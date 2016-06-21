var spoiler_word_arr = [];

//"clear all" button function
var clear_btn_func = function () {
  console.log("in clear all func");
  spoiler_word_arr = [];
  renderStatus(spoiler_word_arr);
  var popup_message = {
    'tag': 'popup',
    'spoiled_words': spoiler_word_arr
  }
  chrome.runtime.sendMessage({
    greeting: popup_message
  }, function (response) {
    console.log('sent_popup_info');
  });
}

document.getElementById("clear_btn").addEventListener("click", clear_btn_func);

// delete a single word from the list
function del_spoiled_word(num) {
  spoiler_word_arr.splice(num, 1);
  console.log('spliced')
  console.log(spoiler_word_arr)
  console.log('num=' + num)
  renderStatus(spoiler_word_arr);
  var popup_message = {
    'tag': 'popup',
    'spoiled_words': spoiler_word_arr
  }
  chrome.runtime.sendMessage({
    greeting: popup_message
  }, function (response) {
    console.log('sent_popup_info');
  });
};

// initialize the blocked words list
function renderStatus(spoils) {
  var element = document.getElementById("status");
  element.innerHTML = '';
  var i;
  for (i = 0; i < spoils.length; i += 1) {
    div_to_add = make_blocked_word_div(spoils[i], i);
    element.appendChild(div_to_add);
  };
};

// make the div that displays a blocked word
function make_blocked_word_div(blocked_word, num) {
  var div = document.createElement("div");
  div.classList.add("spoiled_word_div")
  div.innerHTML = blocked_word;
  var btn_close = document.createElement("BUTTON")

  function wrapper_delete(i) {
    return function () {
      del_spoiled_word(i)
    }
  }
  var del_spoiled_word_set = wrapper_delete(num)
  btn_close.onclick = del_spoiled_word_set;
  var t = document.createTextNode("X");
  btn_close.classList.add("button_close")
  btn_close.appendChild(t);
  div.appendChild(btn_close)
  return div;
};

// check if a new word is already present in the blocked word list
function contains(arr, word) {
  if (word.length < 1) {
    return true;
  }
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === word) {
      return true;
    }
  }
  return false;
};

// add a new word to the blocked list
function add_word_to_list(blocked_word) {
  var element = document.getElementById("status");
  div_to_add = make_blocked_word_div(blocked_word);
  element.appendChild(div_to_add);
};

// function for the blocked word submit form event listener
var submitForm = function () {
  console.log('submitting form...');
  var spoiler_word = document.getElementById("spoiler_box").value;
  if (contains(spoiler_word_arr, spoiler_word) == false) {
    console.log("Word to block: " + spoiler_word)
    spoiler_word_arr.push(spoiler_word);
    add_word_to_list(spoiler_word, spoiler_word_arr.length);
    var popup_message = {
      'tag': 'popup',
      'spoiled_words': spoiler_word_arr
    }
    chrome.runtime.sendMessage({
      greeting: popup_message
    }, function (response) {
      console.log('sent_popup_info');
    });
  };
};

function register_click(check_value) {
  var popup_message = {
    'tag': 'checkbox',
    'checked_state': check_value
  }
  chrome.runtime.sendMessage({
    greeting: popup_message
  }, function (response) {
    console.log('sent_checked_info');
  });
};

// receive the current blocked word list and overlay_check_value from the background.js page
document.addEventListener('DOMContentLoaded', function () {
  var contact_message = {
    'tag': 'load_from_background'
  }
  chrome.extension.sendMessage({
      greeting: contact_message
    },
    function (response) {
      spoiler_word_arr = response["farewell"];
      var cur_check_val = response["checked_state"];
      if (cur_check_val == false) {
        document.getElementById("overlay_check").removeAttribute("checked");
      };
      renderStatus(spoiler_word_arr);
    });
});

document.getElementById("sub_form").addEventListener("click", submitForm);

// for pressing enter in textbox
document.getElementById("spoiler_box")
  .addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode == 13) {
      document.getElementById("sub_form").click();
    }
  });

document.getElementById("overlay_check").addEventListener("click", function () {
  var check_val = document.getElementById("overlay_check").checked;
  register_click(check_val);
})