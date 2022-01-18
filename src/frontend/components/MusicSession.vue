<template>
    <div class="list-group-item">
        <div class="col music-session">
            <div class="row">
                <div class="col">
                    {{ createdAt }}
                </div>
                <div class="col">
                    <template v-if="musicSession.status === 'active'">
                        <span class="session-status status-active" />
                        Aktiv
                    </template>
                    <template v-else>
                        <span class="session-status status-inactive" />
                        Inaktiv
                    </template>
                </div>
                <div class="col">
                    <router-link
                        :to="playLink"
                        class="btn btn-outline-primary"
                    >
                        Beitreten
                    </router-link>
                    <button
                        type="button"
                        class="btn btn-outline-danger"
                        @click="deactivateSession"
                    >
                        <i class="bi bi-trash" />
                    </button>
                </div>
            </div>
            <div class="row music-session-link">
                <div class="col input-group">
                    <input
                        type="text"
                        class="form-control"
                        disabled
                        :value="shareLink"
                    >
                    <button
                        class="input-group-text btn btn-outline-light"
                        @click="shareMusicSessionLink"
                    >
                        <i class="bi bi-share" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { deactivateMusicSession } from "../features/MusicSessions/deactivateMusicSession";

export default {
  props: {
    spotifyUserId: {
      type: String,
      default() {
        return ""
      }
    },
    musicSession: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    createdAt() {
      const date = new Date(this.musicSession.createdAt * 1000);
      return date.toLocaleDateString(navigator.language, {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
    },
    shareLink() {
      return process.env.VUE_APP_BASEURL + this.playLink;
    },
    playLink() {
      return "/play/" + this.spotifyUserId + "/"  + this.musicSession.id;
    },
  },
  methods: {
    async shareMusicSessionLink() {
      await navigator.share({ title: "DJ Shorty", url: this.shareLink });
    },
    async deactivateSession() {
      const updatedMusicSession = await deactivateMusicSession(this.spotifyUserId, this.musicSession.id);
      this.$emit("music-session-changed", updatedMusicSession);
    }
  },
};
</script>

<style scoped>
.music-session-link {
  margin-top: 0.5rem;
}

.session-status {
  height: 10px;
  width: 10px;
  background-color: rgb(46, 107, 37);
  border-radius: 50%;
  display: inline-block;
}

.status-active {
  background-color: rgb(46, 107, 37);
}

.status-inactive {
  background-color: rgb(104, 16, 16);
}
</style>