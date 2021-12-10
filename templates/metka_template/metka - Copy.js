Highcharts.setOptions({
    global:{
        useUTC: false   
  },
      lang: { 
          loading: 'Загрузка...', 
          months: ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'],
          weekdays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
          shortMonths: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек']
      }
  }); 

const urlParams = new URLSearchParams(window.location.search);
var devInfo = [];
var eventInfo = [];
$(function(){
    let devsAndEvents;

    if(wpuser_bleDevs!=null&&wpuser_bleDevs!=''){

    if(urlParams.has(param_required_ID)){
        //Если содержит дату
        if(urlParams.has(param_required_T)){
            devsAndEvents =  getDevinfo(urlParams.get(param_required_ID),buildTimeInteval(urlParams.get(param_required_T)),wpuser_bleDevs);
        } else {
            devsAndEvents =  getDevinfo(urlParams.get(param_required_ID),undefined,wpuser_bleDevs);
        }
        //Если не содержит айдишники
    } else {
        if(urlParams.has(param_required_T)){
            devsAndEvents =  getDevinfo(undefined,buildTimeInteval(urlParams.get(param_required_T)),wpuser_bleDevs);
        } else {
            devsAndEvents =  getDevinfo(undefined,undefined,wpuser_bleDevs);
        }
    }

    }

    if(devsAndEvents!=null&&devsAndEvents.length>0){
            devInfo = devsAndEvents[0];
            eventInfo = devsAndEvents[1];
            if(devInfo!=null){
                //Контейнеры меток слева
                for(let i=0;i<devInfo.length;i++){
                    buildMetkaName(devInfo[i]);
            }
                //Сама тейбл
                createTable();
        }
        if(eventInfo!=null&&devInfo!=null) {
            prepareGunt();
            prepareChart();
        } else if(devsAndEvents[1]==null||devsAndEvents[1].length==0){
            document.getElementById('metka_chart_container').style.display='none';
        }
    } else {
         document.getElementById('metka_table_container').style.display='none';
         document.getElementById('metka_chart_container').style.display='none';
         let noDataInfo = document.createElement('p');
		 noDataInfo.className = 'no_data_placement' ;
         noDataInfo.innerHTML = 'Данных за запрашиваемый период не найдено'
         document.getElementById('metka_overall_container').appendChild(noDataInfo);
    }
});



function getDevinfo(ids,daterange,blefilter){
    let Doneresponse =['',''];
    $.ajax({
        async: false,
        type: 'POST',
        url: '/wp-content/themes/astra/templates/metka_template/metka_control.php',
        data: {
            action: 'devs',
            devs: ids,
            blefilter:blefilter,
            date_range: daterange
        },
        success: function (response) {
		   Doneresponse=jQuery.parseJSON(response);
        }
	});
    return Doneresponse;
}


function buildMetkaName(metka){
   let metkaContainer =  document.createElement('div');
   metkaContainer.className = 'metka_dev';

   let metkaName = document.createElement('p');
   metkaName.innerHTML = metka.BleDev_Name;
   metkaContainer.appendChild(metkaName);

   document.getElementById('metka_devs_container').appendChild(metkaContainer);
   
}

function createTable(){


    //Столбцы - названия девайсов;
    let grid_columns = [];
    grid_columns.push('Дата, время');

    for(let i=0;i<devInfo.length;i++){
        grid_columns.push(
            devInfo[i].BleDev_Name);
    }

    //События, распихать по столбцам
    let dataArr = [];

    if(eventInfo!=null){

    for(let i=0;i<eventInfo.length;i++){
        let event = [];
        let date = new Date(eventInfo[i].time);
        date = moment(date);
        date = date.format('yyyy-MM-DD hh:mm:ss.SS').split(' ');
        event.push(date[0]+'\n'+date[1]);
        for(j=0;j<grid_columns.length-1;j++){
            if(checkEventLink(j,eventInfo[i].BleEvt_BleDev)){
                event[j+1] = 
               '№: ' + eventInfo[i].num+'\n'
                +
               'RSSI: '+ eventInfo[i].rssi+'\n'
               +
               'Координаты: '+
               roundParam(eventInfo[i].lat) + ' ' + roundParam(eventInfo[i].long) + ' ' + roundParam(eventInfo[i].alt)

               // console.log(eventInfo[i].rssi);
            }
        }
     
        dataArr.push(event);
    }
}

    
    
    new gridjs.Grid({
        columns: grid_columns,
        sort:true,
        pagination:{
            enabled:true,
            limit:5,
            summary:true
        },
        data: dataArr,
        style:{
            table: {
                'font-size': '12px',
                'table-layout':'fixed'
              },
            th:{  
            },
            td:{
                'white-space':'pre'
            },
        }
      }).render(document.getElementById("metka_table"));

      
}


function prepareChart(){
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'metka_chart',    
            type: 'spline',
            borderWidth: 1,
            borderRadius:'10px',
            borderColor:'#333',
            zoomType:'xy'
        },
        // mapNavigation:{
        //      enabled:true,
        //      enableDoubleClickZoom: true,
        //      enableMouseWheelZoom: true,
        // },
        scrollbar: {
            enabled: false,
        },
        title: {
            text:null,
            floating: true,
            align: 'center',
            y: +20
        },
        plotOptions: {
            series: {
				turboThreshold:5000,
                point: {
                  events: {
                    click() {
                     if(!this.noTooltip){
                         alert('нажатие на точку чарта');
                     }
                    }
                  }
                }
              },
            spline: {
                lineWidth: 1,
                marker: {
                    enabled: false
                }
            },
            area: {
                marker: {
                    enabled: false
                }
            },
        },
        exporting: {
            enabled: false
        },
        legend: {
            enabled: true,
            align: 'center',
            verticalAlign: 'top',
          
        },
           tooltip: {


            pointFormatter:function(){

                if(!this.noTooltip){
                    return '<span style="color:' + this.color + '">\u25Cf</span> <b>'+this.h+'ч '+this.m+'м '+'</b><br/>'
                }

            }
            
        },
        xAxis: {
            type: 'datetime',
            opposite:true,
            // tickInterval: 60*60*1000,
            // min: eventInfo[0].time-60*60*1000,
            // max: eventInfo[eventInfo.length-1].time+60*60*1000,
            dateTimeLabelFormats: {
                day: '%e %B, %A',
                week: '%e. %b',
                month: '%b \'%y',
                year: '%Y'
            }
        }
        , yAxis:{
            title: { enabled:true, text: 'Общее время работы'},
            labels:{
                style:{
                    color:'#000',

                },
            },
            tickInterval: 1
        }
    });

    if(eventInfo!=null&&eventInfo.length>0)
    for(let i = 0; i<devInfo.length;i++ ){
        prepareChartData(chart,i);
    }
}

function prepareChartData(chart,index){
    let chartdata = []; 
    let inworkInMilis =0;
    let currentMSG = 0;
    let duration = 0;
    for(let i =0;i<eventInfo.length;i++){
        if(eventInfo[i].BleEvt_BleDev==devInfo[index].idBleDev){
            if(chartdata.length==0){
                inworkInMilis =  eventInfo[i].num * DEFAULT_MSG_RATE;
                let startTime;
                if(urlParams.has(param_required_T)){
                   startTime=buildTimeInteval(urlParams.get(param_required_T)).split('-')[0];
                } else {
                   startTime = moment().startOf('day');
                }

                if(eventInfo[i].time-inworkInMilis > startTime){
                        chartdata.push({
                            x:eventInfo[i].time-inworkInMilis,
                            y:0,
                            h:0,
                            m:0,
                            noTooltip:true              
                        })
                } else {
                        // chartdata.push({
                        //     x:parseInt(startTime,10),
                        //     y:0,
                        //     h:0,
                        //     m:0,
                        //     noTooltip:true
                        // })
                }

                

                duration = moment.duration(eventInfo[i].time-(eventInfo[i].time-inworkInMilis));
                chartdata.push({
                    x:eventInfo[i].time,
                    y:duration.asHours(),
                    msg:eventInfo[i].num,
                    h:Math.floor(duration.asHours()),
                    m:duration.minutes(),
                    d: duration,
                    marker:{
                        enabled:true,
                        radius:8
                    }
                })
            } else {
                let msgAddedTime = (eventInfo[i].num-currentMSG)*DEFAULT_MSG_RATE;
                duration = moment.duration(chartdata[chartdata.length-1].d + msgAddedTime);
                chartdata.push({
                    x:eventInfo[i].time,
                    y:duration.asHours(),
                    h:duration.hours(),
                    m:duration.minutes(),
                    d:duration,
                    marker:{
                        enabled:true,
                        radius:8
                    }
                })
            }
            currentMSG = eventInfo[i].num;
            }
        }


    let template_series = {
        type: 'spline',
        name:devInfo[index].BleDev_Name,
        yAxis: 0,
        data: chartdata,
        // tooltip: {
        //     valueSuffix: '°C'
        // },
        color: generateRandomColor(),
        zIndex: 2,
        lineWidth: 5
    }

    chart.addSeries(template_series, false);
    chart.redraw();
}

function prepareGunt(){

    let categories = [];
    for(let i=0; i<devInfo.length;i++){
        categories.push(devInfo[i].BleDev_Name);
    }

    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'metka_gunt',
            type: 'spline',
            borderWidth: 1,
            borderRadius:'10px',
            borderColor:'#333',
            zoomType: 'xy',
        },
        title: {
            text:null,
            floating: true,
            align: 'center',
            y: +20
        },
        plotOptions: {
            series: {
				turboThreshold:5000,
                point: {
                  events: {
                    click() {
                     if(!this.noTooltip){
                         alert('нажатие на точку ганта');
                     }
                    }
                  }
                }
              },
            spline: {
                lineWidth: 2,
                marker: {
                    enabled: false
                }
            },
            area: {
                marker: {
                    enabled: false
                }
            },
        },
        exporting: {
            enabled: false
        },
        legend: {
            enabled: false,
            align: 'center',
            verticalAlign: 'top',
            y:+40,
          
        },
        //всплывающая подсказака
        tooltip: {

            pointFormatter:function(){

                var chart = this.series.chart;
                var index = this.y;
                if(!this.noTooltip){
                    return '<span style="color:' + this.color + '">\u25Cf</span> <b>'+' № '+this.msg+'</b><br/>'
                }

            }
            
        },xAxis: {
            type: 'datetime',
            opposite:true,
            // tickInterval: 60*60*1000,
            // min: eventInfo[0].time-60*60*1000,
            // max: eventInfo[eventInfo.length-1].time+60*60*1000,
            dateTimeLabelFormats: {
                day: '%e %B, %A',
                week: '%e. %b',
                month: '%b \'%y',
                year: '%Y'
            }
        }
        , yAxis:{
            title: { enabled:false, text: 'Время работы'},
            labels:{
                style:{
                    color:'#000'
                },
            },
            categories:categories,
            Min:0,
            max:categories.length-1
        }
    });

    if(eventInfo!=null&&eventInfo.length>0)
    for(let i = 0; i<devInfo.length;i++ ){
        prepareGuntData(chart,i);
    }
}

function prepareGuntData(chart,index){
    let chartdata = []; 
    let inworkInMilis;
    let currentMSG;
    for(let i = 0; i<eventInfo.length;i++){
        if(eventInfo[i].BleEvt_BleDev==devInfo[index].idBleDev){
            if(chartdata.length==0){
                inworkInMilis =  eventInfo[i].num * DEFAULT_MSG_RATE;
                let startTime;
                if(urlParams.has(param_required_T)){
                   startTime=buildTimeInteval(urlParams.get(param_required_T)).split('-')[0];
                } else {
                   startTime = moment().startOf('day');
                }

                if(eventInfo[i].time-inworkInMilis > startTime){
                        chartdata.push({
                            x:eventInfo[i].time-inworkInMilis,
                            y:index,
                            noTooltip:true
                           
                        })
                } else {
                        chartdata.push({
                            x:parseInt(startTime,10),
                            y:index,
                            noTooltip:true
                        })
                }
                
                chartdata.push({
                    x:eventInfo[i].time,
                    y:index,
                    msg:eventInfo[i].num,
                    marker:{
                        enabled:true
                    }
                })
            }
            else {
                if(eventInfo[i].time-chartdata[chartdata.length-1].x>=DEFAULT_MSG_RATE){
                    chartdata.push({
                        x:chartdata[chartdata.length-1].x,
                        y:null
                    })
                    let msgLoss = eventInfo[i].num-currentMSG;
                    let msgTime = eventInfo[i].time-msgLoss*DEFAULT_MSG_RATE;
                    chartdata.push({
                        x:msgTime,
                        y:index,
                        noTooltip: true
                    })
                    // while(msgLoss>0){
                    //     chartdata.push({
                    //         x:msgTime,
                    //         y:index
                    //     })

                    //     msgTime+=DEFAULT_MSG_RATE;
                    //     msgLoss--;
                    // }

                    chartdata.push({
                        x:eventInfo[i].time,
                        y:index,
                        msg:eventInfo[i].num,
                        marker:{
                            enabled:true
                        }
                    })

                  
                //  chartdata =  chartdata.concat(subData.reverse());
                   
                } else {
                chartdata.push({
                    x:chartdata[chartdata.length-1].x+DEFAULT_MSG_RATE,
                    y:index,
                    msg:eventInfo[i].num,
                    marker:{
                        enabled:true
                    }
                })
                }
            }

            currentMSG = eventInfo[i].num;
        }
    }


    // for(let i =0;i<eventInfo.length;i++){
    //     if(eventInfo[i].BleEvt_BleDev==devInfo[index].idBleDev){
    //         if(chartdata.length>1&&chartdata[chartdata.length-1]!=null&&eventInfo[i].time-chartdata[chartdata.length-1].x>GUNT_TIMEOUT_INTERVAL){
    //             chartdata.push(
    //                 {
    //                     x:eventInfo[i].time,
    //                     y:null
    //                 }
    //             );
    //         }
    //             chartdata.push({
    //                 x:eventInfo[i].time,
    //                 y:index
    //             })
    //         }
    //     }


    let template_series = {
        type: 'spline',
        yAxis: 0,
        data: chartdata,
        dataLabels: {
            enabled: true,
            style:{
                fontSize: '9pt'
            },
            formatter: function() {
                
                if((this.point.index<chartdata.length-1&&chartdata[this.point.index+1].y==null)
                || (this.point.index==chartdata.length-1)
                ){
                    
                    let duration = 0;
                    let readyindex=0;
                    for(i=this.point.index;i>=0;i--){
                        if(chartdata[i].y==null){
                            break;
                        }
                        readyindex=i;
                    }
                    
                    if(readyindex==0){
                        duration = moment.duration(chartdata[1].x-(chartdata[1].x-inworkInMilis));
                    }else{
                    duration = moment.duration(chartdata[this.point.index].x-chartdata[readyindex].x);
                    }
                    return Math.floor(duration.asHours())+'ч '+duration.minutes()+'м ';
                }

                

                // if(this.x==chartdata[1].x){
                      
                //       estimatedlength = moment.duration(chartdata[1].x-(chartdata[1].x-inworkInMilis));
                //       return Math.floor(estimatedlength.asHours())+'ч '+estimatedlength.minutes()+'м ';
                // } else { 
                //     if(this.point.index>0&&chartdata[this.point.index-1].y==null){
                //         let duration = 0;
                //         let readyindex=0;
                //         for(i=this.point.index;i<chartdata.length;i++){
                //             if(chartdata[i].y==null){
                //                 readyindex = i;
                //                 break;
                //             }
                //             readyindex=i;
                //         }

                //         console.log(this.point.index);
                //         console.log(readyindex);
                //         console.log(chartdata);

                //         duration = moment.duration(chartdata[readyindex].x-chartdata[this.point.index].x);
                //         return Math.floor(duration.asHours())+'ч '+duration.minutes()+'м ';
                // //     }
                // }
                
            }
      },
        // tooltip: {
        //    formatter: function(){
        //      return 'dogs';
        //    }
        // },
        color: generateRandomColor(),
        zIndex: 2,
        lineWidth: 2
    }

    chart.addSeries(template_series, false);
    chart.redraw();
}


function checkEventLink(index,id){
    if(devInfo[index].idBleDev==id){
        return true;
    }
    return false;
}


function roundParam(param){
    return Math.round(param * 1000)/1000
}
