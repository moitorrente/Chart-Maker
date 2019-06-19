var header = [];
var rawData = [];
var timestamp = [];
var interpolated = [];
//var dataSets = [];

var dataSets = {
	names: [],
	values: []
}

var colorArray = [
	'rgba(255, 99, 132, 1)',
	'rgba(54, 162, 235, 1)',
	'rgba(255, 206, 86, 1)',
	'rgba(75, 192, 192, 1)',
	'rgba(153, 102, 255, 1)',
	'rgba(255, 159, 64, 1)'];

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
					beginAtZero: false,
				},
				bounds: 'data',
				distribution: 'linear'
			}],
			yAxes: [{
				id: 'right',
				position: 'right',
				display: false,
				scaleLabel: {
					display: true,
					labelString: ''
				},
				ticks: {
					beginAtZero: false,
				}
			}, {
				id: 'left',
				position: 'left',
				display: false,
				scaleLabel: {
					display: true,
					labelString: ''
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
	loadOptions();
}

function loadOptions() {
	let dropdown = document.getElementById("chartList");
	let rightChartButton = document.getElementById("rightChartButton");

	let leftChartButton = document.getElementById("leftChartButton");
	let resetButton = document.getElementById("resetButton");

	for (let i = 0; i < header.length; i++) {
		let option = document.createElement("option");
		option.text = header[i];
		option.value = i;
		dropdown.options.add(option);

	}
	dropdown.options[0].style.display = 'none';	//Se oculta el timestamp
	dropdown.selectedIndex = 1; //Se selecciona la siguiente posicion por defecto
	dropdown.style.display = 'flex';
	rightChartButton.style.display = 'inline';
	leftChartButton.style.display = 'inline';
	resetButton.style.display = 'inline';
}

function resetChart() {
	while (data.datasets.length) {
		data.datasets.shift();
	}

	for (let i = 0; i < myChart.options.scales.yAxes.length; i++) {
		myChart.options.scales.yAxes[i].display = false;
	}

	myChart.update();
	document.getElementById('myChart').style.display = 'none';
}

function processData(csv) {
	var allTextLines = csv.split(/\r\n|\n/);

	header = allTextLines.shift().split(",");
	while (allTextLines.length > 1) {
		rawData.push(allTextLines.shift().split(","));
	}

	timestamp = extractValue2dArray(rawData, 0);

	for (let i = 0; i < timestamp.length; i++) {
		timestamp[i] = convertUnixTimestamp(timestamp[i]);
	}

	dataSets.names = header;

	dataSets.values[0] = extractValue2dArray(rawData, 0);
	for (let i = 1; i < header.length; i++) {
		dataSets.values.push(extractValue2dArray(rawData, i));
	}
}

function processChart(index, position) {
	let pos;
	if (position == 'left') {
		pos = 1;
	} else {
		pos = 0;
	}
	myChart.options.scales.yAxes[pos].display = true;

	for (let i = 0; i < interpolated.length; i++) {
		interpolated[i] = false;
	}

	let interpolateCheck = document.getElementById('interpolar').checked;

	if (interpolateCheck) {
		let interpolatedArray = interpolate(dataSets.values[index]);
		addChart(interpolatedArray, dataSets.names[index], position);
	} else {
		addChart(dataSets.values[index], dataSets.names[index], position);
	}
}


function addChart(dataToDisplay, label, position) {
	data.labels = timestamp;
	data.datasets.push(generateChartDataset(dataToDisplay, label, position));
	myChart.update();
	document.getElementById('myChart').style.display = 'inline';
}

function generateChartDataset(dataArray, label, position) {
	let index;
	if (position == 'left') {
		index = 1;
	} else {
		index = 0;
	}
	var newDataset = {
		label: label,
		//lineTension: 0,  //Para quitar el interpolado
		yAxisID: position,
		data: dataArray,
		borderColor: colorArray[index],
		borderWidth: 1,
		pointBackgroundColor: interpolated,
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
		} else {
			dataArray[i] = null;
		}

	}
	return dataArray;
}

function convertUnixTimestamp(unixTimestamp) {
	return moment.unix(unixTimestamp).format();
}