/**
 * https://www.loggly.com/blog/node-js-error-handling/
 */
const CUSTOM_STATUS_CODE = 466

module.exports.STATUS_CODE = CUSTOM_STATUS_CODE
module.exports.Error = function generique(message) {
    this.name = 'error'
    this.message = message || 'An error occurred'
    this.statusCode = CUSTOM_STATUS_CODE
    this.errorCode = CUSTOM_STATUS_CODE

    return this
}
