import US_STATES from '@/states.json'


export function encodeArrayParam(key: string, values: string[]) {
    return values.map(value => `${key}=${encodeURIComponent(value)}`).join("&");
}

export function parseLocation(input: string) {
    const words = input.split(/\s*,\s*|\s+/); // Split by commas or spaces
    let city = undefined;
    let state = undefined;

    for (let word of words) {
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

