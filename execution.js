const file = localStorage.getItem('fileUploaded');
const age = localStorage.getItem('age');
const gender = localStorage.getItem('gender');

//document.getElementById('gender').innerHTML = 'Gender: ' + gender;
//document.getElementById('age').innerHTML = 'Age: ' + age;

processCSV(file);
//localStorage.clear();

function processCSV(csv){
    const data=processData(csv);

    dataSets.name = data.header;
    dataSets.values = data.values;

    loadOptions();

    processChart(chartList.value, 'left', 1);
    dropdownChanged();
}