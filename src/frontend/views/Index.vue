<template>
  <div class="index">
    <div v-if="!this.accessToken">
      <router-link to="/authorize"> Einloggen bei Spotify </router-link>
    </div>
  </div>
</template>

<script>
import { getCurrentSpotifyUser } from "../features/getCurrentSpotifyUser/getCurrentSpotifyUser";
import axios from "axios";

export default {
  name: "Index",
  data() {
    return {
      spotifyUser: {},
      accessToken: false,
    };
  },
  async created() {
    console.log(process.env);
    this.accessToken = await this.$getAccessToken();

    if (this.accessToken) {
      this.$router.push("/host");
    }
  },
};
</script>
