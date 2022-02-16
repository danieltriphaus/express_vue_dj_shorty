<template>
    <div />
</template>

<script>
import { spotifyAuthorizeController } from "../features/SpotifyAuthorize/spotifyAuthorizeController.js";

export default {
  async created() {
    if (this.$route.query.code) {
      spotifyAuthorizeController(
        process.env.BASE_URL,
        this.$route.query.code,
        this.$route.query.state,
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