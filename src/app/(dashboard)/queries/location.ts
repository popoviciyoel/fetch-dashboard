import { parseLocation } from "@/utils";
import { Location } from "@/app/(dashboard)/interfaces";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchZipCodesByLocation = async (searchQuery: string): Promise<Location[]> => {
  try {
    const { city, state } = parseLocation(searchQuery);

    if (!city && !state) return []; // Return early if city is not available

    const response = await fetch(`${BASE_URL}/locations/search`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city, states: state ? [state.toUpperCase()] : undefined , size:1000 }),
    });

    if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);

    const { results } = await response.json();
    
    return results;
  } catch (error) {
    console.error("Failed to fetch zip codes:", error);
    return [];
  }
};
