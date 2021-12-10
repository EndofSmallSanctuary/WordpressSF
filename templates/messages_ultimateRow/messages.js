var messages = [];
var replies = [];
var itemsLimit = 0;
var buttonprev;
var buttonnext;
var attachment = null;
var attachmentOnDeCoding = false;

$(function () {
  buttonprev = $("#navigationfrom");
  buttonnext = $("#navigationto");

  if (wpuser_cltDevs != "") {
    buttonnext.click(function () {
      if (buttonnext.attr("active") == "yes") {
        $("#messages").empty();
        requestNewMsgPage();
        buildMsgSpine();
        onNextPageLoaded();
      }
    });
    buttonprev.click(function () {
      if (buttonprev.attr("active") == "yes") {
        $("#messages").empty();
        if (messages.length != 10)
          messages = getMSGListPrev(
            itemsLimit - messages.length - 10,
            wpuser_cltDevs
          );
        else {
          messages = getMSGListPrev(
            itemsLimit - messages.length - 10,
            wpuser_cltDevs
          );
        }

        buildMsgSpine();
        onPrevPageLoaded();
      }
    });

    // onFirstPageLoaded()
    requestNewMsgPage();
    onNextPageLoaded();
    buildMsgSpine(itemsLimit);
  }
});

function requestNewMsgPage(){
  result = getMSGListNext(itemsLimit, wpuser_cltDevs);
  messages = result[0];
  replies = result[1];
}


function onFirstPageLoaded() {
  buttonprev.attr("active", "no");
  buttonprev.attr("class", buttonprev.attr("class") + "_inactive");

  buttonnext.attr("active", "no");
  buttonnext.attr("class", buttonnext.attr("class") + "_inactive");
}

function onNextPageLoaded() {
  if (messages.length < 10 && itemsLimit < 10) {
    buttonnext.attr("active", "no");
    buttonnext.attr("class", buttonnext.attr("class") + "_inactive");
    buttonprev.attr("active", "no");
    buttonprev.attr("class", buttonprev.attr("class") + "_inactive");
    return;
  } else if (messages.length < 10 && itemsLimit > 10) {
    buttonnext.attr("active", "no");
    buttonnext.attr("class", buttonnext.attr("class") + "_inactive");
    buttonprev.attr("active", "yes");
    buttonprev.attr("class", "message_navigation_node");
    return;
  } else if ((messages.length >= 10) & (itemsLimit > 10)) {
    buttonnext.attr("active", "yes");
    buttonnext.attr("class", "message_navigation_node");
    buttonprev.attr("active", "yes");
    buttonprev.attr("class", "message_navigation_node");
  } else if ((messages.length >= 10) & (itemsLimit == 10)) {
    buttonnext.attr("active", "yes");
    buttonnext.attr("class", "message_navigation_node");
    buttonprev.attr("active", "no");
    buttonprev.attr("class", buttonprev.attr("class") + "_inactive");
  }

  window.scrollTo(0, 0);
}

function onPrevPageLoaded() {
  if (itemsLimit == 10) {
    buttonprev.attr("active", "no");
    buttonprev.attr("class", buttonprev.attr("class") + "_inactive");
  }
  if (messages.length >= 10) {
    buttonnext.attr("active", "yes");
    buttonnext.attr("class", "message_navigation_node");
  }

  window.scrollTo(0, 0);
}

function getMSGListPrev(limit, cltfilter) {
  let Doneresponse = [""];

  $.ajax({
    async: false,
    type: "POST",
    url: "/wp-content/themes/astra/templates/messages_template/messages_control.php",
    data: {
      action: "messageList",
      cltfilter: cltfilter,
      pseudolimit: limit,
    },
    success: function (response) {
      Doneresponse = jQuery.parseJSON(response);
    },
  });

  if (messages.length != 10) {
    itemsLimit -= messages.length;
  } else itemsLimit -= Doneresponse.length;
  return Doneresponse;
}

function getMSGListNext(limit, cltfilter) {
  let Doneresponse = [""];
  $.ajax({
    async: false,
    type: "POST",
    url: "/wp-content/themes/astra/templates/messages_template/messages_control.php",
    data: {
      action: "messageList",
      cltfilter: cltfilter,
      pseudolimit: limit,
    },
    success: function (response) {
      Doneresponse = jQuery.parseJSON(response);
    },
  });
  itemsLimit += Doneresponse.length;
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
  itemsLimit += Doneresponse.length;
  return Doneresponse;
}

function getRelatedImage(msgID) {
  let Doneresponse = [""];
  $.ajax({
    async: false,
    type: "POST",
    url: "/wp-content/themes/astra/templates/messages_template/messages_control.php",
    data: {
      action: "image",
      msgId: msgID,
    },
    success: function (response) {
      Doneresponse = jQuery.parseJSON(response);
    },
  });
  return Doneresponse;
}

function buildMsgSpine() {
  if (messages != null && messages.length > 0) {
    messages.forEach((element) => {
      prepareMessageHolder(element);
    });
  }
}

function prepareMessageHolder(msg) {
  if (msg.message_Phone == null) {
    msg.message_Phone = "номер не указан";
  }
  //Overall message form
  var holder = $("<div>", { id: msg.idMEssage, class: "message_holder" });

  //Header and content
  var holderHeader = $("<div>", { class: "message_holder_header" });
  holderHeader_dev = $("<img>",{
    class: "message_holder_header_icon",
    src: "/wp-content/themes/astra/templates/messages_template/images/icon_dev.png"
  }).appendTo(holderHeader)
  holderHeader_dev_text = $("<p>", {
    class: "message_holder_header_time",
    text:
      msg.CltDev_Model +
      ", " +
      msg.CltDev_Brand +
      ", "+
      msg.CltDev_CompanyName +
      ", " +
      msg.CltDev_UserName +
      ", " +
      msg.CltDev_Phone
  }).appendTo(holderHeader);

  holderHeader_time = $("<img>", {
    class: "message_holder_header_icon",
    src: "/wp-content/themes/astra/templates/messages_template/images/icon_clock.png",
    css: {
      'margin-left':'auto',
      'margin-right':'10px'
    }
  }).appendTo(holderHeader);
  holderHeader_time_text = $("<p>", {
    class: "message_holder_header_time",
    text: moment.unix(msg.message_Time / 1000).format("DD.MM.YYYY HH:mm:ss"),
  }).appendTo(holderHeader);

  var holderContent = $("<div>", { class: "message_holder_content" });
  holderContent_text = $("<p>", {
    class: "message_holder_content_text",
    text: msg.message_Text,
  }).appendTo(holderContent);

  //if image present - show expand button
  if (msg.image != 0) {
    var expandContent = $("<img>", {
      class: "message_expand",
      src: "/wp-content/themes/astra/templates/messages_template/expand.png",
      active: "no",
    });
    expandContent.click(function () {
      if (expandContent.attr("active") == "no") {
        ib64 = getRelatedImage(msg.idMEssage);
        imageContent = $("<img>", {
          id: "i" + msg.idMEssage,
          class: "message_holder_content_image",
          src: "data:image/png;base64," + ib64.message_image,
        });
        holderContent.hide().append(imageContent).fadeIn(400);

        expandContent.attr("active", "yes");
        expandContent.attr(
          "src",
          "/wp-content/themes/astra/templates/messages_template/relapse.png"
        );
      } else {
        $("#" + "i" + msg.idMEssage).slideUp("normal", function () {
          $(this).remove();
        });
        expandContent.attr("active", "no");
        expandContent.attr(
          "src",
          "/wp-content/themes/astra/templates/messages_template/expand.png"
        );
      }
    });
  }


  holder.append(holderHeader);
  holder.append(holderContent);
  holder.append(expandContent);
  prepareMessageReply(msg.idMEssage,holder);
  $("#messages").append(holder);
}



function prepareMessageReply(idMessage, holder){
  let replyIndex = -1;
  for(i=0; i<replies.length; i++){
    if(replies[i].message_ReplyTo == idMessage){
      replyIndex = i;
    }
  }
  
  if(replyIndex!=-1){
    var replyHeader = $("<p>", { class: "reply_header", text: "Посмотреть ответ" }).appendTo(holder);
      replyHeader.click(function () {
      replyHeader.hide()
      var replyHolder = $("<div>", { class: "reply_holder"}).appendTo(holder);
      $("<p>",{class:"reply_content_text",text : replies[replyIndex].message_Text}).appendTo(replyHolder);
      if(replies[replyIndex].image!=0){
        ib64 = getRelatedImage(replies[replyIndex].idMEssage);
        imageContent = $("<img>", {
          id: "i" + replies[replyIndex].idMEssage,
          class: "message_holder_content_image",
          src: "data:image/png;base64," + ib64.message_image,
        }).appendTo(replyHolder);
      }
      var replyShowOff = $("<p>",{class:"reply_header_sandy",text : "Скрыть ответ"}).appendTo(replyHolder);
      replyShowOff.click(function () {
        replyHolder.hide();
        replyHeader.show();
      })
  })
  } else {
    var replyHeader = $("<p>", { class: "reply_header", text: "Ответить" }).appendTo(holder);
    replyHeader.click(function () {
      replyHeader.hide()
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
      }
      })
      
  })
  }
 
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
