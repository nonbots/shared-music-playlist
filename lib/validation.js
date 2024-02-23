function isAnyEmpty (body) {
    let inputVals = Object.values(body);
    return inputVals.some( (val) => val.length === 0);
}
module.exports = {isAnyEmpty};
