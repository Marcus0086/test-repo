export default {
    /**
     *
     * @param {string} key Object identifier
     * @param {Object} state Object to save in local storage
     */
    setState: (key, state) => {
        try {
            const serialState = JSON.stringify(state);
            sessionStorage.setItem(key, serialState);
        } catch (error) {
            console.log(error);
        }
    },
    /**
     *
     * @param {string} key Object Identifer
     * @returns Object represents state
     */
    getState: (key) => {
        try {
            let localData = {};

            if (key) {
                const serialState = sessionStorage.getItem(key);

                localData = JSON.parse(serialState);
            }

            return localData;
        } catch (error) {
            console.log(error);
            return {};
        }
    },
    clear: () => {
        try {
            sessionStorage.clear();
        } catch (error) {
            console.log(error);
        }
    }
};