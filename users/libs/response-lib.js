export function success(body){
    console.log("RESPONSE", buildResponse(200, body,"success"));
    return buildResponse(200, body, "success");
}

export function successPost(body){
    console.log("RESPONSE", buildResponse(201, body,"success"));
    return buildResponse(201, body, "success");
}

export function failure(body){
    console.log("RESPONSE", buildResponse(500, body, "failure"));
    return buildResponse(500, body, "failure");
}

function buildResponse(status, body, message) {
    var responseBody = {"data":body,"message":message,"status":status};
    return {
        statusCode: status,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify(responseBody),
    };
}