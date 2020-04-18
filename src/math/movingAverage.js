function movingAverage(data, samples){
    let tempSamp = Math.floor(samples/2);
    let moveAve = [];
    for(let i = 0; i<data.length+1;i++){
        let temp = mean(data.slice(i-tempSamp, i+tempSamp+1));
        if(!isNaN(temp)){
            moveAve.push(temp);
        } else{
            moveAve.push(data[i]);
        }
    }
    return moveAve;
}

