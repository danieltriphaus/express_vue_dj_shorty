<template>
  <div :class="this.$route.name">
    <div class="spotify_user_info">
      Eingeloggt als
      {{ spotifyUser.display_name }}
    </div>
    <div class="public-playlists" v-if="this.playlistSelect">
      <div class="playlist" style="width: 150px">
        <div class="create-new-playlist" style="width: 150px; height: 150x">
          <div class="plus-icon">+</div>
        </div>
        <div class="playlist-title">Neue Playlist erstellen</div>
      </div>
      <div class="playlist" style="width: 150px">
        <img src="https://via.placeholder.com/150" />
        <div class="playlist-title">Playlist 1</div>
      </div>
      <div class="playlist" style="width: 150px">
        <img src="https://via.placeholder.com/150" />
        <div class="playlist-title">Playlist 2</div>
      </div>
      <div class="playlist" style="width: 150px">
        <img src="https://via.placeholder.com/150" />
        <div class="playlist-title">Playlist 3</div>
      </div>
    </div>
    <div class="music-sessions">
      <div class="music-session">
        <span class="session-status status-active"></span> Aktiv Erstellt
        am:10.11.2021<br />
        <div class="music-session-link">
          https://djshorty.de/music_session/dwa8d8321jfds8f493128432ffjs8321jsa
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
.spotify_user_info {
  font-weight: bold;
}

.public-playlists {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.playlist {
  padding: 10px;
  border: 1px solid rgb(28, 28, 71);
}

.playlist:hover {
  background: #313131;
  cursor: pointer;
}

.create-new-playlist {
  background-color: #b0841e;
}

.plus-icon {
  font-size: 45px;
  text-align: center;
  line-height: 150px;
}

.music-session {
  border: 1px solid rgb(44, 44, 155);
  padding: 15px;
}

.session-status {
  height: 10px;
  width: 10px;
  background-color: rgb(46, 107, 37);
  border-radius: 50%;
  display: inline-block;
}

.music-session-link {
  padding: 5px;
  background-color: #b0841e5e;
}

.status-active {
  background-color: rgb(46, 107, 37);
}

.status-inactive {
  background-color: rgb(104, 16, 16);
}
</style>