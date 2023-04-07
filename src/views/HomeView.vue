<template>
  <main>
    <!-- eslint-disable-next-line vuejs-accessibility/media-has-caption -->
    <audio id="audio"></audio>

    <button type="button" @click="handlePlayMusic">Play music</button>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Hls from "hls.js";

const hlsInstance = ref<Hls | null>(null);

const handlePlayMusic = () => {
  const audio = document.getElementById("audio") as HTMLAudioElement;

  hlsInstance.value = new Hls();

  hlsInstance.value.loadSource(
    "http://localhost:3003/public/1/320kbps/1-320kbps.m3u8"
  );

  hlsInstance.value.attachMedia(audio);

  hlsInstance.value.on(Hls.Events.MANIFEST_PARSED, () => {
    audio.play();
  });
};
</script>
