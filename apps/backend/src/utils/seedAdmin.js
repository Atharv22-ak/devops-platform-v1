const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * Creates the first admin account when the users collection is empty, so a
 * fresh install can always be logged into. Later restarts do nothing.
 * Credentials come from ADMIN_EMAIL / ADMIN_PASSWORD (see values.yaml).
 */
module.exports = async function seedAdmin() {
  try {
    if ((await User.estimatedDocumentCount()) > 0) return;

    const email = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
    const password = process.env.ADMIN_PASSWORD || 'Admin@123';

    await User.create({
      name: 'Admin',
      email,
      password: await bcrypt.hash(password, 10),
      role: 'admin',
    });
    console.log(`Seeded first admin user: ${email}`);
  } catch (err) {
    // E11000 = another replica seeded at the same moment, which is fine
    if (err.code !== 11000) console.error('Admin seed failed:', err.message);
  }
};
