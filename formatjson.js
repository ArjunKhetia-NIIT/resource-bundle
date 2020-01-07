const formatjson = (object) => {
    for (let key in object) {
        if(key.includes('\r\n') || key.includes('\r') || key.includes('\n') || key.includes('\t')){
            let objectValue = object[key];
            delete object[key];
            key = key.replace('\r\n', '');
            key = key.replace('\r', '');
            key = key.replace('\n', '');
            key = key.replace('\t', '');
            object[key] = objectValue;
        }
        if (object.hasOwnProperty(key) && (typeof object[key] === "object")) {
            formatjson(object[key]);
        } else {
            if(object[key].includes('\r\n') || object[key].includes('\r') || object[key].includes('\n') || object[key].includes('\t')){
                object[key] = object[key].replace('\r\n', '');
                object[key] = object[key].replace('\r', '');
                object[key] = object[key].replace('\n', '');
                object[key] = object[key].replace('\t', '');
            }
        }
    }
    return object;
};

exports.formatjson = formatjson;