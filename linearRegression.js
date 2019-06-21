function linearRegression(xArray, yArray) {
    let xClean = cleanArray(xArray);
    let yClean = cleanArray(yArray);
    let xSum = 0;
    let ySum = 0;
    let xySum = 0;
    let xxSum = 0;
    let samples = 0;
    let x = 0;
    let y = 0;
    let resultY = [];

    if (xClean.length != yClean.length) {
        alert('Los dos arrays de datos deben tener la misma longitud');
        return;
    } else {
        samples = xClean.length;
    }
 
    for (let i = 0; i < xClean.length; i++) {
        x = xClean[i];
        y = yClean[i];
        xSum += x;
        ySum += y;
        xxSum += x * x;
        xySum += x * y;
    }

    let m = (samples * xySum - xSum * ySum) / (samples * xxSum - xSum * xSum);
    let b = (ySum / samples) - (m * xSum) / samples;

    for (let i = 0; i < xClean.length; i++) {
        x = xClean[i];
        y = x * m + b;
        y = parseFloat(y.toFixed(2));
        resultY.push(y);
    }
    return resultY;
}

function cleanArray(array) {
    let cleanArray = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i] != null) {
            cleanArray.push(parseFloat(array[i]));
        }
    }
    return cleanArray;
}