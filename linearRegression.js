function linearRegression(xArray, yArray) {
    let xSum = 0;
    let ySum = 0;
    let xySum = 0;
    let xxSum = 0;
    let samples = 0;
    let x = 0;
    let y = 0;
    let resultY = [];

    let regressionObject = {
        slope: 0,
        intersection: 0,
        values: []
    };

    if (xArray.length != yArray.length) {
        alert('Los dos arrays de datos deben tener la misma longitud');
        return;
    } else {
        samples = xArray.length;
    }
 
    for (let i = 0; i < xArray.length; i++) {
        x = xArray[i];
        y = yArray[i];
        xSum += x;
        ySum += y;
        xxSum += x * x;
        xySum += x * y;
    }

    let m = (samples * xySum - xSum * ySum) / (samples * xxSum - xSum * xSum);
    let b = (ySum / samples) - (m * xSum) / samples;

    for (let i = 0; i < xArray.length; i++) {
        x = xArray[i];
        y = x * m + b;
        y = parseFloat(y.toFixed(2));
        resultY.push(y);
    }
    regressionObject.values = resultY;
    regressionObject.slope = m;
    regressionObject.intersection = b;
    return regressionObject;
}
