"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import MossMesh from "./MossMesh";

// Mapping for moss types to their specific 3D models
const MOSS_MODEL_MAP: { [key: string]: string } = {
  "Star Moss": "/models/star moss.glb",
  "Long Moss": "/models/long moss.glb",
};

interface MossModelProps {
  mossType?: string;
  scale?: number;
  cameraZ?: number;
  height?: string;
  className?: string;
}

export default function MossModel({
  mossType,
  scale = 1.6,
  cameraZ = 2.8,
  height = "h-64 md:h-72",
  className = "",
}: MossModelProps) {
  // Determine the model path based on moss type
  const modelPath = mossType ? MOSS_MODEL_MAP[mossType] : undefined;

  return (
    <div className={`w-full ${height} rounded-xl overflow-hidden bg-[#e8f5ea] ${className}`}>
      <Canvas camera={{ position: [0, 0, cameraZ], fov: 35 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 3, 2]} intensity={1} />
        <Suspense fallback={null}>
          <MossMesh modelPath={modelPath} baseScale={scale} />
        </Suspense>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}

