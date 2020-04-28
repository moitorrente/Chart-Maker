function centralMovingAverage(data, samples){
    data.reverse();
    const tempSamp = Math.floor(samples/2);
    let moveAve = [];
    for(let i = 0; i<data.length+1;i++){
        let temp = mean(data.slice(i-tempSamp, i+tempSamp+1));
        if(!isNaN(temp)){
            moveAve.push(temp);
        } else{
            //moveAve.push(data[i]);
        }
    }
    moveAve.reverse();
    return moveAve;
}

function previousMovingAverage(data, samples){
    data.reverse();
    samples = parseInt(samples);
    let moveAve = [];
    for(let i = 0; i<data.length+1;i++){
        let temp = mean(data.slice(i,i+samples));
        if(!isNaN(temp)){
            moveAve.push(temp);
        }
    }
    moveAve.reverse();
    return moveAve;
}

function weightedMovignAverage(data, samples){
    samples = parseInt(samples);
    let moveAve = [];
    for(let i = 0; i<data.length+1;i++){
        let temp = mean(data.slice(i,i+samples));
        if(!isNaN(temp)){
            moveAve.push(temp);
        }
    }
    return moveAve;
}

