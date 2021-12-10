
var datepicker_from
var datepicker_to
var timeInterval = null

$(function(){
    
    if(urlParams.get(param_required_T)!=null){
       timeInterval =  buildTimeInteval(urlParams.get(param_required_T))
       datepicker_from = prepareDatePicker(datepicker_from,"#datepicker_from",new Date(timeInterval.split('-')[0]/1))
       datepicker_to = prepareDatePicker(datepicker_to,"#datepicker_to",new Date(timeInterval.split('-')[1]/1))
    } else {
        datepicker_from = prepareDatePicker(datepicker_from,"#datepicker_from",new Date())
        datepicker_to = prepareDatePicker(datepicker_to,"#datepicker_to",new Date())
    }
    

})

function prepareDatePicker(hinput0,hinput1,time){


    hinput0 =  $(hinput1).datetimepicker({
        formatDate: 'd.m.Y',
        formatTime: 'H:i',
        //startDate: '21.10.2018',
        showSecond: false,
        value: time,
        step: 1,
    })
    return hinput0;
}

