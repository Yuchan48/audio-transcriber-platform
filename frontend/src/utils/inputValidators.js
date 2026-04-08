export function validateEmail(email) {
  if (email.length < 3) {
    return "Email must be at least 3 characters long.";
  }
  if (email.length > 50) {
    return "Email must be no more than 50 characters long.";
  }
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return "Invalid email format.";
  }
  return null; // No errors
}

export function validatePassword(password) {
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (password.length > 100) {
    return "Password must be no more than 100 characters long.";
  }
  return null; // No errors
}
