<template>
  <div class="index">
    <div v-if="!this.accessToken">
      <router-link to="/authorize">Einloggen bei Spotify</router-link>
    </div>
    <div class="spotify_user_info" v-if="this.accessToken">
      Eingeloggt als
      <span class="spotify-text-color">{{ spotifyUser.display_name }}</span>
    </div>
  </div>
</template>

<script>
import { getAccessTokenController } from "../features/GetAccessToken/getAccessToken";
import { getCurrentSpotifyUser } from "../features/getCurrentSpotifyUser/getCurrentSpotifyUser";
import axios from "axios";

export default {
  name: "Index",
  data() {
    return {
      authenticated: false,
      accessToken: {},
      spotifyUser: {},
    };
  },
  async created() {
    this.accessToken = await getAccessTokenController(
      process.env.VUE_APP_APIURL,
      this.$cookie
    );

    if (this.accessToken) {
      this.$router.push("/host");
    }
  },
};
</script>
