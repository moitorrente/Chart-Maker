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
	//todo better implementation of index
	bodyData = new bodyMetrics('male', 26,
		dataSets.values[2][index], // height
		dataSets.values[1][index], // weight
		dataSets.values[10][index]/* impedance*/);

	let BMIText = document.getElementById("BMIText");
	let MuscleText = document.getElementById("MuscleText");
	let ProteinText = document.getElementById("ProteinText");
	let BoneMassText = document.getElementById("BoneMassText");
	let WaterText = document.getElementById("WaterText");
	let BMRText = document.getElementById("BMRText");
	let fatText = document.getElementById("fatText");
	let VisceralFatText = document.getElementById("VisceralFatText");

	BMIText.value = bodyData.BMI.value + " (" + bodyData.BMI.text + ")";
	BMIText.style.backgroundColor = bodyData.BMI.color;

	if (bodyData.muscleMass.value) {
		MuscleText.value = bodyData.muscleMass.value + " kg" + " (" + bodyData.muscleMass.text + ")";;
		MuscleText.style.backgroundColor = bodyData.muscleMass.color;
	} else {
		MuscleText.value = "";
		MuscleText.style.backgroundColor = "lightgray";
	}

	if (bodyData.proteinRate.value) {
		ProteinText.value = bodyData.proteinRate.value + "%" + " (" + bodyData.proteinRate.text + ")";
		ProteinText.style.backgroundColor = bodyData.proteinRate.color;
	} else {
		ProteinText.value = "";
		ProteinText.style.backgroundColor = "lightgray";
	}

	if (bodyData.boneMass.value) {
		BoneMassText.value = bodyData.boneMass.value + " kg" + " (" + bodyData.boneMass.text + ")"
		BoneMassText.style.backgroundColor = bodyData.boneMass.color;
	} else {
		BoneMassText.value = "";
		BoneMassText.style.backgroundColor = "lightgray";
	}

	if (bodyData.waterRate.value) {
		WaterText.value = bodyData.waterRate.value + "%" + " (" + bodyData.waterRate.text + ")";
		WaterText.style.backgroundColor = bodyData.waterRate.color;
	} else {
		WaterText.value = "";
		WaterText.style.backgroundColor = "lightgray";
	}
	if (bodyData.BMR.value) {
		BMRText.value = bodyData.BMR.value + " kcal"+ " (" + bodyData.BMR.text + ")";
		BMRText.style.backgroundColor = bodyData.BMR.color;
	} else {
		BMRText.value = "";
		BMRText.style.backgroundColor = "lightgray";
	}

	if (bodyData.bodyFat.value) {
		fatText.value = bodyData.bodyFat.value + "%" + " (" + bodyData.bodyFat.text + ")";
		fatText.style.backgroundColor = bodyData.bodyFat.color;
	} else {
		fatText.value = "";
		fatText.style.backgroundColor = "lightgray";
	}

	if (bodyData.visceralFat.value) {
		VisceralFatText.value = bodyData.visceralFat.value + "%" + " (" + bodyData.visceralFat.text + ")";
		VisceralFatText.style.backgroundColor = bodyData.visceralFat.color;
	} else {
		VisceralFatText.value = "";
		VisceralFatText.style.backgroundColor = "lightgray";
	}

	if (bodyData.bodyType.value) {
		bodyTypeText.value = bodyData.bodyType.value;
	} else {
		bodyTypeText.value = "";
		bodyTypeText.style.backgroundColor = "lightgray";
	}


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

