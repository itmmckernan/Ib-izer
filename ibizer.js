var keyString = atob("P2tleT03ZmY2M2QzNi0yY2RiLTRmN2UtOGJlZS03MmUwNDU4OTQxMmY=");
//steal this key. I dare you. See how much i care
var baseUrl = "https://www.dictionaryapi.com/api/v3/references/thesaurus/json/";
var top100 = ["the","be","to","of","and","a","in","that","have","I","it","for","not","on","with","he","as","you","do","at","this","but","his","by","from","they","we","say","her","she","or","an","will","my","one","all","would","there","their","what","so","up","out","if","about","who","get","which","go","me","when","make","can","like","time","no","just","him","know","take","people","into","year","your","good","some","could","them","see","other","than","then","now","look","only","come","its","over","think","also","back","after","use","two","how","our","work","first","well","way","even","new","want","because","any","these","give","day","most","us", "is"];

var stateStrings = ["Processed", "Processing", "Waiting for typing to finish"];
var improvementString = "\"Improved\" the text by "

var stateText = document.getElementById('stateText');
var slider = document.getElementById('percentageWords');
var numberSlider = document.getElementById('loopTimes');

var textInput = document.getElementById('textinput');
var textOutput = document.getElementById('textoutput');
var improvementOutput = document.getElementById('improvement');

textInput.addEventListener("keydown", function(){stateText.innerText = stateStrings[2]});
slider.addEventListener("change", function(){ makeString(); document.getElementById('slider').innerHTML = slider.value+'%';});
function debounce(callback, wait) {
  let timeout;
  return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(function () {   stateText.innerText = stateStrings[2];
callback.apply(this, args); }, wait);
  };
}

window.addEventListener('keyup', debounce( () => {
	makeString()
}, 2000));

async function makeString(){
    stateText.innerText = stateStrings[1];
	var split = textInput.value.split(' ');
	for(var i = 0; i < numberSlider.value; i++){
		split = await betterString(split);
	}
	let outputString = split;
	textOutput.value = outputString;
	stateText.innerText = stateStrings[0];
	improvementOutput.innerText = improvementString + Math.round((( outputString.length - textInput.value.length) / textInput.value.length)*100)/100+"%";

}

async function betterString(split){
	var promiseList = [];
	var outputString = "";
	for(var i = 0; i < split.length; i++){
		promiseList[i] = stringParse(split[i]); 
	}
	await Promise.all(promiseList).then((values) => {
		outputString = "";
		for(var i = 0; i < values.length; i++){
			outputString += values[i]+" ";
		}
		});
	return outputString;
}
async function stringParse(string){
	if(typeof string != "string")
		return string;
	if(slider.value < Math.random()*100)
		return string;
	if(top100.includes(string.toLowerCase()))
		return string;
	if(string == "")
		return string;
	
	if(string.match("^.*[^a-zA-Z ].*$"))
		return string;
	return  fetch(baseUrl+string.toLowerCase()+keyString)
	.then(function (response) {
		return response.json();
	})
	.then(function (myJson) {
		var synsArray = myJson[0].meta.syns[0];
		synsArray.sort((a, b) => b.length - a.length);
		return synsArray[0];
	})
	.catch(function (error) {
		return string;
	    })
}
