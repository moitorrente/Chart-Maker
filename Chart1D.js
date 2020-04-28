const color = {
    cyan: '#00ffff',
    lightBlue: '#70cfff',
    blue: '#4092e4',
    darkBlue: '#2377cd',
    lightGreen: '#73f0b8',
    green: '#10b269',
    darkGreen: '#067543',
    lightYellow: '#ffeaa6',
    yellow: '#ffc301',
    darkYellow: '#a67f00',
    lightOrange: '#fcbf79',
    orange: '#f28d19',
    brown: '#854700',
    red: '#fa6a50',
    pink: '#ff00d0',
    white: '#ffffff',
    purple: '#5b04c8',
    black: '#000000'
}

const colorCombinations = [
    [color.green, color.yellow, color.orange],
    [color.orange, color.green, color.darkGreen],
    [color.darkBlue, color.blue, color.green, color.yellow, color.orange],
    [color.purple, color.blue, color.green, color.yellow, color.orange, color.red],
    [color.purple, color.green, color.yellow, color.orange, color.red, color.blue]
]

class Chart1D {
    constructor(id, title, scale, scaleColors) {
        this.id = id;
        this.scale = scale;
        this.title = title;
        this.scaleColors = scaleColors;
        this.ctx = document.getElementById(id).getContext('2d');
        this.data = {
            labels: [],
            datasets: [
                {
                    data: [],
                    borderWidth: 6,
                    pointBackgroundColor: color.white
                }, {
                    data: [],
                    borderWidth: 6,
                    pointBackgroundColor: color.white
                }, {
                    data: [],
                    borderWidth: 6,
                    pointBackgroundColor: color.white
                }, {
                    data: [],
                    borderWidth: 6,
                    pointBackgroundColor: color.white
                }, {
                    data: [],
                    borderWidth: 6,
                    pointBackgroundColor: color.white
                }, {
                    data: [],
                    borderWidth: 6,
                    pointBackgroundColor: color.white
                }, {
                    data: [],
                    borderWidth: 6,
                    pointBackgroundColor: color.white
                }, {
                    data: [],
                    borderWidth: 6,
                    pointBackgroundColor: color.white
                }, {
                    data: [],
                    borderWidth: 6,
                    pointBackgroundColor: color.white
                }, {
                    data: [],
                    borderWidth: 6,
                    pointBackgroundColor: color.white
                }]
        }
        this.option = {
            responsive: true,
            legend: {
                display: false,
                position: 'bottom'
            },
            scales: {
                xAxes: [{
                    display: true,
                    position: 'top',
                    gridLines: false
                }],
                yAxes: [{
                    display: false,
                }]
            },
            title: {
                display: false,
                text: this.title,
                fontColor: '#777777'
            },
            layout: {
                padding: {
                    left: 25,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },
            tooltips: { 
                enabled: false 
            },
            hover: { 
                mode: null 
            },
        }
        
        this.setTitle(title);

        this.myChart = new Chart(this.ctx, {
            type: 'line',
            data: this.data,
            options: this.option
        });
    }

    setTitle(title){
        if(document.getElementById(this.id+'Summary')){
            document.getElementById(this.id+'Summary').innerHTML = title;
        } else {
            this.option.title.display = true;
        }
    }

    show(value, textValue) {
        let dataPosition, datasetPosition;
        const colorArray = this.createColorScale(this.scaleColors);

        this.translateScale();
        this.addScaleLabels(this.interpolateScale(this.scale));
        this.addScaleData(this.scale);

        if (value) {
            dataPosition = this.findValuePosition(value, this.scale)[0];
            datasetPosition = this.findValuePosition(value, this.scale)[1];
        }

        for (let i in this.data.datasets) {
            this.data.datasets[i].pointRadius = this.createArray(this.data.datasets[i].data.length, 0, 0);
            this.data.datasets[i].pointHitRadius = this.data.datasets[i].pointRadius;

            if (i == datasetPosition) {
                this.data.datasets[i].pointBorderWidth = this.createArray(this.data.datasets[i].data.length, dataPosition, 3);
                this.data.datasets[i].pointHoverBorderWidth = this.data.datasets[i].pointBorderWidth;
                this.data.datasets[i].pointHoverRadius = this.createArray(this.data.datasets[i].data.length, dataPosition, 10);
                this.data.datasets[i].pointRadius = this.data.datasets[i].pointHoverRadius;
            }

            this.data.datasets[i].borderColor = colorArray[i];
        }        
        this.myChart.update();
    }

    createColorScale(scaleColors) {
        let colors = [];
        if (scaleColors) {
            for (let i in scaleColors) {
                if (scaleColors[i][0] == '#') {
                    colors.push(scaleColors[i]);
                } else {
                    colors.push(color[scaleColors[i]]);
                    if (!color[scaleColors[i]]) {
                        alert(`Color ${scaleColors[i]} no válido!`);
                    }
                }
            }
        } else {
            colors = colorCombinations[3];
        }
        return colors;
    }

    translateScale() {
        //En caso de que la escala no empiece en 0 lo inserta para desplazar hacia la derecha
        if (this.scale[0] != 0) {
            this.scale.unshift(0);
        }

        //En caso de que la escala no acabe en 99 lo inserta par adesplazar hacia la izquierda
        if (this.scale[this.scale.length - 1] != 9999999) {
            this.scale.push(9999999);
        }
    }

    createScaleVectors(sections) {
        let newArray = [];
        let finalArray = [];
        const tempSections = sections * 2 + 1;
        let pos = 0;

        for (let j = 0; j < sections; j++) {
            newArray = [];
            for (let i = 0; i < tempSections; i++) {
                if (i == pos || i == pos + 1 || i == pos + 2) {
                    newArray.push(0);
                } else {
                    newArray.push(NaN);
                }
            }
            pos += 2;
            finalArray.push(newArray);
        }
        return finalArray;
    }

    addScaleLabels(scale) {
        let labels = [];
        for (let value in scale) {
            if (scale[value] == 0 || scale[value] == 9999999) {
                labels.push('');
            } else {
                labels.push(scale[value].toString());
            }
        }
        this.data.labels = labels;
    }

    addScaleData(scale) {
        const vect = this.createScaleVectors(scale.length - 1);
        for (let i in this.data.datasets) {
            this.data.datasets[i].data = vect[i];
        }
        this.myChart.update();
    }

    interpolateScale(scale) {
        let newScale = [];
        for (let i in scale) {
            newScale.push(scale[i]);
            newScale.push(0);
        }
        return newScale;
    }

    findValuePosition(value, scale) {
        let newScale = Array.from(scale);
        let section;
        let position = 0;
        let finalPos;

        for (let i in newScale) {
            if (newScale[i] == 0 || newScale[i] == 99) {
                newScale.splice(i, 1);
            }
        }
        for (let i = 0; i < newScale.length; i++) {
            if (value == newScale[i]) {
                position = i;
                section = false;
                break;
            } else if (value < newScale[i]) {
                position = i;
                section = true;
                break;
            } else if (value > newScale[i]) {
                position = i + 1;
                section = true;
            }
        }

        if (section) {
            finalPos = position * 2 + 1;
        } else {
            finalPos = position * 2 + 2;
        }
        return [finalPos, position];
    }

    createArray(length, position, value) {
        let newArray = [];
        for (let i = 0; i < length; i++) {
            if (i == position) {
                newArray.push(value);
            } else {
                newArray.push(0);
            }
        }
        return newArray;
    }
}