import { useState } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
} from "react-simple-maps";
import { Dog } from "@/app/(dashboard)/interfaces";
import { DogMarker } from "./dogMarker";
// @ts-expect-error package
import * as geoAlbersUsaTerritories from "geo-albers-usa-territories";
import Image from 'next/image'
import { useUserProvider } from "@/app/(dashboard)/userProvider";

// URL for U.S. geography data (states)
const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Default styles for the geographies
const geographyStyles = {
    default: { fill: "#DDD", stroke: "#FFF" },
    hover: { fill: "#F53" },
    pressed: { fill: "#E42", stroke: "none" },
};

interface MapProps {
    selectedDogs: string[];
    setSelectedDogs: (selectedDogs: string[]) => void;
}

export const Map = ({ selectedDogs, setSelectedDogs }: MapProps) => {
    // State to track which marker (by index) is hovered
    const [hoveredMarker, setHoveredMarker] = useState<Dog | null>(null);
    const { data } = useUserProvider()

    // Early return if there are no results to display
    if (!data.length) {
        return null;
    }


    // Handlers for marker hover events
    const handleMouseEnter = (dog: Dog) => setHoveredMarker(dog);
    const handleMouseLeave = () => setHoveredMarker(null);

    // Handler for marker click event:
    // Adds the clicked dog's id to the selectedDogs state, if not already present
    const handleMarkerClick = (id: string) => {
        if (!selectedDogs.includes(id)) {
            setSelectedDogs([...selectedDogs, id]);
        } else {
            setSelectedDogs(selectedDogs.filter(dogId => dogId !== id));


        }
    };

    // Create a reusable projection using the geoAlbersUsaTerritories package
    const projection = geoAlbersUsaTerritories.geoAlbersUsaTerritories().translate([400, 250]);

    return (
        <div>
            {/* Title or header for the map */}
            {/* Floating HTML Tooltip */}
            {hoveredMarker && <div
                style={{
                    position: "absolute",


                    background: "white",
                    border: "1px solid black",
                    borderRadius: "5px",
                    padding: "5px",
                    width: "290px",
                    height: "190px",
                    zIndex: 10000, // Works since it's in the HTML layer
                    pointerEvents: "none",
                }}
            >
                <Image src={hoveredMarker?.img} alt={hoveredMarker?.img} width="60" height="60" />
                <div style={{ fontFamily: "system-ui", fontWeight: "bold" }}>{hoveredMarker?.name} - {hoveredMarker?.breed}</div>
                <div>Age: {hoveredMarker?.age} years</div>
                <div>Zip: {hoveredMarker?.zip_code}</div>
                <div>Location: {hoveredMarker?.city}, {hoveredMarker?.state}</div>
            </div>}

            <ComposableMap projection={projection}>
                {/* Render the U.S. geographies */}
                <Geographies geography={GEO_URL}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                style={geographyStyles}
                            />
                        ))
                    }
                </Geographies>
                {/* Render markers for each dog */}
                {data.map((dog, index) => (
                    <DogMarker
                        key={dog.id} // Use dog's id as key (assuming it's unique)
                        dog={dog}
                        index={index}
                        onClick={handleMarkerClick}
                        selectedDogs={selectedDogs}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    />
                ))}

            </ComposableMap>

        </div>
    );
};
