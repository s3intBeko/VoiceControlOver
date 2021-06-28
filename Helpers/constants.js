(function (ResponseCodes){
    ResponseCodes["Continue"] = 100
    ResponseCodes["OK"] = 200
    ResponseCodes["Created"] = 201
    ResponseCodes["Accepted"] = 202
    ResponseCodes["NoContent"] = 204
    ResponseCodes["NotModified"] = 304
    ResponseCodes["BadRequest"] = 400
    ResponseCodes["Unauthorized"] = 401
    ResponseCodes["Forbidden"] = 403
    ResponseCodes["NotFound"] = 404
    ResponseCodes["NotAcceptable"] = 406
    ResponseCodes["RequestTimeout"] = 408
    ResponseCodes["InternalServerError"] = 500
    ResponseCodes["ServiceUnavailable"] = 503

})(ResponseCodes = exports.ResponseCodes || (exports.ResponseCodes = {}));

(function (ConvertMS) {
    ConvertMS["ONEWEEKMS"] = 604800000
    ConvertMS["ONEDAYMS"] = 86400000
    ConvertMS["ONEHOUR"] = 3600000
})(ConvertMS = exports.ConvertMS || (exports.ConvertMS = {}));