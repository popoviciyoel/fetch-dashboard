'use client';

import { SelectProps } from "antd"
import { useRouter, useSearchParams } from "next/navigation"
import { ChangeEvent, createContext, ReactNode, useContext, useEffect, useRef, useState } from "react"
import { fetchZipCodesByLocation } from "./queries/location";
import { fetchDogsByFilters } from "./queries/dogs";
import { Dog, SortField, SortOrder, Filters } from "@/app/(dashboard)/interfaces";
import { storePages } from "@/utils";
import { Loading } from "./components/Loading";


interface Query {
    next: string | null
    results: Dog[] // We Map pages to Dogs
    total?: number
    prev?: string | null

}



interface User {
    authenticated?: boolean
    availableBreeds?: SelectProps['options']
    filters: Filters

}


interface UserContext {
    loading: boolean
    user: User
    query: Query
    searchResults?: string

    handleSearch?: () => void
    setUser: (user: User) => void
    clearFilters: () => void
    handleAgeFilter: (value: number[]) => void
    handleBreedFilter: (breeds: string[]) => void
    handleLocationSearchFilter: (e: ChangeEvent<HTMLInputElement>) => void
    onChangeTable: (page: number, pageSize: number) => void
    handleSortOrder: (order: SortOrder) => void
    handleSortField: (field: SortField) => void


    data: Dog[]

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
    query: { results: [], next: null, prev: null, total: 0 },
    searchResults: '',
    handleSearch: () => { },
    setUser: () => { },
    clearFilters: () => { },
    handleAgeFilter: () => { },
    handleBreedFilter: () => { },
    handleLocationSearchFilter: () => { },
    onChangeTable: () => { },
    handleSortOrder: () => { },
    handleSortField: () => { },
    data: [],
});







export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>({
        authenticated: false,
        availableBreeds: [],
        filters: defaultFilters,
    });

    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState<Query>({ results: [], next: null, prev: null, total: 0 });
    const [activeData, setActiveData] = useState<Dog[]>([]);
    const [searchResults, setSearchResults] = useState<string>();

    const router = useRouter();
    const searchParams = useSearchParams();
    const pageTracker = useRef<Map<number, Dog[]>>(new Map());

    const updateUrlParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(key, value);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const fetchBreeds = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/dogs/breeds`, {
                credentials: "include",
                method: "GET",
                headers: { Accept: "application/json" },
            });

            if (!response.ok) {
                router.replace("/login");
                return;
            }

            const breeds = await response.json();
            setUser((prev) => ({
                ...prev,
                authenticated: true,
                availableBreeds: breeds.map((breed: string) => ({ label: breed, value: breed })),
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
            const results = await fetchDogsByFilters(user.filters, [], false, query.next, (page * pageSize) - pageSize);
            storePages(results.results, pageTracker, page);
            setQuery((prev) => ({ ...prev, results: [...prev.results, ...results.results] }));
            setLoading(false);
        }

        setActiveData(pageTracker.current.get(page) || []);
    };

    const updateFilters = (newFilters: Partial<Filters>) => {
        setUser((prev) => ({ ...prev, filters: { ...prev.filters, ...newFilters } }));
    };

    const handleSearch = async () => {
        setLoading(true);
        pageTracker.current.clear();

        try {
            const { breeds, minAge, maxAge, locationSearch } = user.filters;
            const locations = locationSearch ? await fetchZipCodesByLocation(locationSearch) : [];
            const results = await fetchDogsByFilters(user.filters, locations, true, "", 0);

            storePages(results.results, pageTracker, 1);
            updateUrlParam("page", "1");


            const searchResults = `${breeds.length ? `${breeds.join(", ")} in ` : ""}${locationSearch || "United States"} between ages ${minAge} - ${maxAge}\nResults: ${results.total}`

            setSearchResults(
                searchResults
            );

            setActiveData(pageTracker.current.get(1) || []);
            setQuery(results);
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


    return <UserContext.Provider value={{
        data: activeData,
        user,
        query,
        loading,
        searchResults,
        handleSearch,
        setUser,
        clearFilters,
        handleAgeFilter: (value) => updateFilters({ minAge: value[0], maxAge: value[1] }),
        handleBreedFilter: (breeds) => updateFilters({ breeds }),
        handleLocationSearchFilter: (e) => updateFilters({ locationSearch: e.target.value }),
        handleSortOrder: (order) => updateFilters({ order }),
        handleSortField: (field) => updateFilters({ field }),
        onChangeTable,
    }}>
        {children}
    </UserContext.Provider>
}

export const useUserProvider = () => {
    const userContext = useContext(UserContext)
    if (!userContext) {
        console.log('user not authenticated')
    }
    return userContext
}