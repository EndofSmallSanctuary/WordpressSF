
var datepicker_from
var datepicker_to
var timeInterval = null

var datepicker_from_val = 0;
var datepicker_to_val = 0;

$(function(){
    
    if(urlParams.get(param_required_T)!=null){
       timeInterval =  buildTimeInteval(urlParams.get(param_required_T))
       datepicker_from = prepareDatePicker(datepicker_from,"#datepicker_from",new Date(timeInterval.split('-')[0]/1))
       datepicker_to = prepareDatePicker(datepicker_to,"#datepicker_to",new Date(timeInterval.split('-')[1]/1))
    } else {
        datepicker_from = prepareDatePicker(datepicker_from,"#datepicker_from",new Date())
        datepicker_to = prepareDatePicker(datepicker_to,"#datepicker_to",new Date())
    }
    
    $('#button_search').click(function(){

  
        if ('URLSearchParams' in window) {

            //Получаем требуемые параметры из строки
            var searchParams = new URLSearchParams(window.location.search)
            var bleDevsURL =  searchParams.get('idBleDev')
            var cltDevsURL =  searchParams.get('idCltDev')


            var newRelativePathQuery = window.location.pathname
            history.pushState(null, '', newRelativePathQuery)

            searchParams = new URLSearchParams(window.location.search)
            //Теперь сетапим параметры заново
            if(bleDevsURL!=null) searchParams.set('idBleDev',bleDevsURL)
            if(cltDevsURL!=null) searchParams.set('idCltDev',cltDevsURL)
            newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
            history.pushState(null, '', newRelativePathQuery)
        }

        location.reload()
    })


    // //Ny pizdets
    // window.onunload = () => {
    //     console.log('storage cleared')
    //     localStorage.clear()
    //  }

})

function tParamValToStorage(){
   var normalizedInterval =  buildTimeInteval(urlParams.get(param_required_T))
   if (normalizedInterval!=null) {
   normalizedInterval = normalizedInterval.split('-')
   normalizedInterval[0] = moment.unix(normalizedInterval[0]/1000).format("DD.MM.YYYY_HH:mm")
   normalizedInterval[1] = moment.unix(normalizedInterval[1]/1000).format("DD.MM.YYYY_HH:mm")
   normalizedInterval = normalizedInterval[0]+'-'+normalizedInterval[1]
   localStorage.setItem('timeline',normalizedInterval)
   }

}

function dpickerValToParam(key){


     t = param_to_splitStr()

     if(key!=undefined&&key!=null&&key=='timeline'){
        localStorage.setItem('timeline',t)
     }


    if ('URLSearchParams' in window) {
        var searchParams = new URLSearchParams(window.location.search)
        if(searchParams.get('t')==null){
        searchParams.set('t',t)
        var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
        history.pushState(null, '', newRelativePathQuery);
        }
    }

    
}

function param_to_splitStr(){
   let t1 = datepicker_from.val()
   let tempsplit = t1.split(" ")
   t1 = tempsplit[0]+'_'+tempsplit[1]
   
   let t2 = datepicker_to.val()
   tempsplit = t2.split(" ")
   t2 = tempsplit[0]+'_'+tempsplit[1]


   return t1+'-'+t2

}



function prepareBleCheckBoxs(cltDevs,selectedClients){

    if(cltDevs!=null){
        for(let i=0; i<cltDevs.length;i++){

            let container = document.createElement('div')
            container.className = 'single_unit'

            let checkbox = document.createElement('input')
            checkbox.type = 'checkbox'
            checkbox.id = cltDevs[i].idBleDev
            checkbox.addEventListener('change',onBleBoxChecked)
            for(let j=0; j<selectedClients.length; j++){
                if(checkbox.id == selectedClients[j].idBleDev){
                    checkbox.checked=true
                    checkbox.dispatchEvent(new Event('change'))
                }
            }

            
            container.appendChild(checkbox)


            $("<img>", { class: "checkbox_desc_clt_logo", src: "/wp-content/themes/astra/templates/map_template/images/icon_metka_white.png"}).appendTo(container);
            $("<p>", { class: "checkbox_desc_clt_text", 
            text: ` ${cltDevs[i].idBleDev}, ${cltDevs[i].BleDev_Name}, ${cltDevs[i].BleDev_MAC}, ${cltDevs[i].BleDev_SerialNumber}`}).appendTo(container);


            document.getElementById('units_container').appendChild(container)
        }
    }


}



function prepareCltCheckBoxs(cltDevs,selectedClients){

    if(cltDevs!=null){
        for(let i=0; i<cltDevs.length;i++){

            let container = document.createElement('div')
            container.className = 'single_unit'

            let checkbox = document.createElement('input')
            checkbox.type = 'checkbox'
            checkbox.id = cltDevs[i].idCltDev
            checkbox.addEventListener('change',onClientBoxChecked)
            for(let j=0; j<selectedClients.length; j++){
                if(checkbox.id == selectedClients[j][0].id){
                    checkbox.checked=true
                    checkbox.dispatchEvent(new Event('change'))
                }
            }

            container.appendChild(checkbox)


            $("<img>", { class: "checkbox_desc_clt_logo", src: "/wp-content/themes/astra/templates/map_template/images/icon_dev_white.png"}).appendTo(container);
            $("<p>", { class: "checkbox_desc_clt_text", 
            text: ` ${cltDevs[i].idCltDev}, ${cltDevs[i].CltDev_CompanyName}, ${cltDevs[i].CltDev_UserName}, ${cltDevs[i].CltDev_Phone}, 
            ${cltDevs[i].CltDev_Brand}, ${cltDevs[i].CltDev_Model} 
             `}).appendTo(container);


            document.getElementById('units_container').appendChild(container)
        }
    }


}


function onBleBoxChecked(check){    

    if(check.currentTarget.checked){ 
            var searchParams = new URLSearchParams(window.location.search)
            searchQuery = searchParams.get('idBleDev');
            if(searchQuery==null)
                searchParams.set('idBleDev',check.currentTarget.id)
            else {
                searchQuery = purifySearchQueue(searchQuery,check.currentTarget.id)
                searchQuery += check.currentTarget.id
                searchParams.set('idBleDev',searchQuery)
            }
            var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
            history.pushState(null, '', newRelativePathQuery);       
    } else {
            var searchParams = new URLSearchParams(window.location.search)
            searchQuery = searchParams.get('idBleDev');
            if(searchQuery!=null){
                searchQuery = purifySearchQueue(searchQuery,check.currentTarget.id)
                searchQuery =  searchQuery.substr(0,searchQuery.length-1)
                if(searchQuery == ''){
                    searchParams.delete('idBleDev')
                } else {
                    searchParams.set('idBleDev',searchQuery)
                }
               
            }
            var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
            history.pushState(null, '', newRelativePathQuery); 
    }

}

function onClientBoxChecked(check){    

        if(check.currentTarget.checked){ 
                var searchParams = new URLSearchParams(window.location.search)
                searchQuery = searchParams.get('idCltDev');
                if(searchQuery==null)
                    searchParams.set('idCltDev',check.currentTarget.id)
                else {
                    searchQuery = purifySearchQueue(searchQuery,check.currentTarget.id)
                    searchQuery += check.currentTarget.id
                    searchParams.set('idCltDev',searchQuery)
                }
                var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
                history.pushState(null, '', newRelativePathQuery);       
        } else {
                var searchParams = new URLSearchParams(window.location.search)
                searchQuery = searchParams.get('idCltDev');
                if(searchQuery!=null){
                    searchQuery = purifySearchQueue(searchQuery,check.currentTarget.id)
                    searchQuery =  searchQuery.substr(0,searchQuery.length-1)
                    if(searchQuery == ''){
                        searchParams.delete('idCltDev')
                    } else {
                        searchParams.set('idCltDev',searchQuery)
                    }
                   
                }
                var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
                history.pushState(null, '', newRelativePathQuery); 
        }

}


function purifySearchQueue(query, targetID){
    querySplit = query.split(',')
    query = ''
    for(let i=0;i<querySplit.length;i++){
        if(querySplit[i]!=targetID){
            query+=querySplit[i]
            query+=','
        }
        
    }

    return query
}


function prepareDatePicker(hinput0,hinput1,time){

    if(hinput1=="#datepicker_from"){

        hinput0 =  $(hinput1).datetimepicker({
            //startDate: '21.10.2018',
            format: 'd.m.y H:i',
            showSecond: false,
            value: time,
            step: 1,
            onChangeDateTime:function(dp,$input){
                dpickerValToParam('timeline')

            }
        })
    } else {
        hinput0 =  $(hinput1).datetimepicker({
            //startDate: '21.10.2018',
            format: 'd.m.y H:i',
            showSecond: false,
            value: time,
            step: 1,
            onChangeDateTime:function(dp,$input){
                console.log('datepicker 2 changed')

                dpickerValToParam('timeline')

            }
        })
    }

    $.datetimepicker.setLocale('ru')
    return hinput0;
}


