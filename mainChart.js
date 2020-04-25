var header = [];
var rawData = [];
var timestamp = [];
let colorIdx = 0;



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

var option = {
	responsive: true,
	pan: {
		enabled: true,
		mode: 'x',
	},
	zoom: {
		enabled: true,
		mode: 'x',
		drag: false,
	},
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
			//gridLines: { color: "#fff" },
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
	},
	onClick: function (evt) {
		let element = myChart.getElementAtEvent(evt);
		if (element.length > 0) {
			let index = element[0]._index;
			generateBodyMetrics(index);
		}
	}
};

var myChart = new Chart(ctx, {
	type: 'line',
	data: data,
	options: option
});

var bodyData;

function resetChart() {
	while (data.datasets.length) {
		data.datasets.shift();
	}

	for (let i = 0; i < myChart.options.scales.yAxes.length; i++) {
		myChart.options.scales.yAxes[i].display = false;
	}
	myChart.update();
	document.getElementById('myChart').style.display = 'none';
	colorIdx = 0;
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
	colorIdx++;
	if (colorIdx > colorArray.length) {
		colorIdx = 1;
	}
	if (display == 'data') {
		addChart(dataSets.values[index], dataSets.names[index], position, colorIdx);
	} else if (display == 'interpolation') {
		let interpolatedArray = interpolate(dataSets.values[index]);
		addChart(interpolatedArray.values, dataSets.names[index] +' interpolado', position, colorIdx, interpolatedArray.colors);
	} else if (display == 'regression') {
		let interpolatedArray = interpolate(dataSets.values[index]);
		let regression = linearRegression(dataSets.values[0], interpolatedArray.values);
		//addChart(interpolatedArray.values, dataSets.names[index], position, colorIndex, interpolatedArray.colors);
		addChart(regression.values, 'Regresión ' + dataSets.names[index], position, 5);
		//console.log("y(t) = " + regression.slope + "t + " + regression.intersection);
	} else if (display == 'movingAverage') {

		let samples = document.getElementById('averageSamples').value;
		let interpolatedArray = interpolate(dataSets.values[index]);
		let movingAverag = movingAverage(interpolatedArray.values, samples);
		addChart(movingAverag, 'Moving average ' + samples, position, colorIdx);
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
		lineTension: 0,  //Para quitar el interpolado
		yAxisID: position,
		data: dataArray,
		borderColor: colorArray[colorIndex],
		borderWidth: 1,
		pointBackgroundColor: pointBackgroundColor,
	}
	myChart.options.scales.yAxes[index].scaleLabel.labelString = label;
	return newDataset;
}