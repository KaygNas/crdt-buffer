import { createApp } from "vue";
import "./style.css";
import App from "./app.vue";

createApp(App).mount("#app");

import { data_to_bytes } from "crdt-buffer";
const result = data_to_bytes({
  uuids: [
    "0442197c814447f7ae64340a2df3d796",
    "4ae8bd76e84c4652bcd8a5e339c574f3",
  ],
  palette: ["ffffff", "6c4fff"],
  width: 100,
  data: [
    {
      Pixel: [/* uuid index */ 0, /* timestamp */ 3, /** palette index */ 0],
    },
    {
      Pixel: [/* uuid index */ 0, /* timestamp */ 4, /** palette index */ 0],
    },
    {
      Pixel: [/* uuid index */ 0, /* timestamp */ 2, /** palette index */ null],
    },
    {
      Blank: 97, // run of blank pixels
    },
    {
      Pixel: [/* uuid index */ 1, /* timestamp */ 2, /** palette index */ 1],
    },
    {
      Pixel: [/* uuid index */ 1, /* timestamp */ 3, /** palette index */ 2],
    },
  ],
});

const chunk = <T>(arr: T[], size: number) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, size + i));
  }
  return result;
};

const chunks = chunk(
  Array.from(result).map((n) => n.toString(16).padStart(2, "0")),
  8,
);

console.log(chunks.map((chunk) => chunk.join(" ")).join("\n"));
