const express = require('express'); // import express
const app = express(); // initialize express instance
const path = require('path'); // import path for resolve function
const querystring = require('querystring'); // import querystring utils

// get our loan card route
const loanCards = require('./server/routes/loan-cards');

// redirect root route to /loancards with query params intact if present
app.get('/', (req, res) => {
  // get query params as string
  const qString = querystring.stringify(req.query);
  // rebuild to pass along in redirect
  const queries = (qString.length) ? '?' + qString : '';
  // execute redirect
  res.redirect('/loancards' + queries);
});

// setup our /loancards route
app.get('/loancards', loanCards.loancards);

// Serve static assets from js app + styles
app.use(express.static(path.resolve(__dirname, 'dist')));

// setup port
app.listen(3000, function () {
  console.log('Port 3000 activated with Loan Cards');
})
