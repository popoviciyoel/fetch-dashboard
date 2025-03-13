import { encodeArrayParam } from "@/utils";
import { Dog } from "@/interfaces";

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
        return { data: dogs, next, total };
    } catch (error) {
        console.error("Failed to fetch dogs:", error);
        return { data: [], next: null, total: 0 };
    }
};
