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
	bodyData = new bodyMetrics('male', 27,
		dataSets.values[2][index], // height
		dataSets.values[1][index], // weight
		dataSets.values[10][index]/* impedance*/);


	let BMIText = 'IMC' + ' - ' + bodyData.BMI.value+ ' - ' + bodyData.BMI.text;
	let BMIchart = new Chart1D('BMIChart', BMIText, bodyData.BMI.scale, bodyData.BMI.colorArray);
	BMIchart.show(bodyData.BMI.value, bodyData.BMI.text);
	document.getElementById('BMIChartSummary').style.color = bodyData.BMI.color;

	let MuscleText = 'Músculo' + ' - ' + bodyData.muscleMass.value + ' kg'+ ' - ' + bodyData.muscleMass.text;
	let muscleChart = new Chart1D('MuscleChart', MuscleText, bodyData.muscleMass.scale, bodyData.muscleMass.colorArray);
	muscleChart.show(bodyData.muscleMass.value, bodyData.muscleMass.text);
	document.getElementById('MuscleChartSummary').style.color = bodyData.muscleMass.color;

	let ProteinText = 'Proteina' + ' - ' + bodyData.proteinRate.value + '%' + ' - ' + bodyData.proteinRate.text;
	let proteinChart = new Chart1D('ProteinChart', ProteinText, bodyData.proteinRate.scale, bodyData.proteinRate.colorArray);
	proteinChart.show(bodyData.proteinRate.value, bodyData.proteinRate.text);
	document.getElementById('ProteinChartSummary').style.color = bodyData.proteinRate.color;

	let BoneMassText = 'Masa osea' + ' - ' + bodyData.boneMass.value + ' kg' + ' - ' + bodyData.boneMass.text;
	let BoneMassChart = new Chart1D('BoneMassChart', BoneMassText, bodyData.boneMass.scale, bodyData.boneMass.colorArray);
	BoneMassChart.show(bodyData.boneMass.value, bodyData.boneMass.text);
	document.getElementById('BoneMassChartSummary').style.color = bodyData.boneMass.color;

	let WaterRateText = 'Agua' + ' - ' + bodyData.waterRate.value + '%' + ' - ' + bodyData.waterRate.text;
	let WaterRateChart = new Chart1D('WaterChart', WaterRateText, bodyData.waterRate.scale, bodyData.waterRate.colorArray);
	WaterRateChart.show(bodyData.waterRate.value, bodyData.waterRate.text);
	document.getElementById('WaterChartSummary').style.color = bodyData.waterRate.color;

	let BMRText = 'Metabolismo basal' + ' - ' + bodyData.BMR.value + ' kcal' + ' - ' + bodyData.BMR.text;
	let BMRChart = new Chart1D('BMRChart', BMRText, bodyData.BMR.scale, bodyData.BMR.colorArray);
	BMRChart.show(bodyData.BMR.value, bodyData.BMR.text);
	document.getElementById('BMRChartSummary').style.color = bodyData.BMR.color;

	let bodyFatText = 'Grasa corporal' + ' - ' + bodyData.bodyFat.value + '%' + ' - ' + bodyData.bodyFat.text;
	let bodyFatChart = new Chart1D('FatChart', bodyFatText, bodyData.bodyFat.scale, bodyData.bodyFat.colorArray);
	bodyFatChart.show(bodyData.bodyFat.value, bodyData.bodyFat.text);
	document.getElementById('FatChartSummary').style.color = bodyData.bodyFat.color;

	let visceralFatext = 'Grasa visceral' + ' - ' + bodyData.visceralFat.value + '%' + ' - ' + bodyData.visceralFat.text;
	let visceralFatChart = new Chart1D('VisceralFatChart', visceralFatext, bodyData.visceralFat.scale, bodyData.visceralFat.colorArray);
	visceralFatChart.show(bodyData.visceralFat.value, bodyData.visceralFat.text);
	document.getElementById('VisceralFatChartSummary').style.color = bodyData.visceralFat.color;

	document.getElementById('bodyTypeSummary').innerHTML = bodyData.bodyType.value;
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

