
Highcharts.setOptions({
    global:{
        useUTC: true   
  },
      lang: { 
          loading: 'Загрузка...', 
          months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
          weekdays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
          shortMonths: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек']
      }
  }); 




const urlParams = new URLSearchParams(window.location.search);
var devsAndEvents = [];

$(function () {

    //Ели содержит айди
    if (urlParams.has(param_required_UI)) {
        //Если содержит дату
        if (urlParams.has(param_required_T)) {
            devsAndEvents = getDevinfo(urlParams.get(param_required_UI), buildTimeInteval(urlParams.get(param_required_T)));
        } else {
            devsAndEvents = getDevinfo(urlParams.get(param_required_UI));
        }
        //Если не содержит айдишники
    } else {
        if (urlParams.has(param_required_T)) {
            devsAndEvents = getDevinfo(undefined, buildTimeInteval(urlParams.get(param_required_T)));
        } else {
            devsAndEvents = getDevinfo();
        }
    }

    createTable();

    if (devsAndEvents != null && devsAndEvents.length > 0) {


        // //Создание таблицы
        // //Создание управление чартом

        prepareChart();

        document.getElementById('glubina_chart_avaliable').style.display='block'
        let container = document.getElementById('glubina_chart_configuration');
        mod_ids = retrieveMods();
        for(let i=0; i<mod_ids.length;i++){
            container.appendChild(buildCheckBoxType(mod_ids[i],i));
            if(i<=5)
            fillChart(mod_ids[i], findPosMatch(mod_ids[i]));
        }
        
    } else {
    } 
});


function getDevinfo(deveuis, daterange) {
    let Doneresponse = [''];
    $.ajax({
        async: false,
        type: 'POST',
        url: '/wp-content/themes/astra/templates/glubina_template/glubina_control.php',
        data: {
            action: 'devs',
            devs: deveuis,
            date_range: daterange
        },
        success: function (response) {
            Doneresponse = jQuery.parseJSON(response);
        }
    });
    return Doneresponse;
}


function createTable() {


    let grid_columns;
    let dataArr = [];
    grid_columns = [
        'Дата, время', 'Идентификатор датчика', 'Адрес сенсора',
        'Калибровка', 'Траспортное положение', 'Период калибровки', 'Требуемая глубина', 'Допустимое отклонение',
        'Напряжение батареи','Последовательные значения глубины','Количество значений accel_x_data','Значения accel_x_data',
        'Количество значений accel_y_data','Значения accel_y_data','Количество значений accel_z_data','Значения accel_z_data',
        'Количество значений gyro_x_data','Значения gyro_x_data', 'Количество значений gyro_y_data','Значения gyro_y_data',
        'Количество значений gyro_z_data','Значения gyro_z_data', 'Количество значений temp_count','Значения temp_data',];
    // //События, распихать по столбцам
    if (devsAndEvents != null && devsAndEvents.length > 0) {
        for (let i = 0; i < devsAndEvents.length; i++) {
            let event = [];
            event[0] = moment.unix(devsAndEvents[i].mod_time).format("DD.MM.YYYY HH:mm:ss");
            event[1] = devsAndEvents[i].mod_id;
            event[2] = devsAndEvents[i].sens_addr;
            event[3] = devsAndEvents[i].calib_depth;
            event[4] = devsAndEvents[i].trans_pos;
            event[5] = devsAndEvents[i].calib_period;
            event[6] = devsAndEvents[i].required_depth;
            event[7] = devsAndEvents[i].deviation_depth;
            event[8] = devsAndEvents[i].mod_vbat;
            event[9] = prepareDepthString(i);

            event[10] = devsAndEvents[i].accel_x_count;
            event[11] = prepareDataString('accel_x',devsAndEvents[i].accel_x_data);
            event[12] = devsAndEvents[i].accel_y_count;
            event[13] = prepareDataString('accel_y',devsAndEvents[i].accel_y_data);
            event[14] = devsAndEvents[i].accel_z_count;
            event[15] = prepareDataString('accel_z',devsAndEvents[i].accel_z_data);

            event[16] = devsAndEvents[i].gyro_x_count;
            event[17] = prepareDataString('gyro_x',devsAndEvents[i].gyro_x_data);
            event[18] = devsAndEvents[i].gyro_y_count;
            event[19] = prepareDataString('gyro_y',devsAndEvents[i].gyro_y_data);
            event[20] = devsAndEvents[i].gyro_z_count;
            event[21] = prepareDataString('gyro_z',devsAndEvents[i].gyro_z_data);


            event[22] = devsAndEvents[i].temp_count;
            event[23] = prepareDataString('temp',devsAndEvents[i].temp_data);
            // event[1] = devsAndEvents[i].device_type;
            // event[2] = devsAndEvents[i].time1;
            // event[3] = devsAndEvents[i].core_voltage;
            // event[4] = devsAndEvents[i].freq;
            // event[5] = devsAndEvents[i].lsnr
            // event[6] = devsAndEvents[i].rssi
            // if (devsAndEvents[i].device_type == 1)
            //     devsAndEvents[i].sensors_count = 6; else devsAndEvents[i].sensors_count = 9;
            // event[7] = prepareDataAndString(devsAndEvents[i]);
            dataArr.push(event);
        }

    }



    new gridjs.Grid({
        columns: grid_columns,
        sort: true,
        pagination: {
            enabled: true,
            limit: 5,
            summary: true
        },
        data: dataArr,
        style: {
            table: {
                'font-size': '12px',
                'table-layout': 'auto'
            },
            th: {
            },
            td: {
                'white-space': 'pre'
            },
        }
    }).render(document.getElementById("glubina_table"));


}

function prepareChart(){
    let container = document.getElementById('glubina_chart_container');
    let chart_holder = document.createElement('div');
    chart_holder.id = 'glubina_chart'
    chart_holder.className = 'glubina_chart';
    container.appendChild(chart_holder);

    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'glubina_chart',
            type: 'spline',
            borderWidth: 1,
            borderRadius:'10px',
            borderColor:'#333',
            zoomType: 'xy',
        },
        title: {
            floating: true,
            text:  'Глубина',
            align: 'center',
            y: +20
        },
        plotOptions: {
            series: {
				turboThreshold:50000000,
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
                lineWidth: 2,
                marker: {
                    enabled: false
                }
            },
            area: {
                marker: {
                    enabled: false
                }
            }
        },
        exporting: {
            enabled: false
        },
        legend: {
            align: 'center',
            verticalAlign: 'top',
            y:+40,
          
        },
        //всплывающая подсказака
        tooltip: {
            crosshairs: true,
            shared: true,
            xDateFormat: '%e.%m.%Y. %H:%M:%S.%L', // Наш формат даты
            headerFormat: '<span style="font-size: 14px">{point.key}</span><br/>'

        }, xAxis: {
            type: 'datetime',
            tickInterval:  60 * 1000
        },
        yAxis: [
            {
                offset: 30,
                min:0,
                max:200,
                labels: {
                    format: '{value}',
                    style: {
                        //color: 'gray'
                    }
                },
                title: {
                    text: 'Значения',
                    margin: 10
                },
            }
        ],
    });

}

function fillChart(mod_id, matchingIDS) {

    temp_data=[]
    last_point_time = 0;

        matchingIDS.forEach(element => {

            //Проверка на разрыв

            moment_time = devsAndEvents[element]['mod_time']*1000+GMT_OFFSET-900; //Секунда назад от текущей точки
            if(temp_data.length>0){
                last_point_time = temp_data[temp_data.length-1].x
            }
            
            if(moment_time+900==last_point_time){}
            else{
          
            if((temp_data.length>0)&&(moment_time+900-last_point_time> 5 * 1000)){
                temp_data.push({
                    x:last_point_time,
                    y:null
                })
            }
            
                for(let i=1; i<=10; i++){

                    currentDepth = 'depth_'+i;

                    if ((devsAndEvents[element][currentDepth]!=undefined)&&(devsAndEvents[element][currentDepth]!=null)&&(devsAndEvents[element][currentDepth]<LIMIT_DEPTHVAL)){
                        temp_data.push({
                            x:moment_time,
                            y:devsAndEvents[element][currentDepth]
                        })
                    }
                    
                    moment_time+=100
                    
                }	
            }		
        });

        let template_series = {
            name: 'Значения глубины '+mod_id+' датчика',
            type: 'spline',
            id: parseInt(mod_id),
            yAxis: 0,
            data: temp_data,
            plotOptions:{
                pointInterval:5
            },
            // tooltip: {
            //     valueSuffix: '°C'
            // },
            color: generateRandomColor(),
            zIndex: 2,
            lineWidth: 3
        }



    chart.addSeries(template_series, false);
    chart.redraw();
}


function prepareDepthString(index){
    obj = devsAndEvents[index];
    mString = ''
    for(let i=1;i<=10;i++){
        mString+= 'depth'+i+" : "+ obj['depth_'+i] + '\n'
    }

    return mString
}

function prepareDataString(prefix,data){
   obj = data.split(' ');
   mString = ''
   for(let i=0; i<obj.length-1;i++){
      mString+=prefix+(i+1)+" : "+obj[i] + '\n'
   }
   return mString
}


function findPosMatch(mod_id){
    let ids = [];
    for(i=0;i<devsAndEvents.length;i++){
        if(devsAndEvents[i].mod_id == mod_id){
            ids.push(i);
        }
    }
    return ids;
}

function buildCheckBoxType(index,count){
   modHolder = document.createElement('div')
   modHolder.id = 'mod_holder_'+index
   modHolder.className = 'mod_holder'; 

   modTitle = document.createElement('p');
   modTitle.className = 'mod_title'
   modTitle.innerHTML = 'Датчик_'+index
   modHolder.appendChild(modTitle)

   modCheck = document.createElement('input')
   modCheck.className = 'mod_check'
   modCheck.id = 'mod_check_'+index
   modCheck.type='checkbox'

   modCheck.addEventListener("change",(event)=>{
        if(event.currentTarget.checked){
            let purifiedId = event.currentTarget.id.split('_')[2]
            fillChart(purifiedId,findPosMatch(purifiedId))
        } else {
            let purifiedId = event.currentTarget.id.split('_')[2]
            removeSeries(purifiedId)
        }
    })

   if(count<=5)
   modCheck.defaultChecked=true
//    document.getElementById('mod_check_'+index).enabled=true;

   modHolder.appendChild(modCheck)

   return modHolder
}

function retrieveMods(){
    mods = new Set();
    mods.add(devsAndEvents[0].mod_id)

    for(let i=0;i<devsAndEvents.length;i++){
        element = devsAndEvents[i];
        if(element.mod_id!=undefined&&element.mod_id!=null&&mods[mods.length-1]!=element.mod_id)
        mods.add(element.mod_id)
    }
	
	mods = Array.from(mods)
	mods.sort(function(a,b){return a - b})
    return mods
}

function removeSeries(mod_id){
    chart.get(parseInt(mod_id)).remove()
}