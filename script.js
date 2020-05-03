localStorage.clear();

let file;
let csv;
const dropArea = document.getElementById('drop-area');
dropArea.addEventListener('drop', handleDrop, false);
//dropArea.addEventListener('change', handleDrop, false);

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
});

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
});

function handleFiles(files) {
    if (window.FileReader) {
        try {
            file = files[0];
            printFileProperties(file);
            getAsText(file);
        } catch (error) {
            alert("Se ha producido un error, vuelve a seleccionar un archivo.");
        }
    } else {
        alert('FileReader no funciona en este navegador');
    }
}

function printFileProperties(file) {
    document.getElementById('description').innerHTML = 'description';

    let output = [];
    output.push(escape(file.name));
    document.getElementById('input').innerHTML = output;
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    dropArea.classList.add('highlight');
}

function unhighlight(e) {
    dropArea.classList.remove('highlight');
}

function handleDrop(e) {
    const data = e.dataTransfer;
    const files = data.files;
    handleFiles(files);
}

function getAsText(fileToRead) {
    var reader = new FileReader();
    reader.readAsText(fileToRead);
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
}

function loadHandler(event) {
    csv = event.target.result;
    const ageNumber = document.getElementById('age').value;
    const genderValue = document.getElementById('gender').value;
    localStorage.setItem('age', ageNumber);
    localStorage.setItem('gender', genderValue);
    localStorage.setItem('fileUploaded', csv);
    dropArea.classList.add('uploaded');
    document.getElementById('submit').disabled = false;
}

function errorHandler(evt) {
    if (evt.target.error.name == "NotReadableError") {
        alert("No se puede leer el fichero");
    }
}
