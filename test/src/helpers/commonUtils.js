
const commonUtils = {
    isAscending(cur, prev) {
        return String(cur) >= String(prev) || !(cur || prev);
    },
    isDescending(cur, prev) {
        return String(cur) <= String(prev) || !(cur || prev);
    }
}

export default commonUtils;
