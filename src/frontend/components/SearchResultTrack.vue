<template>
  <div class="search-result">
    <div class="result-image">
      <img :src="track.album.images[2].url">
    </div>
    <div class="meta-data">
      <h6>{{ track.name }}</h6>
      {{ artists }}
    </div>
    <div class="add-button">
      <i class="bi bi-plus-circle" />
    </div>
  </div>
</template>

<script>
export default {
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

.add-button {
  display: table-cell;
  font-size: 2.5rem;
  text-align: right;
  vertical-align: middle;
}
</style>