const express = require('express');
const multer = require('multer');
const ext = require('file-extension');
const vision  = require('node-cloud-vision-api');
const bodyParser = require('body-parser');

vision.init({auth: 'AIzaSyCol7ihf26zCvyHTB0RGSveKbixIm4RSFo'});

const storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, './uploads');
	},
	filename: function(req, file, cb){
		cb(null, Date.now()+'.'+ext(file.originalname));
	}
});
const upload = multer({storage: storage}).single('picture');
const app = express();

app.use(express.static('assets'));
app.use(express.static('views'));
app.use(express.static('src'));
app.use(express.static('uploads'));
app.use(bodyParser.json({limit: "100mb", type:'application/json'}));
app.use(bodyParser.urlencoded({limit: "100mb", extended: true, parameterLimit:50000}));

app.get('/', (req, res)=>{
	res.sendfile('index.html');
});


app.post('/api/pictures', function(req, res){
	upload(req,res,function(err){
		console.log(req.file.filename);
		if(err){
			return res.send(500, "Error uploading file");
		}
		var response = {
			status: 200,
			fileName: req.file.filename
		}
		res.send(response);
	});
});

app.post('/api/textRecognize', function(req, res){
	console.log("req------->",req.body);
	const requ = new vision.Request({
	  image: new vision.Image('./uploads/'+req.body.image),
	  features: [
	    new vision.Feature('LOGO_DETECTION', 4),
	    new vision.Feature('TEXT_DETECTION', 10),
	  ]
	});

	vision.annotate(requ).then((response) => {
	  	res.send(response.responses);
	  	console.log(JSON.stringify(response.responses))
	}, (e) => {
		res.send(e);
	  	console.log('Error: ', e)
	})
});


app.listen(process.env.PORT || 5000, (err)=>{
	if(err) return console.log("Hubo un error"), process.exit(1);
	console.log("FamiliaIA escuchando en el puerto 3000");
});