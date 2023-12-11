export interface Platform {
  createCanvasElement: () => HTMLCanvasElement;
  getSize: () => Size;
  getUuid: () => string;
  getLatency: () => number;
}

export interface Size {
  width: number;
  height: number;
}
