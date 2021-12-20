<template>
  <div 
    class="container" 
    :class="focusClass"
  >
    <div class="row">
      <div class="col">
        <h4 v-show="!isFocused">
          Füge Songs zur Playlist hinzu
        </h4>
        <div class="d-flex align-items-center d-inline-block inner-addon right-addon">
          <i class="bi bi-search" />
          <input 
            id="searchTracks"
            v-model="searchQuery"
            v-debounce:300ms.lock.fireonempty="search"
            type="text"
            class="form-control"
            placeholder="Suche Songs auf Spotify"
            @focus="isFocused = true"
            @blur="blurSearchInput"
          >
        </div>
      </div>
    </div>
    <SearchResults
      v-show="isFocused" 
      :search-results="searchResults"
      :is-loading="isLoading"
      :is-loading-more-songs="isLoadingMoreSongs"
      @load-more-songs="loadMoreSongs"
    />
    <div 
      class="row justify-content-center" 
      :class="bottomClass"
    >
      <img 
        src="../assets/img/Spotify_Logo_RGB_White.png"
        class="spotify-logo"
      >
    </div>
  </div>
</template>

<script>
import SearchResults from "../components/SearchResults";
import { getDirective } from "vue-debounce";
import { searchSpotify } from "../features/Tracks/searchSpotify";

const SEARCH_LIMIT = 5;

export default {
    directives: {
        debounce: getDirective(2)
    },
    components: {
        SearchResults
    },
    data() {
        return {
            isFocused: false,
            isLoading: false,
            isLoadingMoreSongs: false,
            searchQuery: "",
            searchResults: {},
            searchHandler: undefined,
        }
    },
    computed: {
        focusClass() {
            return this.isFocused ? "mt-2" : "unfocused" ;
        },
        bottomClass() {
            return this.isFocused ? "bottom" : "";
        }
    },
    methods: {
        blurSearchInput() {
          this.isFocused = this.searchResults.tracks || this.searchResults.albums
        },
        getSearchHandler() {
          return this.searchHandler
              ? this.searchHandler 
              : searchSpotify(this.$route.params, SEARCH_LIMIT);
        },
        async search() {
            this.isLoading = true;
            
            this.searchResults = await this.getSearchHandler().searchSpotify(this.searchQuery);

            this.isLoading = false;
        },
        async loadMoreSongs(numberOfSongLoads) {
            this.isLoadingMoreSongs = true;
            
            const sh = this.getSearchHandler();
            const additionalResults = await sh.searchSpotify(this.searchQuery, SEARCH_LIMIT * numberOfSongLoads, "track");
            this.searchResults.tracks = sh.appendMoreTracks(JSON.parse(JSON.stringify(this.searchResults.tracks)), additionalResults);

            this.isLoadingMoreSongs = false;
        }
    }
}
</script>

<style scoped>
    .container.unfocused {
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .bottom {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
    }

    .bottom .spotify-logo {
        width: 7%;
        min-width: 140px;
    }

    .inner-addon { 
        position: relative; 
    }

    .inner-addon .bi {
        position: absolute;
        padding: 25px;
        pointer-events: none;
    }

    .right-addon .bi { 
        right: 0px;
        color: var(--bs-body-bg);
        font-size: 1.8em;
    }

    .right-addon input { padding-right: 30px; }

    .spotify-logo {
        min-width: 140px;
        width: 10%;
        padding: 20px;
    }
</style>