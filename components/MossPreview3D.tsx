"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useRef, useEffect } from "react";
import * as THREE from "three";

// Mapping for moss types to their specific 3D models
const MOSS_MODEL_MAP: { [key: string]: string } = {
  "Star Moss": "/models/star moss.glb",
  "Long Moss": "/models/long moss.glb",
  // Add more mappings as needed
};

// Dynamic scale mapping based on model file names
// Base scales - will be adjusted dynamically based on bounding box
const MODEL_SCALE_MAP: { [key: string]: number } = {
  "star moss": 3.5, // Increased from 1.4 to ~2.5x (3.5) for better visibility
  "long moss": 1.0,
  "moss with stone": 1.0,
  "moss model 1": 5.0, // Increased to 5.0 for better visibility in snapshot and garden views
  // Add more model-specific scales as needed
};

// Function to get scale based on model file path
function getModelScale(modelPath: string | undefined): number {
  if (!modelPath) {
    return 1.0; // Default fallback scale
  }
  
  // Extract filename from path and normalize (lowercase, remove extension)
  const fileName = modelPath
    .split('/')
    .pop()
    ?.toLowerCase()
    .replace(/\.(glb|usdz)$/, '') || '';
  
  // Check for exact matches first
  for (const [key, scale] of Object.entries(MODEL_SCALE_MAP)) {
    if (fileName.includes(key.toLowerCase())) {
      return scale;
    }
  }
  
  // Default fallback scale
  return 1.0;
}

// Preload the default model and mapped models
useGLTF.preload("/models/moss with stone.glb");
Object.values(MOSS_MODEL_MAP).forEach(path => {
  try {
    useGLTF.preload(path);
  } catch (e) {
    // Ignore preload errors for missing models
  }
});

interface MossModelProps {
  modelPath?: string;
  baseScale?: number;
  onBoundingBoxCalculated?: (size: number) => void;
}

// Render model with fixed scale (auto-fit disabled)
function MossModel({ modelPath, baseScale, onBoundingBoxCalculated }: MossModelProps) {
  const finalModelPath = modelPath || "/models/moss with stone.glb";
  const { scene } = useGLTF(finalModelPath);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!scene) return;

    // DISABLED: Auto-fit logic that was making models tiny
    // Previously calculated bounding box and adjusted scale dynamically
    // Now using fixed scale instead
    
    // Set fixed scale right after model is loaded
    // Use baseScale if provided, otherwise default to 1.8 for better visibility
    const fixedScale = baseScale || 1.8;
    scene.scale.set(fixedScale, fixedScale, fixedScale);
    scene.position.set(0, -0.15, 0); // Keep it centered vertically
    
    // If callback is provided, calculate bounding box for reference (but don't use it for scaling)
    if (onBoundingBoxCalculated) {
      // Wait a frame for scale to be applied
      requestAnimationFrame(() => {
        const box = new THREE.Box3().setFromObject(scene);
        const size = box.getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);
        onBoundingBoxCalculated(maxDimension);
      });
    }
  }, [scene, baseScale, onBoundingBoxCalculated]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

// Fallback model component for when specific model fails
function DefaultMossModel({ baseScale }: { baseScale?: number }) {
  const { scene } = useGLTF("/models/moss with stone.glb");
  const base = baseScale ?? getModelScale("/models/moss with stone.glb");
  return <MossModel modelPath="/models/moss with stone.glb" baseScale={base} />;
}

function PlaceholderBox() {
  return (
    <mesh rotation={[-0.6, 0, 0]}>
      <boxGeometry args={[1.5, 1.5, 0.2]} />
      <meshStandardMaterial color="#5d8f5d" roughness={1} />
    </mesh>
  );
}

interface MossPreview3DProps {
  imageUrl?: string;
  height?: string;
  mossType?: string; // Added to determine the model path
  isGardenView?: boolean; // If true, applies 1.5x scale multiplier for "My Digital Moss Garden"
}

export default function MossPreview3D({ imageUrl, height = 'h-56', mossType, isGardenView = false }: MossPreview3DProps) {
  // Determine the model path based on moss type
  const modelPath = mossType ? MOSS_MODEL_MAP[mossType] : undefined;
  
  // Get base scale based on model file name
  let baseScale = getModelScale(modelPath);
  
  // Apply 1.5x multiplier for "My Digital Moss Garden" view to fill 70-80% of container
  if (isGardenView) {
    baseScale = baseScale * 1.5;
  }
  
  // Camera settings - moved closer for better model visibility
  const cameraPosition: [number, number, number] = [0, 1.5, 2.2];
  const cameraFov = 50;

  return (
    <div className={`w-full ${height} rounded-xl overflow-hidden bg-[#e8f5ea]`}>
      <Canvas camera={{ position: cameraPosition, fov: cameraFov }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 3, 2]} intensity={0.7} />
        <Suspense fallback={<PlaceholderBox />}>
          {modelPath ? (
            <MossModel modelPath={modelPath} baseScale={baseScale} />
          ) : (
            <DefaultMossModel baseScale={baseScale} />
          )}
        </Suspense>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}

