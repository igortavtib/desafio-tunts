const credentials = require('./auth/credentials.json');
const auth = require('./auth/auth');
const gradesServices = require('./gradesServices');

/**
 * Authroize the request through Google auth and call
 * the updateGrades functions as a callback.
 */
auth.authorize(credentials, gradesServices.updateGrades);
