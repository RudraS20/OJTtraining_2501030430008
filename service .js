const express = require('express');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/register', (req, res) => {
    const { username, email } = req.body;
    console.log(`User: ${username}, Email: ${email}`);
    res.send(`<h2>Registration Successful for ${username}</h2>`);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));