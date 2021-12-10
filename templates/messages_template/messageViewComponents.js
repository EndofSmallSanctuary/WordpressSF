var broadcastTextbox = null

function iblamejordan(chicoFacialFeatures){
    let container = $('#messages')
    let clientHolder = $("<div>", { id:chicoFacialFeatures.idCltDev, class: "client_chat_status_container"}).appendTo(container)
    let clientHolderHeader = $("<div>",{class : "client_chat_status_header"}).appendTo(clientHolder)
    $("<img>",{class : "client_chat_status_image_dev",
    src: "/wp-content/themes/astra/templates/messages_template/images/icon_dev.png"}).appendTo(clientHolderHeader)
    $("<p>",{class : "client_chat_status_text",
    text: `${chicoFacialFeatures.CltDev_CompanyName},
     ${chicoFacialFeatures.CltDev_UserName},
     ${chicoFacialFeatures.CltDev_Model},
     ${chicoFacialFeatures.CltDev_Brand}`}).appendTo(clientHolderHeader)

     var awaitingReply
     if(chicoFacialFeatures.awaiting == 0){
       awaitingReply =  $("<img>",{class : "client_chat_status_image_await",
        src: "/wp-content/themes/astra/templates/messages_template/images/icon_status_await_no.png"}).appendTo(clientHolder)
     } else {
       awaitingReply =   $("<img>",{class : "client_chat_status_image_await",
        src: "/wp-content/themes/astra/templates/messages_template/images/icon_status_await.png"}).appendTo(clientHolder)
     }

     var relapse = $("<img>",{class : "client_chat_status_image_relapse",
     src: "/wp-content/themes/astra/templates/messages_template/images/cancel.png"}).appendTo(clientHolderHeader)

     awaitingReply.click(function(){


      
        //Подготовка переписки
        var chatWindow =  prepareMessageList(clientHolder,awaitingReply)
        chatWindow.hide()
        //Скрываю чат до полной прогрузки
        var lastMsgId =  fillChatWindow(chatWindow,chicoFacialFeatures.idCltDev)
        if(lastMsgId!=null){
         var answerForm =  showAnswerForm(clientHolder,lastMsgId)
        }
        relapse.show();
        relapse.click(function(){
          chatWindow.hide();
          answerForm.hide();
          awaitingReply.show();
          relapse.hide();
          clientHolder.attr('class','client_chat_status_container')
        })
        
        clientHolder.attr('class','client_chat_status_container_active')
        //Показываю чат + перемотка вниз до упора
        chatWindow.show()
        chatWindow.scrollTop(chatWindow[0].scrollHeight);


     })

}

/*Сверху-вниз {слева - направо} {Форма широковещательного сообщения, поле с шаблонами}
  История сообщений */
function iblamechico(){
  let container = $('#messages')
  let formHolder = $("<div>", { class: "broadcast_form_template_container"}).appendTo(container)
  let broadCastForm = $("<div>", { class: "broadcast_message_from"}).appendTo(formHolder)
  showBroadCastForm(broadCastForm)
  let broadCastTemplates = $("<div>", { class: "broadcast_templates_from"}).appendTo(formHolder)
  showBroadCastTemplates(broadCastTemplates)
  let historyContainer = $("<div>", { id:'historyB',class: "broadcast_history_from"}).appendTo($('#messages_overall_container'))
  showBroadCastHistory(historyContainer)
}

function showBroadCastHistory(holder){
  $("<h1>", {class: "broadcast_history_header", text: 'История сообщений'}).appendTo(holder);
  let historyMessages = getBroadCastHistory()
  if(historyMessages!=null&&historyMessages.length>0){
    for(let i=0; i<historyMessages.length; i++){
      let templateContainer = $("<div>",{class:"broadhast_historynode_container"}).appendTo(holder)
      $("<p>",{class:"broadhast_historynode_container_text", text: historyMessages[i].message_Text})
      .appendTo(templateContainer)
      $("<p>",{class:"broadhast_historynode_container_time", text:moment.unix(historyMessages[i].message_Time/1000).format("DD.MM.YYYY hh:mm:ss ")})
      .appendTo(templateContainer)
    }
  }
}


function showBroadCastTemplates(holder){
  $("<h1>", {class: "broadcast_from_header", text: 'Готовые шаблоны'}).appendTo(holder);
  let templatesHolder = $("<div>", {class:"broadcast_templates_holder"}).appendTo(holder)
  let templates = getBroadcastList()
  if(templates!=null&&templates.length>0){
    for(let i=0; i < templates.length; i++){
       let templateContainer = $("<div>",{class:"broadhast_header_container"}).appendTo(templatesHolder)
       $("<p>",{class:"broadhast_header_container_text", text: templates[i].header})
       .appendTo(templateContainer)
       templateContainer.click(function(){
         if(broadcastTextbox!=null){
           broadcastTextbox.val(templates[i].text)
         }
       })
    }
  } 
}



function showBroadCastForm(holder){
  var broadCastAnswerHolder = $("<div>", {class: "broadcast_form"}).appendTo(holder);
  $("<h1>", {class: "broadcast_from_header", text: 'Форма ответа'}).appendTo(broadCastAnswerHolder);
  broadcastTextbox = $("<textarea>", {class:"broadcast_answerform_textarea"}).appendTo(broadCastAnswerHolder);
  var broadcastAttachButton = $("<button>", { class: "broadcast_answerform_button", text:"Прикрепить изображение"}).appendTo(broadCastAnswerHolder);
  var broadcastInput = $("<input>", { type:"file",accept:"image/*"}).appendTo(broadCastAnswerHolder);
  broadcastInput.hide();
  broadcastInput.on('change', openFile);
  broadcastAttachButton.click(function () {
    broadcastInput.click()
  })
  var broadcastSubmitButton = $("<button>", { class: "broadcast_answerform_button", text:"Написать для всех клиентов"})
  .appendTo(broadCastAnswerHolder);
  broadcastSubmitButton.click(function (){
    if(attachmentOnDeCoding){
      alert("Изображение загружается. Пожалуйста, попробуйте позже")
    }
    else {
    let sfcMessage = {
      time: new Date().getTime(),
      text: broadcastTextbox.val(),
      image: attachment
    }  
    sendBroadcastMsg(sfcMessage)
    location.reload()
  }})
  return broadCastAnswerHolder;
}



function showAnswerForm(holder,idMessage){
      var replyHolder = $("<div>", { id:idMessage+"_form", class: "reply_answerform_holder"}).appendTo(holder);
      $("<p>", { class: "reply_answerform_header", text:"Введите ответ сюда"}).appendTo(replyHolder);
      var messageInput = $("<textarea>", {class:"reply_answerform_textarea"}).appendTo(replyHolder);
      var replyAttachButton = $("<button>", { class: "reply_answerform_button", text:"Прикрепить изображение"}).appendTo(replyHolder);
      var replyInput = $("<input>", { type:"file",accept:"image/*"}).appendTo(replyHolder);
      replyInput.hide();
      replyInput.on('change', openFile);
      replyAttachButton.click(function () {
        replyInput.click()
      })
      var replySubmitButton = $("<button>", { class: "reply_answerform_button", text:"Ответить"})
      .appendTo(replyHolder);
      replySubmitButton.click(function (){
        if(attachmentOnDeCoding){
          alert("Изображение загружается. Пожалуйста, попробуйте позже")
        }
        else {
        let sfcMessage = {
          time: new Date().getTime(),
          text: messageInput.val(),
          replyTo: idMessage,
          image: attachment
        }  
        sendReplyMsg(sfcMessage)
        location.reload()
      }})
      return replyHolder;
}

function prepareMessageList(container,imagelink){

  imagelink.hide()
  return $("<div>",{class:"client_chat_window"}).appendTo(container)
  
}

function prepareMessageHolder(message){
  // message = null
  if(message.message_CltDev!=null&&message.message_CltDev!=0){
    var messageDiv = $("<div>",{class:"client_chat_message_client"})
    
  } else {
    var messageDiv = $("<div>",{class:"client_chat_message_admin"})
  }

  if(message.message_Text!=undefined&&message.message_Text!=null) message.message_Text = urlify(message.message_Text)
  var messageText = $("<p>",{class:"client_chat_message_text"}).appendTo(messageDiv)
  messageText.html(message.message_Text) 
  if(message.message_Image!=null&&message.message_Image!='')
  var messageImage = $("<img>",{class:"client_chat_message_image",
  src:"data:image/png;base64," + message.message_Image}).appendTo(messageDiv)

  var messageTime = $("<p>",{class:"client_chat_message_time",
  text:moment.unix(message.message_Time/1000).format("DD.MM.YYYY hh:mm:ss ")}).appendTo(messageDiv)

  return messageDiv;
}