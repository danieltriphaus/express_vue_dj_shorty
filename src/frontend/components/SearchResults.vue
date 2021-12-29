<template>
  <div class="search-results g-0">
    <div 
      v-for="track in searchResultTracks" 
      :key="track.id"
      class="result"
    >
      <search-result-track
        :track="track"
        @track-added="$emit('track-added')"
      />
    </div>
    <div
      v-show="showMoreSongsButton"
      class="result load-more-songs"
      @click="loadMoreSongs"
    >
      <spinner :is-loading="isLoadingMoreSongs" />
      <span v-if="!isLoadingMoreSongs"> Mehr Songs </span>
    </div>
    <template
      v-for="album in searchResultAlbums"
    >
      <search-result-album
        :key="album.id"
        :album="album" 
      />
    </template>
  </div>
</template>

<script>
import SearchResultTrack from "./SearchResultTrack";
import SearchResultAlbum from "./SearchResultAlbum";
import Spinner from "./Spinner";

export default {
  components: {
    SearchResultTrack,
    SearchResultAlbum,
    Spinner
  },
  props: {
    isLoading: {
      type: Boolean,
      default() {
        return false;
      }
    },
    isLoadingMoreSongs: {
      type: Boolean,
      default() {
        return false;
      }
    },
    searchResults: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
      return {
        numberOfSongLoads: 0,
      };
  },
  computed: {
    searchResultTracks() {
      return this.searchResults.tracks ? this.searchResults.tracks.items : {}
    },
    searchResultAlbums() {
      return this.searchResults.albums ? this.searchResults.albums.items : {}
    },
    showMoreSongsButton() {
      return this.searchResults.tracks || this.searchResults.albums;
    }
  },
  methods: {
    async loadMoreSongs() {
      this.numberOfSongLoads++;
      this.$emit("load-more-songs", this.numberOfSongLoads)
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
  padding: 5px 0 5px 0;
}


.spinner-border {
  display: inline-block;
}
</style>