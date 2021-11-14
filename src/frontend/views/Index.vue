<template>
  <div class="index">
    <div v-if="!accessToken">
      <router-link to="/authorize"> Einloggen bei Spotify </router-link>
    </div>
    <div v-if="accessToken" class="spotify_user_info">
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
