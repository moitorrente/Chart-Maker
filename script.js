var header = [];
var rawData = [];
var timestamp = [];

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
				distribution: 'linear',
				//,gridLines: { color: "#fff" }
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
				},
				//gridLines: { color: "#fff" }
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
				},
				//,gridLines: { color: "#fff" }
			}
			]
		}
	}
});

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

function processChart(index, position, colorIndex) {
	let pos;
	if (position == 'left') {
		pos = 1;
	} else {
		pos = 0;
	}
	myChart.options.scales.yAxes[pos].display = true;

	let visualOptions = document.getElementsByName('visualOptions');
	let display = '';
	for (let i = 0; i < visualOptions.length; i++) {
		if (visualOptions[i].checked) {
			display = (visualOptions[i].value);
			break;
		}
	}

	if (display == 'data') {
		addChart(dataSets.values[index], dataSets.names[index], position, colorIndex);
	} else if (display == 'interpolation') {
		let interpolatedArray = interpolate(dataSets.values[index]);
		addChart(interpolatedArray.values, dataSets.names[index], position, colorIndex, interpolatedArray.colors);
	} else if (display == 'regression') {
		let interpolatedArray = interpolate(dataSets.values[index]);
		let regression = linearRegression(dataSets.values[0], interpolatedArray.values);
		addChart(interpolatedArray.values, dataSets.names[index], position, colorIndex, interpolatedArray.colors);
		addChart(regression.values, 'Regresión ' + dataSets.names[index], position, 5);
		//console.log("y(t) = " + regression.slope + "t + " + regression.intersection);
	}
}

function addChart(dataToDisplay, label, position, colorIndex, pointBackgroundColor) {
	data.labels = timestamp;
	let newDataset = generateChartDataset(dataToDisplay, label, position, colorIndex, pointBackgroundColor);
	data.datasets.push(newDataset);
	myChart.update();
	document.getElementById('myChart').style.display = 'inline';
}

function generateChartDataset(dataArray, label, position, colorIndex, pointBackgroundColor) {
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
		borderColor: colorArray[colorIndex],
		borderWidth: 1,
		pointBackgroundColor: pointBackgroundColor,
	}
	myChart.options.scales.yAxes[index].scaleLabel.labelString = label;
	return newDataset;
}

function calculateStatistics(index){
	let array = cleanArray(dataSets.values[index]);
	let meanValue = mean(array);
	let medianValue = median(array);
	let modeValue = mode(array);
	let rangeValues = range(array);
	let samplesNumberValue = samplesNumber(array);
	let lossSamplesValue = lossSamplesNumber(array);

	let meanText = document.getElementById("meanText");
	let medianText = document.getElementById("medianText");
	let modeText = document.getElementById("modeText");
	let minText = document.getElementById("minText");
	let maxText = document.getElementById("maxText");
	let samplesText = document.getElementById("samplesText");
	let lossSamplesText = document.getElementById("lossSamplesText");

	meanText.value = meanValue;
	medianText.value = medianValue;
	modeText.value = modeValue;
	minText.value = rangeValues[0];
	maxText.value = rangeValues[1];
	samplesText.value = samplesNumberValue;
	lossSamplesText.value = lossSamplesValue;
}

