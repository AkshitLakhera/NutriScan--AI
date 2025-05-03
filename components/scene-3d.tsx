"use client"

import { useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Text, Float } from "@react-three/drei"

function NutritionSphere({ position, text, color = "#ffffff", delay = 0 }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={color} transparent opacity={0.6} />
      </mesh>
      <Text position={[0, 0.5, 0]} fontSize={0.15} color="black" anchorX="center" anchorY="middle">
        {text}
      </Text>
    </group>
  )
}

function Scene() {
  const group = useRef()

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Simple cube instead of complex model */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <NutritionSphere position={[2, 1, 0]} text="Calories" color="#333333" />
        <NutritionSphere position={[-2, 1, 0]} text="Protein" color="#555555" />
        <NutritionSphere position={[1.5, -1, 0]} text="Carbs" color="#777777" />
        <NutritionSphere position={[-1.5, -1, 0]} text="Fat" color="#999999" />
      </Float>

      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  )
}

export default function Scene3D() {
  return (
    <Canvas shadows dpr={[1, 2]}>
      <color attach="background" args={["#f8f8f8"]} />
      <Scene />
      <Environment preset="city" />
    </Canvas>
  )
}
