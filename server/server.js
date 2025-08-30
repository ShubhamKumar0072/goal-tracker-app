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


const corsOption = {
  origin: ["http://localhost:5173"],
  credentials: true
}
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

//setup session
app.use(session({
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  },
}));

//setup passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:8080/auth/google/callback'
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
    res.redirect('http://localhost:5173/dashboard'); // or wherever you want
  }
);

// 🚪 Logout route
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:5173'); // redirect to homepage after logout
  });
});

// 🚪 Login route
app.get('/login', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:5173/singUpLogin'); // redirect to homepage after logout
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