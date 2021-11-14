<template>
  <div class="row list-group music-sessions">
    <MusicSession />
    <MusicSession />
  </div>
</template>

<script>
import MusicSession from "./MusicSession";

export default {
  components: {
    MusicSession,
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.music-sessions {
  margin-top: 1rem;
}
</style>