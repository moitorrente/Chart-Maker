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

var option = {
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

function generateBodyMetrics(index) {
	console.log(index);
	console.log(dataSets.values[2][index]);
	console.log(dataSets.values[1][index]);
	console.log(dataSets.values[10][index]);
	bodyData = new bodyMetrics('male', 26,
		dataSets.values[2][index], // height
		dataSets.values[1][index], // weight
		dataSets.values[10][index]/* impedance*/);
	console.log(bodyData);
	let BMIText = document.getElementById("BMIText");
	let MuscleText = document.getElementById("MuscleText");
	let ProteinText = document.getElementById("ProteinText");
	let BoneMassText = document.getElementById("BoneMassText");
	let WaterText = document.getElementById("WaterText");
	let BMRText = document.getElementById("BMRText");
	let fatText = document.getElementById("fatText");
	let VisceralFatText = document.getElementById("VisceralFatText");

	BMIText.value = bodyData.BMI.value;
	MuscleText.value = bodyData.muscleMass.value;
	ProteinText.value = bodyData.proteinRate.value;
	BoneMassText.value = bodyData.boneMass.value;
	WaterText.value = bodyData.waterRate.value;
	BMRText.value = bodyData.BMR.value;
	fatText.value = bodyData.bodyFat.value;
	VisceralFatText.value = bodyData.visceralFat.value;
	bodyTypeText.value = bodyData.bodyType.value;
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

function processChart(index, position, colorIndex) {
	//todo good implementation
	// var bodyData = new bodyMetrics('male', 26,
	// 	dataSets.values[2][dataSets.values[2].length - 1], //last height
	// 	dataSets.values[1][dataSets.values[1].length - 1], //last weight
	// 	dataSets.values[10][dataSets.values[10].length - 1]/*last impedance*/);


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

function calculateStatistics(index) {
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
	let rangeText = document.getElementById("rangeText");

	meanText.value = meanValue;
	medianText.value = medianValue;
	modeText.value = modeValue;
	minText.value = rangeValues[0];
	maxText.value = rangeValues[1];
	samplesText.value = samplesNumberValue;
	lossSamplesText.value = lossSamplesValue;
	rangeText.value = rangeValues[2];
}

