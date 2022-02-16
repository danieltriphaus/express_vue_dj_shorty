<template>
    <div
        class="container"
        :class="focusClass"
    >
        <div
            v-if="isMusicSessionActive"
            class="row"
        >
            <div class="col">
                <h4 v-show="!isFocused">
                    Füge Songs zur Playlist <br>
                    <span style="color: var(--bs-primary)">{{ musicSession.playlistName }}</span> hinzu
                </h4>
                <div class="d-flex align-items-center d-inline-block inner-addon right-addon">
                    <i
                        v-show="!isLoading"
                        class="bi bi-search"
                    />
                    <spinner :is-loading="isLoading" />
                    <input
                        id="searchTracks"
                        ref="searchTracks"
                        v-debounce:300ms.lock.fireonempty="search"
                        type="search"
                        class="form-control"
                        placeholder="Suche Songs auf Spotify"
                        :value="searchQuery"
                        @input="(e) => (searchQuery = e.target.value)"
                        @focus="isFocused = true"
                        @blur="blurSearchInput"
                    >
                </div>
            </div>
        </div>
        <div
            v-else
            class="row"
        >
            <div class="col">
                <h4>Music Session ist inaktiv oder existiert nicht</h4>
            </div>
        </div>
        <SearchResults
            v-show="isFocused"
            :search-results="searchResults"
            :is-loading-more-songs="isLoadingMoreSongs"
            :is-loading-more-albums="isLoadingMoreAlbums"
            @load-more-songs="loadMoreSongs"
            @load-more-albums="loadMoreAlbums"
            @touchend.native="triggerBlurOnSearch"
            @track-added="trackAdded"
        />
        <div
            v-if="isMusicSessionActive"
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
    import { searchSpotify } from "../features/SearchSpotify/searchSpotify";
    import axios from "axios";
    import Spinner from "../components/Spinner.vue";

    const SEARCH_LIMIT = 5;

    export default {
        directives: {
            debounce: getDirective(2, {
                listenTo: "input",
            }),
        },
        components: {
            SearchResults,
            Spinner,
        },
        data() {
            return {
                musicSession: undefined,
                isFocused: false,
                isLoading: false,
                isLoadingMoreSongs: false,
                isLoadingMoreAlbums: false,
                searchQuery: "",
                searchResults: {},
                searchHandler: undefined,
            };
        },
        computed: {
            focusClass() {
                return this.isFocused ? "mt-2" : "unfocused";
            },
            bottomClass() {
                return this.isFocused ? "bottom" : "";
            },
            doesMusicSessionExist() {
                return this.musicSession ? true : false;
            },
            isMusicSessionActive() {
                return this.doesMusicSessionExist && this.musicSession.status === "active";
            },
        },
        async created() {
            const response = await axios
                .get("/api/user/" + this.$route.params.userId + "/music_session/" + this.$route.params.musicSessionId)
                .catch((error) => {
                    if (error.response && error.response.status === 404) {
                        this.musicSession = undefined;
                    }
                });
            
            if (response) {
                this.musicSession = response.data ? response.data : {};
            }
        },
        methods: {
            blurSearchInput() {
                this.isFocused = this.searchResults.tracks || this.searchResults.albums;
            },
            triggerBlurOnSearch() {
                this.$refs.searchTracks.blur();
            },
            getSearchHandler() {
                return this.searchHandler ? this.searchHandler : searchSpotify(this.$route.params, SEARCH_LIMIT);
            },
            async search() {
                this.isLoading = true;

                this.searchResults = await this.getSearchHandler().searchSpotify(this.searchQuery);

                this.isLoading = false;
            },
            async loadMoreSongs(numberOfSongLoads) {
                this.isLoadingMoreSongs = true;

                const sh = this.getSearchHandler();
                const additionalResults = await sh.searchSpotify(
                    this.searchQuery,
                    SEARCH_LIMIT * numberOfSongLoads,
                    "track"
                );
                this.searchResults.tracks = sh.appendMoreSingleTypeResults(
                    JSON.parse(JSON.stringify(this.searchResults.tracks)),
                    additionalResults
                );

                this.isLoadingMoreSongs = false;
            },
            async loadMoreAlbums(numberOfAlbumLoads) {
                this.isLoadingMoreAlbums = true;

                const sh = this.getSearchHandler();
                const additionalResults = await sh.searchSpotify(
                    this.searchQuery,
                    SEARCH_LIMIT * numberOfAlbumLoads,
                    "album"
                );
                this.searchResults.albums = sh.appendMoreSingleTypeResults(
                    JSON.parse(JSON.stringify(this.searchResults.albums)),
                    additionalResults
                );

                this.isLoadingMoreAlbums = false;
            },
            trackAdded() {
                setTimeout(async () => {
                    this.searchQuery = "";
                    await this.search();
                    this.blurSearchInput();
                }, 700);
            },
        },
    };
</script>

<style scoped>
    .container.unfocused {
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin-bottom: -60px;
    }

    .bottom .spotify-logo {
        width: 7%;
        min-width: 140px;
    }

    .inner-addon {
        position: relative;
    }

    .inner-addon .bi,
    .inner-addon .spinner {
        position: absolute;
        padding: 25px;
        pointer-events: none;
    }

    .right-addon .bi,
    .inner-addon .spinner {
        right: 0px;
        color: var(--bs-body-bg);
        font-size: 1.8em;
    }

    .inner-addon .spinner {
        font-size: 1.4rem;
    }

    .right-addon input {
        padding-right: 30px;
    }

    .spotify-logo {
        min-width: 140px;
        width: 10%;
        padding: 20px;
    }
</style>
