'use strict';

/**
 * JSON object used to store data.
 */
const model = {}

/**
 * Auth token required in order to login and use the API.
 * It's stored as a cookie and is a json object that contains
 * {username, time, hash}.
 * Can be requested/renewed from the server with the following api calls
 *  /login
 *  /signin
 *  /check-token
 */
model.token = null;