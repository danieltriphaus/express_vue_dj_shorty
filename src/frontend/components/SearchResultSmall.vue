<template>
  <div class="search-result">
    <div class="meta-data-small">
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