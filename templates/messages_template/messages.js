var messages = [];
var replies = [];
var clients = [];
var attachment = null;
var attachmentOnDeCoding = false;

function onCltChosen(){

  if(wpuser_cltDevs!=null){
    clients = getPreviewList(wpuser_cltDevs)

    if(clients!=null){
      for(let i=0; i<clients.length; i++){
        if(clients[i].inactive==0)
        iblamejordan(clients[i])
      }
    }
  }
}

function onBroadChosen(){
  iblamechico()
}

function getBroadCastHistory(){
  let Doneresponse = [""];
  $.ajax({
    async: false,
    type: "POST",
    url: "/wp-content/themes/astra/templates/messages_template/messages_control.php",
    data: {
      action: "broadCastHistory",
    },
    success: function (response) {
      Doneresponse = jQuery.parseJSON(response);
    },
  });
  return Doneresponse;
}


function getBroadcastList(){
  let Doneresponse = [""];
  $.ajax({
    async: false,
    type: "POST",
    url: "/wp-content/themes/astra/templates/messages_template/messages_control.php",
    data: {
      action: "broadCastList",
    },
    success: function (response) {
      Doneresponse = jQuery.parseJSON(response);
    },
  });
  return Doneresponse;
}

function sendBroadcastMsg(message){
  let Doneresponse = [""];
  $.ajax({
    async: false,
    type: "POST",
    url: "/wp-content/themes/astra/templates/messages_template/messages_control.php",
    data: {
      action: "broadcast",
      message: message
    },
    success: function (response) {
      Doneresponse = jQuery.parseJSON(response);
    },
  });
  return Doneresponse;
}


function sendReplyMsg(message){
  let Doneresponse = [""];
  $.ajax({
    async: false,
    type: "POST",
    url: "/wp-content/themes/astra/templates/messages_template/messages_control.php",
    data: {
      action: "reply",
      message: message
    },
    success: function (response) {
      Doneresponse = jQuery.parseJSON(response);
    },
  });
  return Doneresponse;
}



function lastClientMessageId(idCltDev){
  let lastMsgId = null;
  if(messages!=null){
    for(let i=0; i<messages.length;i++){
      if(messages[i].message_CltDev == idCltDev){
        lastMsgId = messages[i].idMessage
      }
    }
  }
  return lastMsgId
}


function fillChatWindow(window,idCltDev){
 messages =  getRelatedMessages(idCltDev)
 if(messages!=null&&messages.length>0)
   for(let i=0; i<messages.length; i++){
      prepareMessageHolder(messages[i]).appendTo(window)
   }

   return lastClientMessageId(idCltDev);
}


function urlify(text){
  let downloadlink = 'https://sfc.rniirs.ru'
  text = text.replace(downloadlink,`<a href="${downloadlink}"> ${downloadlink} </a>`)
  return text
}


function getRelatedMessages(idClt){
  let Doneresponse = [""];
  $.ajax({
    async: false,
    type: "POST",
    url: "/wp-content/themes/astra/templates/messages_template/messages_control.php",
    data: {
      action: "clientChat",
      cltId: idClt,
    },
    success: function (response) {
      Doneresponse = jQuery.parseJSON(response);
    },
  });
  return Doneresponse;
}

function getPreviewList(cltfilter) {
  let Doneresponse = [""];
  $.ajax({
    async: false,
    type: "POST",
    url: "/wp-content/themes/astra/templates/messages_template/messages_control.php",
    data: {
      action: "previewList",
      cltfilter: cltfilter,
    },
    success: function (response) {
      Doneresponse = jQuery.parseJSON(response);
    },
  });
  return Doneresponse;
}


function openFile () {
  let file = this.files[0]
  attachmentOnDeCoding = true
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    attachmentOnDeCoding = false
    attachment = reader.result.split(',')[1]
  };
  
}
