const express = require('express');
const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Set the view engine (if you're using HTML only, this is not needed)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.listen(port, () => {
  console.log(`UDAY Cloud running at http://localhost:${port}`);
});
