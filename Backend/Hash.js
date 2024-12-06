const bcrypt = require("bcrypt");

const hashedPassword =
  "$2b$10$EIXGJ0B7sYk/fJrOVvXT/.p1U3kZl8phmj6T5VexxsVpGhlG5wJ62"; // Example hashed password
const enteredPassword = "superAdmin"; // The password the user entered

bcrypt.compare(enteredPassword, hashedPassword, (err, result) => {
  if (err) {
    console.error("Error comparing password:", err);
  } else if (result) {
    console.log("Password is correct!");
  } else {
    console.log("Incorrect password.");
  }
});
