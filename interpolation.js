

function interpolate(array) {
    let interpolatedArray = Array.from(array);
    let noMeasureIndexes = searchNull(array);
    let interpolatedColor = [];

    let interpolation = {
        values: [],
        colors: []
    }

    interpolatedColor.length = 0;

    for (let i = 0; i < noMeasureIndexes.length; i++) {
        let previousDataIndex = searchPrevious(array, noMeasureIndexes[i]);
        let nextDataIndex = searchNext(array, noMeasureIndexes[i]);
        interpolatedArray[noMeasureIndexes[i]] = interpolatedValue(array, noMeasureIndexes[i], previousDataIndex, nextDataIndex,interpolatedColor);
    }

    //Correccion para inicio y fin de array sin valor
    for (let i = 0; i < interpolatedArray.length; i++) {
        if (isNaN(interpolatedArray[i])) {
            if (interpolatedArray[i + 1] == undefined) {
                interpolatedArray[i] = interpolatedArray[i - 1];
            } else {
                interpolatedArray[i] = interpolatedArray[i + 1];
            }
        }
    }
    interpolation.values = interpolatedArray;
    interpolation.colors = interpolatedColor;
    return interpolation;
}

function searchNull(array) {
    let nullArray = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i] == null) {
            nullArray.push(i);
        }
    }
    return nullArray;
}

function searchPrevious(array, index) {

    for (let i = index; i >= 0; i--) {
        if (array[i] != null) {
            return i;
        }
    }
}

function searchNext(array, index) {
    for (let i = index; i < array.length; i++) {
        if (array[i] != null) {
            return i;
        }
    }
}

function interpolatedValue(array, index, previousIndex, nextIndex, interpolatedColor) {
    let tempTimestamp = dataSets.values[0];
    let firstPonderation = tempTimestamp[nextIndex] - tempTimestamp[index];
    let secondPonderation = tempTimestamp[index] - tempTimestamp[previousIndex];
    let divisor = tempTimestamp[nextIndex] - tempTimestamp[previousIndex];
    let firstValue = parseFloat(array[previousIndex]);
    let secondValue = parseFloat(array[nextIndex]);
    let interpolation = (firstValue * firstPonderation + secondValue * secondPonderation) / divisor;
    interpolation = parseFloat(interpolation.toFixed(2));
    interpolatedColor[index] = 'red';
    return interpolation;
}

