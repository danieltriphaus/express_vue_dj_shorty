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
          <i class="bi bi-chevron-left" />
        </div>
      </div>
    </div>
    <div class="result">
      <div class="search-result">
        <div class="meta-data-small">
          <h6>Song Name 001</h6>
          Künstler
        </div>
        <div class="add-button">
          <i class="bi bi-plus-circle" />
        </div>
      </div>
    </div>
    <div class="result">
      <div class="search-result">
        <div class="meta-data-small">
          <h6>Song Name 002</h6>
          Künstler
        </div>
        <div class="add-button">
          <i class="bi bi-plus-circle" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        album: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    computed: {
      artists() {
        return this.album.artists.map((element) => element.name).join(', ');
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
</style>