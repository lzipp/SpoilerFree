function getText(){
    return document.body.innerText
}

var parse_html = function(html) {
    var el = document.createElement('div');
    el.innerHTML = html;
    return el.childNodes[0];
}

var parse_html2 = function(html) {
    var el = document.createElement('div');
    el.innerHTML = html;
    return el.innerHTML;
}
function spoiled_indices(html_str, word) {
  var result = [];
  flag=false
  for (i = 0; i < html_str.length; ++i) {
    // If you want to search case insensitive use 
    // if (source.substring(i, i + find.length).toLowerCase() == find) {
    if (html_str.substring(i, i + word.length) == word) {
      result.push(i);
      flag=true
    }
  }
  return flag;
}
function find_relevant_divs(word_inds,div_inds) {
	var div_result =[];
	for (i=0; i<word_inds.length; i++) {
		word_ind
	}
}

function getHTML(){
 //   return document.body.outerHTML
   return document.body.innerHTML
}

function traverse_DOM(obj,sp_word){
	var flag=false
	obj.did_visit_sp=true
	children=obj.childNodes
	//console.log(obj.nodeName)
	if(obj.nodeName=='DIV'){
	obj.parent_divs=obj.parent_divs+1
	in_txt=obj.innerText
	if (in_txt){
	flag=spoiled_indices(in_txt,sp_word)
	}
	if (flag){
		obj.style.backgroundColor="red"
		console.log("changed one!")
	}
}
	if (obj.hasChildNodes()){
	for( i=0; i<obj.childNodes.length; i++ ){
		nod=obj.childNodes[i]
		//console.log('hi')
		//console.log(nod.nodeType)
		//console.log(nod.did_visit==false)
		if((nod.nodeType==1)&&(!nod.did_visit_sp)){
		console.log("in here")
		traverse_DOM(nod,sp_word)
		}}
	}
}

function cover_words(wor){
$('*:contains('+wor+'):not(:has(div))').css('background','green');
console.log('here')

}

console.log("trying")
//$('div:contains("draft"):not(:has(div))').css('background','green');
//$('p:contains("draft"):not(:has(div))').css('background','green');
var wor = "and"
//$('*:contains('+wor+'):not(:has(div))').css('background','green');
//cover_words(wor);
elems=$('*:contains("cyclist"):not(:has(div))');
console.log(elems)
console.log(elems[0])
elems[0].css({"background-color":"red"})
var bodyElement = document.getElementsByTagName("body")[0];
//var htmlNodeIterator = new HTMLNodeIterator();
//htmlNodeIterator.iterate(drawBorders,bodyElement);

/*console.log(getText());   */          //Gives you all the text on the page
//console.log('hello there!!!!!!!!')
//sub=traverse_DOM(bodyElement,"Steswart")
console.log('finished')

//console.log(getHTML());             //Gives you the whole HTML of the page
/*document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Syria", "g"), "nobody");*/

/*element.style.visibility = 'hidden';*/      // Hide

//obj_test=parse_html2('<section><a href="#">Link label</a></section>');
//console.log(parse_html('<section><a href="#">Link label</a></section>'))
//console.log('next')
//console.log(obj_test)