const { musicSessionResultFormatter } = require("./musicSessionResultFormatter");

const musicSessionDatastoreHandler = (datastore) => {
  return {
    dataProvider: datastore,

    async getMusicSessions(spotifyUserId) {
      const ancestorKey = datastore.key(["user", spotifyUserId]);

      const query = datastore
        .createQuery("music_session")
        .select(["createdAt", "spotifyPlaylistId", "status", "waitTime"])
        .hasAncestor(ancestorKey);
      
      const [result] = await this.dataProvider.runQuery(query);

      changeQueryResultDateToMilliSecs(result, "createdAt");

      return musicSessionResultFormatter(result).getUniversalEntityArray();
    },

    async createNewMusicSession(params) {
      const musicSessionKey = datastore.key([
        "user",
        params.spotifyUserId,
        "music_session",
        params.id
      ]);
  
      const musicSession = {
        waitTime: params.waitTime,
        spotifyPlaylistId: params.spotifyPlaylistId,
        createdAt: new Date(),
        refreshToken: params.spotifyRefreshToken,
        status: "active"
      };
  
      await this.dataProvider.insert({
        key: musicSessionKey,
        data: musicSession
      });
      
      return musicSession;
    },

    async getMusicSession(spotifyUserId, musicSessionId) {
      const musicSessionKey = datastore.key(["user", spotifyUserId, "music_session", musicSessionId]);
      const [musicSession] = await this.dataProvider.get(musicSessionKey);
      return musicSessionResultFormatter(musicSession).getUniversalEntity();
    },

    async updateMusicSession(spotifyUserId, newMusicSession) {
      const musicSessionKey = datastore.key(["user", spotifyUserId, "music_session", newMusicSession.id]);
      const { id, ...newMusicSessionData } = newMusicSession;
      newMusicSessionData.createdAt = new Date(newMusicSession.createdAt * 1000);
      
      await this.dataProvider.update({
        key: musicSessionKey,
        data: newMusicSessionData
      })
    }
  };

  function changeQueryResultDateToMilliSecs(result, dateName) {
    result.forEach((entity) => {
      entity[dateName] = entity[dateName] / 1000;
    })
  }
};

module.exports = { musicSessionDatastoreHandler };
