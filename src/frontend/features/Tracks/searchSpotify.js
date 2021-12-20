import axios from "axios";

const searchSpotify = (routeParams, limit) => {

    return {
        async searchSpotify(query, offset, type) {
            const response = await axios.get(
                "/api/user/" + routeParams.userId 
                + "/music_session/" + routeParams.musicSessionId + "/guest/search", 
                {
                    params: { 
                        q: query,
                        limit,
                        offset,
                        type
                    }
                }
            );

            return response.data;
        },
        appendMoreTracks(originalResults, additionalResults) {
            const appendedItems = originalResults.items.concat(additionalResults.tracks.items);

            return {
                ...originalResults,
                items: appendedItems,
                total: appendedItems.length,
            };
        },
    }
};



export { searchSpotify };