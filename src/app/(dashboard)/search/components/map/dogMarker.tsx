import { Marker } from "react-simple-maps";
import { Dog } from "@/app/(dashboard)/interfaces";

interface DogMarkerProps {
  dog: Dog;
  index: number;
  selectedDogs: string[]
  onMouseEnter: (dog: Dog) => void;
  onMouseLeave: () => void;
  onClick: (dog: Dog) => void
}

export function DogMarker({
  dog,
  index,
  selectedDogs,
  onClick,
  onMouseEnter,
  onMouseLeave
}: DogMarkerProps) {
  const { name, longitude, latitude, id } = dog;


  return (
    <>
      {/* SVG Marker */}
      <Marker
        name={name + index}
        key={index}
        coordinates={[longitude, latitude]}
        onMouseEnter={() => onMouseEnter(dog)}
        onMouseLeave={onMouseLeave}
        onClick={() => onClick(dog)}
        className="cursor-pointer"
      >
        <circle r={10} fill={selectedDogs.includes(id) ? "#00000" : "#E42A1D"} stroke="#fff" strokeWidth={2} />
        <text textAnchor="middle" y={-20} style={{ fontFamily: "system-ui", fill: "#5D5A6D" }}>
          {name}
        </text>
      </Marker>


    </>
  );
}