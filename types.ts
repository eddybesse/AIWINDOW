export interface ViewerState {
  fileUrl: string | null;
  fileName: string | null;
  isRotating: boolean;
  rotationSpeed: number;
  manualRotation: number;
}

export interface ModelProps {
  url: string;
  isRotating: boolean;
  rotationSpeed: number;
  manualRotation: number;
}