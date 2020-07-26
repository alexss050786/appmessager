function response(data, detail = null) {
    const response = {
        data,
        detail
    }

    return response;
}

module.exports = response;