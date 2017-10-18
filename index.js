// ++++++++++ IMPORTS +++++++++++
var express = require("express");
var exphbs = require("express-handlebars");
var firebase = require("firebase");
var bodyParser = require('body-parser')

var PORT = 8080;

// ++++++++++ MIDDLEWARE +++++++++++

// EXPRESS
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

// HANDLEBARS
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// load the assets
// loading the command scripts
app.use('/assets', express.static(__dirname + '/assets'));

// FIREBASE
// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var config = {
  apiKey: "AIzaSyCYEieU0JuFCa7p3hu3TSa6lhd56OdRs3Q",
  authDomain: "bkitano-ymc-app.firebaseapp.com",
  databaseURL: "https://bkitano-ymc-app.firebaseio.com/"
//   storageBucket: "<BUCKET>.appspot.com"
};
firebase.initializeApp(config);
var database = firebase.database();

// body-parser
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


// ++++++++++ ROUTES +++++++++++
app.get('/', function(req, res) {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        // User is signed in.
            res.render('test', {name:user.email});
        } else {
            res.render('test');
        }
    });
});

app.get('/login', function(req, res) {
    res.render('login');
})

app.post('/loginUser', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    console.log(email);
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
    });
    res.redirect('/');
})

app.post('/registerUser', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.  
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);    
    });
    
    res.redirect('/');
})

// ++++++++++ SOCKETS ++++++++++
io.on('connection', function(socket) {
    console.log('client connected');
    
    socket.on('disconnect', function(data) {
        console.log("disconnected");
    });
    
    
    
})


// ++++++++++ FOOTERS +++++++++++
app.listen(process.env.port || PORT, function() {
    console.log("listening on 8080");
});