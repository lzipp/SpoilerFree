//Content script for spoiler extension
document.documentElement.style.visibility = "hidden";
var blocked_list = [];
var overlay_check_val;
var refire = false;
// global variables for the DOM mutation observer:
var target_mutation;
var config_mutation;
var observer;

var add_observer_listener = function () {
  target_mutation = document.body;
  config_mutation = {
    attributes: false,
    childList: true,
    characterData: true,
    subtree: true
  }
  observer = new MutationObserver(function (mutations) {
    observer.takeRecords();
    observer.disconnect();
    cover_script();
    observer.observe(target_mutation, config_mutation);
  });
}

var prevent_links_func = function (ev) {
  ev.preventDefault();
}

//getting blocked_list from background.js and executing the main_script if there are blocked_wordds in blocked_list
var contact_message_to_background = {
  "tag": "load_to_content"
};
chrome.runtime.sendMessage({
  greeting: contact_message_to_background
}, function (response) {
  blocked_list = response["farewell"];
  overlay_check_val = response["checked_state"];
  if (blocked_list.length < 1) {
    document.documentElement.style.visibility = "";
    return
  } else {
    main_script();
  };
});

function main_script() {
  //extends jquery with a case-insensitive contains selector method
  $.expr[':'].containsIgnoreCase = function (n, i, m) {
    return jQuery(n).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
  };
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    cover_script();
    refire = true;
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      cover_script();
      refire = true;
    }, false);
  };
  if (document.readyState == "complete") {
    add_observer_listener();
    observer.observe(target_mutation, config_mutation);
  } else {
    window.addEventListener("load", function () {
      add_observer_listener();
      observer.observe(target_mutation, config_mutation);
    }, false);
  }
};

function cover_script() {
  var found_object = word_check();
  if (found_object["found"] === true) {
    if (refire === false && overlay_check_val == true) {
      add_overlay(found_object["blocked_word"])
    }
    cover_words();
  }
  if (refire === false) {
    document.documentElement.style.visibility = '';
  }
}; // end of script_cover function

function word_check() {
  var i;
  for (i = 0; i < blocked_list.length; i += 1) {
    var blocked_word = blocked_list[i];
    var all_content = document.body.innerHTML;
    if (all_content.toLowerCase().indexOf(blocked_word.toLowerCase()) != -1) {
      return {
        "found": true,
        "blocked_word": blocked_word
      };
    }
  }
  return {
    "found": false,
    "blocked_word": ""
  };
};

function cover_words() {
  var i;
  for (i_count = 0; i_count < blocked_list.length; i_count += 1) {

    var blocked_word = blocked_list[i_count] // This is the current blocked_word to block

    var containing_text_nodes = $('*:containsIgnoreCase(' + blocked_word + ')').contents().filter(function () {
      if ($(this).length > 0) {
        return this.nodeType == 3;
      }
    }).filter(function () {
      return $(this).text().toLowerCase().indexOf(blocked_word.toLowerCase()) > -1;
    })

    var containing_parents = containing_text_nodes.parent();
    var all_of_it = containing_parents.not(".spoil_super")
    all_of_it = all_of_it.filter(function () {
      return $(this).data(blocked_word) != "true"
    })
    all_of_it.data(blocked_word, "true"); // marks element as containing blocked_wordd

    var a_tags_with_href = $("a[href]");
    var a_tags_group = a_tags_with_href.filter(function () {
      return $(this).attr('href').toLowerCase().indexOf(blocked_word.toLowerCase()) > -1;
    });
    a_tags_group = a_tags_group.filter(function () {
      return $(this).data(blocked_word) != "true"
    })
    a_tags_group.data(blocked_word, "true");

    var img_tags_with_src = $("img[src]");
    var img_tags_group_src = img_tags_with_src.filter(function () {
      return $(this).attr('src').toLowerCase().indexOf(blocked_word.toLowerCase()) > -1;
    });
    var img_tags_with_alt = $("img[alt]");
    var img_tags_group_alt = img_tags_with_alt.filter(function () {
      return $(this).attr('alt').toLowerCase().indexOf(blocked_word.toLowerCase()) > -1;
    });
    var img_tags_group = img_tags_group_src.add(img_tags_group_alt);

    img_tags_group = img_tags_group.filter(function () {
      return $(this).data(blocked_word) != "true"
    })
    img_tags_group.data(blocked_word, "true");

    all_of_it = all_of_it.add(a_tags_group).add(img_tags_group.parent());
    all_of_it = all_of_it.filter(function () {
      return ($(this).parents('script,head').length == 0)
    }); // removes elements inside script and head tags
    if (all_of_it.length > 0) {
      var elms_with_a_parents = all_of_it.filter(function () {
        return $(this).parents().filter("a").length > 0
      });
      var rest = all_of_it.not(elms_with_a_parents);
      all_of_it = rest.add(elms_with_a_parents.parents().filter("a").last()); // Gets the highest a tag ancestor
      var set1 = all_of_it.not("em,span,a,li"); // Can add other text styling tags (good for google search results where key blocked_wordd is bolded)
      var set2 = all_of_it.filter("em,span,a,li").closest("*:not('em'):not('span'):not('a'):not('li')"); // Can add other text styling tags (good for google search results where key blocked_wordd is bolded)   
      var total_set = set1.add(set2);

      var repeated_els = total_set.filter(function () {
          return ($(this).children().filter('.spoil_covering_class').length > 0)
        })
        // var repeated_els=total_set.filter('$(this).children().filter('.spoil_covering_class');
      var total_set_first = total_set.not(repeated_els);
      var set_a_parents = total_set_first.parents().filter("a")
      var set_a_children = total_set_first.children().filter("a")
      var extra_a = set_a_parents.add(set_a_children)
      total_set_first.css({
        'pointer-events': 'none',
        'cursor': 'default'
      }); // the pointer-events prevent clicking hyperlinks etc. on the spoiler content
      extra_a.css({
        'pointer-events': 'none',
        'cursor': 'pointer'
      });
      total_set_first.on('click', prevent_links_func); //disables all click events
      extra_a.on('click', prevent_links_func);
      total_set_first.filter(function () {
        var position = $(this).css('position');
        return position === 'static';
      }).css({
        'position': 'relative'
      }); //This makes sure there are no static (which is the default) positioned elements so that the cover can be absolutely positioned
      var covering = make_spoiler_cover(blocked_word);
      total_set_first.append(covering);
      if (repeated_els.length > 0) {
        old_covers = repeated_els.children().filter('.spoil_covering_class');
        inner_covering = old_covers.children().filter('.spoil_inner_class');
        var phrase_node = inner_covering.contents().filter(function () {
          if ($(this).length > 0) {
            return this.nodeType == 3;
          }
        })
        if (phrase_node.length > 0) {
          updated_phrase = phrase_node[0].nodeValue.concat(', ' + blocked_word);
          phrase_node[0].nodeValue = updated_phrase;
        }

      };
      var new_buttons = $(".spoil_btn_class").filter(function () {
        return $(this).data("placed") != "true";
      });
      new_buttons.click(function (ev) {
        spoil_btn_click_func(this, ev)
      }); //Sets the click function on all spoiler buttons
      new_buttons.data("placed", "true");
    }
  }
} // end of cover_words function

var make_spoiler_cover = function (blocked_word) {
  var covering = document.createElement("div"); //create covering div element
  covering.className = "spoil_covering_class spoil_super";
  var inner_div = document.createElement("div");
  inner_div.className = "spoil_inner_class spoil_super";
  inner_div.innerHTML = "Blocked content: " + blocked_word;
  covering.appendChild(inner_div);

  var spoil_btn = document.createElement("BUTTON") //create button to get rid of cover
  spoil_btn.innerHTML = "REVEAL";
  spoil_btn.className = "spoil_btn_class spoil_super";
  inner_div.appendChild(spoil_btn)
  return covering;
};

function spoil_btn_click_func(my_btn, ev) { //removes the cover and button when clicked, and reveals the spoiler content
  ev.preventDefault();
  ev.stopPropagation();
  if (typeof observer != "undefined") {
    observer.disconnect();
  }
  var blocked_wordd_containing_element = $(my_btn).parent().parent().parent();
  var set_a_parents = blocked_wordd_containing_element.parents().filter("a");
  var set_a_children = blocked_wordd_containing_element.children().filter("a");
  var all_elems = blocked_wordd_containing_element.add(set_a_parents).add(set_a_children);
  all_elems.off('click', prevent_links_func);
  all_elems.css({
    'pointer-events': 'auto'
  });
  $(my_btn).parent().parent().remove()
  if (typeof observer != "undefined") {
    observer.observe(target_mutation, config_mutation)
  }
}



function add_overlay(blocked_word) {
  var overlay = document.createElement("div");
  var overlay_inner_div = document.createElement("div");
  var back_link = document.createElement("p")
  var forward_link = document.createElement("p")
  var spoiler_title = document.createElement("p")
  overlay.className = "overlay_class spoil_super";
  overlay_inner_div.className = "overlay_inner_class spoil_super";
  back_link.className = "navigation_back_class spoil_super";
  forward_link.className = "navigation_forward_class spoil_super";
  spoiler_title.className = "spoiler_title_class spoil_super";
  spoiler_title.innerHTML = "Material on this page about " + blocked_word;
  forward_link.innerHTML = "That's ok, let me in";
  back_link.innerHTML = "Get me out of here!";
  overlay.appendChild(overlay_inner_div);
  overlay_inner_div.appendChild(spoiler_title);
  overlay_inner_div.appendChild(back_link);
  overlay_inner_div.appendChild(forward_link);

  function forward_link_func(my_btn) {
    if (typeof observer != "undefined") {
      observer.disconnect();
    }
    //removes the cover and button when clicked, and reveals the spoiler content
    $(my_btn).parent().parent().remove();
    if (typeof observer != "undefined") {
      observer.observe(target_mutation, config_mutation);
    }
  }

  function back_link_func() {
    if (typeof observer != "undefined") {
      observer.disconnect();
    }
    window.history.back();
  }

  document.body.appendChild(overlay);
  $(".navigation_forward_class").click(function () {
    forward_link_func(this)
  })
  $(".navigation_back_class").click(function () {
    back_link_func(this)
  })
} //end of add_overlay function