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

        <input
          type="radio"
          name="playist"
          id="playlist1"
          class="btn-check"
          autocomplete="off"
        />
        <label class="btn btn-outline-secondary" for="playlist1">
          <div class="d-flex w-100 justify-content-between">
            <h6>Playlist 1</h6>
            <div class="text-end">Tracks: 45 Länge: 1h 3min</div>
          </div>
        </label>

        <input
          type="radio"
          name="playist"
          id="playlist2"
          class="btn-check"
          autocomplete="off"
          checked
        />
        <label class="btn btn-outline-secondary" for="playlist2">
          <div class="d-flex w-100 justify-content-between">
            <h6>Playlist 2</h6>
            <div class="text-end">Tracks: 45 Länge: 1h 3min</div>
          </div>
        </label>
      </div>

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
import { createPlaylist } from "../features/CreatePlaylist/createPlaylist";
import { getCurrentSpotifyUser } from "../features/getCurrentSpotifyUser/getCurrentSpotifyUser";

export default {
  data() {
    return {
      playlistCreate: false,
      waitTime: 0,
      newPlaylistName: "",
    };
  },
  methods: {
    async createPlaylist() {
      const accessToken = await this.$getAccessToken();
      const spotifyUser = await getCurrentSpotifyUser(accessToken);

      await createPlaylist(accessToken, spotifyUser.id, this.newPlaylistName);
      this.playlistCreate = false;
    },
  },
};
</script>

