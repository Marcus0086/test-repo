module.exports = {
    log: (...data) => {
        console.log(JSON.stringify(...data), Date.now());
    },
    warn: (...data) => {
        console.warn(JSON.stringify(...data), Date.now());
    },
    error: (...data) => {
        console.error(JSON.stringify(...data), Date.now());
    }
};
