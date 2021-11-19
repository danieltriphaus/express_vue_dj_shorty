<template>
  <div class="container">
    <form id="new-music-session">
      <div class="row">
        <label for="waitTime">Wartezeit</label>
        <input id="waitTime" type="number" class="form-control" />
      </div>

      <div class="row">
        <label for="playlist">Playlist auswählen oder erstellen</label>
        <button
          type="button"
          class="btn btn-outline-primary"
          v-if="!playlistCreate"
          v-on:click="playlistCreate = true"
        >
          Neue Playlist erstellen
        </button>
        <div class="input-group g-0" v-if="playlistCreate">
          <input
            type="text"
            id="new-playlist-name"
            placeholder="Namen eingeben"
            class="col form-control"
            v-model="newPlaylistName"
          />
          <button
            type="button"
            class="btn btn-outline-primary"
            v-on:click="createPlaylist"
          >
            <i class="bi bi-check"></i>
          </button>
        </div>
      </div>

      <template v-for="playlist in playlists.items">
        <NewMusicSessionPlaylistItem
          v-bind:playlist="playlist"
          v-bind:key="playlist.id"
        />
      </template>

      <div class="row mt-4">
        <input
          type="submit"
          id="submit"
          class="form-control btn btn-outline-primary"
          value="Erstellen"
        />
      </div>
    </form>
  </div>
</template>

<script>
import { createPlaylist } from "../features/Playlists/createPlaylist";
import { getCurrentSpotifyUser } from "../features/getCurrentSpotifyUser/getCurrentSpotifyUser";
import { getPlaylists } from "../features/Playlists/getPlaylists";
import NewMusicSessionPlaylistItem from "../components/NewMusicSessionPlaylistItem";

export default {
  components: { NewMusicSessionPlaylistItem },
  data() {
    return {
      playlistCreate: false,
      waitTime: 0,
      newPlaylistName: "",
      playlists: [],
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
  },
};
</script>

