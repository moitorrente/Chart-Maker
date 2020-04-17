function mean(array) {
    let mean = 0;
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += parseFloat(array[i]);
    }
    mean = sum / array.length;
    mean = parseFloat(mean.toFixed(2));
    return mean;
}

function median(array) {
    let median = 0;
    let numsLen = array.length;
    let sortedArray = Array.from(array);
    sortedArray.sort();

    if (numsLen % 2 === 0) {
        median = (sortedArray[numsLen / 2 - 1] + sortedArray[numsLen / 2]) / 2;
    } else {
        median = sortedArray[(numsLen - 1) / 2];
    }
    return median;
}

function mode(array) {
    var modes = [];
    let count = [];
    let i;
    let number;
    let maxIndex = 0;

    for (i = 0; i < array.length; i += 1) {
        number = array[i];
        count[number] = (count[number] || 0) + 1;
        if (count[number] > maxIndex) {
            maxIndex = count[number];
        }
    }

    for (i in count)
        if (count.hasOwnProperty(i)) {
            if (count[i] === maxIndex) {
                modes.push(Number(i));
            }
        }
    return modes;
}

function range(array) {
    let sortedArray = Array.from(array);
    sortedArray.sort();
    let min = sortedArray[0];
    let max = sortedArray[sortedArray.length - 1];
    let range = max - min;
    range = range.toFixed(2);
    return [min, max, range];
}

function standardDeviation(array) {
    let arrayMean = mean(array);
    let samples = array.length;
    let sum = 0;
    let sDeviation = 0;

    for (let i = 0; i < array.length; i++) {
        sum += ((array[i] - arrayMean) * (array[i] - arrayMean))
    }
    sDeviation = sum/(samples -1);
    sDeviation = Math.sqrt(sDeviation);
    sDeviation = parseFloat(sDeviation.toFixed(2));
    return sDeviation;
}

function samplesNumber(array){
    return array.length;
}

function lossSamplesNumber(array){
    return timestamp.length - array.length;
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