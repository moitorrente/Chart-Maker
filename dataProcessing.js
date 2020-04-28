function processData(csv) {
	const allTextLines = csv.split(/\r\n|\n/);

	header = allTextLines.shift().split(",");
	while (allTextLines.length > 1) {
		rawData.push(allTextLines.shift().split(","));
	}

	timestamp = extractValue2dArray(rawData, 0);

	for (let i = 0; i < timestamp.length; i++) {
		timestamp[i] = convertUnixTimestamp(timestamp[i]);
	}

	dataSets.names = header;
	dataSets.values[0] = extractValue2dArray(rawData, 0);
	for (let i = 1; i < header.length; i++) {
		dataSets.values.push(extractValue2dArray(rawData, i));
	}
}

function extractValue2dArray(array, index) {
	let dataArray = [];
	for (let i = 0; i < array.length; i++) {
		if (array[i][index] > 0) {
			dataArray[i] = parseFloat(array[i][index]);
		} else {
			dataArray[i] = null;
		}
	}
	return dataArray;
}

function convertUnixTimestamp(unixTimestamp) {
	return moment.unix(unixTimestamp).format();
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
