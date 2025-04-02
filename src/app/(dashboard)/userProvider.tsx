"use client";

import { SelectProps } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChangeEvent,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { fetchZipCodesByLocation } from "./queries/location";
import { fetchDogsByFilters } from "./queries/dogs";
import {
  Dog,
  SortField,
  SortOrder,
  Filters,
  Location,
} from "@/app/(dashboard)/interfaces";
import { storePages } from "@/utils";
import { Loading } from "./components/Loading";

interface Results {
  results: Dog[]; // We Map pages to Dogs
  total?: number;
}

interface Query {
    breeds: string[]
    zipCodes: string[]
    minAge: number;
    maxAge: number
    field: SortField
    order: SortOrder
    cursor: number
}

interface User {
  authenticated?: boolean;
  availableBreeds?: SelectProps["options"];
  filters: Filters;
}

interface UserContext {
  loading: boolean;
  user: User;
  results: Results;
  searchResults?: string;

  handleSearch?: () => void;
  setUser: (user: User) => void;
  clearFilters: () => void;
  handleAgeFilter: (value: number[]) => void;
  handleBreedFilter: (breeds: string[]) => void;
  handleLocationSearchFilter: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeTable: (page: number, pageSize: number) => void;
  handleSortOrder: (order: SortOrder) => void;
  handleSortField: (field: SortField) => void;

  data: Dog[];
}

const defaultFilters: Filters = {
  minAge: 0,
  maxAge: 20,
  locationSearch: "",
  breeds: [],
  field: SortField.BREED,
  order: SortOrder.ASC,
};

const UserContext = createContext<UserContext>({
  loading: false,
  user: { authenticated: false, availableBreeds: [], filters: defaultFilters },
  results: { results: [], total: 0 },
  searchResults: "",
  handleSearch: () => {},
  setUser: () => {},
  clearFilters: () => {},
  handleAgeFilter: () => {},
  handleBreedFilter: () => {},
  handleLocationSearchFilter: () => {},
  onChangeTable: () => {},
  handleSortOrder: () => {},
  handleSortField: () => {},
  data: [],
});

const buildQuery = (params: Query) => {
  const { breeds, minAge, maxAge, field, order, zipCodes, cursor } = params;

  const QUERY_SIZE = "30";

  const queryParams = new URLSearchParams();

  if (minAge !== undefined) queryParams.append("ageMin", minAge.toString());
  if (maxAge !== undefined) queryParams.append("ageMax", maxAge.toString());
  queryParams.append("from", cursor.toString());

  queryParams.append("size", QUERY_SIZE);
  queryParams.append("sort", `${field}:${order}`);
  if (breeds.length > 0)
    breeds.forEach((breed: string) => queryParams.append("breeds", breed));
  if (zipCodes.length > 0)
    zipCodes.forEach((zip_code: string) => queryParams.append("zipCodes", zip_code));

  return queryParams;
};


export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({
    authenticated: false,
    availableBreeds: [],
    filters: defaultFilters,
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Results>({
    results: [],
    total: 0,
  });
  const [activeData, setActiveData] = useState<Dog[]>([]);
  const [searchResults, setSearchResults] = useState<string>();

  const router = useRouter();
  const searchParams = useSearchParams();
  const pageTracker = useRef<Map<number, Dog[]>>(new Map());
  const zipCodeLookup = useRef<Map<string, Location>>(new Map());
  const query = useRef<Query>({...defaultFilters, cursor: 0, zipCodes: []});

  const updateUrlParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const fetchBreeds = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/dogs/breeds`,
        {
          credentials: "include",
          method: "GET",
          headers: { Accept: "application/json" },
        }
      );

      if (!response.ok) {
        router.replace("/login");
        return;
      }

      const breeds = await response.json();
      setUser((prev) => ({
        ...prev,
        authenticated: true,
        availableBreeds: breeds.map((breed: string) => ({
          label: breed,
          value: breed,
        })),
      }));
    } catch (error) {
      console.error("Error fetching breeds:", error);
    }
  };

  const clearFilters = () => {
    setUser((prev) => ({ ...prev, filters: defaultFilters }));
  };

  const onChangeTable = async (page: number, pageSize: number) => {
    updateUrlParam("page", page.toString());

    if (!pageTracker.current.has(page)) {
      setLoading(true);
      const cursor = page * pageSize - pageSize;

      const queryParams = buildQuery({ ...query.current, cursor });

      const results = await fetchDogsByFilters(queryParams.toString(), zipCodeLookup);
      storePages(results.results, pageTracker, page);
      setResults((prev) => ({
        ...prev,
        results: [...prev.results, ...results.results],
      }));
      setLoading(false);
    }

    setActiveData(pageTracker.current.get(page) || []);
  };

  const updateFilters = (newFilters: Partial<Filters>) => {
    setUser((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
    }));
  };

  function isZipCode(locationSearch: string): boolean {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(locationSearch);
  }

  const handleSearch = async () => {
    setLoading(true);
    pageTracker.current.clear();

    try {
      const { breeds, minAge, maxAge, locationSearch } =
        user.filters;
      // Retrieve Location objects

      // Check if we need to get zipcodes
      // because we can only query dogs by Zipcode
      const zipCodes: string[] = [];
      if (isZipCode(locationSearch)) {
        zipCodes.push(locationSearch);
      } else {
        // its a city or state and we need to locate the zipcodes
        const locations = locationSearch
          ? await fetchZipCodesByLocation(locationSearch)
          : [];
        locations.forEach((location) => {
          zipCodes.push(location.zip_code);
          zipCodeLookup.current.set(location.zip_code, location);
        });
      }

      // reference old query in case user switches filters params and doesn't search
      query.current = { ...user?.filters, zipCodes, cursor: 0 };
      const queryParams = buildQuery(query.current);
      const results = await fetchDogsByFilters(queryParams.toString(), zipCodeLookup);

      storePages(results.results, pageTracker, 1);
      updateUrlParam("page", "1");

      const searchResults = `${
        breeds.length ? `${breeds.join(", ")} in ` : ""
      }${
        locationSearch || "United States"
      } between ages ${minAge} - ${maxAge}\nResults: ${results.total}`;

      setSearchResults(searchResults);

      setActiveData(pageTracker.current.get(1) || []);
      setResults(results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user.authenticated) {
      fetchBreeds();
    } else {
      handleSearch();
    }
  }, [user.authenticated]);

  if (!user.authenticated) {
    return <Loading />;
  }

  return (
    <UserContext.Provider
      value={{
        data: activeData,
        user,
        results,
        loading,
        searchResults,
        handleSearch,
        setUser,
        clearFilters,
        handleAgeFilter: (value) =>
          updateFilters({ minAge: value[0], maxAge: value[1] }),
        handleBreedFilter: (breeds) => updateFilters({ breeds }),
        handleLocationSearchFilter: (e) =>
          updateFilters({ locationSearch: e.target.value }),
        handleSortOrder: (order) => updateFilters({ order }),
        handleSortField: (field) => updateFilters({ field }),
        onChangeTable,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserProvider = () => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    console.log("user not authenticated");
  }
  return userContext;
};
