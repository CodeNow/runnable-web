//****Try your screenname****
var screenname = "getrunnable";


var request = require('request')//HTTP request client
  , express = require('express')//web dev framework
  , qs = require('qs')          //querystring parser
  , app = express()
  , output = "<body><h1>@" + screenname + "'s friends</h1>"
  , url = "http://api.twitter.com/1/friends/ids.json"
  ;

// send request to get list of friends
url += '?' + qs.stringify({screen_name:screenname});
request.get(url, function (err, res, usrs) {
  usrs = JSON.parse(usrs);
  // only iterate through at most 5 usrs
  var len = (usrs.ids.length>5) ? 5:usrs.ids.length; 

  // loop through usrs (the first 5 in the list)
  for(var i=0; i<len; i++) {
    // set the params to get user details
    
    var detailsURL = 'https://api.twitter.com/1/users/show.json?' 
          + qs.stringify({user_id: usrs.ids[i]});

    //send request to get details for each friend
    request.get(detailsURL, function (err, res, fr) {
      fr = JSON.parse(fr);
      //display friend's profile pic and screenname
      output += '<img src="' + fr.profile_image_url + '" title="@' + fr.screen_name + '" />';
    });
  }
  
});

// attach stylesheet to output
app.use(express.static(__dirname));
output = '<link rel="stylesheet" href="styles.css" />' + output + '</body>';

app.get('/', function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(output); //send output 
});

app.listen(process.env.OPENSHIFT_NODEJS_PORT, process.env.OPENSHIFT_NODEJS_IP);

console.log('http server started on port: '+ process.env.OPENSHIFT_NODEJS_PORT);
