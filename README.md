# selectah.js
Small no-frills jQuery clone. Why? Because I can. Unminified but mostly golfed, it's currently about 8.25kb. Compare to 84kb for minified jQuery.

## What haven't you stolen from jQuery?
.fadeIn(), .fadeOut(), .before(), .after(), .insertAfter(), .insertBefore(), $.htmlPrefilter(), .replaceAll(), .replaceWith(), .unwrap(), .wrap(), .wrapAll(), .wrapInner(), .add(), .addBack(), .andSelf(), .closest(), .contents(), .end(), .filter(), .has(), .map(), .next(), .nextAll(), .nextUntil(), .not(), .offsetParent(), .parents(), .prev(), .prevAll(), .prevUntil(), .slice(), .clearQueue(), .dequeue(), $.dequeue(), $.hasData(), $.queue(), .queue(), .removeData(), $.removeData(), .outerHeight(), .outerWidth(), .innerHeight(), .innerWidth(), .scrollLeft(), .scrollRight(), .scrollTop(), .animate(), .data(), .get(), .index(), $.param(), .toArray(), .serialize(), .serializeArray(), $.get(), $.getJSON(), $.getScript(), .prop(), .removeProp(), .removeAttr(), any AJAX function, any deferred/promise functions, any animation/effect function, any shorthand event handler function (.click(), .blur(), etc), some CSS3 selector support, and probably more but I'm tired of scrolling through jQuery's site. 

## Why weren't these included? What kind of programmer are you that you don't use, uh, like, $.removeData(), which is just SO important in MY very specific application???
I have a guess that the vast majority of people using jQuery only use it for 2 things: simple selections using simple selectors, and performing up to 2 physical, chained actions on a selected set of elements. Binding event handlers, showing and hiding elements, adjusting CSS, looping through a bunch of elements to perform a check on each one, etc. 

If that's all you're using jQuery for, plus or minus a few features listed above, why not JUST have those functions available? Why include the entire 84kb of minified jQuery? If you need promises or CSS animation, there are far more efficient and comprehensive libraries that can wrap that all up for you.

If at the end of the day, you still need some of the stuff above, you have 2 options as I see it. First, you can get off your lazy ass and figure out the handful of lines required to do your task. It all boils down to Javascript, a language you presumably know since you ended up here. It can't be that hard, man. Secondly, just use jQuery! No one would fault you for using a larger toolkit, especially an industry standard like jQuery.

## Okay but -
And another thing: have you actually looked at jQuery's source? Like, really _looked_ at it to try and ~~steal~~understand their functions? Most of it is redundant. Most of it is wrappers around wrappers around wrappers. It's a huge mess representing years of compatibility, polyfill, changing design choices, and new technologies. In the end, all of that impressive technology is just doing basic Javascript back there somewhere. Javascript that you know, and would probably facepalm if you could only peel away all the layers to discover it. Javascript that, maybe with some adjustments or a polyfill here and there, works in all browsers. 

# What it do
All functions return undefined (or false if I golfed too hard) if you don't give them their required arguments.

All functions return a copy of the object itself, like jQuery, unless you've asked for a specific value from those elements, or have asked to change the set of elements. In any case, you're either getting a $(), a boolean, or a value.

All functions that don't return a straight value are chainable.

<dl>
  <dt>`.on(string event, function handler)`</dt>
  <dd>Binds the handler to the given event in relation to the selected element(s). Binds all elements that have been selected.</dd>
  <dd>Example: `$('#theStreets').on('hover', function() { // do hoodrat shit })`</dd>
  
  <dt>`.off(string event)`</dt>
  <dd>Removes all handlers assigned to the given event in relation to the selected element(s). Unbinds all handlers for all elements.</dd>
  <dd>Example: `$('#emailYourGrandparents').off('click')`</dd>
  
  <dt>`.css(string rule, [ mixed value, [ string units ] ])`</dt>
  <dd>If no value is given, it returns the given rule for the first selected element. If a value is given, it changes the rule to that value for the selected element(s). If a unit is given, it'll just concatenate the value and the unit together. This was included to provide some optional granularity. **Note:** There is no lookup table between the DOM rule names (fontSize) and the CSS ones (font-size). It will only understand the DOM ones, as returned by `getComputedStyle(Node element)`</dd>
  <dd>Example: `$('a').css('fontSize', '400', 'vw')`, `$('a').css('fontSize', '400vw')`, `$('a').css('fontSize')`</dd>

  <dt>`.first()`</dt>
  <dd>Returns an instance of selectah containing only the first element from the original selection.</dd>
  
  <dt>`.last()`</dt>
  <dd>Returns and instance of selectah containing only the last element from the original selection.</dd>
  
  <dt>`.each(function handler)`</dt>
  <dd>Iterates through the selected element(s), running the given function for every element. Arguments passed to the function are: `Node element, number index`</dd>
  <dd>Example: `$('p').each(function(element, i) { // remove all mention of your ex  })`</dd>
  
  <dt>`.addClass(string class)`</dt>
  <dd>Adds the given class(es) to the selected element(s). Features Node.classList support, and a fallback to Node.className.</dd>
  <dd>Example: `$('.porkchop').addClass('applesauce')`</dd>
  
  <dt>`.hasClass(string class)`</dt>
  <dd>Returns true if the first selected element has the given class, otherwise returns false.</dd>
  <dd>Example: `$('.noShitSherlock').hasClass('noShitSherlock') ==> true`</dd>
  
  <dt>`.removeClass(string class)`</dt>
  <dd>Removes the given class from the selected element(s). Features Node.classList support, and a fallback to Node.className.</dd>
  <dd>Example: `$('.castle').removeClass('peach')`</dd>
  
  <dt>`.toggleClass(string class)`</dt>
  <dd>If the selected element(s) already have the given class assigned to them, remove it. Otherwise, give it to them.</dd>
  <dd>Example: `$('.them').toggleClass('giveItTo')`</dd>
  
  <dt>`.hide()`</dt>
  <dd>Hides (`display: none`) the selected element(s).</dd>
  <dd>Example: `$('#shame').hide()`</dd>
  
  <dt>`.show()`</dt>
  <dd>Shows (`display: ''`) the selected element(s).</dd>
  <dd>Example: `$('.paultryAccomplishments').show()`</dd>
  
  <dt>`.toggle()`</dt>
  <dd>Hides any selected elements that are visible, and shows any selected elements that are hidden.</dd>
  <dd>Example: `$('#eyesInTheDark').toggle()`</dd>
    
  <dt>`.children()`</dt>
  <dd>Returns an instance of selectah containing the child nodes of the first selected element.</dd>
  <dd>Example: `$('#corn').children()`</dd>
  
  <dt>`.attr(string attribute, [ mixed value ])`</dt>
  <dd>If a value is given, sets the given attribute to that value for the selected element(s). Otherwise, returns the value of the given attribute for the first selected element.</dd>
  <dd>Example: `$('a').attr('href', 'http://http://youmightnotneedjquery.com/)`, `$('span#iAmAGoldenGod').attr('title')`</dd>
  
  <dt>`.text([ mixed value ])`</dt>
  <dd>If a value is given, sets the text component of the selected element(s) to that value. Otherwise, returns the text component of the first selected element.</dd>
  <dd>Example: `$('input').text('Oh god please help')`, `$('input').text()`</dd>
    
  <dt>`.find([ string selector ])`</dt>
  <dd>Attempts to find child nodes of the first selected element that match the given selector. If no selector is given, it behaves just like `.children()`. Why you'd do that, I don't know, but it makes sense.</dd>
  <dd>Example: `$('div#haystack').find('#needle')`, `$('div#haystack').find()`</dd>
    
  <dt>`.html([ mixed value ])`</dt>
  <dd>If a value is given, sets the inner HTML of the selected element(s) to the given value. As this is done using Node.innerHTML, HTML strings will be parsed, and don't need to be converted ahead of time to Nodes or whatever. If no value is given, returns the inner HTML of the first selected element.</dd>
  <dd>Example: `$('#goodbye').html($('#hello').html())`, `$('#goodbye').html()`</dd>
    
  <dt>`.is(string selector)`</dt>
  <dd>Returns true if the first selected element matches the given selector. Otherwise, returns false ~~hopes~~ ~~dreams~~.</dd>
  <dd>Example: `$('#pantaloons').is('.pants')`</dd>
    
  <dt>`.parent()`</dt>
  <dd>Returns the parent node of the first selected element.</dd>
  <dd>Example: `$('#thatBratAtTheMall').parent()`</dd>
    
  <dt>`.position()`</dt>
  <dd>Returns the top, bottom, left, and right pixel position of the first selected element. I'll be honest, I'm not sure if this includes or discludes border, padding, or margins, so be wary.</dd>
  <dd>Example: `$('#allTheWayOverHere').position() ==> { top: 0, left: 0, bottom: 0, right: 0 }`</dd>
    
  <dt>`.contains(string selector)`</dt>
  <dd>Returns true if the first selected element has a child node that matches the given selector. Otherwise, returns false.</dd>
  <dd>Example: `$('#oatmeal').contains('.blueberry')`</dd>
    
  <dt>`.empty()`</dt>
  <dd>Removes all child nodes from the selected element(s). Remember: when you die in the console, you die in real life.</dd>
  <dd>Example: `$('ul#expectations').empty()`</dd>
    
  <dt>`.offset()`</dt>
  <dd>Returns the offset position for the first selected element, as given by Node.getBoundingClientRect()</dd>
  <dd>Example: `$('.dontStandSoClose').offset()`</dd>
    
  <dt>`.remove()`</dt>
  <dd>Removes the selected element(s) from the DOM tree. Basically `rm -rf ./` but for Nodes.</dd>
  <dd>Example: `$('#pants').remove()`</dd>
    
  <dt>`.siblings()`</dt>
  <dd>Returns an instance of selectah containing all sibling nodes to the first selected element, not including that element.</dd>
  <dd>Example: `$('#marshaMarshaMarsha').siblings()`</dd>
    
  <dt>`.trigger(string event)`</dt>
  <dd>Simulates the given event happening on the selected element(s). Whether or not those elements have a handler hooked to that event is on you.</dd>
  <dd>Example: `$('.protestor').trigger('change')`</dd>
    
  <dt>`.height([ mixed value, [ string unit ] ])`</dt>
  <dd>Just a shortcut to `.css('height', value, unit)` because you're lazy.</dd>
  <dd>Example: `$('.tree').height(500, 'em')`, `$('.tree').height('500em')`, `$('.tree').height()`</dd>
    
  <dt>`.width([ mixed value, [ string unit ] ])`</dt>
  <dd>Just a shortcut to `.css('width', value, unit)` because you're lazy.</dd>
  <dd>Example: `$('#yoMama').width(500, 'em')`, `$('#yoMama').width('500em')`, `$('#yoMama').width()`</dd>
    
  <dt>`.isVisible()`</dt>
  <dd>Returns true if the first selected element is at least partially visible in the viewport. Keep in mind that I said _partially_, meaning it could only be a sliver on the top of the page, and be true. Otherwise, returns false.</dd>
  <dd>Example: `$('.horizon').find('#mountain').isVisible() ==> true`</dd>
    
  <dt>`.areVisible()`</dt>
  <dd>Same as `.isVisible()` except it will only return true if ALL selected elements are at least partially visible in the viewport. Otherwise, returns false.</dd>
  <dd>Example: `$('#forest').find('.tree').areVisible() ==> false`</dd>
    
  <dt>`.context()`</dt>
  <dd>Returns the context with which the selected element(s) were selected. Unless you supplied a context in the selection, or you changed the selection criteria, this will probably be `document`.</dd>
  <dd>Example: `$('#thereIsntAGoodExampleOfThis').context() ==> document`</dd>
    
  <dt>`.count()`</dt>
  <dd>Just a fancy way of saying `.length`, which is also available to you.</dd>
  <dd>Example: `$('.fingers.heldUp).count()`</dd>
    
  <dt>`.val([ mixed value ])`</dt>
  <dd>If a value is given, sets the value attribute of the selected element(s) to that value. Two things: first, I'm just trusting that you know whether you need to use `.text()`, `.val()`, or `.html()`; second, I'm pretty sure you can also do `.attr('value')` </dd>
  <dd>Example: `$('#valery').val('Actually it's spelled Valerie, but you can call me Val')`</dd>
    
  <dt>`.clone()`</dt>
  <dd>Returns a deep clone of the first selected element. This is not wrapped in selectah - it's just the straight up Node. This can be useful if you're trying to move element trees around, and it acts like there should only ever be one of them.</dd>
  <dd>Example: `$('#gaiusBaltar').clone()`</dd>
    
  <dt>`.append(mixed element)`</dt>
  <dd>If an element is given, in straight Node, HTML string, or selectah formats, append that element to the originally selected element(s) child list.</dd>
  <dd>Example: `$('#battlestarGalactica').find('#crew').append($('#gaiusBaltar').clone())`</dd>
    
  <dt>`.prepend(mixed element)`</dt>
  <dd>If an element is given, either in straight Node or selectah formats, prepend that element to the originally selected element(s) child list.</dd>
  <dd>Example: `$('#line').prepend('<li>Cutter</li>')`</dd>
    
  <dt>`.appendTo(mixed element)`</dt>
  <dd>Appends the selected element(s) to the given Node(s), like `.append()` but the other way.</dd>
  <dd>Example: `$('<p>One more thing...</p>').appendTo('#shitIGottaDoToday')`</dd>
    
  <dt>`.prependTo(mixed element)`</dt>
  <dd>Prepends the selected element(s) to the given Node(s), like `.prepend()` but the other way.</dd>
  <dd>Example: `$('<li>Cutter</li>').prependTo('#line')`</dd>


## Will you ever add `/([?]?\.(\w+))\(\)$/` to your thing? 
Yeah, sure man. Things like .closest() and .serialize() are pretty useful, but I considered them outside of the toolkit I was currently building. They might even be in there on the next push, who knows. If you (or I, to myself) can give me a solid reason why your favorite function should make my library fatter and less efficient than it already is, I'll give it a thought.

## Where's my `/\.fade[Out|In]\(\)$/`, man?
The way jQuery does its animations, even the basic ones, would require more bloat than I'm willing to take on currently. I would suggest doing what you're _supposed_ to be doing and use CSS animations via adding and removing classes.

## It's broken, like my self-worth!
I would love to hear about it! I'm a lazy tester, and want this to work exactly how you think it should based on your experience with jQuery equivalent functions.

# You are bad
Yes I am :( But I gotta get that paper.
