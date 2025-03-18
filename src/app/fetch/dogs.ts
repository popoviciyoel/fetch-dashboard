import { encodeArrayParam } from "@/utils";
import { Dog, Location } from "@/interfaces";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchDogsByFilters = async (
    breeds: string[],
    minAge: number,
    maxAge: number,
    locations: Location[],
    isNewSearch: boolean,
    nextPageUrl: string
): Promise<{ data: Dog[]; next: string | null; total: number }> => {
    try {
        // Early return if no filters provided
        if (!isNewSearch && !nextPageUrl) return { data: [], next: null, total: 0 };

        // Build search query
        let apiUrl: string = BASE_URL!
        if (isNewSearch) {
            const queryParams = new URLSearchParams();
            if (breeds.length > 0) breeds.forEach(value => queryParams.append('breeds', value));
            if (locations.length > 0) {
                const zipCodes = locations.map((location: Location) => location.zip_code)
                zipCodes.forEach(value => queryParams.append("zipCodes", value));
            }
            if (minAge !== undefined) queryParams.append("ageMin", minAge.toString());
            if (maxAge !== undefined) queryParams.append("ageMax", maxAge.toString());


            apiUrl += `/dogs/search?${queryParams.toString()}`;
        } else {
            apiUrl += nextPageUrl

        }
        // const apiUrl = isNewSearch ? searchUrl : nextPageUrl;

        // Fetch dog IDs
        const response = await fetch(apiUrl, {
            credentials: "include",
            method: "GET",
            headers: { Accept: "application/json" },
        });

        if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);

        const { resultIds, next, total } = await response.json();
        if (!resultIds || resultIds.length === 0) return { data: [], next, total };

        // Fetch dog details
        const detailsResponse = await fetch(`${BASE_URL}/dogs`, {
            credentials: "include",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resultIds),
        });

        if (!detailsResponse.ok) throw new Error(`Error: ${detailsResponse.status} ${detailsResponse.statusText}`);

        const dogs: Dog[] = await detailsResponse.json();



        // Fetch dog details

        const map = new Map<string, Location | null>()

        // actually only fetching 25 dogs at a time so maybe will never run into this case
        if (locations.length === 0) {
            // this can only serve 100 ids

            // const uniqueZipcodes = new Set()


            // first get the unique zip codes

            dogs.forEach(dog => {
                // uniqueZipcodes.add(dog.zip_code);
                if (!map.get(dog.zip_code)) {
                    map.set(dog.zip_code, null)
                }
            }
            )

            if (map.size > 100) {
                console.log('fix logic here ')
            }

            // search database with unique zipcodes

            const locationsResponse = await fetch(`${BASE_URL}/locations`, {
                credentials: "include",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(map.keys().toArray()),
            });

            const locations: Location[] = await locationsResponse.json()

            for (const location of locations) {
                map.set(location?.zip_code, location)
            }


            // merge dog entity with location data from zipcodes








        } else {
            locations.forEach(location => {
                // uniqueZipcodes.add(dog.zip_code);

                map.set(location.zip_code, location)
            })



        }


        const dogsWithLocation = dogs.map(dog => {
            return {
                ...dog,
                ...map.get(dog.zip_code)
            }
        })
        return { data: dogsWithLocation, next, total };




    } catch (error) {
        console.error("Failed to fetch dogs:", error);
        return { data: [], next: null, total: 0 };
    }
};
