

const file = localStorage.getItem('fileUploaded');
const data = processData(file);
console.log(data);

const table = document.getElementById('table');

function addDataTable(){
    let row = table.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = "NEW CELL1";
    cell2.innerHTML = "NEW CELL2";
    cell3.innerHTML = "NEW CELL3";
}



createHeader();

function createHeader(){
    let header = table.createTHead();
    let row = header.insertRow();
    for(let i = 0; i<data.header.length; i++){

        let cell = row.insertCell();
        cell.innerHTML = data.header[i];
    }

}


for (let i = 0; i < data.values[0].length; i++) {
    let row = document.createElement("tr");
 
    for (var j = 0; j < data.header.length; j++) {
      var cell = document.createElement("td");
      var cellText = document.createTextNode(data.values[j][i]);
      cell.appendChild(cellText);
      row.appendChild(cell);
    }
 
    table.tBodies[0].appendChild(row);
  }



updateTable();
function updateTable() {
    $(document).ready(function () {
        $('#table').DataTable();
    });
}
