<template>
  <div 
    class="drawer"
    :style="calculatedMaxHeight"
  > 
    <div 
      v-if="isLoading"
      class="col text-center"
    >
      <div
        class="spinner-border text-primary" 
        role="status" 
      />
    </div>
    <div 
      v-for="track in albumTracks"
      :key="track.id"
      ref="albumTrack"
      class="result"
    >
      <search-result-small
        :track="track"
        @track-added="$emit('track-added')"
      />
    </div>
  </div>
</template>

<script>
import SearchResultSmall from './SearchResultSmall.vue';
export default {
  components: { SearchResultSmall },
    props: {
        opened: {
            type: Boolean,
            default() {
                return false;
            }
        },
        isLoading: {
            type: Boolean,
            default() {
                return false;
            }
        },
        albumTracks: {
            type: Array,
            default() {
              return []
            }
        }
    },
    computed: {
        calculatedMaxHeight() {
            const maxHeight = this.isLoading ? 50 : this.albumTracks.length * 81 + 160;
            return "max-height: " + maxHeight + "px";
        },
    }
}
</script>

<style scoped>
.spinner-border {
    display: inline-block;
}

.result {
    border-bottom: 1px dotted rgb(131, 130, 130);
}

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

.drawer {
    overflow: hidden;
}
</style>