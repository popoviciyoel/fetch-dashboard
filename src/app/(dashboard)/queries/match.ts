import { Match } from "@/app/(dashboard)/interfaces";

export const fetchMatch = async (dogIds: string []) => {
    const url = process.env.NEXT_PUBLIC_BASE_URL + '/dogs/match';

    console.log('url', url)
    const response = await fetch(url, {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  // Ensure the server knows it's JSON
        },
        body: JSON.stringify(dogIds)
    });

    const data: Match = await response.json()


    return data.match
}