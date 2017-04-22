const path = require('path'); // import path for resolve function

// export our loan card function for use in route
exports.loancards = function(req, res){
  // console.log(req.query);

  // setup sendFile options
  const options = {
    root: path.resolve('dist'),
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  // js build index page
  const fileName = 'index.html';
  
  // return the html file
  res.sendFile(fileName, options);
  
};