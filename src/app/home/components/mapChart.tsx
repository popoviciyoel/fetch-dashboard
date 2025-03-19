
import {
    ComposableMap,
    Geographies,
    Geography,
} from "react-simple-maps";

import { DogMarker } from './DogMarker';
import geoAlbersUsaTerritories from "geo-albers-usa-territories";
import { useState } from "react";
import { Dog } from "@/interfaces";


const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface MapProps {
    results: Dog[]
    selectedDogs: string[]
    setSelectedDogs: (selectedDogs: string []) => void
}

export const MapChart = ({ results, selectedDogs, setSelectedDogs }: MapProps) => {
    if (!results) {
        return null
    }
    console.log('geoAlbersUsaTerritories', geoAlbersUsaTerritories)

    const [hoveredMarker, setHoveredMarker] = useState<null | number>(null); // To store the index of hovered marker

    const handleMouseEnter = (index: number) => {
        setHoveredMarker(index); // Set the index of hovered marker
    };

    const handleMouseLeave = () => {
        setHoveredMarker(null); // Reset when mouse leaves
    };

    const onClick = (id: string) => {
        setSelectedDogs([...selectedDogs, id])
    }

    const projection = geoAlbersUsaTerritories.geoAlbersUsaTerritories()
        .translate([400, 250])

    return (
        <div>
            <div>
                Dogs
            </div>

            <ComposableMap projection={projection}
            >
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                style={{
                                    default: { fill: "#DDD", stroke: "#FFF" },
                                    hover: { fill: "#F53" },
                                    pressed: { fill: "#E42", stroke: 'none' }
                                }}
                            />
                        ))
                    }
                </Geographies>
                {results?.map((dog, index) => {

                    return <DogMarker key={index} dog={dog} // assuming each dog object has all the required properties
                        index={index}
                        hoveredMarker={hoveredMarker}
                        onClick={onClick}
                        selectedDogs={selectedDogs}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave} />
                })}

            </ComposableMap>

        </div>

    );
};


