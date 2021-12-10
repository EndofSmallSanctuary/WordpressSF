const urlParams = new URLSearchParams(window.location.search);
var devsAndEvents = [];
var clts=[];

/*
    Структура карты 
    devsAndEvents = устройства
    devsAndEvents[i][0] = инфа о клиенте
    devsAndEvents[i][1] = события бле и дев клиента
    devsAndEvents[i][1][0] = события бле
    devsAndEvents[i][1][1] = события gps
*/


$(function(){



    if(wpuser_id != 0 && wpuser_cltDevs != ''){

        let sharedTimeline = localStorage.getItem('timeline')
    
        //Ели содержит айди
        if (urlParams.has(param_required_EUI)) {
            //Если содержит дату
            if (urlParams.has(param_required_T)) {
                tParamValToStorage()
                devsAndEvents = getDevinfo(urlParams.get(param_required_EUI), buildTimeInteval(urlParams.get(param_required_T)), wpuser_cltDevs, wpuser_bleDevs);
            } else if(sharedTimeline!=null){
                devsAndEvents = getDevinfo(urlParams.get(param_required_EUI), buildTimeInteval(sharedTimeline), wpuser_cltDevs, wpuser_bleDevs);
            }
            else {
                devsAndEvents = getDevinfo(urlParams.get(param_required_EUI),undefined,wpuser_cltDevs,wpuser_bleDevs);
            }
            //Если не содержит айдишники
        } else {
            if (urlParams.has(param_required_T)) {
                //*
                tParamValToStorage()
                devsAndEvents = getDevinfo(undefined, buildTimeInteval(urlParams.get(param_required_T)),wpuser_cltDevs,wpuser_bleDevs);
            }
             else if(sharedTimeline!=null){
                devsAndEvents = getDevinfo(undefined, buildTimeInteval(sharedTimeline),wpuser_cltDevs,wpuser_bleDevs);
            }
             else {
                devsAndEvents = getDevinfo(undefined,undefined,wpuser_cltDevs,wpuser_bleDevs);
            }
        }
    } else {
        if(urlParams.has('mobile')&&urlParams.get('mobile')=='heavensnight'){
            let cltid = 0;
            cltid = urlParams.get('idCltDev')
            let devs = urlParams.get('bleDevs');
            devsAndEvents = getDevinfo(undefined,undefined,cltid,devs)
        }
    }

        ymaps.ready(init);

})

function getClients(cltfilter){
    let Doneresponse = [''];
    $.ajax({
        async: false,
        type: 'POST',
        url: '/wp-content/themes/astra/templates/map_template/map_control.php',
        data: {
            action: 'clients',
            cltfilter:cltfilter
        },
        success: function (response) {
            Doneresponse = jQuery.parseJSON(response);
        }
    });
    return Doneresponse;
}

function getDevinfo(deveuis, daterange, cltfilter, blefilter) {
    let Doneresponse = [''];
    $.ajax({
        async: false,
        type: 'POST',
        url: '/wp-content/themes/astra/templates/map_template/map_control.php',
        data: {
            action: 'devs',
            devs: deveuis,
            cltfilter:cltfilter,
            blefilter:blefilter,
            date_range: daterange
        },
        success: function (response) {
            Doneresponse = jQuery.parseJSON(response);
        }
    });
    return Doneresponse;
}

function getImagePick(messageId){
    let image = '';
    $.ajax({
        async: false,
        type: 'POST',
        url: '/wp-content/themes/astra/templates/map_template/map_control.php',
        data: {
            action: 'img',
            msgId: messageId
        },
        success: function (response) {
            image = jQuery.parseJSON(response);
        }
    });
    return image;
}


function drawMsgMarks(mMap,msgEvts,cltDev){
    var placemarkCollection = new ymaps.Collection()

    for(let i=0; i<msgEvts.length; i++){
        long = msgEvts[i].message_Long
        lat = msgEvts[i].message_Lat
        alt = msgEvts[i].message_Alt

        if(long == null || lat == null) continue;
        if(long == 0 || lat == 0) continue;
    

      let messagePlacemark = new ymaps.Placemark([lat,long],{
        },{
            // balloonPanelMaxMapArea: 0,
            openEmptyBalloon: true,
            preset: 'islands#bluePostIcon',
        })

        messagePlacemark.events.add('balloonopen',function(e){

            switch(msgEvts[i].message_image){

                case 0:
                    messagePlacemark.properties.set('balloonContent',
                    `
                    <div class = message_holder>
                        <div class = mesasge_info_holder>
                            <img class = message_info_image src = https://i.imgur.com/fHqHurW.png'> </img>
                            <p class = message_info> ${moment.unix(msgEvts[i].message_Time/1000).format("DD.MM.YYYY HH:mm:ss")} </p>
                        </div> 

                        <div class = mesasge_info_holder>
                            <img class = message_info_image src = https://i.imgur.com/VZeJamK.png'> </img>
                            <p class = message_info> ${cltDev.company+ ", "+ cltDev.username + ", "+cltDev.brand+", "+cltDev.model+", "+cltDev.phone} </p>
                        </div>                         
                        
                        <div class = mesasge_info_holder>
                            <img class = message_info_image src = https://i.imgur.com/JY2vhMc.png'> </img>
                            <p class = message_info> ${msgEvts[i].message_Lat+", "+msgEvts[i].message_Long+", "+msgEvts[i].message_Alt} </p>
                        </div>                            

                        <p class = message_text> ${msgEvts[i].message_Text}</p>
                    </div>
                    `);
                break

                case 1:
                    messagePlacemark.properties.set('balloonContent', "Идет загрузка данных...");
                    ib64 = getImagePick(msgEvts[i].idMessage)
                    messagePlacemark.properties.set('balloonContent',
                    `
                    <div class = message_holder> 

                        <div class = mesasge_info_holder>
                            <img class = message_info_image src = https://i.imgur.com/fHqHurW.png'> </img>
                            <p class = message_info> ${moment.unix(msgEvts[i].message_Time / 1000).format("DD.MM.YYYY HH:mm:ss")} </p>
                        </div> 

                        <div class = mesasge_info_holder>
                            <img class = message_info_image src = https://i.imgur.com/VZeJamK.png'> </img>
                            <p class = message_info> ${cltDev.company + ", " + cltDev.username + ", " + cltDev.brand + ", " + cltDev.model + ", " + cltDev.phone} </p>
                        </div>                         
                
                        <div class = mesasge_info_holder>
                            <img class = message_info_image src = https://i.imgur.com/JY2vhMc.png'> </img>
                            <p class = message_info> ${msgEvts[i].message_Lat + ", " + msgEvts[i].message_Long + ", " + msgEvts[i].message_Alt} </p>
                        </div>                            

                        <p class = message_text> ${msgEvts[i].message_Text}</p>
                        
                        <img class=message_image id = msg_pic></img>
                    </div>
                    `);
                    $('#msg_pic').attr('src',`data:image/jpeg;base64,${ib64.message_Image}`)

                break
            }
        })

        placemarkCollection.add(messagePlacemark)
    }

    mMap.geoObjects
    .add(placemarkCollection)
}


function drawEvtMarks(mMap,bleEvts){

    LIMITSEPARATOR = 1;

    var placemarkCollection = new ymaps.Collection()
    var circleLayout = ymaps.templateLayoutFactory.createClass('<div class="placemark_layout_container"><div class="bluecircle_layout"></div></div>')

    // if(bleEvts.length > 500) LIMITSEPARATOR = 10;
    // if(bleEvts.length > 100) LIMITSEPARATOR = 20;
    // if(bleEvts.length > 10000) LIMITSEPARATOR = 50;

    for (let i =0; i<bleEvts.length; i++){
        long = bleEvts[i].BleEvt_Long
        lat = bleEvts[i].BleEvt_Lat
		alt = bleEvts[i].BleEvt_Alt
        
        
       if(long == null || lat == null) continue;
       if(long == 0 || lat == 0) continue;



                        placemarkCollection.add(new ymaps.Placemark([long, lat], {
                            balloonContent:

                            `
                    <div class = message_holder> 

                        <div class = mesasge_info_holder>
                            <img class = message_info_image src = https://i.imgur.com/fHqHurW.png'> </img>
                            <p class = message_info> ${moment.unix(bleEvts[i].BleEvt_Time/1000).format("DD.MM.YYYY HH:mm:ss")} </p>
                        </div> 

                        <div class = mesasge_info_holder>
                            <img class = message_info_image src = https://i.imgur.com/KjZQCiR.png'> </img>
                            <p class = message_info> ${bleEvts[i].idBleDev+", "+bleEvts[i].BleDev_Name+", "+bleEvts[i].BleDev_SerialNumber} </p>
                        </div>

                        <div class = mesasge_info_holder>
                            <img class = message_info_image src = https://i.imgur.com/iB74kqe.png'> </img>
                            <p class = message_info> ${"№: "+bleEvts[i].BleEvt_NumMsg} </p>
                         </div>
                        
                        <div class = mesasge_info_holder>
                                <img class = message_info_image src = https://i.imgur.com/JY2vhMc.png'> </img>
                                <p class = message_info> ${lat + ", " + long + ", " + alt} </p>
                        </div>   
                    </div>`
                            
                            // '<b>' + 'Устройство: '+bleEvts[i].BleDev_Name + '</b> </br>'
                            //               + '<b>' + 'Время: '+moment.unix(bleEvts[i].BleEvt_Time/1000).format("DD.MM.YYYY HH:mm:ss") + '</b> </br>'
                            //               + '<b>' + 'Сообщение: '+ '№'+ bleEvts[i].BleEvt_NumMsg + '</b> </br>'
                            //               + '<b>' + 'Координаты: lat:'+lat+' '+' long: '+long+' '+'alt: '+alt+'</b></br>'
                        }, {
                            iconCaptionMaxWidth: '3450',
                            iconLayout: circleLayout,
                            iconShape: {
                                type: 'Circle',
                                coordinates: [0, 0],
                                radius: 10
                            }
                        }));
                    }
                    
   mMap.geoObjects
   .add(placemarkCollection) 
}


function drawGpsMarks(mMap,clientDev,gpsEvts){

    LIMITSEPARATOR = 1;


    var squareLayout = ymaps.templateLayoutFactory.createClass('<div class="placemark_layout_container"><div class="square_layout"></div></div>');
    var circleLayout = ymaps.templateLayoutFactory.createClass('<div class="placemark_layout_container"><div class="circle_layout"></div></div>');
    var polylineCoordinates = []
    var placemarkCollection = new ymaps.Collection()

    if(gpsEvts.length > 50) LIMITSEPARATOR = 10;
    if(gpsEvts.length > 500) LIMITSEPARATOR = 30;
    if(gpsEvts.length > 100) LIMITSEPARATOR = 50;
    if(gpsEvts.length > 10000) LIMITSEPARATOR = 100;
    
    for(let i=0;i<gpsEvts.length;i++){
        long = gpsEvts[i].GpsEvt_Long
        lat = gpsEvts[i].GpsEvt_Lat
		alt = gpsEvts[i].GpsEvt_Alt
        
        if(long == null || lat == null) continue;
        if(long == 0 || lat == 0) continue;

        if(i!=gpsEvts.length-1&&i%LIMITSEPARATOR == 0){
            placemarkCollection.add(new ymaps.Placemark([lat, long], {
                balloonContentBody: `
                <div class = message_holder> 
 
                <div class = mesasge_info_holder>
                    <img class = message_info_image src = https://i.imgur.com/fHqHurW.png'> </img>
                    <p class = message_info> ${moment.unix(gpsEvts[i].GpsEvt_Time/1000).format("DD.MM.YYYY HH:mm:ss")} </p>
                </div> 
 
                <div class = mesasge_info_holder>
                    <img class = message_info_image src = https://i.imgur.com/VZeJamK.png'> </img>
                    <p class = message_info> ${clientDev.id +", "+ clientDev.company + ", " + clientDev.username + ", " + clientDev.brand + ", " + clientDev.model + ", " + clientDev.phone} </p>
                </div>
                
                <div class = mesasge_info_holder>
                     <img class = message_info_image src = https://i.imgur.com/JY2vhMc.png'> </img>
                     <p class = message_info> ${lat + ", " + long + ", " + alt} </p>
                </div>   
            </div>`
            }, {
				iconCaptionMaxWidth: '3450',
                iconLayout: circleLayout,
                iconShape: {
                    type: 'Circle',
                    coordinates: [0, 0],
                    radius: 10
                }
            }));
        } else if(i==gpsEvts.length-1) {
            placemarkCollection.add(new ymaps.Placemark([lat, long], {
               balloonContent: `
               <div class = message_holder> 

               <div class = mesasge_info_holder>
                   <img class = message_info_image src = https://i.imgur.com/fHqHurW.png'> </img>
                   <p class = message_info> ${moment.unix(gpsEvts[i].GpsEvt_Time/1000).format("DD.MM.YYYY HH:mm:ss")} </p>
               </div> 

               <div class = mesasge_info_holder>
                   <img class = message_info_image src = https://i.imgur.com/VZeJamK.png'> </img>
                   <p class = message_info> ${clientDev.id +", "+ clientDev.company + ", " + clientDev.username + ", " + clientDev.brand + ", " + clientDev.model + ", " + clientDev.phone} </p>
               </div>
               
               <div class = mesasge_info_holder>
                    <img class = message_info_image src = https://i.imgur.com/JY2vhMc.png'> </img>
                    <p class = message_info> ${lat + ", " + long + ", " + alt} </p>
               </div>   
           </div>`

            }, {
                iconLayout: squareLayout,
                iconShape: {
                    type: 'Rectangle',
                    coordinates: [
                        [-25, -25], [25, 25]
                    ]
                }
            }));
        }

        polylineCoordinates.push([lat,long])
    }

        var myPolyline = new ymaps.Polyline(polylineCoordinates,
            {
            }, {
                draggable: false,
                strokeColor: generateRandomColor(),
                strokeWidth: 3,
            });

            mMap.geoObjects
            .add(placemarkCollection)
            .add(myPolyline)
}


function init(){

    let unbounded = false;

    if(urlParams.has("lat")&&urlParams.has("long")&&urlParams.has('z')&&(urlParams.has('type'))){
        let lat = urlParams.get('lat')
        let long = urlParams.get('long')
        let zoom = urlParams.get('z')
        let type = urlParams.get('type')
        switch(type){
            case 'sat': 
                type = 'yandex#satellite'
                break
            case 'hyb':
                type = 'yandex#hybrid'
                break
            case 'map':
                type = 'yandex#map'
                break
        }
        unbounded = true;
        mMap = new ymaps.Map("map", {
            center: [lat,long],
            zoom: zoom,
            type: type
        });
    }
    else {
        mMap = new ymaps.Map("map", {
            center: [47.220,39.72],
            zoom: 10,
            type: 'yandex#hybrid'
        });
    }

    if(devsAndEvents!=undefined&&devsAndEvents!=null){  
        try{
         var dates = findMinMaxDate()
         datepicker_from.datetimepicker({value: dates[0]})
         datepicker_to.datetimepicker({value: dates[1]})
        } catch (error){
            console.log(error)
            console.log('нет данных')
        }
        
      
        for(let i =0; i<devsAndEvents.length; i++){
            if(devsAndEvents[i][1][1]!=null&&devsAndEvents[i][1][1].length>0)
                drawGpsMarks(mMap,devsAndEvents[i][0],devsAndEvents[i][1][1])

            if(devsAndEvents[i][1][1]!=null&&devsAndEvents[i][1][0].length>0) 
                drawEvtMarks(mMap,devsAndEvents[i][1][0])

            if(devsAndEvents[i][1][2]!=null&&devsAndEvents[i][1][2].length>0)
                drawMsgMarks(mMap,devsAndEvents[i][1][2],devsAndEvents[i][0])
            
        }
    }


    mMap.events.add('typechange', function (e) {
        if ('URLSearchParams' in window) {
            var searchParams = new URLSearchParams(window.location.search)
            searchParams.set('type',e.originalEvent.map.getType().split("#")[1].substr(0,3))
            var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
            history.pushState(null, '', newRelativePathQuery);
        }

     });


     prepareCltCheckBoxs(getClients(wpuser_cltDevs),devsAndEvents)
     dpickerValToParam()

    mMap.events.add('actionend', function (e) {

        if ('URLSearchParams' in window) {
            var searchParams = new URLSearchParams(window.location.search)
            searchParams.set('lat', e.originalEvent.map.getCenter()[0]);
            searchParams.set('long', e.originalEvent.map.getCenter()[1]);
            searchParams.set('z', e.originalEvent.map.getZoom());
            searchParams.set('type',e.originalEvent.map.getType().split("#")[1].substr(0,3))
            var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
            history.pushState(null, '', newRelativePathQuery);
        }
     });


    if(mMap.geoObjects.getBounds()!=null&&!unbounded){
        mMap.setBounds(mMap.geoObjects.getBounds());
        //Yandex максимальный зум
        if(mMap.getZoom() > 20) 
            mMap.setZoom(20)
        mMap.setZoom(mMap.getZoom()-0.5); 
    }



    //Для мобильной версии подкинул сажи
    if(urlParams.has('mobile')&&urlParams.get('mobile')=='heavensnight'){
        mMap.container.enterFullscreen();
    }


    function findMinMaxDate(){
        let dates = [0,0]
        for(let i =0; i<devsAndEvents.length; i++){
            if(devsAndEvents[i][1][1]!=undefined
                && devsAndEvents[i][1][1].length>0){    
                dates[0] = devsAndEvents[i][1][1][0].GpsEvt_Time
                dates[1] = devsAndEvents[i][1][1][0].GpsEvt_Time
                break;
            }

        }
       for(let i =0; i<devsAndEvents.length; i++){
        for (let j=0; j<devsAndEvents[i][1][1].length; j++){
            let time = devsAndEvents[i][1][1][j].GpsEvt_Time
            if(time<dates[0]) dates[0] = time
            if(time>dates[1]) dates[1] = time
        }
       }
       dates[0] = new Date(dates[0]/1)
       dates[1] = new Date(dates[1]/1)
       return dates
    }

}