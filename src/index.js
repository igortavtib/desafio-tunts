const credentials = require('./auth/credentials.json');
const auth = require('./auth/auth');
const gradesServices = require('./gradesServices');

/**
 * Authroize the request besides Google auth and call
 * the updateGrades functions as a callback.
 */
auth.authorize(credentials, gradesServices.updateGrades);
