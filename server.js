// Express sample aritmetic application.
var	url 	= require("url"),
	restify = require("restify"),
	operacionsAritmetiques = require("./operacionsAritmetiques");

var ipaddr  = process.env.OPENSHIFT_INTERNAL_IP || "127.0.0.1",
	port    = process.env.OPENSHIFT_INTERNAL_PORT || "8080";

var app = restify.createServer(),
	handle = {};

handle["sumar"] = operacionsAritmetiques.sumar;
handle["restar"] = operacionsAritmetiques.restar;
handle["multiplicar"] = operacionsAritmetiques.multiplicar;
handle["dividir"] = operacionsAritmetiques.dividir;
handle["expensive"] = operacionsAritmetiques.arrel;


app.use(restify.bodyParser());

app.post("/:operation", function(request, response, next){
	var op = handle[request.params.operation];

	if(typeof op === 'function'){
		op(	request.params.op1, 
			request.params.op2, 
			function(error, resultat){
	    			if(error){
	    				response.json(error.errorCode, { error: error.errorDescription });
	    			}else {
	    				response.json(200, {resultat: resultat});
	    			}
    		});
	}else{
		response.json(404, {error:'404 Not Found'});
	}
});

app.get("/:operation", function (request, response, next){
	var op = handle[request.params.operation];
	
	if(typeof op === 'function'){
		op( parseInt(request.params.op1),
			parseInt(request.params.op2),
			function(error, resultat){
				if(error){
					response.json(error.errorCode, { error: error.errorDescription });
				}else {
					response.json(200, {resultat: resultat});
				}
		});
	}else {
		response.json(404, {error:'404 Not Found'});
	}
});

/*app.all("/*", function (request, response){
	response.json(404, {error:'404 Not Found'});
});*/

app.listen(port,ipaddr);
console.log("Server has started at: "+ipaddr+":"+port);

