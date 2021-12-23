<template>
  <div class="search-result">
    <div class="result-image">
      <img :src="track.album.images[1].url">
    </div>
    <div class="meta-data">
      <h6>{{ track.name }}</h6>
      {{ artists }}
    </div>
    <add-track-button
      :spotify-track-uri="track.uri"
      @track-added="$emit('track-added')"
    />
  </div>
</template>

<script>
import AddTrackButton from './AddTrackButton.vue';
export default {
  components: { AddTrackButton },
    props: {
        track: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    computed: {
      artists() {
        return this.track.artists.map((element) => element.name).join(', ');
      }
    }
}
</script>

<style scoped>
.search-result {
    display: table;
    border-collapse: separate;
    padding: 10px 0 10px 0;
    width: 100%;
}

.result-image {
    display: table-cell;
    width: 5%
}

.meta-data {
    display: table-cell;
    vertical-align: middle;
    padding-left: 5px;
}

.result-image img {
    height: 4rem;
}
</style>