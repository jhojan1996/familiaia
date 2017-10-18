function callAPI(){
	fetch('/api/textRecognize')
		.then(res=>res.json())
		.then(text=>console.log(text))
		.catch(err=>console.log(err));
}

$(document).ready(function(){
	$( "#tabs" ).tabs();
});


var uNegocio =[
	{
		nombre: "Familia",
		un: "Family Care"
		//Categorias: ["Papel Higienico", "Servilletas", "Toallas de cocina", "Pañuelos faciales", "Cuidado del aire", "Pañitos humedos hogar", "Geles antibacteriales"]
	},
	{
		nombre: "Pequeñin",
		un: "Baby"
		//Categorias: ["Pañales para Bebe", "Pañitos Humedos para Bebe", "Cremas Protectoras", "Complementarios", "Shampoo"]
	},
	{
		nombre: "Nosotras",
		un: "FemCare"
		//Categorias: ["Toallas higienicas", "Protectores Diarios*", "Tampones", "Pañitos Humedos Intimos*", "Jabon Intimo*", "Jabon Corporal", "Mousse Cuidado V", "Pañitos Humedos Cuidado V"]
	},
	{
		nombre: "Lights by Tena",
		un: "Adult"
		//Categorias: ["Protectores Diarios*", "Pañitos Humedos Intimos*", "Jabon Intimo*"]
	},
	{
		nombre: "Tena",
		un: "Adult"
		//Categorias: ["Absorbentes (Pañales)", "Pañitos Humedos Adulto", "Complementarios Adulto (Cremas y Sabanilla)"]
	},
	{
		nombre: "Petys",
		un: "Negocios Emergentes"
		//Categorias: ["Pañitos Humedos Mascotas", "Liquidos Mascotas", "Complementarios Mascotas"]
	},
	{
		nombre: "Pommys",
		un: "Negocios Emergentes"
		//Categorias: ["Pañitos Humedos Faciales", "Rueditas Algodón Faciales", "Liquidos Faciales (Cremas Limpiadoras)"]
	}
]

function toggleButtons(){
	document.getElementById('fileName').classList.toggle('hide');
	document.getElementById('btnUpload').classList.toggle('hide');
	document.getElementById('btnCancel').classList.toggle('hide');
}

function cancel(){
	toggleButtons();
	document.getElementById('formUpload').reset();
}

function onsmt(){
	var data = new FormData(document.getElementById('formUpload'));
	fetch('/api/pictures',{method: "POST", body: data})
	.then(res=>res.json())
	.then(picture=>{
		let image = picture.fileName;
		document.getElementById('img').src = image;
		let data2 = new FormData();
		data2.append("image", image);
		return fetch('/api/textRecognize', {
						method: 'POST',
						headers: {
							'Accept': 'application/json, text/plain, */*',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							image: image
						})
					});
	})
	.then(res=>res.json())
	.then(response=>{
		createLogoTable(response);
		createTextTable(response);
		createPriceTable(response);
	})
	.catch(err=>console.log(err));
}

function createLogoTable(response){
	var table = `
	<table border='1'>
		<tr>
			<td><b>UEN</b></td>
			<td><b>Marca</b></td>
			<td><b>Categoria</b></td>
		</tr>
	`;
	let uen = "";
	if(typeof response[0].logoAnnotations === 'undefined'){
		table += `
		<tr>
			<td colspan='3' align='center'><i>No he podido identificar ninguna marca</i></td>
		</tr>
		`;
	}else{
		for (let i = 0; i < response[0].logoAnnotations.length; i++) {
			for (let j = 0; j < uNegocio.length; j++) {
				if(uNegocio[j].nombre == response[0].logoAnnotations[i].description){
					uen = uNegocio[j].un;
					break;
				}
			}
			if(uen === ""){
				uen = "Family care";
			}

			table += `
			<tr>
				<td align='center'>${uen}</td>
				<td align='center'>${response[0].logoAnnotations[i].description}</td>
				<td align='center'>¿?</td>
			</tr>
			`;
		}
	}
		
	table += "</table>";
	document.getElementById("logoTabla").innerHTML = table;
}

function createTextTable(response){
	var table = `
	<table>
		<tr>
			<td align='center'><b>Texto</b></td>
		</tr>
	`;
	if(typeof response[0].textAnnotations === 'undefined'){
		table += `
		<tr>
			<td colspan='2' align='center'><i>No he reconocido texto</i></td>
		</tr>
		`;
	}else{
		table += `
		<tr>
			<td>${response[0].textAnnotations[0].description}</td>
		</tr>
		`;
	}
		
	table += "</table>";
	document.getElementById("tabs-3").innerHTML = table;
}

function createPriceTable(response){
	var table = `
	<table>
		<tr>
			<td align='center'><b>Precios</b></td>
		</tr>
	`;
	if(typeof response[0].textAnnotations === 'undefined'){
		table += `
		<tr>
			<td colspan='2' align='center'><i>No he reconocido texto</i></td>
		</tr>
		`;
	}else{
		for (let i = 1; i < response[0].textAnnotations.length; i++) {
			table += response[0].textAnnotations[i].description.replace(/\$([\d,]+(?:\.\d+)?)/g,
			function (string, c1) {
			    return `
			    <tr>
					<td>${string}</td>
				</tr>
			    `;
			});
		}
		
	}
		
	table += "</table>";
	document.getElementById("tabs-4").innerHTML = table;
}