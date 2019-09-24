// @ts-ignore
import smartcar = require("smartcar");

const smartcarAuthClient: smartcar.AuthClient = new smartcar.AuthClient({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
    scope: ['read_vehicle_info', 'read_vin', 'read_odometer'],
});

export { smartcarAuthClient };
