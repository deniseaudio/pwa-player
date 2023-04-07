<template>
  <main className="flex flex-col items-center justify-center min-h-screen">
    <!-- eslint-disable-next-line vuejs-accessibility/media-has-caption -->
    <audio id="audio"></audio>

    <div
      class="fixed top-0 right-0 px-4 py-2 flex items-center justify-center bg-stone-600 rounded-bl-xl text-stone-50 font-medium text-xs"
    >
      <p>HLS supported: {{ isHlsSupported ? "yes" : "no 😩" }}</p>
    </div>

    <h1 class="text-3xl text-stone-50 text-center font-bold">
      Denise Audio - PWA
    </h1>

    <p class="mt-12 text-center text-stone-200 font-medium text-base">
      Choose a song ID
    </p>

    <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
    <input
      type="text"
      v-model="songId"
      class="mt-2 bg-stone-800 text-stone-50 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-600 transition duration-200 ease-in-out"
    />

    <button
      type="button"
      className="mt-8 px-8 py-3 rounded-lg text-stone-50 font-medium text-xl bg-gradient-to-br from-blue-600 via-sky-600 to-emerald-600 hover:scale-105 transition-all duration-500 ease-in-out"
      @click="transcodeSong"
      :disabled="isTranscoding"
    >
      Start streaming ✨
    </button>

    <p v-if="isTranscoding" class="mt-2 text-sm font-medium text-stone-400">
      Transcoding in progress...
    </p>

    <p v-if="transcodeError" class="mt-2 text-sm font-medium text-red-600">
      {{ transcodeError }}
    </p>

    <div class="mt-8 flex gap-x-8">
      <button
        type="button"
        class="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 via-sky-600 to-emerald-600 rounded-lg"
        @click="handleResume"
      >
        <PlayIcon class="w-8 h-8 text-stone-50" />
      </button>

      <button
        type="button"
        class="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 via-sky-600 to-emerald-600 rounded-lg"
        @click="handlePause"
      >
        <PauseIcon class="w-8 h-8 text-stone-50" />
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Hls from "hls.js";
import { PauseIcon, PlayIcon } from "@heroicons/vue/24/solid";

const hlsInstance = ref<Hls | null>(null);

const songId = ref<string>("1");
const transcodeError = ref<string>("");

const isHlsSupported = ref<boolean>(Hls.isSupported());
const hasStarted = ref<boolean>(false);
const isTranscoding = ref<boolean>(false);

const startHlsAudioStream = (transcodedSongId: string) => {
  const audio = document.getElementById("audio") as HTMLAudioElement;

  if (hasStarted.value) {
    audio.pause();
    hlsInstance.value?.destroy();
    hasStarted.value = false;
  }

  hlsInstance.value = new Hls();

  hlsInstance.value.loadSource(
    `${
      import.meta.env.VITE_API_BASE_URL
    }/stream/${transcodedSongId}/320/playlist`
  );

  hlsInstance.value.attachMedia(audio);

  hlsInstance.value.on(Hls.Events.MANIFEST_PARSED, () => {
    audio.play();
    hasStarted.value = true;
  });
};

/**
 * Safari iOS does not support HLS.js. However, they do support native HLS M3U8 streams
 * on the <audio> tag.
 *
 * @see https://stackoverflow.com/a/61008253/3669565
 */
const startSafariAudioStream = (transcodedSongId: string) => {
  const audio = document.getElementById("audio") as HTMLAudioElement;

  if (hasStarted.value) {
    audio.pause();
    hasStarted.value = false;
  }

  audio.src = `${
    import.meta.env.VITE_API_BASE_URL
  }/stream/${transcodedSongId}/320/playlist`;

  audio.addEventListener("loadedmetadata", () => {
    audio.play();
    hasStarted.value = true;
  });
};

const transcodeSong = async () => {
  try {
    transcodeError.value = "";
    isTranscoding.value = true;

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/transcode/${songId.value}`
    );

    isTranscoding.value = false;

    if (response.status === 200) {
      if (isHlsSupported.value) {
        startHlsAudioStream(songId.value);
      } else {
        startSafariAudioStream(songId.value);
      }
    } else {
      transcodeError.value =
        "Something went wrong, please try another song ID.";
    }
  } catch (error) {
    console.log(error);
  }
};

const handlePause = () => {
  if (hasStarted.value) {
    const audio = document.getElementById("audio") as HTMLAudioElement;
    audio.pause();
  }
};

const handleResume = () => {
  if (hasStarted.value) {
    const audio = document.getElementById("audio") as HTMLAudioElement;
    audio.play();
  }
};
</script>
