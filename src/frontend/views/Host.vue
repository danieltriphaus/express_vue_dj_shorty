<template>
  <div :class="this.$route.name" class="container">
    <div class="spotify_user_info row">
      <h3>
        Eingeloggt als
        {{ spotifyUser.display_name }}
      </h3>
    </div>
    <div class="row">
      <button type="button" class="btn btn-outline-primary">
        Neue Session erstellen
      </button>
    </div>

    <div class="row list-group music-sessions">
      <div class="list-group-item">
        <div class="col music-session">
          <div class="row">
            <div class="col">10.11.2021</div>
            <div class="col">
              <span class="session-status status-active"></span> Aktiv
            </div>
            <div class="col">
              <a class="btn btn-outline-primary">Beitreten</a>
              <button type="button" class="btn btn-outline-danger">
                Deaktiveren
              </button>
            </div>
          </div>
          <div class="row music-session-link">
            <div class="col input-group">
              <input
                type="text"
                class="form-control"
                disabled
                value="https://djshorty.de/music_session/dwa8d8321jfds8f493128432ffjs8321jsa"
              />
              <span class="input-group-text"><i class="bi bi-share"></i></span>
            </div>
          </div>
        </div>
      </div>
      <div class="list-group-item">
        <div class="col music-session">
          <div class="row">
            <div class="col">10.11.2021</div>
            <div class="col">
              <span class="session-status status-inactive"></span> Inaktiv
            </div>
            <div class="col">
              <a class="btn btn-outline-primary disabled">Beitreten</a>
              <button
                type="button"
                class="btn btn-outline-danger"
                disabled
                aria-disabled="disabled"
              >
                Deaktiveren
              </button>
            </div>
          </div>
          <div class="row music-session-link">
            <div class="col input-group">
              <input
                type="text"
                class="form-control"
                disabled
                value="https://djshorty.de/music_session/dwa8d8321jfds8f493128432ffjs8321jsa"
              />
              <span class="input-group-text"><i class="bi bi-share"></i></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAccessTokenController } from "../features/GetAccessToken/getAccessToken";
import { getCurrentSpotifyUser } from "../features/getCurrentSpotifyUser/getCurrentSpotifyUser";

export default {
  data() {
    return {
      accessToken: "",
      spotifyUser: {},
    };
  },
  async created() {
    this.accessToken = await getAccessTokenController(
      process.env.VUE_APP_APIURL,
      this.$cookie
    );

    this.spotifyUser = await getCurrentSpotifyUser(this.accessToken);
  },
};
</script>


<style scoped>
.music-sessions {
  margin-top: 1rem;
}

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