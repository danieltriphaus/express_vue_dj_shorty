<template>
  <div />
</template>

<script>
import config from "../config/spotify.config.js";
import axios from "axios";

export default {
  async created() {
    if (this.$route.query.code) {
      await axios
        .post(process.env.VUE_APP_BASEURL + "/api/authorize", {
          code: this.$route.query.code,
        })
        .catch((error) => {
          console.log(error);
        });

      this.$router.push("/");
    } else {
      console.log(process.env);
      const oauth_redirect_url =
        config.authorization.baseUrl +
        config.authorization.endpoint +
        "?" +
        new URLSearchParams({
          client_id: config.clientId,
          response_type: "code",
          redirect_uri:
            process.env.VUE_APP_BASEURL + config.authorization.redirectEndpoint,
          //ToDo: state: CSRF Token
          scopes: "playlist-modify-public",
        });
      window.location.href = oauth_redirect_url;
    }
  },
};
</script>