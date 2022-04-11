import AWS from "./aws_sdk";

export default {
    send: (domainName, stage, connectionId, body) => {
        const ws = create(domainName, stage);

        const params = {
            Data: Buffer.from(JSON.stringify(body)),
            ConnectionId: connectionId,
        };

        return ws.postToConnection(params).promise();
    }
};


function create (domainName, stage) {
    const endpoint = `${domainName}/${stage}`;
    return new AWS.ApiGatewayManagementApi({
        apiVersion: '2022-03-06',
        endpoint,
    });
}