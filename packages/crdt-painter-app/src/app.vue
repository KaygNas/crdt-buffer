<script lang="ts" setup>
import PixelEditor from "./pixel-editor.vue";
</script>

<template>
  <PixelEditor uuid="alice" :latency="1" />
  <PixelEditor uuid="bob" :latency="3" />
</template>

<style></style>
