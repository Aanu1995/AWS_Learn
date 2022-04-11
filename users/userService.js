import DynamoDB from "./libs/dynamodb-lib";
import * as uuid from "uuid";
import mathUtil from "./libs/mathUtil";


export default {
    createAccount: (payload) => {
        return new Promise(async (resolve, reject) => {
            try {
                let data = {
                    id: uuid.v4(),
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    email: payload.email,
                    location: payload.location,
                    phoneNumber: payload.phoneNumber,
                    age: payload.age,
                };

                const params = {
                    TableName: process.env.userTable,
                    Item: data,
                };
                await DynamoDB.create(params);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    },

    editProfile: (userId, payload) => {
        return new Promise(async (resolve, reject) => {
            try {
                const editableAttirbutes = {
                    firstName: { Action: 'PUT', Value: payload.firstName},
                    lastName: { Action: 'PUT', Value: payload.lastName},
                    location: { Action: 'PUT', Value: payload.location},
                    phoneNumber: { Action: 'PUT', Value: payload.phoneNumber },
                    age: { Action: 'PUT', Value: payload.age},
                };
                const params = {
                    TableName: process.env.userTable,
                    Key: { id: userId },
                    AttributeUpdates: mathUtil.skipNullAttributes(editableAttirbutes),
                    ReturnValues: "ALL_NEW"
                };

                let updatedInfo = await DynamoDB.update(params);
                resolve(updatedInfo.Attributes);
            } catch (error) {
                reject(error);
            }
        });
    },

    getUserProfile: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const params = {
                TableName: process.env.userTable,
                Key: {id: userId}
            };

                let data = await DynamoDB.get(params);
                resolve(data.Item || {});
            } catch (error) {
                reject(error);
            }
        });
    },

    getUsers: (age) => {
        return new Promise(async (resolve, reject) => {
            try {
                const params = {
                TableName: process.env.userTable,
               // ProjectionExpression: "#age",
                FilterExpression: "#age >= :g",
                ExpressionAttributeNames: {
                    "#age": "age",
                },
                ExpressionAttributeValues: {
                    ":g": parseInt(age),
                 }
            };

                let data = await DynamoDB.scan(params);
                resolve(data.Items || []);
            } catch (error) {
                reject(error);
            }
        });
    },

    getUsersByLocation: (location) => {
        return new Promise(async (resolve, reject) => {
            try {
                const params = {
                    TableName: process.env.userTable,
                    IndexName: 'locationIndex',
                    KeyConditionExpression: '#loc = :loc',
                    ExpressionAttributeNames: {
                    "#loc": "location",
                    },
                    ExpressionAttributeValues: {
                        ':loc': location,
                     },
                };

                let data = await DynamoDB.query(params);
                resolve(data.Items || []);
            } catch (error) {
                reject(error);
            }
        });
    }
};