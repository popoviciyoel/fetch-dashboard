import stateData from '@/states.json'
import { Dog } from './interfaces';
import { RefObject } from 'react';


const US_STATES: Record<string, string> = stateData;


export function encodeArrayParam(key: string, values: string[]) {
    return values.map(value => `${key}=${encodeURIComponent(value)}`).join("&");
}

export function parseLocation(input: string) {
    const words = input.split(/\s*,\s*|\s+/); // Split by commas or spaces
    let city = undefined;
    let state = undefined;

    for (const word of words) {
        const lowerWord = word.toLowerCase();
        if (US_STATES[lowerWord]) {
            state = US_STATES[lowerWord]; // It's a state
        } else if (Object.values(US_STATES).includes(lowerWord)) {
            state = lowerWord
        }
        else {
            city = lowerWord; // Assume it's a city
        }
    }

    return { city, state };
}



export function storePages(tempData: Dog[], pageTracker: RefObject<Map<number, Dog[]>>, page: number) {
    // Size of chunk
    const chunkSize = 10;

    const chunks = []

    // Loop to split array into chunks
    for (let i = 0; i < tempData.length; i += chunkSize) {
        const chunk = [];

        // Iterate for the size of chunk
        for (let j = i; j < i + chunkSize && j < tempData.length; j++) {
            chunk.push(tempData[j]);
        }

        // push the chunk to output array
        chunks.push(chunk);
    }




    // reload pages from memory
    for (const chunk of chunks) {
        pageTracker.current.set(page, chunk)
        page++

    }


}

