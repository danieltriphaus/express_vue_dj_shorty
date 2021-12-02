<template>
  <div>
    <div
      v-for="musicSession in musicSessions"
      :key="musicSession.id"
      class="row list-group music-sessions"
    >
      <MusicSession 
        :music-session="musicSession"
        :spotify-user-id="spotifyUserId"
        @music-session-changed="reloadMusicSession"
      />
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
    spotifyUserId: {
      type: String,
      default() {
        return ""
      }
    },
    musicSessions: {
      type: Array,
      default() {
        return []
      }
    },
  },
  data() {
    return {};
  },
  methods: {
    reloadMusicSession(updatedMusicSession) {
      console.log("here");
      const changedIndex = this.musicSessions.findIndex((musicSession) => {
        return musicSession.id = updatedMusicSession.id;
      });

      this.$set(this.musicSessions, changedIndex, updatedMusicSession);
    }
  }
};
</script>

<style scoped>
.music-sessions {
  margin-top: 1rem;
}
</style>