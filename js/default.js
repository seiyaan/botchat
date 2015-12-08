;
(function ($) {
  "use strict";
  
  $(function () {
    var TOUCH_EVENT = checkTouchEventType(),
        button = $("#sendMessageForm #send"),
        message = $("#sendMessageForm #message"),
        messageList = $("#messageList");

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
    
    $('.opening').each(function(index){
      $(this).delay(2000 * index).fadeTo("slow", 1.0);
    });
  });


  /**
   * 送信ボタンが押された時の処理。
   * @param message String 投稿の内容
   * @return void
   **/
  function sendMessage(msg) {
    var messageList = $("#messageList");
    var jsonMessage = JSON.stringify({
      "message": msg
    });
    
    userTweet(messageList, msg);
    
    $.ajax({
      type: "POST",
      url: "./question/index.php",
      data: jsonMessage,
      contentType: 'application/json',
      chache: false,
      dataType: "json",
      scriptCharset: "utf-8",
      success: function(result, status){
        botTweet(messageList, result.answer);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown){
        console.log(XMLHttpRequest);
      }
    });
    
  }


  /**
   * ユーザがつぶやきます
   * @param target Elem 追加先
   * @param msg String つぶやく内容
   * @return void
   **/
  function userTweet(target, msg){
    $("<div>", {
      class: "me tweet",
    }).append(
      $("<div>", {
        class: "message",
        text: msg
      })
    ).stop().appendTo(target).stop().fadeTo("slow", 1.0);
    scroll();
  }


  /**
   * botがつぶやきます
   * @param target Elem 追加先
   * @param msg String つぶやく内容
   * @return void
   **/
  function botTweet(target, msg){
    setTimeout(function() {
      $("<div>", {
        class: "com tweet"
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
          text: msg
        })
      ).stop().appendTo(target).stop().fadeTo("slow", 1.0);
    }, 1000);
    scroll();
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


  /**
   * 画面下にスクロール
   * @return void
   **/
  function scroll() {
    $("body, html").animate({
      "scrollTop": $(document).height()
    }, 1000);
  }


})(jQuery);
