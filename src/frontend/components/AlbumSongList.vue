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
      v-show="!isLoading"
      class="result"
    >
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
    <div
      v-show="isLoading"
      class="result"
    >
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
        }
    },
    computed: {
        calculatedMaxHeight() {
            const maxHeight = 50 || 81 * 2
            return "max-height: " + maxHeight + "px";
        }
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