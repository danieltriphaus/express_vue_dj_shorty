<template>
  <div class="list-group-item">
    <div class="col music-session">
      <div class="row">
        <div class="col">10.11.2021</div>
        <div class="col">
          <span class="session-status status-active" /> Aktiv
        </div>
        <div class="col">
          <a class="btn btn-outline-primary">Beitreten</a>
          <button type="button" class="btn btn-outline-danger">
            <i class="bi bi-trash" />
          </button>
        </div>
      </div>
      <div class="row music-session-link">
        <div class="col input-group">
          <input
            type="text"
            class="form-control"
            disabled
            value="https://djshorty.de/music_session/dwa8d8321jfds8f493128432ffjs8321jsa"
          />
          <span class="input-group-text"><i class="bi bi-share" /></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style scoped>
.music-session-link {
  margin-top: 0.5rem;
}

.session-status {
  height: 10px;
  width: 10px;
  background-color: rgb(46, 107, 37);
  border-radius: 50%;
  display: inline-block;
}

.status-active {
  background-color: rgb(46, 107, 37);
}

.status-inactive {
  background-color: rgb(104, 16, 16);
}
</style>