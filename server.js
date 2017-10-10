var express = require("express");
var ejd = require("ejs");
var bodyParser = require("body-parser");
var path = require("path");
var session = require("express-session");
var mongoose = require("mongoose");
var app = express();


app.use(session({ secret: 'codingdojorocks' }));
app.use(bodyParser.urlencoded({ extended: true }));
//static content
app.use(express.static(path.join(__dirname, "./static")));
//setup views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/quoting_dojo');
//////////////////////////////////////////////////////////

var UserQuotesSchema = new mongoose.Schema({
	name: {type:String, required: true, minlength: 5},
	quote: { type: String, required: false},
	date: {type:Date, default: Date.now}
}, {timestamps: true});
var userquotes = mongoose.model('UserQuotes', UserQuotesSchema);

///////////////////////////////////////////////////////////
app.get('/', function (req, res) {
	res.render("index");
})

app.post('/', function (req, res) {
	var name = req.body.name;
	var quote = req.body.quote;
	var uquotes = new userquotes({name: name, quote: quote});
	var data = {}
	uquotes.save(function (err){
		if (err){
			data = {
				name: name,
				quote: quote,
				error: uquotes.errors
			}
			res.render("index", data);
		}else{
			res.redirect("/quotes");
		}
	})
})

app.get('/quotes', function (req, res) {
	userquotes.find({}, function(err, content){
		res.render("quotes", {pagecontent: content});
	});
})

app.listen(8000, function () {
	console.log("listening on port 8000");
});