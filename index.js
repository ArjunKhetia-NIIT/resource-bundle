var _ = require('lodash');
var json = require('./formatjson');
var phrase = require('./phrase');
var fs = require('fs');
var async = require('async');
var flatten = require('flat');
var unflatten = require('flat').unflatten;
var authToken, project, locale, fileformat;
const args = process.argv.slice(2);
const projectURL = 'https://api.phrase.com/v2/projects';
const encoding = 'UTF-8';
// Valid options are "UTF-8", "UTF-16" and "ISO-8859-1"
var distFolder = 'sunbirdresourcebundle';
var files = [];
var merge = false;

makeDistFolder = (distFolderName) => {
    fs.mkdir(distFolderName, { recursive: true }, (err) => {
        if (err) throw err;
    });
}

if (_.findIndex(args, function(arg) { return arg.includes('-distFolder') }) !== -1) {
    const value = args[_.findIndex(args, function(arg) { return arg.includes('-distFolder') })];
    distFolder = value.slice(12);
    makeDistFolder(distFolder);
} else {
    makeDistFolder(distFolder);
}

_.forEach(args, function (arg) {
    if (arg.includes('-authToken')) {
        authToken = arg.slice(11);
    }
    if (arg.includes('-project')) {
        project = arg.slice(9).split(",");
    }
    if (arg.includes('-locale')) {
        locale = arg.slice(8).split(",");
    }
    if (arg.includes('-fileformat')) {
        fileformat = arg.slice(12);
    }
    if (arg.includes('-merge')) {
        merge = arg.slice(7);
    }
});

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

const run = async () => {
    if (authToken) {
        if (project) {
            if (locale) {
                if (fileformat) {
                    await phrase.getProjects(authToken, projectURL)
                        .then(async (data) => {
                            const projects = await JSON.parse(data);
                            await asyncForEach(projects, async (Project) => {
                                await asyncForEach(project, async (prj) => {
                                    if (Project['name'] === prj) {
                                        const projectId = await Project['id'];
                                        await phrase.getLocales(authToken, projectURL, projectId)
                                            .then(async (data) => {
                                                const locales = await JSON.parse(data);
                                                if (locales && (locales.length > 0)) {
                                                    await asyncForEach(locales, async (element) => {
                                                        if (locale.indexOf(element['code']) !== -1) {
                                                            const localeId = await element['id'];
                                                            await phrase.downloadFile(authToken, projectURL, projectId, localeId, fileformat, encoding)
                                                                .then(async (data) => {
                                                                    if (fileformat === 'nested_json' || fileformat === 'json' || fileformat === 'react_simple_json'
                                                                        || fileformat === 'react_nested_json' || fileformat === 'simple_json' || fileformat === 'go_i18n'
                                                                        || fileformat === 'angular_translate' || fileformat === 'i18next') {
                                                                        const object = await JSON.parse(data);
                                                                        await json.formatjson(object);
                                                                        await fs.writeFile(distFolder + '/' + prj + ' - ' + element['code'] + '.json', JSON.stringify(object), encoding, () => {
                                                                            files.push(prj + ' - ' + element['code'] + '.json');
                                                                            if (merge === false) {
                                                                                console.log(prj + ' - ' + element['code'] + '.json File Generated');
                                                                            }
                                                                        });
                                                                    } else {
                                                                        await fs.writeFile(distFolder + '/' + prj + ' - ' + element['code'] + '.' + fileformat, data, encoding, () => {
                                                                            console.log(prj + ' - ' + element['code'] + '.' + fileformat + ' File Generated');
                                                                        });
                                                                    }
                                                                })
                                                                .catch((err) => {
                                                                    console.log('Error ', err);
                                                                });
                                                        }
                                                    })
                                                } else {
                                                    console.log('Locales Not Found');
                                                }
                                            })
                                            .catch((err) => {
                                                console.log('Error ', err);
                                            });
                                    }
                                })
                            })
                        })
                        .catch((err) => {
                            console.log('Error ', err);
                        });
                    if ((fileformat === 'nested_json' || fileformat === 'json' || fileformat === 'react_simple_json'
                        || fileformat === 'react_nested_json' || fileformat === 'simple_json' || fileformat === 'go_i18n'
                        || fileformat === 'angular_translate' || fileformat === 'i18next') && (merge === 'true')) {
                        setTimeout(async () => {
                            await asyncForEach(locale, async (Locale) => {
                                let result = [];
                                let jsonresult = {};
                                for (let index = 0; index < files.length; index++) {
                                    if (files[index].includes(Locale)) {
                                        const json = await JSON.parse(fs.readFileSync(distFolder + '/' + files[index], 'utf8'));
                                        const flatjson = await flatten(json);
                                        result.push(flatjson);
                                        fs.unlinkSync(distFolder + '/' + files[index]);
                                    }
                                    if (index === files.length - 1) {
                                        await asyncForEach(result, async (res) => {
                                            await Object.assign(jsonresult, res);
                                            const unfjson = await unflatten(jsonresult);
                                            await fs.writeFile(distFolder + '/' + Locale.substring(0, 2) + '.json', JSON.stringify(unfjson), encoding, () => {
                                                console.log(Locale.substring(0, 2) + '.json File Generated');
                                            });
                                        })
                                    }
                                }
                            })
                        }, 2000);
                    }
                } else {
                    console.log('FileFormat is Missing');
                }
            } else {
                console.log('Locale is Missing');
            }
        } else {
            console.log('Project is Missing');
        }
    } else {
        console.log('AuthToken is Missing');
    }
}
run();