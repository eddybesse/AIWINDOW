import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import { ModelProps } from '../types';

const ModelRender: React.FC<ModelProps> = ({ url, isRotating, rotationSpeed, manualRotation }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);
  
  // Refs to track rotation logic without triggering re-renders
  const targetRotation = useRef(0);
  const lastManualRotation = useRef(manualRotation);

  // Sync refs when prop changes (for new file loads)
  useEffect(() => {
    lastManualRotation.current = manualRotation;
    targetRotation.current = manualRotation;
  }, [url]); // Only reset when URL changes, otherwise we handle steps in useFrame

  // Clean up the scene when the component unmounts or URL changes
  useEffect(() => {
    return () => {
      useGLTF.preload(url); 
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });
    };
  }, [url, scene]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // 1. Handle Manual Steps
      // Check if the manualRotation prop has changed since last frame
      const manualDiff = manualRotation - lastManualRotation.current;
      if (manualDiff !== 0) {
        targetRotation.current += manualDiff;
        lastManualRotation.current = manualRotation;
      }

      // 2. Handle Auto-Rotation
      if (isRotating) {
        targetRotation.current += rotationSpeed * delta;
      }

      // 3. Apply Smooth Rotation (Damping)
      // Smoothly interpolate current rotation to target rotation
      // Lambda = 5 gives a nice snappy but smooth transition
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetRotation.current,
        5,
        delta
      );
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      <Center top>
        <primitive object={scene} />
      </Center>
    </group>
  );
};

export default ModelRender;