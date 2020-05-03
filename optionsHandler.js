function loadOptions() {
	let optionPanel = document.getElementById("optionPanel");
	let dropdown = document.getElementById("chartList");
	let statisticsPanel = document.getElementById("statisticsPanel");
	//let miniCharts = document.getElementById("miniCharts");

	//	dropdown.options.length = 0;

	for (let i = 0; i < header.length; i++) {
		let option = document.createElement("option");
		option.text = header[i];
		option.value = i;
		dropdown.options.add(option);
	}

	dropdown.options[0].style.display = 'none';	//Se oculta el timestamp
	dropdown.selectedIndex = 1; //Se selecciona la siguiente posicion por defecto  
	optionPanel.style.display = 'flex';
	statisticsPanel.style.display = 'flex';
	//miniCharts.style.display = 'inline-block';
}

document.getElementById("chartList").onchange = dropdownChanged;

function dropdownChanged() {
	if (document.getElementById('myChart').style.display == 'none') {
		resetChart();
		processChart(chartList.value, 'left', 1);
	};
	calculateStatistics(chartList.value);
	generateBodyMetrics(dataSets.values[1].length-1);
}

function selectTab(evt, index) {
	let tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	evt.currentTarget.className += " active";
	let dropdown = document.getElementById("chartList");
	dropdown.selectedIndex = index;
	dropdownChanged();
	resetChart();
	processChart(index, 'left', 1);
}


