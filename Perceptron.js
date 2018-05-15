/*************************************************************
	Perceptron JS Implementation
		by Nicholas Jarzembowski 2015
**************************************************************/


var V = [1, 1, 1]; // weights vector
var misclassified_points = []; // array of misclassified datapoints (support vectors)
var dps = []; // datapoints array
var iterations = 0; // iterations counter
var dataPointIndex = 0; // datapoints array index
var class_ = -1; // datapoint class
var colour = "red"; // datapoint colour

// get canvas context
var canvas = document.getElementById("plot");
canvas.width = canvas.height = 400;
var context = canvas.getContext("2d");


/***************************
	Event Handling
***************************/

window.onload = function() {
	init();
}

function init() {
	drawGrid();
	document.getElementById("switch-class").style.background = colour;
}

document.getElementById("iterate").addEventListener('mousedown',function() {
	learn();
	render();
});

document.getElementById("switch-class").addEventListener('mousedown',function() {
	switchClass(); 
});

document.getElementById("iterate-multi").addEventListener('mousedown',function() {
	iterate(1000);
	render();
});

canvas.addEventListener('mousemove', function(e) {
	render();
	drawCircle(getCoords(e));
}, false);

canvas.addEventListener('mouseout', function() {
	render();
}, false);

canvas.addEventListener('mousedown', function(e) {
	var c = getCoords(e); // get mouse coords
	dps.push({x: c.x / canvas.width, y: c.y /canvas.height, c: class_}); // add datapoint json object
	drawCircle((getCoords(e))); // draw circle for datapoint
}, false);

window.addEventListener('keypress', function(e) {
	console.log(e.keyCode);
	if (e.keyCode == 97) {
		iterate(1); // 97 == 'a'
	}
	if (e.keyCode == 115) switchClass(); // 115 = 's'
	if (e.keyCode == 100) {
		iterate(1000); // 100 == 'd'
	}
	if (e.keyCode == 122) {
		printDPS();
	}
	render();
}, false);

/***
	Draw on canvas
***/
function render() {
	clearScreen();
	drawGrid();
	drawConverged();
	drawIterCount();
	drawDataPoints();
	drawCurrentPoint();
	drawLine();
	// drawMisclassifiedPoints();
}

function drawCurrentPoint() {
	// highlight current dp
	if (dps.length == 0) return;
	var dp = dps[dataPointIndex % dps.length];
	context.beginPath();
	context.arc(dp.x * canvas.width,dp.y * canvas.height,10,0,2*Math.PI);
	context.strokeStyle = "blue";
	context.lineWidth = 3;
	context.stroke();
}

/***
	Perceptron learning implementation
***/
function learn() {

		iterations++;

		var dp = dps[dataPointIndex++ % dps.length]; // get next datapoint
		var dot = (V[2] * 1 + V[0] * dp.x * 400 + V[1] * dp.y * 400); // calculate dot product of weights and dp
		var sign = dot?dot<0?-1:1:0; // get the sign of the dot product

		if (sign != dp.c) { // dp is misclassified
			// update weight vector according to update rule w := W + c * dp
			V[0] = V[0] + dp.c * dp.x;
			V[1] = V[1] + dp.c * dp.y;
			V[2] = V[2] + dp.c * 1;
			// misclassified_points.push({x: dp.x * 400, y: dp.y * 400});
		}
}

function isConverged() {
	for (i = 0; i < dps.length; i++) {
		var dp = dps[i]; // get next datapoint
		var dot = (V[2] * 1 + V[0] * dp.x * 400 + V[1] * dp.y * 400); 
		var sign = dot?dot<0?-1:1:0; // get the sign of the dot product
		if (sign != dp.c) return false;
	}
	return (dps.length == 0 ? false : true);
}


/***************************
	Render methods
***************************/


function drawConverged() {
	context.fillStyle= "black";
	context.fillText("converged?: ",canvas.width - 80,canvas.height - 15); // x axis
	var converged = isConverged();
	context.fillStyle= "red";
	if (converged) context.fillStyle= "green";
	context.fillText(converged,canvas.width - 23,canvas.height - 15); // x axis
}

function drawIterCount() {
	context.fillStyle= "black";
	context.fillText("iterations: " + iterations,canvas.width - 80,canvas.height - 5); // x axis
}

function drawGrid() {
	context.beginPath();
	context.fillStyle = "black";
	context.strokeStyle = 'grey';

	context.fillText(0,1,10); // x axis

	for (i = 0; i < 4; i++) {
		if (i==0) continue;

		context.lineWidth = 1;

		context.fillText(i/4,i*(canvas.width/4) - 10, 10); // x axis
		context.moveTo(i*(canvas.width/4),10);
		context.lineTo(i*(canvas.width/4), canvas.height);

		context.fillText(i/4,0, i*(canvas.height/4)); // y axis
		context.moveTo(0, i*(canvas.height/4));
		context.lineTo(canvas.width, i*(canvas.height/4));

	}

	context.stroke();
}

function drawMisclassifiedPoints() {
	for (i = 0; i < misclassified_points.length; i++) {
		drawSquare(misclassified_points[i]);
	}
	misclassified_points = [];
}


function drawLine() {
	context.strokeStyle = 'black';
	context.beginPath();
	context.moveTo(1, (-V[2]-(V[0]*1))/(V[1]) );
	context.lineTo(400, (-V[2]-(V[0]*400))/(V[1]) );
	context.stroke();
}

function drawDataPoints() {
	for (i = 0; i < dps.length; i++) {
		context.beginPath();
		context.arc(dps[i].x * canvas.width,dps[i].y * canvas.height,10,0,2*Math.PI);

		var col = dps[i].c == 1 ? "green" : "red";

		context.fillStyle = col;
		context.fill();
		context.fillStyle = "black";
		context.stroke();
	}
}

function clearScreen() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSquare(data) {
	context.fillStyle = "green";
	context.rect(data.x - 5,data.y - 5,10,10);
	context.stroke();
}

function drawCircle(cart) {
	context.beginPath();
	context.arc(cart.x,cart.y,10,0,2*Math.PI);
	context.fillStyle = colour;
	context.fill();
}


/***************************
	Helper functions
***************************/


function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function switchClass() {
	colour = colour == "red" ? "green" : "red";
	class_ = class_ == 1 ? -1 : 1;
	document.getElementById("switch-class").style.background = colour;
}

function iterate(count) {
	if (isConverged()) return;
	for(i = 0; i < count; i++) {
		learn();
	}
}

function getCoords(e) {
	var box = canvas.getBoundingClientRect();
	return {
		x: (e.clientX - box.left),
		y: (e.clientY - box.top)
	}
}

function printDPS() {
	var str = "";
	for (i = 0; i < dps.length; i++) {
		str += dps[i].x + " " + dps[i].y + " " +  dps[i].c + "X";
	}
	console.log(str);
}

function loadDataset(dataset) {
	reset();
	dataset = dataset.split('X');
	for (i = 0; i < dataset.length; i++) {
		var vals = dataset[i].split(' ');
		if (vals[2] == undefined) continue;
		dps.push({x: vals[0], y: vals[1], c: vals[2]}); // add datapoint json object
	}
	console.log(dps);
	render();
}

function reset() {
	V = [1,1,1];
	dps = [];
	iterations = 0;
	dataPointIndex = 0
}
