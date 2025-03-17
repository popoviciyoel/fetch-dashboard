
import {
    ComposableMap,
    Geographies,
    Geography,
} from "react-simple-maps";

import { DogMarker } from './DogMarker';
import geoAlbersUsaTerritories from "geo-albers-usa-territories";
import { useState } from "react";


const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// const geoUrl =
//   "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/united-states/us-albers.json";


interface MapProps {
    dataSource: any[]
}

export const MapChart = ({ dataSource }: MapProps) => {
    console.log('dataSource', dataSource)
    if (!dataSource) {
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


    const projection = geoAlbersUsaTerritories.geoAlbersUsaTerritories()
        .translate([400, 250])
    return (
        <ComposableMap projection={projection}
            projectionConfig={{
                // rotate: [58, 20, 0],
            }}>
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
            {dataSource?.map((dog, index) => {

                return <DogMarker key={index} dog={dog} // assuming each dog object has all the required properties
                    index={index}
                    hoveredMarker={hoveredMarker}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave} />
            })}

        </ComposableMap>
    );
};


