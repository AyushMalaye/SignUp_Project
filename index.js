const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const { hasSubscribers } = require("diagnostics_channel");
const { stringify } = require("querystring");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/signUp.html");
});

app.post("/", function (req, res) {
	let userName = req.body.Username;
	let email = req.body.email;
	let FirstName = req.body.Fname;
	let LastName = req.body.Lname;

	const audience_id = "bdb773d862";

	var data = {
		members: [
			{
				email_address: email,
				status: "subscribed",
				merge_fields: {
					FNAME: FirstName,
					LNAME: LastName,
				},
			},
		],
	};

	let jsonData = JSON.stringify(data);

	const url = "https://us17.api.mailchimp.com/3.0/lists/bdb773d862";
	const options = {
		method: "POST",
		auth: "Ayush:bdf079c9a71d3c0407953f54e564f3b5-us17",
	};

	const request = https.request(url, options, function (response) {
		response.on("data", function (data) {
			console.log(JSON.parse(data));
		});
	});

	if (request.statusCode === 200) {
		res.sendFile(__dirname + "/success.html");
	} else {
		res.sendFile(__dirname + "/fail.html");
	}

	request.write(jsonData);
	request.end();
});

app.post("/failure", function (req, res) {
	res.redirect("/");
});

// app.listen(3000, function () {
// 	console.log("Server 3000");
// });

app.listen(process.env.PORT || 3000, function () {
	console.log("Server 3000");
});

// Api Key = bdf079c9a71d3c0407953f54e564f3b5-us17
// audience id bdb773d862
