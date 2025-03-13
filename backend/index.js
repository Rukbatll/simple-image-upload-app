const express = require('express');
const app = express();
const port = 5000;

app.use(express.json());
app.use(express.static('uploads'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});