import { Dog, Location, Filters } from "@/app/(dashboard)/interfaces";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchDogsByFilters = async (
    filter: Filters,
    locations: Location[],
    isNewSearch: boolean,
    nextPageUrl: string | null,
    cursor: number,
): Promise<{ results: Dog[]; next: string | null; total: number, prev: string | null }> => {
    try {
        const { breeds, minAge, maxAge, field, order } = filter
        // Early return if no filters provided

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
            queryParams.append("size", '30');

            queryParams.append('sort', `${field}:${order}`)


            apiUrl += `/dogs/search?${queryParams.toString()}`;
        } else {
            if (nextPageUrl) {


                const params = new URLSearchParams(nextPageUrl)
                params.set('from', cursor.toString())
                apiUrl += decodeURIComponent(params.toString())
            } else {
                throw Error("Next Page doesn't exist")
            }

        }

        // Fetch dog IDs
        const response = await fetch(apiUrl, {
            credentials: "include",
            method: "GET",
            headers: { Accept: "application/json" },
        });

        if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);

        const { resultIds, next, total, prev } = await response.json();
        if (!resultIds || resultIds.length === 0) return { results: [], next, total, prev: null };

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
        return { results: dogsWithLocation, next, total, prev };




    } catch (error) {
        console.error("Failed to fetch dogs:", error);
        return { results: [], next: null, total: 0, prev: null };
    }
};
