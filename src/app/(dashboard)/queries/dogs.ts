import { Dog, Location } from "@/app/(dashboard)/interfaces";
import { RefObject } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


export const fetchDogsByFilters = async (
    query: string,
    zipCodeLookup: RefObject<Map<string, Location>>
  
): Promise<{ results: Dog[];  total: number }> => {
    try {
        const apiUrl = `${BASE_URL}/dogs/search?${query}`;

        // Fetch dog IDs
        const response = await fetch(apiUrl, {
            credentials: "include",
            method: "GET",
            headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);

        const { resultIds, total} = await response.json();
        if (!resultIds || resultIds.length === 0) return { results: [],  total, };

        // Fetch dog details
        const detailsResponse = await fetch(`${BASE_URL}/dogs`, {
            credentials: "include",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resultIds),
        });

        if (!detailsResponse.ok) throw new Error(`Error: ${detailsResponse.status} ${detailsResponse.statusText}`);

        const dogs: Dog[] = await detailsResponse.json();

        // // Handling locations and merging with dogs
        // const locationsMap = new Map<string, Location | null>();
        // locations.forEach(location => locationsMap.set(location.zip_code, location));

        // // Fetch unique locations if needed
        // if query isn't location based we need to search locations
        console.log('zipCodeLookup', zipCodeLookup.current.keys())
        if (!query.includes('zipCodes')) {

            const uniqueZipCodes = new Set()

            // if we don't have location object for zipcode retrieve it
            dogs.forEach(dog => {
                if(!zipCodeLookup.current.has(dog.zip_code)){
                    uniqueZipCodes.add(dog.zip_code)
                }
            })

            const locationsResponse = await fetch(`${BASE_URL}/locations`, {
                credentials: "include",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(uniqueZipCodes.keys().toArray()),
            });

            const fetchedLocations: Location[] = await locationsResponse.json();

            fetchedLocations.forEach(location => zipCodeLookup?.current?.set(location?.zip_code, location));
        }

        // Merge dog details with location data
        const dogsWithLocation = dogs.map(dog => ({
            ...dog,
            ...zipCodeLookup.current.get(dog.zip_code)
        }));

        return { results: dogsWithLocation,  total };
    } catch (error) {
        console.error("Failed to fetch dogs:", error);
        return { results: [], total: 0 };
    }
};
