import { Dog, Location, Filters } from "@/app/(dashboard)/interfaces";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

function isZipCode(locationSearch: string): boolean {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(locationSearch);
}

const QUERY_SIZE = '30';

const buildQueryParams = (filter: Filters, locations: Location[], isNewSearch: boolean, cursor: number, nextPageUrl: string | null): URLSearchParams => {
    const { breeds, minAge, maxAge, field, order, locationSearch } = filter;
    const queryParams = new URLSearchParams();

    if (isNewSearch) {
        if (breeds.length > 0) breeds.forEach(breed => queryParams.append('breeds', breed));
        if (locations.length > 0) locations.forEach(location => queryParams.append("zipCodes", location.zip_code));
        if (isZipCode(locationSearch)) queryParams.append("zipCodes", locationSearch);
        if (minAge !== undefined) queryParams.append("ageMin", minAge.toString());
        if (maxAge !== undefined) queryParams.append("ageMax", maxAge.toString());
        queryParams.append("size", QUERY_SIZE);
        queryParams.append('sort', `${field}:${order}`);
    } else if (nextPageUrl) {
        const oldParams = new URLSearchParams(nextPageUrl.split('?')[1]);
        oldParams.forEach((value, key) => {
            if (key.startsWith('breeds')) queryParams.append('breeds', value);
            if (key.startsWith('zipCodes')) queryParams.append('zipCodes', value);
        });
        queryParams.set('from', cursor.toString());
        queryParams.append("size", QUERY_SIZE);
    } else {
        throw new Error("Next Page doesn't exist");
    }

    return queryParams;
};

export const fetchDogsByFilters = async (
    filter: Filters,
    locations: Location[],
    isNewSearch: boolean,
    nextPageUrl: string | null,
    cursor: number
): Promise<{ results: Dog[]; next: string | null; total: number, prev: string | null }> => {
    try {
        const apiUrl = `${BASE_URL}/dogs/search?${buildQueryParams(filter, locations, isNewSearch, cursor, nextPageUrl).toString()}`;

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

        // Handling locations and merging with dogs
        const locationsMap = new Map<string, Location | null>();
        locations.forEach(location => locationsMap.set(location.zip_code, location));

        // Fetch unique locations if needed
        if (locations.length === 0) {
            const uniqueZipCodes = [...new Set(dogs.map(dog => dog.zip_code))];
            const locationsResponse = await fetch(`${BASE_URL}/locations`, {
                credentials: "include",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(uniqueZipCodes),
            });

            const fetchedLocations: Location[] = await locationsResponse.json();
            fetchedLocations.forEach(location => locationsMap.set(location.zip_code, location));
        }

        // Merge dog details with location data
        const dogsWithLocation = dogs.map(dog => ({
            ...dog,
            ...locationsMap.get(dog.zip_code)
        }));

        return { results: dogsWithLocation, next, total, prev };
    } catch (error) {
        console.error("Failed to fetch dogs:", error);
        return { results: [], next: null, total: 0, prev: null };
    }
};
