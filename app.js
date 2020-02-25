const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

//bodyParser middleware
app.use(bodyParser.urlencoded({extended: true}));
// Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Signup Route
app.post('/signup', (req, res) => {
    const { firstName, lastName, email } = req.body;

    // validation
    if(!firstName || !lastName || !email) {
      res.redirect('/fail.html');
      return;
    }

     //Construct req data
     const data = {
       members: [
        {
          email_address: email,
          status: 'subscribed',
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName
          }
        }
       ]
     };
// change the data to string
     const postData = JSON.stringify(data);

    const options = {
      url: 'https://us3.api.mailchimp.com/3.0/lists/94436f2e87',
      method: 'POST',
      headers: {
        Authorization: 'auth 7f1adc31723c23bc238ab68bf3cd02b7-us3'
      },
      body: postData
    };

    request(options, (err, response, body) => {
     if(err) {
         res.redirect('/fail.html');
     } else {
       if(response.statuscode === 200) {
         res.redirect('/success.html');
       } else {
         res.redirect('/success.html');
       }
     }
   });

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server stared on ${PORT}`));
