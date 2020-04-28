const file = localStorage.getItem('fileUploaded');
const age = localStorage.getItem('age');
const gender = localStorage.getItem('gender');

//document.getElementById('gender').innerHTML = 'Gender: ' + gender;
//document.getElementById('age').innerHTML = 'Age: ' + age;

processCSV(file);
localStorage.clear();

function processCSV(csv){
    processData(csv);
    loadOptions();

    processChart(chartList.value, 'left', 1);
    dropdownChanged();
}