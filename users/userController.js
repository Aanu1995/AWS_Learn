import { success, failure } from "./libs/response-lib";
import userService from "./userService";

export async function getUserProfile (event, context) {
  try {
    // if userId does not exist
    if (!event.pathParameters || !event.pathParameters.userId) {
      return failure({ Error: "userId not specified" });
    }

    const userId = event.pathParameters.userId;
    const data = await userService.getUserProfile(userId);
    return success(data);

  } catch (error) {
    console.log("FUNC:createAccount failed with error: ", error);
    return failure(error);
  }
};

export async function editProfile (event, context) {
  try {
    // if userId does not exist
    if (!event.pathParameters || !event.pathParameters.userId) {
      return failure({ Error: "userId not specified" });
    }

    const userId = event.pathParameters.userId;
    const payload = JSON.parse(event.body);
    const data = await userService.editProfile(userId, payload);
    return success(data);

  } catch (error) {
    console.log("FUNC:createAccount failed with error: ", error);
    return failure(error);
  }
};

export async function getUsers (event, context) {
  try {
    const age = event.queryStringParameters.age;
    const location = event.queryStringParameters.location;

    if (age) {
      const data = await userService.getUsers(age);
      return success(data);
    } else if (location) {
       const data = await userService.getUsersByLocation(location);
      return success(data);
    }
    return success([]);
  } catch (error) {
    console.log("FUNC:createAccount failed with error: ", error);
    return failure(error);
  }
};

export async function createUserAccount(event, context) {
  try {
    const requestBody = JSON.parse(event.body);
    const data = await userService.createAccount(requestBody);
    return success(data);
  } catch (error) {
    console.log("FUNC:createAccount failed with error: ", error);
    return failure(error);
  }
}
