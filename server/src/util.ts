const path = require('path');

/**
 * This feature detects the file extension requested by the server and returns
 * the content-type
 *
 * @param  {string} filePath Where and what file to analyze
 * @return {string}          Content-type for handler webserver
 */
export function getMimeType(filePath: string): string {
  const mimeTypes = {
    '.html' : 'text/html',
    '.js'   : 'text/javascript',
    '.css'  : 'text/css',
    '.json' : 'application/json',
    '.svg'  : 'application/image/svg+xml'
  };

  let extname: string = path.extname(filePath);

  return mimeTypes[extname];
}

/**
 * This function mapping the value between two value
 * @param  {number} x       Value for mapping
 * @param  {number} in_min  Min value in input
 * @param  {number} in_max  Max value in input
 * @param  {number} out_min Min value in output
 * @param  {number} out_max Max value in output
 * @return {string}         Mapped Value
 */
export function map(x: number, in_min: number, in_max: number, out_min: number, out_max: number):  string {
  return ((x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min).toString();
}
