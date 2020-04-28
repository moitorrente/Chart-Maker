//Based on: https://github.com/wiecosystem/Bluetooth/blob/master/sandbox/body_metrics.py
//          https://github.com/oliexdev/openScale/blob/ecc8f2fd01db50456ec45b170d20e2aeb7323476/android_app/app/src/main/java/com/health/openscale/core/bluetooth/lib/MiScaleLib.java

var bodyData;

class bodyMetrics {
    constructor(sex, age, height, weight, impedance) {
        this.BMI = {};
        this.BMR = {};
        this.LBM = {};
        this.boneMass = {};
        this.proteinRate = {};
        this.waterRate = {};
        this.muscleMass = {};
        this.bodyFat = {};
        this.visceralFat = {};
        this.bodyType = {};
        this.idealWeight = {};
        this.massToIdealWeight = {};

        this.sex = sex;
        this.age = age;
        this.height = height;
        //todo 
        //create color array
        this.BMI.colorArray = ["#4092e4", "#10b269", "#ffc301", "#f28d19", "#fa6a50"];
        this.BMI.textArray = ["Bajo", "Normal", "Aumentó", "Alto", "Muy alto"];

        this.BMR.colorArray = ["#f28d19", "#10b269"];
        this.BMR.textArray = ["Objetivos no conseguidos", "Objetivos conseguidos"];

        this.bodyFat.colorArray = ["#2377cd", "#4092e4", "#10b269", "#ffc301", "#f28d19"];
        this.bodyFat.textArray = ["Muy baja", "Baja", "Normal", "Ha aumentado", "Alto"];

        this.waterRate.colorArray = ["#f28d19", "#10b269", "#08a45d"];
        this.waterRate.textArray = ["Insuficiente", "Normal", "Bueno"];

        this.boneMass.colorArray = ["#f28d19", "#10b269", "#08a45d"];
        this.boneMass.textArray = ["Insuficiente", "Normal", "Bueno"];

        this.muscleMass.colorArray = ["#f28d19", "#10b269", "#08a45d"];
        this.muscleMass.textArray = ["Insuficiente", "Normal", "Bueno"];

        this.proteinRate.colorArray = ["#f28d19", "#10b269", "#08a45d"];
        this.proteinRate.textArray = ["Insuficiente", "Normal", "Bueno"];

        this.visceralFat.colorArray = ["#10b269", "#ffc301", "#f28d19"];
        this.visceralFat.textArray = ["Normal", "Alto", "Muy alto"];


        if (weight && impedance) {
            this.weight = weight;
            this.impedance = impedance;
            this.getAllMetrics(this.weight, this.impedance);
            this.getAllScales(this.weight);
            this.getAllEvaluations();
        } else {
            this.BMI.value = this.getBMI(weight);
            this.BMI.scale = this.getBMIScale();
            this.BMR.value = this.getBMR(weight);
            this.BMR.scale = this.getBMRScale(weight);
            this.visceralFat.value = this.getVisceralFat(weight);
            this.visceralFat.scale = this.getVisceralFatScale();
            this.idealWeight.value = this.getIdealWeight(weight);
            this.evaluateMetric(this.BMI);
            this.evaluateMetric(this.BMR);
            this.evaluateMetric(this.visceralFat);
        }
        // console.log(this);
    }

    getAllMetrics(weight, impedance) {
        this.BMI.value = this.getBMI(weight);
        this.BMR.value = this.getBMR(weight);
        this.LBM.value = this.getLBM(weight, impedance);
        this.boneMass.value = this.getBoneMass(weight, impedance);
        this.proteinRate.value = this.getProteinRate(weight, impedance);
        this.waterRate.value = this.getWaterRate(weight, impedance);
        this.muscleMass.value = this.getMuscleMass(weight, impedance);
        this.bodyFat.value = this.getBodyFat(weight, impedance);
        this.visceralFat.value = this.getVisceralFat(weight);
        this.bodyType.value = this.getBodyType(weight, impedance);
        this.idealWeight.value = this.getIdealWeight(weight);
        this.massToIdealWeight.value = this.getMassToIdealWeight(weight, impedance);
    }

    getAllScales(weight) {
        this.BMI.scale = this.getBMIScale();
        this.BMR.scale = this.getBMRScale(weight);
        this.bodyFat.scale = this.getBodyFatScale();
        this.waterRate.scale = this.getWaterScale();
        this.boneMass.scale = this.getBoneMassScale(weight);
        this.muscleMass.scale = this.getMuscleMassScale();
        this.proteinRate.scale = this.getProteinScale();
        this.visceralFat.scale = this.getVisceralFatScale();
    }

    getAllEvaluations() {
        this.evaluateMetric(this.BMI);
        this.evaluateMetric(this.BMR);
        this.evaluateMetric(this.bodyFat);
        this.evaluateMetric(this.waterRate);
        this.evaluateMetric(this.boneMass);
        this.evaluateMetric(this.muscleMass);
        this.evaluateMetric(this.proteinRate);
        this.evaluateMetric(this.visceralFat);
    }

    evaluateMetric(obj) {
        let pos = 0;
        for (let i in obj.scale) {
            if (obj.value < obj.scale[i]) {
                pos = i;
                break;
            }
        }

        if (obj == this.BMR) {
            pos--;
        }

        obj.color = obj.colorArray[pos];
        obj.text = obj.textArray[pos];
        obj.index = pos;
    }

    //Lean Body Mass
    getLBM(weight, impedance) {
        let LBM = (this.height * 9.058 / 100) * (this.height / 100);
        LBM += weight * 0.32 + 12.226;
        LBM -= impedance * 0.0068;
        LBM -= this.age * 0.0542;
        return LBM;
    }

    //Body Mass Index
    getBMI(weight) {
        const BMI = weight / (this.height / 100 * this.height / 100);
        return this.roundDecimals(BMI);
    }

    getBMIScale() {
        return [18.5, 25, 28, 32, 9999999];
    }


    //Basal Metabolic Rate (kcal/day)
    getBMR(weight) {
        let BMR = 0;
        if (this.sex == 'male') {
            BMR = 877.8 + weight * 14.916;
            BMR -= this.height * 0.726;
            BMR -= this.age * 8.976;
        } else {
            BMR = 864.6 + weight * 10.2036;
            BMR -= this.height * 0.39336;
            BMR -= this.age * 6.204;
        }
        return this.roundDecimals(BMR);
    }

    getBMRScale(weight) {
        const scales = {
            'female': { 12: 34, 15: 29, 17: 24, 29: 22, 50: 20, 120: 19 },
            'male': { 12: 36, 15: 30, 17: 26, 29: 21.5, 50: 21, 120: 20 }
        }
        for (let years in Object.keys(scales[this.sex])) {
            if (this.age < Object.keys(scales[this.sex])[years]) {
                return [0, this.roundDecimals(scales[this.sex][Object.keys(scales[this.sex])[years]] * weight), 9999999];
            }
        }
    }

    getBodyFat(weight, impedance) {
        let bodyFat = 0;
        const LBMCoefficient = this.getLBM(weight, impedance);
        const bfConstant = this.getBodyFatConstant();
        const bfCoefficient = this.getBodyFatCoefficient(weight);
        bodyFat = (1.0 - (((LBMCoefficient - bfConstant) * bfCoefficient) / weight)) * 100;
        if (bodyFat > 63) {
            bodyFat = 75;
        }

        return this.roundDecimals(bodyFat);
    }

    getBodyFatScale() {
        const scales = [
            { 'min': 0, 'max': 20, 'female': [18, 23, 30, 35, 9999999], 'male': [8, 14, 21, 25, 9999999] },
            { 'min': 21, 'max': 25, 'female': [19, 24, 30, 35, 9999999], 'male': [10, 15, 22, 26, 9999999] },
            { 'min': 26, 'max': 30, 'female': [20, 25, 31, 36, 9999999], 'male': [11, 17, 22, 27, 9999999] },
            { 'min': 31, 'max': 35, 'female': [21, 26, 33, 36, 9999999], 'male': [13, 17, 25, 28, 9999999] },
            { 'min': 46, 'max': 40, 'female': [22, 27, 34, 37, 9999999], 'male': [15, 20, 26, 29, 9999999] },
            { 'min': 41, 'max': 45, 'female': [23, 28, 35, 38, 9999999], 'male': [16, 22, 27, 30, 9999999] },
            { 'min': 46, 'max': 50, 'female': [24, 30, 36, 38, 9999999], 'male': [17, 23, 29, 31, 9999999] },
            { 'min': 51, 'max': 55, 'female': [26, 31, 36, 39, 9999999], 'male': [19, 25, 30, 33, 9999999] },
            { 'min': 56, 'max': 100, 'female': [27, 32, 37, 40, 9999999], 'male': [21, 26, 31, 34, 9999999] },
        ]
        for (let scale in scales) {
            if (this.age >= scales[scale].min && this.age <= scales[scale].max) {
                return scales[scale][this.sex];
            }
        }
    }

    getBodyFatConstant() {
        let constant = 0.8;
        if (this.sex == 'female') {
            if (this.age <= 49) {
                constant = 9.25;
            } else {
                constant = 7.25;
            }
        }
        return constant;
    }

    getBodyFatCoefficient(weight) {
        let coefficient = 1;
        if (this.sex == 'male' && weight < 61) {
            coefficient = 0.98;
        } else if (this.sex == 'female') {
            if (weight > 60) {
                coefficient = 0.96;
                if (this.height > 160) {
                    coefficient *= 1.03;
                }
            } else if (weight < 50) {
                coefficient = 1.02;
                if (this.height > 160) {
                    coefficient *= 1.03;
                }
            }
        }
        return coefficient;
    }

    getWaterRate(weight, impedance) {
        let waterRate = 0;
        let aux = 0.98;
        waterRate = (100 - this.getBodyFat(weight, impedance)) * 0.7;
        if (waterRate < 50) {
            aux = 1.02;
        }
        waterRate *= aux;
        return this.roundDecimals(waterRate);
    }

    getWaterScale() {
        return [55, 65.1];
    }

    getBoneMass(weight, impedance) {
        let base = 0.18016894;
        let boneMass = 0;
        if (this.sex == 'female') {
            base = 0.245691014;
        }
        boneMass = (base - this.getLBM(weight, impedance) * 0.05158) * -1;

        if (boneMass > 2.2) {
            boneMass += 0.1;
        } else {
            boneMass -= 0.1;
        }

        if (this.sex == 'female' && boneMass > 5.1) {
            boneMass = 8;
        } else if (this.sex == 'male' && boneMass > 5.2) {
            boneMass = 8;
        }
        return this.roundDecimals(boneMass);
    }


    getBoneMassScale(weight) {
        const scales = [
            { 'female': { 'min': 60, 'optimal': 2.5 }, 'male': { 'min': 75, 'optimal': 3.2 } },
            { 'female': { 'min': 45, 'optimal': 2.2 }, 'male': { 'min': 69, 'optimal': 2.9 } },
            { 'female': { 'min': 0, 'optimal': 1.8 }, 'male': { 'min': 0, 'optimal': 2.5 } }
        ]
        for (let scale in scales) {
            if (weight >= scales[scale][this.sex].min) {
                return [scales[scale][this.sex].optimal - 1.2, scales[scale][this.sex].optimal + 1, 9999999];
            }
        }
    }

    getMuscleMass(weight, impedance) {
        let muscleMass = 0;
        muscleMass = weight - ((this.getBodyFat(weight, impedance) * 0.01) * weight) - this.getBoneMass(weight, impedance);
        if (this.sex == 'female' && muscleMass >= 84) {
            muscleMass = 120;
        } else if (this.sex == 'male' && muscleMass >= 96.5) {
            muscleMass = 120;
        }
        return this.roundDecimals(muscleMass);
    }

    getMuscleMassScale() {
        const scales = [
            { 'min': 170, 'female': [36.5, 42.5, 9999999], 'male': [49.4, 59.5, 9999999] },
            { 'min': 160, 'female': [32.9, 37.5, 9999999], 'male': [44.0, 52.4, 9999999] },
            { 'min': 0, 'female': [29.1, 34.7, 9999999], 'male': [38.5, 46.5, 9999999] }
        ]

        for (let scale in scales) {
            if (this.height >= scales[scale].min) {
                return scales[scale][this.sex];
            }
        }
    }

    getProteinRate(weight, impedance) {
        let proteinRate = 0;
        proteinRate = 100 - Math.floor((this.getBodyFat(weight, impedance) * 100) / 100);
        proteinRate -= Math.floor(this.getWaterRate(weight, impedance) * 100) / 100;
        proteinRate -= Math.floor((this.getBoneMass(weight, impedance) / weight * 100) * 100) / 100;
        return this.roundDecimals(proteinRate);
    }

    getProteinScale() {
        return [16, 20, 9999999];
    }

    getVisceralFat(weight) {
        let visceralFat = 0;
        if (this.sex == 'female') {
            if (weight > (13 - (this.height * 0.5)) * -1.0) {
                let subsubcalc = ((this.height * 1.45) + (this.height * 0.1158) * this.height) - 120;
                let subcalc = weight * 500.0 / subsubcalc;
                visceralFat = (subcalc - 6) + (this.age * 0.07);
            }
            else {
                let subcalc = 0.691 + (this.height * -0.0024) + (this.height * -0.0024);
                visceralFat = (((this.height * 0.027) - (subcalc * weight)) * -1.) + (this.age * 0.07) - this.age;
            }
        } else {
            if (this.height > weight * 1.6) {
                let subcalc = ((this.height * 0.4) - (this.height * (this.height * 0.0826))) * -1;
                visceralFat = ((weight * 305) / (subcalc + 48)) - 2.9 + (this.age * 0.15);
            }
            else {
                let subcalc = 0.765 + this.height * -0.0015;
                visceralFat = (((this.height * 0.143) - (weight * subcalc)) * -1) + (this.age * 0.15) - 5;
            }
        }
        return this.roundDecimals(visceralFat);
    }

    getVisceralFatScale() {
        return [10, 15];
    }

    getBodyType(weight, impedance) {
        let factor = 0;
        if (this.getBodyFat(weight, impedance) > this.getBodyFatScale()[2]) {
            factor = 0;
        } else if (this.getBodyFat(weight, impedance) < this.getBodyFatScale()[1]) {
            factor = 2;
        } else {
            factor = 1;
        }

        if (this.getMuscleMass(weight, impedance) > this.getMuscleMassScale()[1]) {
            factor = 2 + (factor * 3);
        } else if (this.getMuscleMass(weight, impedance) < this.getMuscleMassScale()[0]) {
            factor = factor * 3;
        } else {
            factor = 1 + (factor * 3);
        }
        return this.getBodyTypeScale(factor);
    }

    getBodyTypeScale(index) {
        const scales = ['Obeso', 'Sobrepeso', 'Regordete', 'Te falta ejercicio', 'Equilibrado', 'Musculoso equilibrado', 'Delgado', 'Delgado equilibrado', 'Delgado musculoso'];
        // return ['obese', 'overweight', 'thick-set', 'lack-exerscise', 'balanced', 'balanced-muscular', 'skinny', 'balanced-skinny', 'skinny-muscular'];
        return scales[index];
    }

    getIdealWeight() {
        const idealWeight = 22 * this.height * this.height / 10000;
        return this.roundDecimals(idealWeight);
    }

    //fat to lose
    getMassToIdealWeight(weight, impedance) {
        let mass = (weight * (this.getBodyFat(weight, impedance) / 100)) - (weight * this.getBodyFatScale(weight, impedance)[2] / 100);
        if (mass < 0) {
            return { 'type': 'to_gain', 'mass': mass };
        } else {
            return { 'type': 'to_lose', 'mass': mass };
        }
    }

    roundDecimals(value, decimals) {
        if (!decimals) {
            decimals = 2;
        }
        const roundedValue = parseFloat(value.toFixed(decimals));
        return roundedValue;
    }
}

function generateBodyMetrics(index) {
    //todo better implementation of index
        bodyData = new bodyMetrics(gender, age,
        dataSets.values[2][index], // height
        dataSets.values[1][index], // weight
        dataSets.values[10][index]/* impedance*/);

    if (bodyData.BMI.value) {
        const BMIText = 'IMC' + ' - ' + bodyData.BMI.value + ' - ' + bodyData.BMI.text;
        let BMIchart = new Chart1D('BMIChart', BMIText, bodyData.BMI.scale, bodyData.BMI.colorArray);
        BMIchart.show(bodyData.BMI.value, bodyData.BMI.text);
        document.getElementById('BMIChartSummary').style.color = bodyData.BMI.color;
    }

    if (bodyData.muscleMass.value) {
        const MuscleText = 'Músculo' + ' - ' + bodyData.muscleMass.value + ' kg' + ' - ' + bodyData.muscleMass.text;
        let muscleChart = new Chart1D('MuscleChart', MuscleText, bodyData.muscleMass.scale, bodyData.muscleMass.colorArray);
        muscleChart.show(bodyData.muscleMass.value, bodyData.muscleMass.text);
        document.getElementById('MuscleChartSummary').style.color = bodyData.muscleMass.color;
    }

    if (bodyData.proteinRate.value) {
        const ProteinText = 'Proteina' + ' - ' + bodyData.proteinRate.value + '%' + ' - ' + bodyData.proteinRate.text;
        let proteinChart = new Chart1D('ProteinChart', ProteinText, bodyData.proteinRate.scale, bodyData.proteinRate.colorArray);
        proteinChart.show(bodyData.proteinRate.value, bodyData.proteinRate.text);
        document.getElementById('ProteinChartSummary').style.color = bodyData.proteinRate.color;
    }

    if (bodyData.boneMass.value) {
        const BoneMassText = 'Masa osea' + ' - ' + bodyData.boneMass.value + ' kg' + ' - ' + bodyData.boneMass.text;
        let BoneMassChart = new Chart1D('BoneMassChart', BoneMassText, bodyData.boneMass.scale, bodyData.boneMass.colorArray);
        BoneMassChart.show(bodyData.boneMass.value, bodyData.boneMass.text);
        document.getElementById('BoneMassChartSummary').style.color = bodyData.boneMass.color;
    }

    if (bodyData.waterRate.value) {
        const WaterRateText = 'Agua' + ' - ' + bodyData.waterRate.value + '%' + ' - ' + bodyData.waterRate.text;
        let WaterRateChart = new Chart1D('WaterChart', WaterRateText, bodyData.waterRate.scale, bodyData.waterRate.colorArray);
        WaterRateChart.show(bodyData.waterRate.value, bodyData.waterRate.text);
        document.getElementById('WaterChartSummary').style.color = bodyData.waterRate.color;

    }

    if (bodyData.BMR.value) {
        const BMRText = 'Metabolismo basal' + ' - ' + bodyData.BMR.value + ' kcal' + ' - ' + bodyData.BMR.text;
        let BMRChart = new Chart1D('BMRChart', BMRText, bodyData.BMR.scale, bodyData.BMR.colorArray);
        BMRChart.show(bodyData.BMR.value, bodyData.BMR.text);
        document.getElementById('BMRChartSummary').style.color = bodyData.BMR.color;
    }

    if (bodyData.bodyFat.value) {
        const bodyFatText = 'Grasa corporal' + ' - ' + bodyData.bodyFat.value + '%' + ' - ' + bodyData.bodyFat.text;
        let bodyFatChart = new Chart1D('FatChart', bodyFatText, bodyData.bodyFat.scale, bodyData.bodyFat.colorArray);
        bodyFatChart.show(bodyData.bodyFat.value, bodyData.bodyFat.text);
        document.getElementById('FatChartSummary').style.color = bodyData.bodyFat.color;
    } else {

        document.getElementById('FatChartSummary').style.color = color.white;
    }

    if (bodyData.visceralFat.value) {
        const visceralFatext = 'Grasa visceral' + ' - ' + bodyData.visceralFat.value + '%' + ' - ' + bodyData.visceralFat.text;
        let visceralFatChart = new Chart1D('VisceralFatChart', visceralFatext, bodyData.visceralFat.scale, bodyData.visceralFat.colorArray);
        visceralFatChart.show(bodyData.visceralFat.value, bodyData.visceralFat.text);
        document.getElementById('VisceralFatChartSummary').style.color = bodyData.visceralFat.color;
    }

    if (bodyData.bodyType.value) {
        document.getElementById('bodyTypeSummary').innerHTML = bodyData.bodyType.value;
    }
}

