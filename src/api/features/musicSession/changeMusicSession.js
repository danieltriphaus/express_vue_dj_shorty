const { datastoreHandler } = require("../../datastore/datastoreHandler");
const { ChangeReadOnlyError } = require("../../errors/ChangeReadOnlyError");
const { MissingParamError } = require("../../errors/MissingParamError");

const changeMusicSession = async (spotifyUserId, musicSessionId, changeData) => {  
    const readOnlyFields = [
        "id", "refreshToken", "createdAt"
    ];
    
    return await ( async () => {
        if (hasDataToChange()) {
            throw new MissingParamError("No Data for Change")
        }
    
        if (hasChangesToReadOnlyFields()) {
            throw new ChangeReadOnlyError("Attempting to change read only field");
        }
    
        const dh = datastoreHandler();
        const musicSession = await dh.getMusicSession(spotifyUserId, musicSessionId);
    
        const changedMusicSession = Object.assign(musicSession, changeData);
        
        await dh.updateMusicSession(spotifyUserId, changedMusicSession)
    
        const { refreshToken, ...changedMusicSessionResult } = changedMusicSession
        return changedMusicSessionResult;
    })();

    function hasDataToChange() {
        return !changeData || !Object.keys(changeData).length;
    }

    function hasChangesToReadOnlyFields() {
        return Object.keys(changeData).find((changeDataKey) => {
            return readOnlyFields.includes(changeDataKey);
        });
    }
};

module.exports = { changeMusicSession };