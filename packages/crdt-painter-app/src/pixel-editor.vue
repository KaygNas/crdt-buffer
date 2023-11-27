<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { RGB, PixelEditor, ClientConnect } from "./pixel-editor";

export interface Props {
  uuid: string;
  latency?: number;
}
const props = defineProps<Props>();

const canvasElementRef = ref<HTMLCanvasElement>();
const inputElementRef = ref<HTMLInputElement>();

const initialize = () => {
  // get canvas
  const canvas = canvasElementRef.value;
  if (!(canvas instanceof HTMLCanvasElement))
    throw new Error(`<canvas> not found!`);

  // get the color input
  const palette = inputElementRef.value;
  if (!(palette instanceof HTMLInputElement))
    throw new Error(`<input> not found!`);

  // set the artboard size
  const artboardSize = { w: 100, h: 100 };

  // instantiate the two `PixelEditor` classes
  const editor = new PixelEditor(canvas, artboardSize);
  const connect = new ClientConnect(props.uuid, props.latency);

  // merge the states whenever either editor makes a change
  connect.onmessage = (state) => editor.receive(state);
  editor.onchange = (state) => connect.send(state);

  // set the color whenever the palette input changes
  const onPaletteInput = (
    inputElement: HTMLInputElement,
    setter: (value: RGB) => void,
  ) => {
    inputElement.oninput = () => {
      const hex = inputElement.value.substring(1).match(/[\da-f]{2}/g) || [];
      const rgb = hex.join("");
      if (rgb.length === 6) setter(rgb as RGB);
    };
  };
  onPaletteInput(palette, (value) => (editor.color = value));
};

onMounted(initialize);
</script>

<template>
  <div class="wrapper">
    <canvas :ref="(el: any) => (canvasElementRef = el)" class="canvas"></canvas>
    <div class="title-wrapper">
      <h3 class="title">{{ uuid }}</h3>
      <input
        :ref="(el: any) => (inputElementRef = el)"
        class="color"
        type="color"
        value="#000000"
      />
    </div>
  </div>
</template>

<style>
.wrapper {
  display: inline-flex;
  flex-direction: column;
  gap: 1rem;
}

.canvas {
  width: 25rem;
  height: 25rem;
  border: 0.25rem solid #eeeeee;
  border-radius: 0.25rem;
  cursor: crosshair;
  touch-action: none;
}

.title-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.title {
  margin: 0;
}

.color {
  border: 0;
}
</style>
