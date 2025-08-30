require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreateUser = require('./util/findOrCreateUser');
const ensureAuth = require("./middleware");

const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error",()=>{
    console.log("error in session store:",err);
});

const corsOptions = {
  origin: "https://goal-tracker-app-frontend.onrender.com", // exact frontend domain
  credentials: true
};
app.use(cors(corsOptions));

app.use(session({
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true on Render
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));



app.use(cors(corsOption));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Database SetUp
const dbURL = process.env.ATLASDB_URL;
main().then(() => {
  console.log("Successfully Connected1");
})
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(dbURL);
}


//setup passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateUser(profile);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));

passport.serializeUser((user, done) => {
  done(null, user.id); // store MongoDB _id in session
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// 🔐 Login route
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 🔄 Callback route
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`); // or wherever you want
  }
);

// 🚪 Logout route
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect(process.env.FRONTEND_URL); // redirect to homepage after logout
  });
});

// 🚪 Login route
app.get('/login', (req, res) => {
  req.logout(() => {
    res.redirect(`${process.env.FRONTEND_URL}/singUpLogin`); // redirect to homepage after logout
  });
});

//Check Login
app.get("/check-login", (req, res) => {
  if (req.isAuthenticated()) {
    res.send({ loggedIn: true, user: req.user });
  } else {
    res.send({ loggedIn: false });
  }
});








const goal = require("./routes/goals");
app.use("/goals", goal);

const task = require("./routes/tasks");
app.use("/tasks", task);

const dash = require("./routes/dash");
app.use("/dash", dash);






app.listen(8080, () => {
  console.log("server started on port 8080");
})