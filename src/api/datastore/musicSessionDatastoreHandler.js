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
    }
  };
};

module.exports = { musicSessionDatastoreHandler };
