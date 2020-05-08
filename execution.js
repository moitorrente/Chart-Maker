const file = localStorage.getItem('fileUploaded');
const age = localStorage.getItem('age');
const gender = localStorage.getItem('gender');
const ageText = document.getElementById('ageText');
ageText.innerHTML = age;

const genderText = document.getElementById('genderText');
genderText.innerHTML = gender;

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