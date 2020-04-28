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
    const numsLen = array.length;
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
    const sortedArray = Array.from(array);
    sortedArray.sort();
    const min = sortedArray[0];
    const max = sortedArray[sortedArray.length - 1];
    let range = max - min;
    range = range.toFixed(2);
    return [min, max, range];
}

function standardDeviation(array) {
    const arrayMean = mean(array);
    const samples = array.length;
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
	const array = cleanArray(dataSets.values[index]);
	const meanValue = mean(array);
	const medianValue = median(array);
	const modeValue = mode(array);
	const rangeValues = range(array);
	const samplesNumberValue = samplesNumber(array);
	const lossSamplesValue = lossSamplesNumber(array);

	const meanText = document.getElementById("meanText");
	const medianText = document.getElementById("medianText");
	const modeText = document.getElementById("modeText");
	const minText = document.getElementById("minText");
	const maxText = document.getElementById("maxText");
	const samplesText = document.getElementById("samplesText");
	const lossSamplesText = document.getElementById("lossSamplesText");
	const rangeText = document.getElementById("rangeText");

	meanText.innerHTML = new Intl.NumberFormat('de-DE').format(meanValue);
	medianText.innerHTML = new Intl.NumberFormat('de-DE').format(medianValue);
	modeText.innerHTML = new Intl.NumberFormat('de-DE').format(modeValue);
	minText.innerHTML = new Intl.NumberFormat('de-DE').format(rangeValues[0]);
	maxText.innerHTML = new Intl.NumberFormat('de-DE').format(rangeValues[1]);
	samplesText.innerHTML = new Intl.NumberFormat('de-DE').format(samplesNumberValue);
	lossSamplesText.innerHTML = new Intl.NumberFormat('de-DE').format(lossSamplesValue);
	rangeText.innerHTML = new Intl.NumberFormat('de-DE').format(rangeValues[2]);
}