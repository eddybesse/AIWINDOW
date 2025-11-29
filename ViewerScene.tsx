import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Html, useProgress } from '@react-three/drei';
import ModelRender from './ModelRender';
import { Loader2 } from 'lucide-react';

interface ViewerSceneProps {
  fileUrl: string | null;
  isRotating: boolean;
  rotationSpeed: number;
  manualRotation: number;
}

const LoadingIndicator = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-4 bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-700">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
        <span className="text-zinc-200 text-sm font-medium">{progress.toFixed(0)}% loaded</span>
      </div>
    </Html>
  );
};

const ViewerScene: React.FC<ViewerSceneProps> = ({ fileUrl, isRotating, rotationSpeed, manualRotation }) => {
  return (
    <div className="w-full h-full bg-zinc-950 relative overflow-hidden">
        {/* Grid Background Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/20 pointer-events-none"></div>

      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4], fov: 50 }}
        className="w-full h-full touch-none"
      >
        <Suspense fallback={<LoadingIndicator />}>
          {fileUrl ? (
            <Stage environment="city" intensity={0.6} adjustCamera>
              <ModelRender 
                key={fileUrl} // Force remount when file changes to reset rotation refs
                url={fileUrl} 
                isRotating={isRotating} 
                rotationSpeed={rotationSpeed} 
                manualRotation={manualRotation}
              />
            </Stage>
          ) : (
            <Html center>
               <div className="text-zinc-500 text-center select-none pointer-events-none">
                 <p className="text-lg font-medium">No model loaded</p>
                 <p className="text-sm opacity-60">Upload a .glb or .gltf file to start</p>
               </div>
            </Html>
          )}
        </Suspense>
        
        {/* Standard controls always available */}
        <OrbitControls makeDefault autoRotate={false} />
      </Canvas>
    </div>
  );
};

export default ViewerScene;