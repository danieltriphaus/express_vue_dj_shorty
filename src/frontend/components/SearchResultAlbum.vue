<template>
  <div class="album-result">
    <div class="result">
      <div class="search-result">
        <div class="result-image">
          <img :src="album.images[2].url">
        </div>
        <div class="meta-data">
          <h6>{{ album.name }}</h6>
          {{ artists }}
        </div>
        <div class="add-button">
          <i 
            class="bi"
            :class="albumButtonIcon"
            @click="openAlbum"
          />
        </div>
      </div>
    </div>
    <transition
      name="open"
      mode="out-in"
    >
      <component
        :is="albumDrawer"
        :opened="opened"
        :is-loading="isLoading"
        :album-tracks="albumTracks"
      />
    </transition>
  </div>
</template>

<script>
import AlbumSongList from './AlbumSongList.vue';
import axios from "axios";

export default {
  components: { AlbumSongList },
    props: {
        album: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            opened: false,
            isLoading: false,
            albumTracks: [],
        }
    },
    computed: {
        artists() {
          return this.album.artists.map((element) => element.name).join(', ');
        },
        albumButtonIcon() {
          return this.opened ? "bi-chevron-down" : "bi-chevron-left"
        },
        drawerOpenedClass() {
          return this.opened ? "height: 200px" : "";
        },
        albumDrawer() {
          return this.opened ? "album-song-list" : "";
        }
    },
    methods: {
        async openAlbum() {
          this.opened = !this.opened;
          this.isLoading = true;

          const response = await axios.get(
            "/api/user/" + this.$route.params.userId 
            + "/music_session/" + this.$route.params.musicSessionId 
            + "/guest/album/" + this.album.id + "/track");

          this.albumTracks = response.data.items;

          this.isLoading = false;
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

.open-enter-active, .open-leave-active {
  transition: max-height 0.7s ease;
}

.open-enter, .open-leave-to {
  max-height: 0 !important;
}
</style>