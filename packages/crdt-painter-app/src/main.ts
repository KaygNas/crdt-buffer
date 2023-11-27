import { createApp } from "vue";
import "./style.css";
import App from "./app.vue";

createApp(App).mount("#app");

import { greet } from "crdt-buffer";
greet("World");
