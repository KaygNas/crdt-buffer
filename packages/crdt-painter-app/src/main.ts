import { createApp } from "vue";
import "./style.css";
import App from "./app.vue";

createApp(App).mount("#app");

import { data_to_bytes } from "crdt-buffer";
console.log(
  data_to_bytes({
    uuids: [
      "0442197c814447f7ae64340a2df3d796",
      "4ae8bd76e84c4652bcd8a5e339c574f3",
    ],
    palette: ["ffffff", "6c4fff"],
    width: 100,
    // TODO: recover
    // data: [
    //   [/* uuid index */ 0, /* timestamp */ 3, /** palette index */ 0],
    //   [/* uuid index */ 0, /* timestamp */ 4, /** palette index */ 0],
    //   [/* uuid index */ 0, /* timestamp */ 2, /** palette index */ null],
    //   97, // run of blank pixels
    //   [/* uuid index */ 1, /* timestamp */ 2, /** palette index */ 1],
    //   [/* uuid index */ 1, /* timestamp */ 3, /** palette index */ 1],
    // ],
  }),
);
