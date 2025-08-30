function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  return next();
  // res.status(401).json({ redirect: "/singUpLogin" });
}

module.exports = ensureAuth;

// Usage
// app.get('/dashboard', ensureAuth, (req, res) => {
//   res.send(`Welcome, ${req.user.name}`);
// });
