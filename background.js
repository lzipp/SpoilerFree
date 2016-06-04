
var spoiler_word_arr_back=[]

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	var received_message=request.greeting;
	if (received_message['tag']=='popup'){
		spoiler_word_arr_back=received_message["spoiled_words"];
	}

    if (received_message['tag'] == "load_from_background"){
    	console.log('received query from popup')
      sendResponse({farewell: spoiler_word_arr_back})
  }
    if (received_message['tag'] == "load_to_content"){
      sendResponse({farewell: spoiler_word_arr_back})
  };  
});