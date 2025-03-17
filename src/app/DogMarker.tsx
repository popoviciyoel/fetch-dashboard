import { Marker } from "react-simple-maps";

interface Dog {
  name: string;
  coordinates: [number, number];
  img: string;
  breed: string;
  age: number;
  zip_code: string;
  city: string;
  state: string;
}

interface DogMarkerProps {
  dog: Dog;
  index: number;
  hoveredMarker: number | null;
  onMouseEnter: (index: number) => void;
  onMouseLeave: () => void;
}

export function DogMarker({
  dog,
  index,
  hoveredMarker,
  onMouseEnter,
  onMouseLeave
}: DogMarkerProps) {
  const { name, longitude, latitude, img, breed, age, zip_code, city, state } = dog;

  return (
    <Marker
      name={name + index}
      key={index}
      coordinates={[longitude, latitude]}
      onMouseEnter={() => onMouseEnter(index)}
      onMouseLeave={onMouseLeave}
    >
      <circle r={10} fill="#E42A1D" stroke="#fff" strokeWidth={2} />
      <text
        textAnchor="middle"
        y={-20}
        style={{ fontFamily: "system-ui", fill: "#5D5A6D" }}
      >
        {name}
      </text>
      {hoveredMarker === index && (
        <g transform={`translate(0, 20)`}>
          <rect
            x={-40}
            y={-10}
            width={160}
            height={130}
            fill="white"
            stroke="black"
            strokeWidth={1}
            rx={5}
          />
          <image
            href={img}
            x={-30}
            y={-10}
            width={70}
            height={70}
            clipPath="url(#imgClip)"
          />
          <text x={-30} y={65} style={{ fontFamily: "system-ui", fontWeight: "bold" }}>
            {name} - {breed}
          </text>
          <text x={-30} y={80}>
            Age: {age} years
          </text>
          <text x={-30} y={95}>
            Zip: {zip_code}
          </text>
          <text x={-30} y={110}>
            Location: {city}, {state}
          </text>
        </g>
      )}
    </Marker>
  );
}