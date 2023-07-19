const express = require('express');
const app = express();
const port = 8000;
const pdfGenerator = require('./pdfGenerator');
 
app.get('/pdf', (req, res) => {
  pdfGenerator.generatePDF((err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error generating PDF');
    } else {
      res.setHeader('Content-Type', 'application/pdf');
      res.send(data);
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


