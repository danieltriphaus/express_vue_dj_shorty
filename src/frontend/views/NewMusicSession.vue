<template>
    <div class="container">
        <form
            id="new-music-session"
            @submit.prevent="createMusicSession"
        >
            <div class="row">
                <label for="waitTime">Wartezeit</label>
                <input
                    id="waitTime"
                    v-model="musicSession.waitTime"
                    type="number"
                    class="form-control"
                >
            </div>

            <div class="row">
                <label for="playlist">Playlist auswählen oder erstellen</label>
                <button
                    v-if="!playlistCreate"
                    type="button"
                    class="btn btn-outline-primary"
                    @click="playlistCreate = true"
                >
                    Neue Playlist erstellen
                </button>
                <div
                    v-if="playlistCreate"
                    class="input-group g-0"
                >
                    <input
                        id="new-playlist-name"
                        v-model="newPlaylistName"
                        type="text"
                        placeholder="Namen eingeben"
                        class="col form-control"
                    >
                    <button
                        type="button"
                        class="btn btn-outline-primary"
                        @click="createPlaylist"
                    >
                        <i class="bi bi-check" />
                    </button>
                </div>
            </div>

            <template v-for="playlist in playlists.items">
                <NewMusicSessionPlaylistItem
                    :key="playlist.id"
                    v-model="playlistParams"
                    :value="playlist.id"
                    :playlist="playlist"
                />
            </template>

            <div class="row mt-4">
                <input
                    id="submit"
                    type="submit"
                    class="form-control btn btn-outline-primary"
                    value="Erstellen"
                >
            </div>
        </form>
    </div>
</template>

<script>
import { createPlaylist } from "../features/Playlists/createPlaylist";
import { getCurrentSpotifyUser } from "../features/getCurrentSpotifyUser/getCurrentSpotifyUser";
import { getPlaylists } from "../features/Playlists/getPlaylists";
import NewMusicSessionPlaylistItem from "../components/NewMusicSessionPlaylistItem";
import { createNewMusicSession } from "../features/MusicSessions/createNewMusicSession";

export default {
  components: { NewMusicSessionPlaylistItem },
  data() {
    return {
      playlistCreate: false,
      waitTime: 0,
      newPlaylistName: "",
      playlists: [],
      playlistParams: {
        spotifyPlaylistId: undefined,
        playlistName: undefined
      },
      musicSession: {
        waitTime: "",
      },
    };
  },
  async created() {
    this.accessToken = await this.$getAccessToken();

    Promise.all([
      getPlaylists(this.accessToken),
      getCurrentSpotifyUser(this.accessToken),
    ]).then((values) => {
      [this.playlists, this.spotifyUser] = values;
    });
  },
  methods: {
    createPlaylist() {
      createPlaylist(
        this.accessToken,
        this.spotifyUser.id,
        this.newPlaylistName
      ).then(async () => {
        this.playlists = await getPlaylists(this.accessToken);
      });

      this.playlistCreate = false;
    },
    async createMusicSession() {
      const newMusicSession = await createNewMusicSession(
        { ...this.musicSession, ...this.playlistParams },
        this.spotifyUser.id
      );
      if (newMusicSession.id.length > 0) {
        this.$router.push("/host");
      }
    },
  },
};
</script>

