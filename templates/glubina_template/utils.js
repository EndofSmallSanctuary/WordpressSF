function buildTimeInteval(t) {
    let tSplit = t.split('-');
    let dateFrom;
    let dateTo;
    if (tSplit[0] == null) {
        return undefined;
    } else {
        dateFrom = moment(tSplit[0], 'DD.MM.YYYY_hh:mm').unix() * 1000;
    }
    if (tSplit[1] == null) {
        dateTo = dateFrom + 24 * 60 * 60 * 1000;
    } else {
        dateTo = moment(tSplit[1], 'DD.MM.YYYY_hh:mm').unix() * 1000;
    }
    return (dateFrom + '-' + dateTo);
}


function generateRandomColor(){
    let letters = '0123456789ABCDEF';
    let color = '#'
    for (let i=0; i<6; i++){
        color+= letters[Math.floor(Math.random()*16)];
    }
    return color;
}