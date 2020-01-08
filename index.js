var _ = require('lodash');
var json = require('./formatjson');
var phrase = require('./phrase');
var fs = require('fs');
var async = require('async');

var authToken, project, locale, fileformat;
const args = process.argv.slice(2);
const projectURL = 'https://api.phrase.com/v2/projects';
const encoding = 'UTF-8'; 
// Valid options are "UTF-8", "UTF-16" and "ISO-8859-1"

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
                                            if (fileformat === 'nested_json' || fileformat === 'json') {
                                                const object = JSON.parse(data);
                                                await json.formatjson(object);
                                                fs.writeFile(element['code']+'.json', JSON.stringify(object), encoding, () => {
                                                    console.log(element['code']+'.json File Generated');
                                                });
                                            } else {
                                                fs.writeFile(element['code']+'.'+fileformat, data, encoding, () => {
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