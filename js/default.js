;
(function ($) {
  "use strict";

  $(function () {
    var TOGGLE_SPEED = 300,
        TOUCH_EVENT = checkTouchEventType(),
        sendButton = $("#sendMessageForm #send"),
        message = $("#sendMessageForm #message"),
        messageList = $("#messageList"),
        humbargerButton = $("#humbargerButton"),
        humbarger = $("#humbarger"),
        humbargerList = $("#humbarger ul li");

    if (message.val().length == 0) {
      sendButton.attr("disabled", "disabled");
    }
    message.bind("keydown keyup keypress change", function() {
      if ($(this).val().length > 0) {
        sendButton.removeAttr("disabled");
      } else {
        sendButton.attr("disabled", "disabled");
      }
    });

    sendButton.on(TOUCH_EVENT, function () {
      sendMessage(messageList, escapeHtml(message.val()));
      message.val("");
      sendButton.attr("disabled", "disabled");
    });
    
    humbargerButton.on(TOUCH_EVENT, function () {
      humbarger.stop().toggle(TOGGLE_SPEED);
    });
    
    humbargerList.on(TOUCH_EVENT, function () {
      var index = humbargerList.index(this),
          msg = humbargerList.eq(index).text();
      humbarger.stop().hide(TOGGLE_SPEED);
      sendMessage(messageList, msg);
    });
    
    $('.opening').each(function(index){
      $(this).delay(2000 * index).fadeTo("slow", 1.0);
    });
  });


  /**
   * 質問の送信を行い、回答を貰う。
   * @param target Elem 追加先
   * @param message String 投稿の内容
   * @return void
   **/
  function sendMessage(target, msg) {
    var jsonMessage = JSON.stringify({
      "message": msg
    });
    
    userTweet(target, msg);
    
    $.ajax({
      type: "POST",
      url: "./question/index.php",
      data: jsonMessage,
      contentType: 'application/json',
      chache: false,
      dataType: "json",
      scriptCharset: "utf-8",
      success: function(result, status){
        botTweet(target, result.answer);
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
    var WAIT = 1000;
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
    }, WAIT);
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
