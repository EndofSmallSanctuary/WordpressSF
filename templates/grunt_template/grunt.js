
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
    if (urlParams.has(param_required_EUI)) {
        //Если содержит дату
        if (urlParams.has(param_required_T)) {
            devsAndEvents = getDevinfo(urlParams.get(param_required_EUI), buildTimeInteval(urlParams.get(param_required_T)));
        } else {
            devsAndEvents = getDevinfo(urlParams.get(param_required_EUI));
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


        //Создание таблицы
        //Создание управление чартом
        let container = document.getElementById('grunt_chart_configuration');
        let stationsList = document.createElement('p');
        stationsList.className = 'grunt_chart_p';
        stationsList.innerHTML = 'Доступные станции';
        container.appendChild(stationsList);


        let selectList = document.createElement('select');
        selectList.id = 'chart_device_select';
        selectList.onchange = function(){


            charts = Highcharts.charts;

            for(let i=0;i<charts.length;i++){
                let series_len = charts[i].series.length;
                for (let j = 0; j < series_len; j++) {
                    charts[i].series[0].remove(false);
                }

                fillChart(charts[i],findPosMatch(this.value),i);
            }



        };
        container.appendChild(selectList);
        for (let i = 0; i < devsAndEvents.length; i++) {
            if(i>0&&devsAndEvents[i].deveui==devsAndEvents[i-1].deveui)
            continue;
            let option = document.createElement('option');
            option.value = devsAndEvents[i].deveui;
            option.text = devsAndEvents[i].deveui;
            selectList.appendChild(option);
        }
        createAllCharts(devsAndEvents[0].deveui);

    }

});


function getDevinfo(deveuis, daterange) {
    let Doneresponse = [''];
    $.ajax({
        async: false,
        type: 'POST',
        url: '/wp-content/themes/astra/templates/grunt_template/grunt_control.php',
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
    // //События, распихать по столбцам
    if (devsAndEvents != null && devsAndEvents.length > 0) {
        grid_columns = [
            'Идентификатор', 'Тип устройства', 'Время',
            'Вольтаж батареи', 'Частота', 'ОСШ', 'Мощность на входе', { name: 'Измерения', width: '50%' }];
        for (let i = 0; i < devsAndEvents.length; i++) {
            let event = [];
            event[0] = devsAndEvents[i].deveui;
            event[1] = devsAndEvents[i].device_type;
            event[2] = devsAndEvents[i].time1;
            event[3] = devsAndEvents[i].core_voltage;
            event[4] = devsAndEvents[i].freq;
            event[5] = devsAndEvents[i].lsnr
            event[6] = devsAndEvents[i].rssi
            if (devsAndEvents[i].device_type == 1)
                devsAndEvents[i].sensors_count = 6; else devsAndEvents[i].sensors_count = 9;
            event[7] = prepareDataAndString(devsAndEvents[i]);
            dataArr.push(event);
        }

    } else {
        grid_columns = [
            'Идентификатор', 'Тип устройства', 'Время',
            'Вольтаж батареи', 'Частота', 'ОСШ', 'Мощность на входе', 'Измерения'];
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
    }).render(document.getElementById("grunt_table"));


}


function createAllCharts(deveui){

    let container = document.getElementById('grunt_chart_container');
    let createdCharts = document.getElementsByClassName('grunt_chart');
    for(let i=0;i<createdCharts.length;i++){
       container.removeChild(createdCharts[i]);
    }
    for(let i =0; i<params.length;i++){
        createSingleChart(deveui,i);
    }
}

function createSingleChart(deveui,index) {

    let container = document.getElementById('grunt_chart_container');
    let chart_holder = document.createElement('div');
    chart_holder.id = 'grunt_chart_'+index
    chart_holder.className = 'grunt_chart';
    container.appendChild(chart_holder);

    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'grunt_chart_'+index,
            type: 'spline',
            borderWidth: 1,
            borderRadius:'10px',
            borderColor:'#333',
            zoomType: 'xy',
        },
        title: {
            floating: true,
            text:  params[index],
            align: 'center',
            y: +20
        },
        plotOptions: {
            series: {
				turboThreshold:50000,
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
            xDateFormat: '%e.%m.%Y. %H:%M:%S', // Наш формат даты
            headerFormat: '<span style="font-size: 14px">{point.key}</span><br/>'

        }, xAxis: {
            type: 'datetime',
            tickInterval: 3 * 60 * 60 * 1000
        },
        yAxis: [
            {
                offset: 30,
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

    //   for(let i=0; i<devsAndEvents.length;i++){

    //   }

    fillChart(chart, findPosMatch(deveui),index);
}

function fillChart(chart, matchingIDS,index) {
    for(let i = 0;i<devsAndEvents[matchingIDS[0]].sensors_count;i++){
        let temp_data = [];
        matchingIDS.forEach(element => {
			
			
			if(devsAndEvents[element].data[i][index]!='Нет данных'){
				temp_data.push({
					x:new Date(devsAndEvents[element].time1).getTime() + GMT_OFFSET,
					y:devsAndEvents[element].data[i][index]
				});
			}
        });
		
		
      



        let template_series = {
            name: sensors_range[i],
            type: 'spline',
            yAxis: 0,
            data: temp_data,
            // tooltip: {
            //     valueSuffix: '°C'
            // },
            color: color_range[i],
            zIndex: 2,
            lineWidth: 3
        }



    chart.addSeries(template_series, false);
    chart.redraw();
    }
}

function prepareData() {
    let combinedData = [];
    // combinedData.push({
    //     x:new Date(devsAndEvents[0].time1).getTime()+10800000,
    //     y:
    // });

    return combinedData;
}




//Конвертация данных в вид данных


function prepareDataAndString(dev) {
    var valObj = [];
    let ready_value_string = '';

    if (dev.data.length / 2 < dev.sensors_count * 4 * 4 || dev.data.length % 8 != 0) {
        return ('Недостаточный размер полученных данных');
    } else {

        for (let i = 0; i < dev.sensors_count; i++) {
            let data_part = dev.data.substr(i * 4 * 8, 4 * 8);
            let valNode = [];
            for (let i = 0; i < data_part.length; i += 8) {
                let lEndpart = data_part.substr(i, 8);
                //Условие поправить
                if (lEndpart != 'FFFFFFFF' && lEndpart != '0000C07F') {
                    valNode.push(hexToFloat(flipHexString('0x' + data_part.substr(i, 8), 8).toLowerCase()));
                } else {
                    valNode.push('Нет данных');
                }
                // console.log(hexToFloat(flipHexString(data.substr(i,i+8))))
            }


            valObj.push(valNode);
            //Моделируем строчку 
            ready_value_string +=
                sensors_range[i] + ' : '
                //Температура
                + 't=' + valNode[0] + ' °C, '
                //Re
                + 'Re=' + valNode[1] + ' Ом, '
                //im
                + 'Im=' + valNode[2] + ' Ом, '
                //abs
                + 'Abs=' + valNode[3] + ' Ом; '

            if (i < dev.sensors_count - 1) {
                ready_value_string += '\n';
            }
        }

        //Избавляемся от хексов в дате...
        dev.data = valObj;
    }
    return ready_value_string;
}


function flipHexString(hexValue, hexDigits) {
    var h = hexValue.substr(0, 2);
    for (var i = 0; i < hexDigits; ++i) {
        h += hexValue.substr(2 + (hexDigits - 1 - i) * 2, 2);
    }
    return h;
}


function hexToFloat(hex) {
    var s = hex >> 31 ? -1 : 1;
    var e = (hex >> 23) & 0xFF;
    return Math.round(s * (hex & 0x7fffff | 0x800000) * 1.0 / Math.pow(2, 23) * Math.pow(2, (e - 127)) * 10) / 10;
}

function findPosMatch(deveui){
    let ids = [];
    for(i=0;i<devsAndEvents.length;i++){
        if(devsAndEvents[i].deveui == deveui){
            ids.push(i);
        }
    }
    return ids;
}