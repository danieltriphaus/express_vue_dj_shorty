const {
  musicSessionResultFormatter
} = require("./musicSessionResultFormatter");

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

      return musicSessionResultFormatter(
        result
      ).formatGetMusicSessionByUserResult();
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
    }
  };
};

module.exports = { musicSessionDatastoreHandler };
