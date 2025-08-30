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
const findOrCreateUser = require("./util/findOrCreateUser");
const ensureAuth = require("./middleware");

// ---------- CORS CONFIG ----------
const corsOption = {
  origin: process.env.FRONTEND_URL, // your frontend URL (Render)
  credentials: true
};
app.use(cors(corsOption));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ---------- DATABASE SETUP ----------
const dbURL = process.env.ATLASDB_URL;
main()
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

async function main() {
  await mongoose.connect(dbURL);
}

// ---------- SESSION STORE ----------
const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.error("❌ Error in session store:", err);
});

// ---------- SESSION SETUP ----------
app.set("trust proxy", 1); // important for secure cookies on render

app.use(session({
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only set Secure in prod
    sameSite: "none" // needed for cross-origin cookies
  },
}));

// ---------- PASSPORT SETUP ----------
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateUser(profile);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id); // store MongoDB _id in session
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// ---------- ROUTES ----------

// 🔐 Login with Google
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 🔄 Google callback
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

// 🚪 Logout
app.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect(process.env.FRONTEND_URL);
  });
});

// 🚪 Login redirect (failure)
app.get('/login', (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/singUpLogin`);
});

// ✅ Check login
app.get("/check-login", (req, res) => {
  if (req.isAuthenticated()) {
    res.send({ loggedIn: true, user: req.user });
  } else {
    res.send({ loggedIn: false });
  }
});

// ---------- YOUR APP ROUTES ----------
const goal = require("./routes/goals");
app.use("/goals", goal);

const task = require("./routes/tasks");
app.use("/tasks", task);

const dash = require("./routes/dash");
app.use("/dash", dash);

// ---------- SERVER START ----------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
