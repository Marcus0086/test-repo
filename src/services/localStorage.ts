export default {
    /**
     *
     * @param {string} key Object identifier
     * @param {Object} state Object to save in local storage
     */
    setState: (key, state) => {
        try {
            const serialState = JSON.stringify(state);
            localStorage.setItem(key, serialState);
        } catch (error) {
            // eslint-disable-next-line no-console
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
                const serialState = localStorage.getItem(key);

                localData = JSON.parse(serialState);
            }

            return localData;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
            return {};
        }
    },
    clear: () => {
        try {
            localStorage.clear();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
        }
    }
};