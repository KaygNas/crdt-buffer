import { PixelData } from "./pixel-data";
export interface CRDTData {
  uuids: string[];
  palette: string[];
  width: number;
  data: { Pixel?: [number, number, number | null]; Blank?: number }[];
}

export function fromCRDTData(crdtData: CRDTData) {
  const { uuids, palette, width, data } = crdtData;
  const state: PixelData["state"] = {};

  let index = 0;
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const x = index % width;
    const y = Math.floor(index / width);
    if (!!item.Pixel) {
      const [uuidIndex, timestamp, paletteIndex] = item.Pixel;
      const uuid = uuids[uuidIndex];
      const color = paletteIndex === null ? null : palette[paletteIndex];
      const key = PixelData.key(x, y);
      state[key] = [uuid, timestamp, color];
      index += 1;
    } else if (!!item.Blank) {
      const length = item.Blank;
      index += length;
    } else {
      throw new Error("Invalid CRDT data");
    }
  }

  return state;
}

export function toCRDTData(state: PixelData["state"], width: number): CRDTData {
  const uuids: string[] = [];
  const palette: string[] = [];
  const data: CRDTData["data"] = [];

  const coords = Object.keys(state)
    .map(
      (key) => key.split(",").map((n) => parseInt(n, 10)) as [number, number],
    )
    .sort(([x1, y1], [x2, y2]) => {
      if (y1 - y2 === 0) return x1 - x2;
      else return y1 - y2;
    });

  let prevPixelIndex = -1;
  for (let i = 0; i < coords.length; i++) {
    const coord = coords[i];
    const [x, y] = coord;
    const [uuid, timestamp, color] = state[PixelData.key(x, y)];
    const pixelIndex = x + y * width;
    let uuidIndex = uuids.indexOf(uuid);
    let paletteIndex = color === null ? null : palette.indexOf(color);

    if (uuidIndex === -1) {
      uuidIndex = uuids.push(uuid) - 1;
    }

    if (paletteIndex === -1 && color !== null) {
      paletteIndex = palette.push(color) - 1;
    }

    if (pixelIndex - prevPixelIndex > 1) {
      data.push({ Blank: pixelIndex - prevPixelIndex - 1 });
    }
    data.push({ Pixel: [uuidIndex, timestamp, paletteIndex] });

    prevPixelIndex = pixelIndex;
  }

  return { uuids, palette, width, data };
}
