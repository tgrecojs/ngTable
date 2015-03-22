
var express = require('express');
var http = require('http');
var path = require('path');
var aws = require('aws-sdk');

/*
 * Set-up the Express app.
 */
var app = express();
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY || "AKIAJGC74GI3A44JUZJA";
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY || "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"; 
var S3_BUCKET = process.env.S3_BUCKET || "tg-me";
/*
 * Load the S3 information from the environment variables.
 */

/*
 * Respond to GET requests to /account.
 * Upon request, render the 'account.html' web page in views/ directory.
 */
app.get('/account', function(req, res){
    res.render('account.html');
});

/*
 * Respond to GET requests to /sign_s3.
 * Upon request, return JSON containing the temporarily-signed S3 request and the
 * anticipated URL of the image.
 */
app.get('/sign_s3', function(req, res){
    aws.config.update({accessKeyId: AWS_ACCESS_KEY , secretAccessKey: AWS_SECRET_KEY });
    var s3 = new aws.S3(); 
    var s3_params = { 
        Bucket: S3_BUCKET, 
        Key: req.query.s3_object_name, 
        Expires: 60, 
        ContentType: req.query.s3_object_type, 
        ACL: 'public-read'
    }; 
    s3.getSignedUrl('putObject', s3_params, function(err, data){ 
        if(err){ 
            console.log(err); 
        }
        else{ 
            var return_data = {
                signed_request: data,
                url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+req.query.s3_object_name 
            };
            res.write(JSON.stringify(return_data));
            res.end();
        } 
    });
});

/*
 * Respond to POST requests to /submit_form.
 * This function needs to be completed to handle the information in 
 * a way that suits your application.
 */
app.post('/submit_form', function(req, res){
    username = req.body.username;
    full_name = req.body.full_name;
    avatar_url = req.body.avatar_url;
    update_account(username, full_name, avatar_url);

    if(err){
        console.log(err);
    } // TODO: create this function
    // TODO: Return something useful or redirect
});

/*
 * Start the server to handle incoming requests.
 */
app.listen(app.get('port'));