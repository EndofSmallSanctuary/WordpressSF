var tabClt;
var tabCast;


$(function(){

  tabClt = $("#tab_clts")
  tabCast = $("#tab_broadcast")

  if(wpuser_login!=null&&wpuser_login=='test_krot01'){

  tabClt.click(function(){
    navigationFocusChanged(tabClt)
  })
  tabCast.click(function(){
    navigationFocusChanged(tabCast)
  })
} else {
    $('#tabs').hide()
}
onCltChosen()

})


function navigationFocusChanged(element){
   if(element.attr('active')=='n'){
       $('#messages').empty()
       element.children().first().attr('class','tab_header_active')
       element.attr('active','y')
    if(element == tabClt){
        let historyContainer = $('#historyB')
        if(historyContainer!=null) historyContainer.remove()
        tabCast.children().first().attr('class','tab_header_inactive')
        tabCast.attr('active','n')
        onCltChosen()
    } else {
        tabClt.children().first().attr('class','tab_header_inactive')
        tabClt.attr('active','n')
        onBroadChosen()
    }
 }
}