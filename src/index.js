"use strict";

var getter = function getter(obj, paths, defaultValue, filter, callback, debuggerMode) {
    // Prüfe auf undefinierte Variablen
    if (!obj || !paths) {
        return defaultValue;
    }

    // Regex um zu überprüfen ob der Pfad eine Indexangabe ist
    var arrayPattern = new RegExp("[\\d]");

    var errorMessages = [];

    for (var i = 0; i < paths.length; i++) {
        var path = paths[i];
        var attributes = path.split(".");

        // Zeigt auf das aktuelle Objekt am aktuellen Pfad
        var actualObject = obj;

        var foundPath = false;

        for (var j = 0; j < attributes.length; j++) {
            var attribute = attributes[j];
            // Prüfe ob aktuelles Objekt ein Array ist
            if(Array.isArray(actualObject)){
                if(arrayPattern.test(attribute)){
                    // Extrahiere index aus pfad
                    var index = attribute.substring(1, attribute.length - 1);
                    if(actualObject.length > index){
                        actualObject = actualObject[index];
                        if(j == attributes.length - 1){
                            foundPath = true;
                        }
                    }
                    else{
                        errorMessages.push("The index " + index + " does not exist");
                        actualObject = defaultValue;
                        break;
                    }
                }
                else{
                    errorMessages.push("The attribute " + attribute + " is not a valid array pattern");
                    actualObject = defaultValue;
                    break;
                }
            }
            else{
                if (actualObject.hasOwnProperty(attribute)) {
                    actualObject = actualObject[attribute];
                    if (j == attributes.length - 1) {
                        foundPath = true;
                    }
                } else {
                    errorMessages.push("The attribute " + attribute + " does not exist");
                    actualObject = defaultValue;
                    break;
                }
            }
        }
        if (foundPath) {
            break;
        }
    }

    if (filter) {
        actualObject = filter.call(this, actualObject);
    }

    if(callback){
        callback(actualObject);
    }

    if(debuggerMode && errorMessages.length > 0){
        return errorMessages;
    }

    return actualObject;
};

var getterWithCallback = function getterWithCallback(obj, paths, defaultValue, callback) {
    getter(obj, paths, defaultValue, null, callback)
};

var getterWithCallbackDebug = function getterWithCallbackDebug(obj, paths, defaultValue, callback){
    getter(obj, paths, defaultValue, null, callback, true);
}

var getterDebug = function getterDebug(obj, paths, defaultValue, filter, callback){
    return getter(obj, paths, defaultValue, filter, callback, true);
}

var item = {
    a: {
        b: {
            c: {
                e: 5
            }
        }
    }
};

var array = [1,2,3,4,5,6,7,8,9,10,11,12,13]

console.log(
    getterDebug(array, ["[12]", "[18]"], 3, item => item + 5, null)
);
