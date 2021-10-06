export default rebuildObject = (data, callback) => {
    data.map((value) => {
        if (typeof callback == "function")
            callback(arguments[1], value);
    })
}