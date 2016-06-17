var spoiler_word_arr=[];
 var clear_btn_func = function(){                 //removes the cover and button when clicked, and reveals the spoiler content
          console.log("in clear all func");
          spoiler_word_arr=[];
          renderStatus(spoiler_word_arr );
          var popup_message={'tag': 'popup', 'spoiled_words':spoiler_word_arr}
          chrome.runtime.sendMessage({greeting: popup_message}, function(response) {
           console.log('sent_popup_info');
});
           }            
// $(".clear_all").click(function(ev){clear_btn_func(this,ev)})  //Sets the click function on all spoiler buttons
document.getElementById("clear_btn").addEventListener("click", clear_btn_func);



function del_spoiled_word(num) {
    spoiler_word_arr.splice(num,1);
    console.log('spliced')
    console.log(spoiler_word_arr)
    console.log('num='+num)
    renderStatus(spoiler_word_arr );
    var popup_message={'tag': 'popup', 'spoiled_words':spoiler_word_arr}
chrome.runtime.sendMessage({greeting: popup_message}, function(response) {
  console.log('sent_popup_info');
});
}  


function renderStatus(spoils) {
  //document.getElementById('status').textContent = statusText;
      var element=document.getElementById("status");
element.innerHTML = '';
  var i;
  for (i=0; i<spoils.length; i +=1){
    var div = document.createElement("div");
    div.classList.add("spoiled_word_div")
    div.innerHTML = spoils[i];
    var btn_close=document.createElement("BUTTON")
    function wrapper(num) {
      return function() {del_spoiled_word(num)}
    }
    var del_spoiled_word_set= wrapper(i)
    btn_close.onclick = del_spoiled_word_set;

  var t = document.createTextNode("X");     
    btn_close.classList.add("button_close")
    btn_close.appendChild(t);
    div.appendChild(btn_close) 
     element.appendChild(div)
  }
}

function contains(arr, word) {
  if (word.length<1){
    return true;
  }
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === word) {
            return true;
        }
    }
    return false;
}

var submitForm = function() {
  console.log('submitting form...');
  var spoiler_word = document.getElementById("spoiler_box").value;
  if (contains(spoiler_word_arr,spoiler_word)==false){
  console.log("Word to block: " + spoiler_word)
  spoiler_word_arr.push(spoiler_word)
  renderStatus(spoiler_word_arr );

var popup_message={'tag': 'popup', 'spoiled_words':spoiler_word_arr}
chrome.runtime.sendMessage({greeting: popup_message}, function(response) {
  console.log('sent_popup_info');
});
};
};

document.addEventListener('DOMContentLoaded', function() {
console.log('loaded')
var contact_message={'tag': 'load_from_background'}
    chrome.extension.sendMessage({greeting: contact_message},
        function (response) {
         spoiler_word_arr=response.farewell;
         renderStatus(spoiler_word_arr );
        });
})
document.getElementById("sub").addEventListener("click", submitForm);

// should change "click" to just when input form submitted...