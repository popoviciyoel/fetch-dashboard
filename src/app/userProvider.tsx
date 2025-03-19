'use client';

import { SelectProps } from "antd"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"
import { fetchZipCodesByLocation } from "./fetch/location";
import { fetchDogsByFilters } from "./fetch/dogs";
import { Location, Dog } from "@/interfaces";

interface Filters {
    locationSearch: string
    selectedBreeds: string[]
    minAge?: number;
    maxAge?: number
}

interface Query {
    next?: string | null
    results?: Dog[]
    total?: number
    prev?: string | null

}

interface User {
    authenticated?: boolean
    availableBreeds?: SelectProps['options']
    filters: Filters

}


interface UserContext {
    searchResult: string
    loading: boolean
    user: User
    query: Query

    handleSearch?: () => void
    setUser: (user: User) => void
    clearFilters: () => void
    handleAgeFilter: (e) => void
    handleBreedFilter: (selectedBreeds: string[]) => void
    handleLocationSearchFilter: (e) => void
    onChangeTable: (page: number, pageSize: number) => void


}


const UserContext = createContext<UserContext>()


export const UserProvider = ({ children }) => {
    const [user, setUser] = useState<User>({ authenticated: false, availableBreeds: [], filters: { locationSearch: '', selectedBreeds: [] } })
    const [searchResult, setSearchResults] = useState<string>()
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState<Query>({results: [], next: null, prev: null, total: 0})

    const router = useRouter()
    console.log('user', user)
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
                selectedBreeds: [],
                minAge: 0,
                maxAge: 20
            }
        })
    }

    const onChangeTable = async (page: number, pageSize: number) => {

        if (page >= Math.ceil(((query?.results?.length || 0) / pageSize)) - 1 && query?.next) {

            const { selectedBreeds, minAge, maxAge } = user?.filters || {}

            const moreResults = await fetchDogsByFilters(selectedBreeds, minAge || 0, maxAge || 20, [], false, query?.next)
            setQuery({ ...moreResults, results: [...(query.results || []), ...moreResults.results] })


        }

    }

    const handleAgeFilter = (e: any) => {
        const [min, max] = e
        setUser({
            ...user, filters: {
                ...user.filters,
                minAge: min,
                maxAge: max
            }
        })

    };

    const handleBreedFilter = (selectedBreeds: string[]) => {
        setUser({ ...user, filters: { ...user.filters, selectedBreeds: selectedBreeds } })

    }

    const handleLocationSearchFilter = (e) => {
        setUser({ ...user, filters: { ...user.filters, locationSearch: e.target.value } })
    }


    const handleSearch = async () => {
        setLoading(true)
        try {

            const { locationSearch, selectedBreeds, minAge, maxAge } = user?.filters || {}

            let locations: Location[] = []

            if (locationSearch) {
                locations = await fetchZipCodesByLocation(locationSearch)
            }
            const results: Query = await fetchDogsByFilters(selectedBreeds, minAge || 0, maxAge || 20, locations, true, query?.next)

            if (selectedBreeds.length > 0 || locationSearch || minAge || maxAge) {

                setSearchResults(`${selectedBreeds.join(', ')}` + ' in ' + (locationSearch || "United States") + ' between ages ' + `${minAge || 0}` + " - " + `${maxAge || 20}` + `\nResults: ${result.total}`)


            }
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


    return <UserContext.Provider value={{ user, query, loading, handleSearch, setUser, clearFilters, handleAgeFilter, handleBreedFilter, handleLocationSearchFilter, searchResult, onChangeTable }}>
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