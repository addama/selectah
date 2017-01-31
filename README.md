# selectah.js
Small no-frills jQuery clone. Why? Because I can. Golfed and minified, it's currently just about 6kb, and even less when gzipped. Compare to 84kb for minified jQuery.

* *selectah.max.js* (21.9kb): fully commented, no shortcuts, no golfing, not minified
* *selectah.mod.js* (7.12kb): no comments, fully golfed, but still tabbed out so you can get line numbers if errors occur
* *selectah.min.js* (5.93kb): no comments, all the shortcuts I know, fully golfed, minified

## Not ~~stolen~~ported from jQuery
.fadeIn(), .fadeOut(), .before(), .after(), .insertAfter(), .insertBefore(), $.htmlPrefilter(), .replaceAll(), .replaceWith(), .unwrap(), .wrap(), .wrapAll(), .wrapInner(), .add(), .addBack(), .andSelf(), .closest(), .contents(), .end(), .filter(), .has(), .map(), .next(), .nextAll(), .nextUntil(), .not(), .offsetParent(), .parents(), .prev(), .prevAll(), .prevUntil(), .slice(), .clearQueue(), .dequeue(), $.dequeue(), $.hasData(), $.queue(), .queue(), .removeData(), $.removeData(), .outerHeight(), .outerWidth(), .innerHeight(), .innerWidth(), .scrollLeft(), .scrollRight(), .scrollTop(), .animate(), .data(), .get(), .index(), $.param(), .toArray(), .serialize(), .serializeArray(), $.get(), $.getJSON(), $.getScript(), .prop(), .removeProp(), .removeAttr(), any AJAX function, any deferred/promise functions, any animation/effect function, any shorthand event handler function (.click(), .blur(), etc), some CSS3 selector support, and probably more but I'm tired of scrolling through jQuery's site. 

## Why weren't these included? 
I have a guess that the vast majority of people using jQuery only use it for 2 things: simple selections using simple selectors, and performing a handful of specific chained actions on those selections. Binding event handlers, showing and hiding elements, adjusting CSS, looping through a bunch of elements to perform a check on each one, etc. The functions listed above are certainly useful (particularly the animation and promise sections), but are outside of what a basic DOM selection and manipulation library should have.

For example, animating CSS properties is more efficiently done, and arguably more "modern" if not _correct_, using CSS animations applied with classes. Promises are built in to Javascript, and are being sugared in ES6. All you really need there are a few functions to replicate jQuery's chaining interface. The rest are convenience functions that either trade one vanilla JS line for a slightly shorter jQuery-flavored line (actually, trading one line of typed code for about 80-ish lines of wrappers surrounding 1 line of vanilla JS), or are conceptual features that may have a place somewhere, but are ultimately just fluff. If you're processing your DOM elements one a time like you're working on a tape machine (`.prev()`, `.next()`, etc), I'm sure you have your reasons, but there are far better and more efficient ways to do what you're doing.

# Functions
All functions return `undefined` if you don't give them their required arguments.

All functions return a copy of the object itself, like jQuery, unless you've asked for a specific value from those elements, or have asked to change the set of elements. In any case, you're either getting a $(), a boolean, or a value.

All functions that don't return a value are chainable.

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

## Issues
My goal, like most jQuery replacements, is for the library to feel like jQuery so that you're not lost trying to figure out how to do it "my" way. If what selectah does doesn't line up with jQuery, or there are errors, please let me know. Additionally, if I have misjudged the use cases for some of the discluded functions, I encourage you to present your case. The only exception to this is CSS animations - the bloat required to replicate jQuery's animation engine would defeat the entire purpose of being a smaller alternative.

# Todo
* `.serialize()`, `.replace()`, `.replaceAll()`, and maybe `.closest()`, as these fit into the scope, but didn't make it into the first pass
 
# Other jQuery alternatives
There are a lot, and mine is just one. If my feature set isn't to your liking, the by-no-means complete list below are pretty great.
* [Balalaika](https://github.com/finom/balalaika): extended from the Array prototype, includes only the selector, `.on()`, `.off()`, `.is()`, and `.extend()`. See also its even smaller version "bala."
* [Zepto](http://zeptojs.com/): Has an amazing selection of functions, which are grouped into convenient packages. "Aerogel light", which is not... in any way true, but the important thing is that it _can_ be, if you don't include any of the modules.
* [Minified](http://minifiedjs.com/api/): Comparable functionality to Zepto, but smaller footprint.
* [Cash](https://github.com/kenwheeler/cash/): Slightly larger footprint than selectah, slightly larger feature set. Probably what I'd use if I was too lazy to write my own.
