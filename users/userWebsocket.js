import { success, failure } from "./libs/response-lib";
import DynamoDB from "./libs/dynamodb-lib";
import WebSocket from "./libs/websocket";

export async function userWebsocket(event, context) {
    const { routeKey } = event.requestContext;
    try {
        switch (routeKey) {
            case `$connect`:
                return success(await connect(event, context));
            case `$disconnect`:
                return success(await disconnect(event, context));
            case `message`:
                return success(await message(event, context));
            case `$default`:
                return success(defaultHandler());
            default:
                return success(defaultHandler());
        }
    } catch (error) {
        return failure(error);
    }
}

export async function userTestWebsocket(event, context) {
    const { routeKey } = event.requestContext;
    try {
        switch (routeKey) {
            case `$connect`:
                return success(await connect(event, context));
            case `$disconnect`:
                return success(await disconnect(event, context));
            case `message`:
                return success(await message(event, context));
            case `$default`:
                return success(defaultHandler());
            default:
                return success(defaultHandler());
        }
    } catch (error) {
        return failure(error);
    }
}

function connect(event, context) {
    return new Promise(async (resolve, reject) => {
        try {
            const { connectionId, domainName, stage } = event.requestContext;
            const data = {
                id: connectionId,
                date: Date.now(),
                domainName,
                stage,
                messages: [],
            };
            const params = {
                TableName: process.env.connectTable,
                Item: data,
            };

            await DynamoDB.create(params);
            console.log('event', event);
            return resolve({ message: "connected" });
        } catch (error) {
            return reject(error);
        }
    });
}

function disconnect(event, context) {
    return new Promise(async (resolve, reject) => {
        try {
            const connectionId = event.requestContext.connectionId;
            const params = {
                TableName: process.env.connectTable,
                Key: {id: connectionId}
            };

            await DynamoDB.delete(params);
            console.log('event', event);
            return resolve({ message: "disconnected" });
        } catch (error) {
             return reject(error);
        }
    });
 }

function message(event, context) {
    return new Promise(async (resolve, reject) => {

        try {
            const { connectionId, domainName, stage } = event.requestContext;
            const body = JSON.parse(event.body);

            const getParams = {
                TableName: process.env.connectTable,
                Key: {id: connectionId}
            };

            const record = await DynamoDB.get(getParams);
            const item = record.Item;
            const messages = item.messages;

            messages.push(body.message);

            const params = {
                TableName: process.env.connectTable,
                Item: {
                    ...item,
                    messages
                },
            };

            await DynamoDB.create(params);
            await WebSocket.send(domainName, stage, connectionId, messages);
            return resolve({ message: "Got a message" });
        } catch (error) {
            return reject(error);
        }
    });
}

function defaultHandler() {
  return {message: "default connection"};
}