'use client';

import { SelectProps } from "antd"
import { useRouter, useSearchParams } from "next/navigation"
import { ChangeEvent, createContext, ReactNode, useContext, useEffect, useRef, useState } from "react"
import { fetchZipCodesByLocation } from "./queries/location";
import { fetchDogsByFilters } from "./queries/dogs";
import { Location, Dog, SortField, SortOrder, Filters } from "@/app/(dashboard)/interfaces";
import { storePages } from "@/utils";


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



const UserContext = createContext<UserContext>({
    loading: false,
    user: { authenticated: false, availableBreeds: [], filters: { minAge: 0, maxAge: 20, locationSearch: '', breeds: [], field: SortField.BREED, order: SortOrder.ASC } },
    query: { results: [], next: null, prev: null, total: 0 },
    searchResults: '',
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




export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>({ authenticated: false, availableBreeds: [], filters: { minAge: 0, maxAge: 20, locationSearch: '', breeds: [], field: SortField.BREED, order: SortOrder.ASC } })
    const [loading, setLoading] = useState(false)


    const [query, setQuery] = useState<Query>({ results: [], next: null, prev: null, total: 0 })
    const [activeData, setActiveData] = useState<Dog[]>([])
    const [searchResults, setSearchResults] = useState<string>()


    const searchParams = new URLSearchParams(useSearchParams().toString());

    const updateUrlParam = (key: string, value: string) => {
        searchParams.set(key, value);
        router.push(`?${searchParams.toString()}`, { scroll: false });
    };

    const pageTracker = useRef<Map<number, Dog[]>>(new Map())

    const router = useRouter()
    // Add data fetching
    const fetchBreeds = async () => {
        try {

            const response3 = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/dogs/breeds', {
                credentials: 'include',
                method: 'GET',

                headers: {
                    'Accept': 'application/json',
                }
            });

            if (!response3.ok) {

                router.replace('/login'); // Changed to replace instead of push
                return;

            }

            const breeds = await response3.json()

            setUser({ ...user, authenticated: true, availableBreeds: breeds.map((breed: string) => ({ label: breed, value: breed })) })


        } catch (error) {
            console.error('Error fetching dogs:', error);
        }
    };

    const clearFilters = () => {
        setUser({
            ...user, filters: {
                locationSearch: '',
                breeds: [],
                minAge: 0,
                maxAge: 20,
                field: SortField.BREED, order: SortOrder.ASC
            }
        })
    }

    const onChangeTable = async (page: number, pageSize: number) => {

        let activePage = pageTracker.current.get(page)

        updateUrlParam('page', page.toString())

        console.log('activePage', activePage)
        if (!activePage) {
            setLoading(true)

            const results: Query = await fetchDogsByFilters(user?.filters, [], false, query?.next, (page * pageSize) - pageSize)
            console.log('results', results)
            storePages(results.results, pageTracker, page)

            activePage = pageTracker.current.get(page)

            setLoading(false)



        }

        setActiveData(activePage!)
    }

    const handleAgeFilter = (value: number[]) => {
        const [min, max] = value
        setUser({
            ...user, filters: {
                ...user.filters,
                minAge: min,
                maxAge: max
            }
        })

    };

    const handleBreedFilter = (breeds: string[]) => {
        setUser({ ...user, filters: { ...user.filters, breeds: breeds } })

    }


    const handleSortOrder = (order: SortOrder) => {
        setUser({ ...user, filters: { ...user.filters, order } })

    }

    const handleSortField = (field: SortField) => {
        setUser({ ...user, filters: { ...user.filters, field } })

    }

    const handleLocationSearchFilter = (e: ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, filters: { ...user.filters, locationSearch: e.target.value } })
    }


    const handleSearch = async () => {
        setLoading(true)
        pageTracker.current.clear()



        try {


            const { breeds, minAge, maxAge, locationSearch } = user?.filters
            let locations: Location[] = []

            if (locationSearch) {
                locations = await fetchZipCodesByLocation(locationSearch)
            }
            console.log('query?.next', query?.next)
            const results: Query = await fetchDogsByFilters(user?.filters, locations, true, '', 0)

            storePages(results.results, pageTracker, 1)






                setSearchResults(`${breeds.length > 0 ?  breeds.join(', ') + 'in' : ''}` + ' ' + (locationSearch || "United States") + ' between ages ' + `${minAge || 0}` + " - " + `${maxAge || 20}` + `\nResults: ${results.total}`)


     
            const activeData = pageTracker.current.get(1)
            updateUrlParam('page', '1')

            setActiveData(activeData!)
            setQuery(results)



        } catch (error) {
            console.log('error', error)
        } finally {
            setLoading(false)

        }
    }

    useEffect(() => {
        if (!user?.authenticated) {
            fetchBreeds()
        } else {
            handleSearch()
        }

    }, [user?.authenticated])


    if (!user?.authenticated) {
        return <p>Loading your dogs</p>
    }

    console.log(' pageTracker.current', pageTracker.current)


    return <UserContext.Provider value={{ data: activeData, user, query, loading, searchResults, handleSearch, setUser, clearFilters, handleAgeFilter, handleBreedFilter, handleLocationSearchFilter, handleSortOrder, handleSortField, onChangeTable }}>
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