<template>
  <div class="index">
    <div v-if="!accessToken">
      <router-link to="/authorize">
        Einloggen bei Spotify 
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      spotifyUser: {},
      accessToken: false,
    };
  },
  async created() {
    if (this.$route.query.code) {
      this.$router.push({
        path: "/authorize",
        query: this.$route.query
      });
    } else {
      this.accessToken = await this.$getAccessToken();

      if (this.accessToken) {
        this.$router.push("/host");
      }
    }
  },
};
</script>
