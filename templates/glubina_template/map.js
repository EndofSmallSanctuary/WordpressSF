const urlParams = new URLSearchParams(window.location.search);
var devsAndEvents = [];
var clts=[];



$(function(){

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
        try{ 
            if(devsAndEvents!=null&&devsAndEvents[1]!=undefined){
                clts = devsAndEvents[0];
                devsAndEvents = devsAndEvents[1];
            }

            if(devsAndEvents!=null){
                devsAndEvents.sort(function(a,b){
                    let timeA;
                    let timeB;

                    if(a.BleEvt_Time!=undefined)
                        timeA = a.BleEvt_Time
                    else 
                        timeA =a.GpsEvt_Time
                    
                    if(b.BleEvt_Time!=undefined)
                        timeB = b.BleEvt_Time
                    else 
                        timeB = b.GpsEvt_Time 
                    return timeA - timeB    
                
                })
            }

            console.log(devsAndEvents);
        } catch(e){
            console.log(e);
        }
        ymaps.ready(init);

})

function getDevinfo(deveuis, daterange) {
    let Doneresponse = [''];
    $.ajax({
        async: false,
        type: 'POST',
        url: '/wp-content/themes/astra/templates/map_template/map_control.php',
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

function drawEvtMarks(mMap){
    var squareLayout = ymaps.templateLayoutFactory.createClass('<div class="placemark_layout_container">'+'{{ properties.iconCaption }}' +'<div class="square_layout"></div></div>');
    var circleLayout = ymaps.templateLayoutFactory.createClass('<div class="placemark_layout_container"><div class="circle_layout"></div></div>');
    polylineCoordinates = []
    maxCollectionInfo={
        ind: 0,
        length: 0
    };
    placemarkCollection = new ymaps.Collection()

    if(devsAndEvents!=undefined&&devsAndEvents!=null){
        for(let i=0; i<devsAndEvents.length; i++){

            if(devsAndEvents[i].idBleEvt!=undefined){
                long = devsAndEvents[i].BleEvt_Long
                lat = devsAndEvents[i].BleEvt_Lat
                if(long!=null&&lat!==null)
                    if(i!=devsAndEvents.length-1){
                        placemarkCollection.add(new ymaps.Placemark([long, lat], {
                            balloonContent: devsAndEvents[i].BleDev_Name +' '+  moment.unix(devsAndEvents[i].BleEvt_Time/1000)
                            .format("DD.MM.YYYY HH:mm:SS.ms")+ ' №'+ devsAndEvents[i].BleEvt_NumMsg,
                        }, {
                            preset: 'islands#blueCircleDotIconWithCaption',
                            iconCaptionMaxWidth: '2450'
                        }));
                    }
                    else {
                        placemarkCollection.add(new ymaps.Placemark([long, lat], {
                            iconCaption: clts[0].CltDev_Model
                        }, {
                            preset: 'islands#redCircleDotIconWithCaption',
                            iconCaptionMaxWidth: '2450'
                        }));
                    }

                    polylineCoordinates.push([long,lat])
            }

            else {
                if(devsAndEvents[i].idGpsEvt!=undefined){
                    long = devsAndEvents[i].GpsEvt_Long
                    lat = devsAndEvents[i].GpsEvt_Lat
                    if(long!=null&&lat!==null)
                        if(i!=devsAndEvents.length-1){
                            placemarkCollection.add(new ymaps.Placemark([lat, long], {
                                iconCaption: clts[0].CltDev_Model
                            }, {
                                iconLayout: circleLayout,
                                // Описываем фигуру активной области "Прямоугольник".
                                iconShape: {
                                    type: 'Circle',
                                    // Прямоугольник описывается в виде двух точек - верхней левой и нижней правой.
                                    coordinates: [0, 0],
                                    radius: 10
                                }
                            }));
                        } else {
                            placemarkCollection.add(new ymaps.Placemark([lat, long], {
                                iconCaption: clts[0].CltDev_Model
                            }, {
                                iconLayout: squareLayout,
                                // Описываем фигуру активной области "Прямоугольник".
                                iconShape: {
                                    type: 'Rectangle',
                                    // Прямоугольник описывается в виде двух точек - верхней левой и нижней правой.
                                    coordinates: [
                                        [-25, -25], [25, 25]
                                    ]
                                }
                            }));
                        }
    
                        polylineCoordinates.push([lat,long])
                }
            }


        };

        var myPolyline = new ymaps.Polyline(polylineCoordinates,
            {
            }, {
                draggable: false,
                strokeColor: INBETWEENSOLID,
                strokeWidth: 3,
                // Первой цифрой задаем длину штриха. Второй — длину разрыва.
            });
        mMap.geoObjects
        .add(placemarkCollection)
        .add(myPolyline)
    }
    
}



function init(){
    mMap = new ymaps.Map("map", {
        center: [47.220,39.72],
        zoom: 10,
        type: 'yandex#hybrid'
    });

    if(devsAndEvents[0]!=undefined&&devsAndEvents[0]!=null){
        drawEvtMarks(mMap)
    }
}
