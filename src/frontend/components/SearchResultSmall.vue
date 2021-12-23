<template>
  <div class="search-result">
    <div class="meta-data-small">
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
                return {};
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

.add-button {
  display: table-cell;
  font-size: 2.5rem;
  text-align: right;
  vertical-align: middle;
}

.meta-data-small {
  display: table-cell;
  padding: 5px;
}
</style>