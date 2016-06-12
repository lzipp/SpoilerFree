// var spoilers={"spo"}
var spoiler_word_arr=[]

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function contains(arr, word) {
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
}
 console.log(spoiler_word_arr)
  renderStatus('Spoiler blocking for: '+ spoiler_word_arr );


    chrome.extension.sendMessage({greeting: "spoil_list"+spoiler_word_arr},
        function (response) {
         console.log(response.farewell);
           
        });


}


document.addEventListener('DOMContentLoaded', function() {
console.log('loaded')
  renderStatus('loaded');
})
document.getElementById("sub").addEventListener("click", submitForm);

