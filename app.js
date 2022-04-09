// import mailchimp from "@mailchimp/mailchimp_marketing";

const mailchimp = require("@mailchimp/mailchimp_marketing");

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { response } = require("express");
// const { path } = require("express/lib/application");


const mailchimpServer = "us14"; // put your server name here. e.g. us7
const mailchimpAPI = "2668effa13063a755041ac0ee81b3d61-us14"; // put your API key here
const mailchimpListID = "d804ae163c"; // put your list ID here
 
mailchimp.setConfig({
  apiKey: mailchimpAPI,
  server: mailchimpServer
});

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended:true
}));

app.listen(process.env.PORT || 3000, ()=> {
    console.log("Server running on 3000");
});

app.get("/", (req, res) =>{
    res.sendFile(__dirname + '/signup.html');
});

app.post("/", (req, res) => {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    console.log(firstName, lastName, email);

    var data = {
        members : [
            {
                email_address: email,
                status: "subscribed",
                merge_fields : {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    // const mailchimpListID = "d804ae163c";
    // const mailchimpServer = "us14"
    const url =
        "https://" +
            mailchimpServer +
         ".api.mailchimp.com/3.0/lists/" +
        mailchimpListID; 

  const options = {
    method: "POST",
    auth: "thebigshaikh:" + mailchimpAPI
  };    

    const request = https.request(url, options, (response) => {
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data", (data)=>{
            console.log(JSON.parse(data));
        })
    });
    request.write(jsonData);
    request.end();

});


app.post("/failure", (req, res) => {
    res.redirect("/");
})


// 2668effa13063a755041ac0ee81b3d61-us14
// d804ae163c

