const sendResponse = require("../utils/sendResponse");
const { USER_POOL, USER_POOL_CLIENT } = require("../const/paths");
const { cognito } = require("../const/providers");

module.exports.handler = async (event) => {
    try {
        const { email, password } = JSON.parse(event.body);

       const response = await cognito
    .adminInitiateAuth({
        AuthFlow: "ADMIN_NO_SRP_AUTH",
        UserPoolId: USER_POOL,
        ClientId: USER_POOL_CLIENT, // Add this line
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
        },
    })
    .promise();

        const data = await cognito
            .getUser({
                AccessToken: response.AuthenticationResult.AccessToken,
            })
            .promise();

        const formattedAttributes = data.UserAttributes.reduce((acc, { Name, Value }) => {
            return { ...acc, [Name]: Value };
        }, {});

        return sendResponse(200, {
            ...formattedAttributes,
            ...response.AuthenticationResult,
            statusCode: 200,
        });
    } catch (error) {
        console.error(error);
        return sendResponse(400, error);
    }
};