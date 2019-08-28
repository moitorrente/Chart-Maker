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