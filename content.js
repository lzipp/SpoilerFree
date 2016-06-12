
//Content script for spoiler extension
$( document ).ready(function() {
  document.body.style.display = 'none !important';
  console.log("in hideing")
 // document.body.style.color='green!important';
});
console.log("running content script")
var spoiler_list=[];
var child_stat;   //used for static children of body (used now for espn overlay)
var contact_message_to_back={'tag': 'load_to_content'}
//get spoiler_list words from background.js
chrome.runtime.sendMessage({greeting: contact_message_to_back}, function(response) {
  console.log("sending_message")
  spoiler_list=response.farewell;
  script_to_cover(); //run main script once list is received
  });

function script_to_cover(){                        // main script
console.log("running cover script with this list:")
console.log(spoiler_list)

$( document ).ready(function() {
  if (spoiler_list.length>0){
      cover_words(spoiler_list);
      document.body.style.display = '';
  }
  else{
    console.log("no_blocked_words")
      document.body.style.display = '';
  }

var prevent_links_func= function(ev) {
  ev.preventDefault();
    }

function add_overlay(wor){
  console.log("in add_overlay")
 // return

 child_stat= $('body').children().filter(function(){
           var position = $(this).css('position');
          return (position === 'static');
       }).css({'position':'relative'});
 child_stat.css('zIndex', '-100');
 var position_children= child_stat.map(function(){
      return ($(this).prop('position'));
     }).get();

// child_stat=$(document.body.children.querySelectorAll('[position="static"]'));
// child_stat.css({'position':'relative'});
// child_stat.css('zIndex', '-100');

  var overlay=document.createElement("div");
  var overlay_inner_div=document.createElement("div");
  var back_link=document.createElement("p")
  var forward_link=document.createElement("p")
  var spoiler_title=document.createElement("p")
  //overlay.id="overlay_elem";
  overlay.className = "overlay_class";
  overlay_inner_div.className+="overlay_inner_class";
  back_link.className+= "navigation_back_class";
  forward_link.className+= "navigation_forward_class";
  spoiler_title.className+="spoiler_title_class";
  spoiler_title.innerHTML="Material on this page about "+wor;
  forward_link.innerHTML="That's ok, let me in";
  back_link.innerHTML="Get me out of here!";
  //overlay.innerHTML="WHHHHHHHAAAAAAAAAAAATTTTTT";
  overlay.appendChild(overlay_inner_div);
  overlay_inner_div.appendChild(spoiler_title);
    overlay_inner_div.appendChild(back_link);
  overlay_inner_div.appendChild(forward_link);
 //document.documentElement.className = 'html_class'​​​​;
//className+="html_class";

  function forward_link_func(my_btn){                 //removes the cover and button when clicked, and reveals the spoiler content
        $(my_btn).parent().parent().remove();
 } 

   function back_link_func() {
    window.history.back();
}

  document.body.appendChild(overlay);
  $(".navigation_forward_class").click(function(){forward_link_func(this)})  //Sets the click function on all spoiler buttons
  $(".navigation_back_class").click(function(){back_link_func(this)})  //Sets the click function on all spoiler buttons
}

function cover_words(spoilers){
	var i;
	var wor;
  var found=0;
  for (i=0; i<spoilers.length; i +=1){
    wor=spoiler_list[i];
    var all_content=document.body.innerHTML;
    if (all_content.toLowerCase().indexOf(wor.toLowerCase()) != -1){
        console.log('Found Matched');
        found=1;
        i=spoilers.length // This will make it the last iteration
        add_overlay(wor);
    } 
  }
if (found==0){
        console.log("no match found")
        return
        }

  $.expr[':'].containsIgnoreCase = function (n, i, m) {
  return jQuery(n).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
  }; //extends jquery with a case-insensitive contains selector method

	for (i=0; i<spoilers.length; i +=1){

	      wor=spoiler_list[i]   // This is the current word to block

        var covering = document.createElement("div");     //create covering div element
        covering.className += "spoil_covering_class"
        var cover_phrase=document.createElement("p");
        cover_phrase.className+="spoil_phrase_class";
        cover_phrase.innerHTML="This might contain info about "+wor;
        covering.appendChild(cover_phrase);

        var spoil_btn=document.createElement("BUTTON")   //create button to get rid of cover
        spoil_btn.innerHTML="X";
        spoil_btn.className += "spoil_btn_class";

        function btn_click_func(my_btn,ev){                 //removes the cover and button when clicked, and reveals the spoiler content
          ev.preventDefault();
          //ev.stopPropagation();
          console.log("in btn click func");
          var word_containing_element= $(my_btn).parent().parent();
          var set_a_parents=word_containing_element.parents().filter("a");
          var set_a_children=word_containing_element.children().filter("a");
          var all_elems=word_containing_element.add(set_a_parents).add(set_a_children);
          all_elems.off('click',prevent_links_func);
          all_elems.css({'visibility':'initial','pointer-events':'auto'});
          $(my_btn).parent().remove()
           } 
         
        covering.appendChild(spoil_btn)

        var all_of_it=$('*:containsIgnoreCase('+wor+')').filter(function() {
            return (
            $(this).clone() //clone the element
            .children() //select all the children
            .remove() //remove all the children
            .end() //again go back to selected element
            .filter('*:containsIgnoreCase('+wor+')').not(".spoil_covering_class,.spoiler_title_class,.navigation_forward_class,.navigation_back_class").length > 0)
        });

        var a_tags_group= $("a[href*='"+wor.toLowerCase+"']");
        if (a_tags_group.length>0){
          console.log("found <a> tags")
        };
        var total_group=all_of_it.add(a_tags_group);
        total_group=total_group.filter(function() {
            return($(this).parents('script,head').length==0)
        }); // removes elements inside script and head tags
        total_group=total_group.not('script,head'); 
        var all_with_a_parents=total_group.filter(function() {
          return($(this).parents('a').length>0)
        });
        var additional_a_els=total_group.parents('a');
        total_group=total_group.not(all_with_a_parents);
        total_group=total_group.add(additional_a_els);
        var set_a_children=total_group.children().filter("a")

     //   var set1=total_group.closest("*:not('em'):not('span')"); // Can add other text styling tags (good for google search results where key word is bolded)
       var set1=total_group.filter('em,span').parent()
        var set2=total_group.not("em,span");
       var  final_group=set1.add(set2);
   //  var final_group=total_group
     //   var repeated_els=total_set.filter('$(this)>.spoil_covering_class');
        var repeated_els=final_group.filter(function(){
          return( $(this).children().filter('.spoil_covering_class').length>0)
        })
       // var repeated_els=total_set.filter('$(this).children().filter('.spoil_covering_class');
        var total_set_first=final_group.not(repeated_els);
        final_group.css({'visibility':'hidden','pointer-events':'none','cursor':'default'});   // the pointer-events prevent clicking hyperlinks etc. on the spoiler content
        set_a_children.css({'pointer-events':'none','cursor':'default'});  
        final_group.on('click',prevent_links_func); //disables all click events
        set_a_children.on('click',prevent_links_func);
        total_set_first.filter(function(){
           var position = $(this).css('position');
           return position === 'static';
        }).css({'position':'relative'});  //This makes sure there are no static (which is the default) positioned elements so that the cover can be absolutely positioned
        total_set_first.append(covering);
        if (repeated_els.length>0){
   old_covers=repeated_els.children().filter('.spoil_covering_class');
        phrase_elem=old_covers.children().filter('.spoil_phrase_class')
        updated_phrase=phrase_elem.html().concat(', '+ wor);
        phrase_elem.html(updated_phrase);
      };
        $(".spoil_btn_class").click(function(ev){btn_click_func(this,ev)})  //Sets the click function on all spoiler buttons
  }
}

});  // end of DOM loaded function
}; //end of script_to_cover function