export default {
    log: (...data) => {
        console.log(...data, Date.now());
    },
    warn: (...data) => {
        console.warn(...data, Date.now());
    },
    error: (...data) => {
        console.error(...data, Date.now());
    }
};