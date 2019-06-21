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

	for (let i = 0; i < interpolated.length; i++) {
		interpolated[i] = false;
	}

	let visualOptions = document.getElementsByName('visualOptions');
	let display = '';
	for (let i = 0; i < visualOptions.length; i++) {
		if (visualOptions[i].checked) {
			display = (visualOptions[i].value);
			break;
		}
	}
	//	console.log(visualOptions);

	if (display == 'data') {
		addChart(dataSets.values[index], dataSets.names[index], position, colorIndex);
	} else if (display == 'interpolation') {
		let interpolatedArray = interpolate(dataSets.values[index]);
		addChart(interpolatedArray, dataSets.names[index], position, colorIndex);
	} else if (display == 'regression') {
		let interpolatedArray = interpolate(dataSets.values[index]);
		let regresion = linearRegression(dataSets.values[0], interpolatedArray);
		addChart(interpolatedArray, dataSets.names[index], position, colorIndex);
		addChart(regresion, 'Regresión ' + dataSets.names[index], position, 5);
	}
}

function addChart(dataToDisplay, label, position, colorIndex) {
	data.labels = timestamp;
	data.datasets.push(generateChartDataset(dataToDisplay, label, position, colorIndex));
	myChart.update();
	document.getElementById('myChart').style.display = 'inline';
}

function generateChartDataset(dataArray, label, position, colorIndex) {
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
		pointBackgroundColor: interpolated,
	}
	myChart.options.scales.yAxes[index].scaleLabel.labelString = label;
	return newDataset;
}

