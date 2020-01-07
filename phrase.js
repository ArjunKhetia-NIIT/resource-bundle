var http = require('./httpdata');
var request = require('request-promise');

const getProjects = (authToken, projectURL) => {
    const projects = http.getData(authToken, projectURL);
    return request(projects);
};

const getLocales = (authToken, projectURL, projectId) => {
    const locales = http.getData(authToken, projectURL + '/' + projectId + '/locales');
    return request(locales);
};

const downloadFile = (authToken, projectURL, projectId, localeId, fileformat, encoding) => {
    const file = http.getData(authToken, projectURL + '/' + projectId + '/locales/' + localeId + '/download?file_format=' + fileformat + '&encoding=' + encoding);
    return request(file);
};

exports.getProjects = getProjects;
exports.getLocales = getLocales;
exports.downloadFile = downloadFile;