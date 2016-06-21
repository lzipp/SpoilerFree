var spoiler_word_arr_back = [];
var checked_val = true;

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    var received_message = request.greeting;
    if (received_message['tag'] == 'popup') {
      spoiler_word_arr_back = received_message["spoiled_words"];
    }
    if (received_message['tag'] == 'checkbox') {
      checked_val = received_message["checked_state"];
    }

    if (received_message['tag'] == "load_from_background") {
      console.log('received query from popup')
      sendResponse({
        "farewell": spoiler_word_arr_back,
        "checked_state": checked_val
      })
    }
    if (received_message['tag'] == "load_to_content") {
      sendResponse({
        "farewell": spoiler_word_arr_back,
        "checked_state": checked_val
      })
    };
  });