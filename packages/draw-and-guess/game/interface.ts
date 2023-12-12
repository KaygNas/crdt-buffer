export interface Size {
  width: number;
  height: number;
}

export interface Platform {
  createCanvasElement: () => HTMLCanvasElement;
  getSize: () => Size;
  getUuid: () => string;
  getLatency: () => number;
}
