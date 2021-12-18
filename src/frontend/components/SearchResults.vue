<template>
  <div class="search-results g-0">
    <div 
      v-for="track in searchResultTracks" 
      :key="track.id"
      class="result"
    >
      <search-result-track :track="track" />
    </div>
    <div class="result load-more-songs">
      Mehr Songs
    </div>
    <template
      v-for="album in searchResultAlbums"
    >
      <search-result-album :album="album" :key="album.id"/>
    </template>
    <div class="result">
      <div class="search-result">
        <div class="result-image">
          <img src="https://via.placeholder.com/640">
        </div>
        <div class="meta-data">
          <h6>Künstler</h6>
        </div>
        <div class="add-button">
          <i class="bi bi-chevron-left" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchResultTrack from "./SearchResultTrack";
import SearchResultAlbum from "./SearchResultAlbum";

export default {
  components: {
    SearchResultTrack,
    SearchResultAlbum
  },
  props: {
    searchResults: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
      return {};
  },
  computed: {
    searchResultTracks() {
      return this.searchResults.tracks ? this.searchResults.tracks.items : {}
    },
    searchResultAlbums() {
      return this.searchResults.albums ? this.searchResults.albums.items : {}
    }
  }
}
</script>

<style scoped>
.result {
    border-bottom: 1px dotted rgb(131, 130, 130);
}

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

.load-more-songs {
  text-align: center;
  font-weight: bolder;
}

/*
@media (min-width: 576px) {
    .result-image img {
        height: 16%;
    }
}
*/
</style>