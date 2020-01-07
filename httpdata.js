const getData = (authToken, url) => {
    return {
        method: 'GET',
        url: url,
        headers: { Authorization: authToken } 
    };
};

exports.getData = getData;
