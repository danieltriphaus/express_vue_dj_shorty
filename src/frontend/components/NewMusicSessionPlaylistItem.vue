<template>
  <div class="row">
    <input
      type="radio"
      name="playlist"
      v-bind:id="playlist.id"
      autocomplete="off"
      class="btn-check"
    />
    <label class="btn btn-outline-secondary" v-bind:for="playlist.id">
      <div class="d-flex w-100 justify-content-between">
        <h6>{{ playlist.name }}</h6>
        <div class="text-end">Tracks: {{ playlist.tracks.total }}</div>
      </div>
    </label>
  </div>
</template>

<script>
export default {
  props: ["playlist"],
};
</script>