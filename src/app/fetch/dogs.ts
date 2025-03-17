import { encodeArrayParam } from "@/utils";
import { Dog, Location } from "@/interfaces";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchDogsByFilters = async (
    breeds: string[],
    minAge: number,
    maxAge: number,
    zipCodes: string[],
    isNewSearch: boolean,
    nextPageUrl: string
): Promise<{ data: Dog[]; next: string | null; total: number }> => {
    try {
        // Early return if no filters provided
        if (!isNewSearch && !nextPageUrl) return { data: [], next: null, total: 0 };

        // Build search query
        const queryParams = new URLSearchParams();
        if (breeds.length > 0) queryParams.append("breeds", encodeArrayParam("breeds", breeds));
        if (zipCodes.length > 0) queryParams.append("zipCodes", encodeArrayParam("zipCodes", zipCodes));
        queryParams.append("ageMin", minAge.toString());
        queryParams.append("ageMax", maxAge.toString());

        const searchUrl = `${BASE_URL}/dogs/search?${queryParams.toString()}`;
        const apiUrl = isNewSearch ? searchUrl : nextPageUrl;

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


        // actually only fetching 25 dogs at a time so maybe will never run into this case
        if (zipCodes.length === 0) {
            // this can only serve 100 ids

            // const uniqueZipcodes = new Set()

            const map = new Map<string, Location | null>()

            // first get the unique zip codes

            dogs.forEach(dog => {
                // uniqueZipcodes.add(dog.zip_code);

                map.set(dog.zip_code, null)
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
                map.set(location.zip_code, location)
            }


            // merge dog entity with location data from zipcodes

            const dogsWithLocation = dogs.map(dog => {
                return {
                    ...dog,
                    ...map.get(dog.zip_code)
                }
            })
            return { data: dogsWithLocation, next, total };







        }




        return { data: dogs, next, total };
    } catch (error) {
        console.error("Failed to fetch dogs:", error);
        return { data: [], next: null, total: 0 };
    }
};
