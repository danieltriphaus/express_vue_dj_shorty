<template>
  <div />
</template>

<script>
import axios from "axios";
import { spotifyAuthorizeController } from "../features/SpotifyAuthorize/spotifyAuthorizeController.js";

export default {
  async created() {
    this.axios = axios.create();

    if (this.$route.query.code) {
      spotifyAuthorizeController(
        process.env.BASE_URL,
        this.$route.query.code,
        process.env.VUE_APP_APIURL,
        this.$cookie,
        this.$router
      );
    } else {
      spotifyAuthorizeController(process.env.VUE_APP_BASEURL);
    }
  },
};
</script>