
//Content script for spoiler extension
document.documentElement.style.visibility = 'hidden';

console.log("running content script")
var spoiler_list=[]
var contact_message_to_back={'tag': 'load_to_content'}
chrome.runtime.sendMessage({greeting: contact_message_to_back}, function(response) {
  console.log("sending_message")
  spoiler_list=response.farewell;
  });

document.addEventListener('DOMContentLoaded', function() {
  if (spoiler_list.length>0){
      cover_words(spoiler_list);
      document.documentElement.style.visibility = '';
  }
  else{
    console.log("no_blocked_words")
      document.documentElement.style.visibility = '';
  }

var prevent_links_func= function(ev) {
  ev.preventDefault();
    }

function add_overlay(wor){
  console.log("in add_overlay")
 // document.body.style.visibility="hidden";
  var overlay=document.createElement("div");
  var overlay_inner_div=document.createElement("div");
  var back_link=document.createElement("p")
  var forward_link=document.createElement("p")
  var spoiler_title=document.createElement("p")
  //overlay.id="overlay_elem";
  overlay.className += "overlay_class";
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

        all_of_it=$('*:containsIgnoreCase('+wor+')').filter(function() {
            return (
            $(this).clone() //clone the element
            .children() //select all the children
            .remove() //remove all the children
            .end() //again go back to selected element
            .filter('*:containsIgnoreCase('+wor+')').not(".spoil_covering_class,.spoiler_title_class,.navigation_forward_class,.navigation_back_class").length > 0)
        });
        var set_a_parents=all_of_it.parents().filter("a")
        var set_a_children=all_of_it.children().filter("a")
        var extra_a=set_a_parents.add(set_a_children)
        //var set_a=all_of_it.filter("a")
        var set1=all_of_it.not("em,span");   // Can add other text styling tags (good for google search results where key word is bolded)
        var set2=all_of_it.filter("em,span").parent(); 
        var total_set= set1.add( set2 );
     //   var repeated_els=total_set.filter('$(this)>.spoil_covering_class');
       console.log('before repeated_els')
        var repeated_els=total_set.filter(function(){
          return( $(this).children().filter('.spoil_covering_class').length>0)
        })
       // var repeated_els=total_set.filter('$(this).children().filter('.spoil_covering_class');
        var total_set_first=total_set.not(repeated_els);
        total_set.css({'visibility':'hidden','pointer-events':'none','cursor':'default'});   // the pointer-events prevent clicking hyperlinks etc. on the spoiler content
        extra_a.css({'visibility':'hidden','pointer-events':'none','cursor':'default'});  
        total_set.on('click',prevent_links_func); //disables all click events
        extra_a.on('click',prevent_links_func);
        total_set_first.filter(function(){
           var position = $(this).css('position');
           return position === 'static';
        }).css({'position':'relative'});  //This makes sure there are no static (which is the default) positioned elements so that the cover can be absolutely positioned
        total_set_first.append(covering);
        console.log("after covering")
        if (repeated_els.length>0){
        old_covers=repeated_els.children().filter('.spoil_covering_class');
        cur_phrase=old_covers.children().filter('.spoil_phrase_class')
        updated_phrase=cur_phrase.html().concat(wor);
      };
        $(".spoil_btn_class").click(function(ev){btn_click_func(this,ev)})  //Sets the click function on all spoiler buttons
  }
}

});  // end of DOM loaded function