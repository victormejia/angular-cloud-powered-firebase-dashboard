
var admin = require("firebase-admin");
var uid = process.argv[2];

var serviceAccount = require('./angular-firebase-grid-dash-firebase-adminsdk-tj8jv-82ac1dec4c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://angular-firebase-grid-dash.firebaseio.com"
});

admin.auth().setCustomUserClaims(uid, { admin: true})
  .then(() => {
    console.log('custom claims set for user', uid);
    process.exit();
  })
  .catch(error => {
    console.log('error', error);
    process.exit(1);
  });
