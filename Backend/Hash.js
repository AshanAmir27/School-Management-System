const bcrypt = require('bcrypt');
const saltRounds = 10;  // You can adjust this to make the hashing slower or faster

const password = 'password123';  // The password you want to hash

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log('Hashed Password:', hash);
  }
});
