const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const config = require('../config');
const UsersDBApi = require('../db/api/users');

const options = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secret_key
};

passport.use(new JWTstrategy(options, async (jwt_payload, done) => {
  try {
    const user = await UsersDBApi.findBy({ id: jwt_payload.id });
    console.log(`JWT Payload: ${JSON.stringify(jwt_payload)}`);
    if (user) {
      console.log(`${user.firstName}: Logging the First name of the user from the passport initialisation code to confirm that Passport is communicating successfully with UsersDBApi`);
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));

module.exports = passport;