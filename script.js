var header = [];
var rawData = [];
var timestamp = [];
var weight = [];
var height = [];
var bmi = [];
var fatRate = [];
var bodyWaterRate = [];
var boneMass = [];
var metabolism = [];
var muscleRate = [];
var visceralFat = [];
var impedance = [];
var ctx = document.getElementById('myChart').getContext('2d');

var data = {
	labels: [],
	datasets: [],
};

var myChart = new Chart(ctx, {
	type: 'line',
	data: data,
	options: {
		responsive: false,
		scales: {
			xAxes: [{
				type: 'time',
				time: {
					unit: 'day'
				},
				ticks: {
					beginAtZero: false
				},
				bounds: 'data',
				distribution: 'linear'
			}],
			yAxes: [{
				id: 'right',
				position: 'right',
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'bmi'
				},
				ticks: {
					beginAtZero: false,
				}
			}, {
				id: 'left',
				position: 'left',
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'weigth'
				},
				ticks: {
					beginAtZero: false
				}
			}
			]
		}
	}
});

function handleFiles(files) {
	if (window.FileReader) {
		printFileProperties(files[0]);
		getAsText(files[0]);
	} else {
		alert('FileReader no funciona en este navegador');
	}
}

function printFileProperties(file) {
	let output = [];
	output.push('<li><strong>', escape(file.name), '</strong> (', file.type || 'n/a', ') - ', file.size, ' bytes, last modified: ',
		file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a',
		'</li>');
	document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}

function getAsText(fileToRead) {
	var reader = new FileReader();
	reader.readAsText(fileToRead);
	reader.onload = loadHandler;
	reader.onerror = errorHandler;
}

function loadHandler(event) {
	var csv = event.target.result;
	processData(csv);
	addChart(weight, 1, 'right');
	addChart(muscleRate, 8, 'left');
}


function processData(csv) {
	var allTextLines = csv.split(/\r\n|\n/);

	header = allTextLines.shift().split(",");
	while (allTextLines.length > 0) {
		rawData.push(allTextLines.shift().split(","));
	}

	timestamp = extractValue2dArray(rawData, 0);

	for (let i = 0; i < timestamp.length; i++) {
		timestamp[i] = convertUnixTimestamp(timestamp[i]);
	}

	weight = extractValue2dArray(rawData, 1);
	height = extractValue2dArray(rawData, 2);
	bmi = extractValue2dArray(rawData, 3);
	fatRate = extractValue2dArray(rawData, 4);
	bodyWaterRate = extractValue2dArray(rawData, 5);
	boneMass = extractValue2dArray(rawData, 6);
	metabolism = extractValue2dArray(rawData, 7);
	muscleRate = extractValue2dArray(rawData, 8);
	visceralFat = extractValue2dArray(rawData, 9);
	impedance = extractValue2dArray(rawData, 10);
}

function addChart(dataToDisplay, headerIndex, position) {
	data.labels = timestamp;
	data.datasets.push(generateDatasets(dataToDisplay, header[headerIndex], position));
	myChart.update();
	document.getElementById('myChart').style.display = 'flex';
}


function generateDatasets(dataArray, label, position) {
	let index;
	if (position == 'right'){
		index = 0;
	} else {
		index = 1;
	}
	var newDataset = {
		label: label,
		yAxisID: position,
		data: dataArray,
		borderColor: [
			'rgba(255, 99, 132, 1)',
			'rgba(54, 162, 235, 1)',
			'rgba(255, 206, 86, 1)',
			'rgba(75, 192, 192, 1)',
			'rgba(153, 102, 255, 1)',
			'rgba(255, 159, 64, 1)'
		],
		borderWidth: 1,
	}
	myChart.options.scales.yAxes[index].scaleLabel.labelString = label;
	return newDataset;
}

function errorHandler(evt) {
	if (evt.target.error.name == "NotReadableError") {
		alert("No se puede leer el fichero");
	}
}

function extractValue2dArray(array, index) {
	let dataArray = [];
	for (let i = 0; i < array.length; i++) {
		if (array[i][index] > 0) {
			dataArray[i] = array[i][index];
		}
	}
	return dataArray;
}

function convertUnixTimestamp(unixTimestamp) {
	return moment.unix(unixTimestamp).format();
}