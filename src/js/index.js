function callAPI(){
	fetch('/api/textRecognize')
		.then(res=>res.json())
		.then(text=>console.log(text))
		.catch(err=>console.log(err));
}

$(document).ready(function(){
	$( "#tabs" ).tabs();
});