const User = require('../models/user');

async function findOrCreateUser(profile) {
  const googleId = profile.id;
  const email = profile.emails?.[0]?.value;
  const name = profile.displayName;

  let user = await User.findOne({ googleId });

  if (!user) {
    user = await User.create({ googleId, email, name });
  }

  return user;
}

module.exports = findOrCreateUser;