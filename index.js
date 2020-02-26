var _ = require('lodash');
var json = require('./formatjson');
var phrase = require('./phrase');
var fs = require('fs');
var async = require('async');
const distFolder = 'sunbirdresourcebundle';
var authToken, project, locale, fileformat;
const args = process.argv.slice(2);
const projectURL = 'https://api.phrase.com/v2/projects';
const encoding = 'UTF-8'; 
// Valid options are "UTF-8", "UTF-16" and "ISO-8859-1"

fs.mkdir(distFolder, { recursive: true }, (err) => {
    if (err) throw err;
});

_.forEach(args, function (arg) {
    if (arg.includes('-authToken')) {
        authToken = arg.slice(11);
    }
    if (arg.includes('-project')) {
        project = arg.slice(9);
    }
    if (arg.includes('-locale')) {
        locale = arg.slice(8).split(",");
    }
    if (arg.includes('-fileformat')) {
        fileformat = arg.slice(12);
    }
});

if (authToken && project && locale && fileformat) {
    phrase.getProjects(authToken, projectURL)
        .then((data) => {
            const projects = JSON.parse(data);
            _.forEach(projects, function(Project) {
                if (Project['name'] === project ) {
                    const projectId = Project['id'];
                    phrase.getLocales(authToken, projectURL, projectId)
                        .then((data) => {
                            const locales = JSON.parse(data);
                            if (locales && (locales.length > 0)) {
                                _.forEach(locales, function(element) {
                                    if (locale.indexOf(element['code']) !== -1) {
                                        const localeId = element['id'];
                                        phrase.downloadFile(authToken, projectURL, projectId, localeId, fileformat, encoding)
                                            .then(async (data) => {
                                                if (fileformat === 'nested_json' || fileformat === 'json' || fileformat === 'react_simple_json'
                                                || fileformat === 'react_nested_json' || fileformat === 'simple_json' || fileformat === 'go_i18n'
                                                || fileformat === 'angular_translate' || fileformat === 'i18next') {
                                                    const object = JSON.parse(data);
                                                    await json.formatjson(object);
                                                    fs.writeFile(distFolder + '/' + element['code']+'.json', JSON.stringify(object), encoding, () => {
                                                        console.log(element['code']+'.json File Generated');
                                                    });
                                                } else {
                                                    fs.writeFile(distFolder + '/' + element['code']+'.'+fileformat, data, encoding, () => {
                                                        console.log(element['code']+'.'+fileformat+' File Generated');
                                                    });
                                                }
                                            })
                                            .catch((err) => {
                                                console.log('Error ', err);
                                            });
                                    }
                                });
                            } else {
                                console.log('Locales Not Found');
                            }
                        })
                        .catch((err) => {
                            console.log('Error ', err);
                        });
                }
            });
        })
        .catch((err) => {
            console.log('Error ', err);
        });
} else {
    console.log('Some Parameters Missing');
}