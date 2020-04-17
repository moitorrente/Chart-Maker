function handleFiles(files) {
    if (window.FileReader) {
        try {
            printFileProperties(files[0]);
            getAsText(files[0]);
        } catch (error) {
            alert("Se ha producido un error, vuelve a seleccionar un archivo.");
        }
    } else {
        alert('FileReader no funciona en este navegador');
    }
}

function printFileProperties(file) {
    let output = [];
    output.push('<li><strong>', escape(file.name), '</strong> (', file.type || 'n/a', ') - ', file.size, ' bytes, last modified: ',
        file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a',
        '</li>');
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}

function getAsText(fileToRead) {
    var reader = new FileReader();
    reader.readAsText(fileToRead);
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
}

function loadHandler(event) {
    var csv = event.target.result;
    processData(csv);
    loadOptions();

    processChart(chartList.value, 'left', 1);
    dropdownChanged();
}

function errorHandler(evt) {
    if (evt.target.error.name == "NotReadableError") {
        alert("No se puede leer el fichero");
    }
}