;
(function ($) {
  "use strict";
  
  $(function () {
    $("#messageList").animate({"opacity":1.0}, 1000);
    var TOUCH_EVENT = checkTouchEventType(),
        button = $("#sendMessageForm #send"),
        message = $("#sendMessageForm #message");

    if (message.val().length == 0) {
      button.attr("disabled", "disabled");
    }
    message.bind("keydown keyup keypress change", function() {
      if ($(this).val().length > 0) {
        button.removeAttr("disabled");
      } else {
        button.attr("disabled", "disabled");
      }
    });

    button.on(TOUCH_EVENT, function () {
      sendMessage(escapeHtml(message.val()));
      message.val("");
      button.attr("disabled", "disabled");
    });
  });
  
  
  function sendMessage(message) {
    var messageList = $("#messageList");
    var jsonMessage = JSON.stringify({
      "message": message
    });
    
    $("<div>", {
      class: "me"
    }).append(
      $("<div>", {
        class: "message",
        text: message
      })
    ).stop().appendTo(messageList);
    
    scroll();
    
    $.ajax({
      type: "POST",
      url: "./question.php",
      data: jsonMessage,
      contentType: 'application/json',
      chache: false,
      dataType: "json",
      async: false,
      scriptCharset: "utf-8",
      success: function(result, status){

        setTimeout(function() {
          $("<div>", {
            class: "com"
          }).append(
            $("<div>", {
              class: "icon"
            }).append(
              $("<img>", {
                src: "./images/com_icon.png",
                alt:"アイコン"
              })
            )
          ).append(
            $("<div>", {
              class: "message",
              text: result.answer
            })
          ).stop().appendTo(messageList);
        }, 1000);
        
        scroll();
      },
      error: function(XMLHttpRequest, textStatus, errorThrown){
        console.log(XMLHttpRequest);
      }
    });
    
  }


  /**
   * touchend イベントの存在チェック
   * @return string "touchend" or "click"
   **/
  function checkTouchEventType() {
    if ("ontouchend" in window) {
      return "touchend";
    } else {
      return "click";
    }
  }

  /**
   * HTMLエスケープ
   * @param content エスケープされる前の文字列
   * @return エスケープされた後の文字列
   **/
  function escapeHtml(content) {
    var TABLE_FOR_ESCAPE_HTML = {
      "&": "&amp;",
      "\"": "&quot;",
      "<": "&lt;",
      ">": "&gt;"
    };
    return content.replace(/[&"<>]/g, function(match) {
      return TABLE_FOR_ESCAPE_HTML[match];
    });
  }
  
  function scroll() {
    var scrollH = $("#messageList").height();
    $("#messageList").stop().animate({
      "scrollTop":scrollH
    }, 1500);
  }


})(jQuery);
