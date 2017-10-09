const express = require('express');
const multer = require('multer');
const ext = require('file-extension');
const vision  = require('node-cloud-vision-api');

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

app.get('/', (req, res)=>{
	res.sendfile('index.html');
});


app.post('/api/pictures', function(req, res){
	upload(req,res,function(err){
		if(err){
			return res.send(500, "Error uploading file");
		}
		var response = {
			
		}
		res.send('File uploaded')
	});
});

app.get('/api/textRecognize', function(req, res){
	const requ = new vision.Request({
	  image: new vision.Image('./assets/familia3.jpg'),
	  features: [
	    new vision.Feature('LOGO_DETECTION', 4)
	  ]
	})
	 
	// send single request
	vision.annotate(requ).then((res) => {
	  // handling response
	  console.log(JSON.stringify(res.responses))
	}, (e) => {
	  console.log('Error: ', e)
	})
});


app.listen(3000, (err)=>{
	if(err) return console.log("Hubo un error"), process.exit(1);
	console.log("FamiliaIA escuchando en el puerto 3000");
});