"use client";

import { Line } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group, QuadraticBezierCurve3, Shape, ShapeGeometry, Vector3 } from "three";
import type { MapPoint } from "./contact-journey.type";

const mapWidth = 5.6;
const mapHeight = 2.8;

const continents: Array<{ name: string; outline: Array<[number, number]> }> = [
  {
    name: "north-america",
    outline: [
      [-168, 70],
      [-145, 72],
      [-130, 62],
      [-122, 50],
      [-108, 48],
      [-96, 54],
      [-82, 48],
      [-65, 45],
      [-59, 31],
      [-78, 8],
      [-95, 16],
      [-109, 24],
      [-117, 34],
      [-130, 43],
      [-142, 57],
    ],
  },
  {
    name: "central-america",
    outline: [
      [-91, 20],
      [-82, 12],
      [-77, 8],
      [-79, 2],
      [-84, 8],
    ],
  },
  {
    name: "south-america",
    outline: [
      [-80, 12],
      [-68, 10],
      [-51, 2],
      [-35, -7],
      [-42, -22],
      [-52, -35],
      [-68, -55],
      [-75, -35],
      [-78, -12],
    ],
  },
  {
    name: "greenland",
    outline: [
      [-54, 82],
      [-39, 78],
      [-24, 70],
      [-36, 59],
      [-51, 62],
      [-62, 72],
    ],
  },
  {
    name: "europe",
    outline: [
      [-12, 36],
      [-9, 50],
      [4, 58],
      [20, 70],
      [38, 62],
      [42, 52],
      [31, 44],
      [24, 36],
      [9, 37],
      [1, 43],
      [-7, 40],
    ],
  },
  {
    name: "africa",
    outline: [
      [-18, 35],
      [3, 38],
      [24, 32],
      [38, 17],
      [45, 4],
      [34, -12],
      [25, -33],
      [14, -35],
      [2, -20],
      [-8, 1],
      [-16, 15],
    ],
  },
  {
    name: "asia",
    outline: [
      [35, 56],
      [47, 70],
      [70, 75],
      [96, 72],
      [121, 65],
      [147, 59],
      [166, 49],
      [154, 39],
      [134, 34],
      [120, 25],
      [111, 12],
      [98, 7],
      [89, 20],
      [78, 9],
      [72, 20],
      [60, 26],
      [50, 40],
      [40, 43],
    ],
  },
  {
    name: "india",
    outline: [
      [67, 28],
      [78, 34],
      [89, 27],
      [87, 18],
      [78, 7],
      [73, 16],
    ],
  },
  {
    name: "japan",
    outline: [
      [136, 44],
      [142, 40],
      [145, 34],
      [140, 31],
      [136, 36],
    ],
  },
  {
    name: "australia",
    outline: [
      [113, -11],
      [131, -10],
      [153, -18],
      [151, -36],
      [136, -43],
      [118, -34],
      [113, -22],
    ],
  },
  {
    name: "madagascar",
    outline: [
      [48, -13],
      [51, -17],
      [49, -26],
      [46, -22],
    ],
  },
];

function projectPoint(point: MapPoint, depth = 0.1) {
  return new Vector3(
    (point.longitude / 180) * (mapWidth / 2),
    (point.latitude / 90) * (mapHeight / 2),
    depth,
  );
}

function makeShape(outline: Array<[number, number]>) {
  const shape = new Shape();
  outline.forEach(([longitude, latitude], index) => {
    const x = (longitude / 180) * (mapWidth / 2);
    const y = (latitude / 90) * (mapHeight / 2);
    if (index === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  });
  shape.closePath();
  return shape;
}

function LandMass({ outline, name }: { outline: Array<[number, number]>; name: string }) {
  const geometry = useMemo(() => new ShapeGeometry(makeShape(outline)), [outline]);
  return (
    <mesh name={name} position={[0, 0, 0.075]} geometry={geometry}>
      <meshStandardMaterial color="#507d68" roughness={0.86} flatShading />
    </mesh>
  );
}

function MapGrid() {
  const latitudeLines = [-60, -30, 0, 30, 60];
  const longitudeLines = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150];
  return (
    <group>
      {latitudeLines.map((latitude) => {
        const y = (latitude / 90) * (mapHeight / 2);
        return (
          <Line
            key={`lat-${latitude}`}
            points={[
              [-mapWidth / 2, y, 0.025],
              [mapWidth / 2, y, 0.025],
            ]}
            color="#56887b"
            lineWidth={0.6}
            transparent
            opacity={0.24}
          />
        );
      })}
      {longitudeLines.map((longitude) => {
        const x = (longitude / 180) * (mapWidth / 2);
        return (
          <Line
            key={`lon-${longitude}`}
            points={[
              [x, -mapHeight / 2, 0.025],
              [x, mapHeight / 2, 0.025],
            ]}
            color="#56887b"
            lineWidth={0.6}
            transparent
            opacity={0.2}
          />
        );
      })}
    </group>
  );
}

function LocationPin({ point, color }: { point: MapPoint; color: string }) {
  const position = projectPoint(point, 0.1);
  return (
    <group position={position}>
      <mesh position={[0, 0.08, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.045, 0.15, 10]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.55} />
      </mesh>
      <mesh position={[0, 0.17, 0.1]}>
        <sphereGeometry args={[0.065, 14, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.1} />
      </mesh>
      <mesh position={[0, 0.17, 0.1]} scale={1.7}>
        <sphereGeometry args={[0.065, 12, 10]} />
        <meshBasicMaterial color={color} transparent opacity={0.16} />
      </mesh>
    </group>
  );
}

function MessageRoute({ from, to }: { from: MapPoint; to: MapPoint }) {
  const traveler = useRef<import("three").Mesh>(null);
  const curve = useMemo(() => {
    const start = projectPoint(from, 0.27);
    const end = projectPoint(to, 0.27);
    const middle = start.clone().add(end).multiplyScalar(0.5);
    middle.z = 0.72;
    middle.y += 0.22;
    return new QuadraticBezierCurve3(start, middle, end);
  }, [from, to]);
  const routePoints = useMemo(() => curve.getPoints(36), [curve]);

  useFrame(({ clock }) => {
    if (traveler.current)
      traveler.current.position.copy(curve.getPoint((clock.elapsedTime * 0.24) % 1));
  });

  return (
    <>
      <Line points={routePoints} color="#227c69" lineWidth={1.8} transparent opacity={0.85} />
      <mesh ref={traveler}>
        <sphereGeometry args={[0.045, 12, 10]} />
        <meshBasicMaterial color="#e8ae59" />
      </mesh>
    </>
  );
}

function MessageMap({ destination, visitor }: { destination: MapPoint; visitor: MapPoint | null }) {
  const map = useRef<Group>(null);
  const { size } = useThree();
  const scale = size.width < 420 ? 0.78 : 1;

  useFrame(({ clock }) => {
    if (map.current) map.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.025;
  });

  return (
    <group ref={map} scale={scale} rotation={[-0.16, 0.05, -0.035]}>
      <mesh position={[0, 0, -0.045]} castShadow receiveShadow>
        <boxGeometry args={[mapWidth + 0.12, mapHeight + 0.12, 0.16]} />
        <meshStandardMaterial color="#e5d9c3" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[mapWidth, mapHeight]} />
        <meshStandardMaterial color="#d9e8da" roughness={0.92} />
      </mesh>
      <MapGrid />
      {continents.map((continent) => (
        <LandMass key={continent.name} {...continent} />
      ))}
      <LocationPin point={destination} color="#d38a43" />
      {visitor && <LocationPin point={visitor} color="#247e6b" />}
      {visitor && <MessageRoute from={visitor} to={destination} />}
    </group>
  );
}

export function ContactRouteWorld({
  destination,
  visitor,
}: {
  destination: MapPoint;
  visitor: MapPoint | null;
}) {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 32 }} dpr={[1, 1.5]}>
      <ambientLight intensity={1.1} />
      <directionalLight position={[2, 4, 5]} intensity={1.2} color="#fffaf0" />
      <MessageMap destination={destination} visitor={visitor} />
    </Canvas>
  );
}
