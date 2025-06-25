const express = require('express');
const router = express.Router();

// Dummy login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const name = 'Pengguna';
  console.log(email, password)
  if (email === 'admin@admin.com' && password === 'admin123') {
    return res.status(200).json({ token: 'dummy-token', alias: name});
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

module.exports = router;