<template>
  <div class="row">
    <input
      type="radio"
      name="playlist"
      v-bind:id="playlist.id"
      autocomplete="off"
      class="btn-check"
      v-bind:value="value"
      v-on:change="$emit('change', $event.target.value)"
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
  model: {
    prop: "modelValue",
    event: "change",
  },
  props: {
    playlist: Object,
    modelValue: { default: "" },
    value: { type: String, default: undefined },
  },
};
</script>