import React, { useRef } from 'react';
import { Upload, RefreshCcw, Box, Play, Pause, ArrowLeft, ArrowRight } from 'lucide-react';

interface ControlsProps {
  onFileUpload: (file: File) => void;
  isRotating: boolean;
  toggleRotation: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  fileName: string | null;
  resetView: () => void;
}

const Controls: React.FC<ControlsProps> = ({ 
  onFileUpload, 
  isRotating, 
  toggleRotation,
  onRotateLeft,
  onRotateRight,
  fileName,
  resetView
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-10">
      <div className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-2xl p-4 shadow-2xl shadow-black/50 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* File Info / Upload Section */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
            <Box className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-zinc-200 truncate max-w-[200px]">
              {fileName || "Ready to view"}
            </h3>
            <p className="text-xs text-zinc-500">
              {fileName ? "Model loaded successfully" : "Supports .glb & .gltf"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".glb,.gltf"
            className="hidden" 
          />
          
          <button 
            onClick={triggerUpload}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-xl transition-all active:scale-95 border border-zinc-700"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>

          <div className="h-8 w-px bg-zinc-800 mx-2 hidden md:block"></div>

          <div className="flex items-center gap-1 bg-zinc-800/50 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={onRotateLeft}
              disabled={!fileName}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50"
              title="Rotate Left"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={toggleRotation}
              disabled={!fileName}
              className={`flex items-center justify-center w-10 h-8 rounded-lg transition-all active:scale-95 ${
                isRotating 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
                  : 'text-zinc-200 hover:bg-zinc-700 disabled:opacity-50'
              }`}
              title={isRotating ? "Stop Rotation" : "Start Rotation"}
            >
              {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button
              onClick={onRotateRight}
              disabled={!fileName}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50"
              title="Rotate Right"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <button 
             onClick={resetView}
             className="p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
             title="Reset View"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;