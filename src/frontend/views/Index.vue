<template>
    <div class="index container">
        <div
            v-if="!accessToken"
            class="row justify-content-center mt-4"
        >
            <router-link
                id="spotify-login"
                to="/authorize"
                class="btn btn-outline-primary"
            >
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
                query: this.$route.query,
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
