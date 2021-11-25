<template>
  <div>
    <div
      class="row list-group music-sessions"
      v-for="musicSession in musicSessions"
      v-bind:key="musicSession.id"
    >
      <MusicSession v-bind:musicSession="musicSession" />
    </div>
  </div>
</template>

<script>
import MusicSession from "./MusicSession";

export default {
  components: {
    MusicSession,
  },
  props: {
    musicSessions: Array,
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