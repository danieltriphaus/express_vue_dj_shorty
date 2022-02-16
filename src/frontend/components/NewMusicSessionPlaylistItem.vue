<template>
    <div class="row">
        <input
            :id="playlist.id"
            type="radio"
            name="playlist"
            autocomplete="off"
            class="btn-check"
            :value="value"
            @change="$emit('change', { spotifyPlaylistId: $event.target.value, playlistName: playlist.name });"
        >
        <label
            class="btn btn-outline-secondary"
            :for="playlist.id"
        >
            <div class="d-flex w-100 justify-content-between">
                <h6>{{ playlist.name }}</h6>
                <div class="text-end">Tracks: {{ playlist.tracks.total }}</div>
            </div>
        </label>
    </div>
</template>

<script>
export default {
  model: {
    prop: "modelValue",
    event: "change",
  },
  props: {
    playlist: {
      type: Object,
      default() {
          return {};
      }
    },
    modelValue: { 
      type: Object,
      default() {
          return {} ;
      }
    },
    value: { 
      type: String,
      default: undefined 
    },
  },
};
</script>