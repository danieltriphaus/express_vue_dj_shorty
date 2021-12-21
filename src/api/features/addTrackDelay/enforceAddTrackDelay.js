const { datastoreHandler } = require("../../datastore/datastoreHandler");
const { AddTrackDelayError } = require("../../errors/AddTrackDelayError");

const enforceAddTrackDelay = (spotifyAccessToken, musicSessionId, waitTime) => {
    const dh = datastoreHandler();

    return {
        async checkGuestAccess() {
            const guestAccess = await dh.getGuestAccess(spotifyAccessToken);
            
            if (guestAccess && isAddTrackToEarly(guestAccess.trackLastAdded)) {   
                throw new AddTrackDelayError("Attempted to add track before waitTime elapsed");
            }
        },

        async updateTrackLastAdded() {
            await dh.upsertGuestAccess({
                musicSessionId,
                spotifyAccessToken,
                trackLastAdded: new Date()
            });
        }
    }

    function isAddTrackToEarly(trackLastAdded) {
        let nextAllowedAddDate = new Date(trackLastAdded.getTime());
        nextAllowedAddDate.setMinutes(nextAllowedAddDate.getMinutes() + parseInt(waitTime, 10));
            
        return (new Date() <= nextAllowedAddDate);
    }
};

module.exports = { enforceAddTrackDelay };