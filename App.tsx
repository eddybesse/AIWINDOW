import React, { useState, useEffect } from 'react';
import ViewerScene from './components/ViewerScene';
import Controls from './components/Controls';
import { ViewerState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<ViewerState>({
    fileUrl: null,
    fileName: null,
    isRotating: false,
    rotationSpeed: 0.5, // Slower default speed for auto-rotate
    manualRotation: 0,
  });

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (state.fileUrl) {
        URL.revokeObjectURL(state.fileUrl);
      }
    };
  }, [state.fileUrl]);

  const handleFileUpload = (file: File) => {
    // Revoke previous URL if exists
    if (state.fileUrl) {
      URL.revokeObjectURL(state.fileUrl);
    }

    const url = URL.createObjectURL(file);
    setState(prev => ({
      ...prev,
      fileUrl: url,
      fileName: file.name,
      isRotating: false, // Stop rotation on new load
      manualRotation: 0, // Reset manual rotation
    }));
  };

  const toggleRotation = () => {
    setState(prev => ({
      ...prev,
      isRotating: !prev.isRotating
    }));
  };

  const handleRotateLeft = () => {
    // Stop auto-rotation and step left by 45 degrees
    setState(prev => ({
      ...prev,
      isRotating: false,
      manualRotation: prev.manualRotation - (Math.PI / 4)
    }));
  };

  const handleRotateRight = () => {
    // Stop auto-rotation and step right by 45 degrees
    setState(prev => ({
      ...prev,
      isRotating: false,
      manualRotation: prev.manualRotation + (Math.PI / 4)
    }));
  };

  const resetView = () => {
    if (state.fileUrl) {
        setState(prev => ({ 
          ...prev, 
          isRotating: false,
          manualRotation: 0 
        }));
    }
  };

  return (
    <div className="relative w-screen h-screen bg-black">
      {/* 3D Viewer Layer */}
      <ViewerScene 
        fileUrl={state.fileUrl} 
        isRotating={state.isRotating} 
        rotationSpeed={state.rotationSpeed}
        manualRotation={state.manualRotation}
      />

      {/* Header Overlay */}
      <div className="absolute top-0 left-0 p-6 z-10 pointer-events-none">
        <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">
          GLB<span className="text-indigo-500">Spinner</span>
        </h1>
        <p className="text-zinc-400 text-xs mt-1 font-medium tracking-wide uppercase">
          Interactive 3D Viewer
        </p>
      </div>

      {/* Controls Layer */}
      <Controls 
        onFileUpload={handleFileUpload} 
        isRotating={state.isRotating} 
        toggleRotation={toggleRotation}
        onRotateLeft={handleRotateLeft}
        onRotateRight={handleRotateRight}
        fileName={state.fileName}
        resetView={resetView}
      />
    </div>
  );
};

export default App;