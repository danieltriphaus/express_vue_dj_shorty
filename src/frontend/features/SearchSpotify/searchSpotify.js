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
        appendMoreSingleTypeResults(originalResults, additionalResults) {
            if (additionalResults.tracks && additionalResults.albums) {
                throw new Error("Only Items of One Type can be appended")
            }

            const typeOfNewResults = getTypeFromResults(additionalResults);
            const appendedItems = originalResults.items.concat(additionalResults[typeOfNewResults].items);

            return {
                ...originalResults,
                items: appendedItems,
                total: appendedItems.length,
            };
        },
    }

    function getTypeFromResults(results) {
        return results.tracks ? "tracks" : "albums";
    }
};



export { searchSpotify };