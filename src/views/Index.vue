<template>
  <div class="index">
    <div>
      <router-link to="/authorize" v-if="!this.accessToken"
        >Einloggen bei Spotify</router-link
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      authenticated: false,
      accessToken: null,
    };
  },
  async created() {
    this.accessToken = this.$cookie.get("spotify_access_token");

    if (!this.accessToken) {
      const accessToken = await this.$apiClient.refreshAccessToken();

      this.$cookie.set("spotify_access_token", accessToken.value, {
        expires: accessToken.expiresIn + "s",
        path: "/",
      });
    }

    this.accessToken = this.$cookie.get("spotify_access_token");
  },
};
</script>
