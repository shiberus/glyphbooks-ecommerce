const jwt = require("jsonwebtoken"),
  { User } = require("./db"),
  passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  BearerStrategy = require("passport-http-bearer").Strategy,
  GoogleStrategy = require("passport-google-oauth20").Strategy,
  FacebookStrategy = require("passport-facebook").Strategy;

const SECRET = process.env.AUTH_SECRET || "secret";

const { Op } = require("sequelize");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async (email, password, done) => {
      const user = await User.findOne({
        where: {
          email,
        },
      });
      if (!user)
        return done(null, false, {
          message: "Username or password is incorrect",
        });
      if (!user.compare(password))
        return done(null, false, {
          message: "Username or password is incorrect",
        });
      const { id, firstName, lastName, isAdmin } = user;
      return done(null, {
        id,
        firstName,
        lastName,
        isAdmin,
        email,
      });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: `${process.env.BACK}/auth/login/auth/google/callback`,
      session: false,
    },
    async (token, tokenSecret, profile, done) => {
      let user = await User.findOne({
        where: {
          [Op.or]: [
            { googleId: profile.id },
            { email: profile.emails[0].value },
          ],
        },
      });
      if (!user)
        user = await User.create({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          googleId: profile.id,
        });
      const { id, firstName, lastName, email, isAdmin } = user;
      return done(null, {
        id,
        firstName,
        lastName,
        email,
        isAdmin,
      });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: "2436859816610284",
      clientSecret: "3600fa155fe092a43d7151a4ac18d76f",
      callbackURL: "http://localhost:3001/auth/login/facebook/callback",
      profileFields: ["id", "emails", "displayName"],
      enableProof: true,
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      let user = await User.findOne(profile.id); //buscar user por id de facebook adentro de la base de datos
      if (!user)
        user = User.create(
          profile.first_name,
          profile.last_name,
          profile.email,
          null,
          "GUEST",
          null,
          profile.id,
          profile.picture
        );
      const { id, firstName, lastName, isAdmin } = user;
      return done(null, {
        id,
        firstName,
        lastName,
        email,
        isAdmin,
      });
    }
  )
);

passport.use(
  new BearerStrategy((token, done) => {
    jwt.verify(token, SECRET, function (err, user) {
      if (err) return done(err);
      return done(null, user ? user : false);
    });
  })
);

module.exports = passport;
