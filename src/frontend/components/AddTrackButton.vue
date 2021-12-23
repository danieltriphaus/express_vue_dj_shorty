<template>
  <div
    class="add-button" 
    @click="addTrack"
  >
    <i
      v-if="wasSuccessful"
      class="bi bi-check-lg"
    />
    <spinner :is-loading="isLoading" />
    <i
      v-if="!isLoading && !wasSuccessful"
      class="bi bi-plus-circle" 
    />
  </div>
</template>

<script>
import { AddTrackDelayError } from '../errors/AddTrackDelayError';
import { addTrack } from "../features/Tracks/addTrack";
import Spinner from './Spinner.vue';

export default {
  components: { Spinner },
    props: {
        spotifyTrackUri: {
            type: String,
            default() {
                return "";
            }
        }
    },
    data() {
        return {
            isLoading: false,
            wasSuccessful: false,
        };
    },
    methods: {
        async addTrack() {
            this.isLoading = true;

            try {
                this.wasSuccessful = await addTrack(this.$route.params, this.spotifyTrackUri);

                this.$toasted.show("Song zur Playlist hinzugefügt", {
                    position: "top-center",
                    duration: 3000,
                    type: "success"
                });

                this.$emit("track-added");
            } catch(error) {
                if (error instanceof AddTrackDelayError) {
                    this.wasSuccessful = false;
                    this.$toasted.show("Wartezeit noch nicht abgelaufen", {
                      position: "top-center",
                      duration: 3000,
                      type: "error"
                    });
                } else {
                  throw error
                }
            }
            
            this.isLoading = false;
        }
    }
}
</script>

<style scoped>
.add-button {
  display: table-cell;
  font-size: 2.5rem;
  text-align: right;
  vertical-align: middle;
}

.add-button:hover {
    cursor: pointer;
}

.add-button .spinner {
  font-size: 1rem;
}
</style>