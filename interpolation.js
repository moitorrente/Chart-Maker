function interpolate(array) {
    let interpolatedArray = Array.from(array);
    let noMeasureIndexes = searchNull(array);

    for (let i = 0; i < array.length; i++) {
        interpolated.push(false);
    }

    for (let i = 0; i < noMeasureIndexes.length; i++) {
        let previousDataIndex = searchPrevious(array, noMeasureIndexes[i]);
        let nextDataIndex = searchNext(array, noMeasureIndexes[i]);
        interpolatedArray[noMeasureIndexes[i]] = interpolatedValue(array, noMeasureIndexes[i], previousDataIndex, nextDataIndex);
    }
    return interpolatedArray;
}

function searchNull(array) {
    let zeroArray = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i] == null) {
            zeroArray.push(i);
        }
    }
    return zeroArray;
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

function interpolatedValue(array, index, previousIndex, nextIndex) {
    let tempTimestamp = dataSets.values[0];
    let firstPonderation = tempTimestamp[nextIndex] - tempTimestamp[index];
    let secondPonderation = tempTimestamp[index] - tempTimestamp[previousIndex];
    let divisor = tempTimestamp[nextIndex] - tempTimestamp[previousIndex];
    let firstValue = parseFloat(array[previousIndex]);
    let secondValue = parseFloat(array[nextIndex]);
    let interpolation = (firstValue * firstPonderation + secondValue * secondPonderation) / divisor;
    interpolation = interpolation.toFixed(2);
    interpolated[index] = 'red';
    return interpolation;
}

