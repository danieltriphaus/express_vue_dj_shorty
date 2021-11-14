<template>
  <div class="container">
    <form id="new-music-session">
      <div class="row">
        <label for="waitTime">Wartezeit</label>
        <input id="waitTime" type="number" class="form-control" />
      </div>

      <!--
      <div class="row list-group">
        <label for="playlist">
          Öffentliche Playlist auswählen oder erstellen
        </label>
        <input id="playlist" type="hidden" />
        <div class="list-group-item btn btn-outline-secondary text-start">
          <h6>Playlist erstellen</h6>
        </div>
        <div class="list-group-item btn btn-outline-secondary">
          <div class="d-flex w-100 justify-content-between">
            <h6>Playlist 1</h6>
            <div class="text-end">Tracks: 45 Länge: 1h 3min</div>
          </div>
        </div>
      </div> -->

      <div class="row">
        <label for="playlist">Playlist auswählen oder erstellen</label>
        <button type="button" class="btn btn-outline-primary">
          Neue Playlist erstellen
        </button>

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
export default {
  data() {
    return {};
  },
};
</script>

