"use client";

import { useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";

// Mapping for moss types to their specific 3D models
const MOSS_MODEL_MAP: { [key: string]: string } = {
  "Star Moss": "/models/star moss.glb",
  "Long Moss": "/models/long moss.glb",
  // Add more mappings as needed
};

// Dynamic scale mapping based on model file names
const MODEL_SCALE_MAP: { [key: string]: number } = {
  "star moss": 3.5,
  "long moss": 1.0,
  "moss with stone": 1.0,
  "moss model 1": 5.0,
};

// Function to get scale based on model file path
function getModelScale(modelPath: string | undefined): number {
  if (!modelPath) {
    return 1.0;
  }
  
  const fileName = modelPath
    .split('/')
    .pop()
    ?.toLowerCase()
    .replace(/\.(glb|usdz)$/, '') || '';
  
  for (const [key, scale] of Object.entries(MODEL_SCALE_MAP)) {
    if (fileName.includes(key.toLowerCase())) {
      return scale;
    }
  }
  
  return 1.0;
}

// Preload models
useGLTF.preload("/models/moss with stone.glb");
Object.values(MOSS_MODEL_MAP).forEach(path => {
  try {
    useGLTF.preload(path);
  } catch (e) {
    // Ignore preload errors
  }
});

interface MossMeshProps {
  modelPath?: string;
  baseScale?: number;
}

export default function MossMesh({ modelPath, baseScale }: MossMeshProps) {
  const finalModelPath = modelPath || "/models/moss with stone.glb";
  const { scene } = useGLTF(finalModelPath);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!scene) return;
    
    // Use baseScale if provided, otherwise use model-specific scale, or default to 1.8
    const fixedScale = baseScale ?? getModelScale(finalModelPath) ?? 1.8;
    scene.scale.set(fixedScale, fixedScale, fixedScale);
    scene.position.set(0, -0.15, 0);
  }, [scene, baseScale, finalModelPath]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

