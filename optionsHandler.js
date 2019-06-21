function loadOptions() {
    let optionPanel = document.getElementById("optionPanel");
    let dropdown = document.getElementById("chartList");


	for (let i = 0; i < header.length; i++) {
		let option = document.createElement("option");
		option.text = header[i];
		option.value = i;
		dropdown.options.add(option);

    }

	dropdown.options[0].style.display = 'none';	//Se oculta el timestamp
	dropdown.selectedIndex = 1; //Se selecciona la siguiente posicion por defecto  
    optionPanel.style.display = 'inline'
}