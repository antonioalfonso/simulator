"use strict";
exports.__esModule = true;
var path = require('path');
function getMimeType(filePath) {
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.svg': 'application/image/svg+xml'
    };
    var extname = path.extname(filePath);
    return mimeTypes[extname];
}
exports.getMimeType = getMimeType;
function map(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
exports.map = map;
