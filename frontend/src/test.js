var http = require('http');

http.createServer(function (req, res) {

  //console.log(req);
  var axios = require('axios');

  var config = {
    method: 'get',
    url: 'https://localhost:3000/json_placeholder/api/v1/124411075',
    headers: { 
      "Access-Control-Allow-Origin": "*",
      
    }
    
  };
  
  axios(config)
  .then(function (response) {
//console.log(response);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(response.data.pen);
    
  })
  
  
}).listen(8083);

