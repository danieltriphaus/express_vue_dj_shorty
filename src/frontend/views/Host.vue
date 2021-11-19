<template>
  <div :class="this.$route.name" class="container">
    <div class="spotify_user_info row">
      <h3>
        Eingeloggt als
        {{ spotifyUser.display_name }}
      </h3>
    </div>
    <div class="row">
      <router-link
        to="/new_music_session"
        type="button"
        class="btn btn-outline-primary"
      >
        Neue Session erstellen
      </router-link>
    </div>

    <MusicSessionList />
  </div>
</template>

<script>
import { getCurrentSpotifyUser } from "../features/getCurrentSpotifyUser/getCurrentSpotifyUser";
import MusicSessionList from "../components/MusicSessionList";


export default {
  components: {
    MusicSessionList,
  },
  data() {
    return {
      spotifyUser: { display_name: "" },
    };
  },
  async created() {
    this.accessToken = await this.$getAccessToken();
    this.spotifyUser = await getCurrentSpotifyUser(this.accessToken);
  },
};
</script>