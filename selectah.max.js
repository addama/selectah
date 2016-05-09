// Set up our globals
var $;
var selectahListeners = {};

(function() {
	// Set up the vendor-specific matchesSelector, which is used by .is()
	if (Element && !Element.prototype.matches) {
		var proto = Element.prototype;
		proto.matches = proto.matchesSelector 
			|| proto.webkitMatchesSelector 
			|| proto.mozMatchesSelector 
			|| proto.msMatchesSelector 
			|| proto.oMatchesSelector;
	}

	// Create a new Selectah object with every call to $
	$ = function(selector, context) { 
		return new Selectah(selector, context); 
	}
	
	var Selectah = function(selector = false, context = false) {
		// Selectah can be used in the following ways:
		// 		Simple selections: $('p'), $('#content > .panel')
		// 		Element creation: $('<p>Hello</p>'), $('<ul><li>...</li></ul>')
		// 		Node selection: $($('p').first())
		// A context can be given to narrow down the number of elements
		// that it has to search through. Functions that return subsets of
		// their current selections will often change the context to reflect
		// this change in... context.
		
		if (context) {
			// We can't guarantee how the context will be delivered,
			// so we'll feed it through selectah to make it useable
			context = $(context)[0];
		} else {
			// If no context is given, we can assume that the document
			// is a safe choice
			context = document;
		}
		
		// Initialize some properties
		this.length = 0;
		this.selector = selector 
		this.context = context;
		
		if (selector) {
			if (typeof selector === 'object') {
				// If an array is given, we need to break it apart
				if (selector instanceof Array) {
					for (var i = 0; i < selector.length; i++) {
						this[i] = selector[i];
					}
					
					this.length = selector.length;
				} else {
					// Otherwise, the selector is most likely a DOM Node object
					this[0] = selector;
					this.length = 1;
				}
				
			} else {
				// For strings that include the angle brackets, we assume that
				// they want to create a new element or set of elements
				if (/^</.test(selector)) {
					// A throwaway div is created to house the element(s)
					var temp = document.createElement('div');
					temp.innerHTML = selector;
					// Append the elements to this
					for (var i = 0; i < temp.children.length; i++) {
						this[i] = temp.children[i];
					}
					
					this.length = temp.children.length;
				} else {
					// This is the common case, which will be a regular selector
					var elements = context.querySelectorAll(selector);
					for (var i = 0; i < elements.length; i++) {
						this[i] = elements[i];
					}
					
					this.length = elements.length;
				}
			}
		}
		
		return this;
	};

	core.prototype = {
		on: function(eventType = false, handler = false) {
			// Binds a handler to an event for all selected elements
			// This relationship is currently stored in the global variable 
			// selectahListeners, which allows us to unbind the same handlers
			// with .off()
			if (!this.length || !eventType || !handler) {
				return undefined;
			}
			
			var events = [];
			eventType.toLowerCase();
			
			// If we have multiple events in the string (e.g. "click keyup"),
			// we'll break it up into an array
			if (eventType.indexOf(/\s/g) !== -1) {
				eventType.split(/\s/).forEach(function(event) { 
					events.push(event); 
				});
			} else {
				// Even if there's only one item, it'll be an array
				events.push(event); 
			}
			
			for (var i = 0; i < this.length; i++) {
				var element = this[i];
				events.forEach(function(event) {
					// Here we initialize each step in the selectahListeners tree
					// so that we don't get "can't access property ____ of undefined"
					selectahListeners[element] = selectahListeners[element] || {};
					selectahListeners[element][event] = selectahListeners[element][event] || [];
					selectahListeners[element][event].push(fn);
					// This is what binds the actual handler to the element and event
					element.addEventListener(event, handler);
				});
			}
			
			return this;	
		},
		
		off: function(eventType = false) {
			// Unbinds all handlers from all selected elements for the given event(s)
			// This will only unbind event handlers that were registered with .on(),
			// as any other method will not place the handler in the selectahListener
			// catalog
			if (!this.length || !eventType) {
				return undefined;
			}
			
			var events = [];
			eventType.toLowerCase();
			
			// If we have multiple events in the string (e.g. "click keyup"),
			// we'll break it up into an array
			if (eventType.indexOf(/\s/g) !== -1) {
				eventType.split(/\s/).forEach(function(event) { 
					events.push(event); 
				});
			} else {
				// Even if there's only one item, it'll be an array
				events.push(eventType);
			}
			
			for (var i = 0; i < this.length; i++) {
				var element = this[i];
				if (element in selectahListeners) {
					events.forEach(function(event) {
						// For every event, granted the element has been found to it,
						// we'll unbind the handler first, then remove that entry from
						// selectahListeners. In most cases, the element key will remain,
						// but there shouldn't be any harm in that
						if (event in selectahListeners[element]) {
							var handlers = selectahListeners[element][event];
							for (var j = 0; j < handlers.length; j++) {
								// Unbind the handler
								element.removeEventListener(event, handlers[j]);
							}
							
							// Remove the entry from selectahListeners
							delete selectahListeners[element][event];
						}
					})
				}
			}
			
			return this;
		},
		
		css: function(rule = false, value = false, unit = false) {
			// Sets the given CSS rule to the given value in the given units for all
			// selected elements, if all of those things are given. If no value is given,
			// it returns the value of that CSS rule for the first selected element only
			if (!this.length || (!rule && !value)) {
				return undefined;
			}
			
			if (rule && !value) {
				// Here we get the current style rules for the first element
				// and return the one being asked for
				var style = getComputedStyle(this[0], null);
				return style[rule];
			}
			
			// For added flexibility, you can specify the units separately
			if (unit) {
				value = value + unit;
			}
			
			// Set the CSS rule to the given value for all elements
			for (var i = 0; i < this.length; i++) {
				this[i].style[rule] = value;
			}
			
			return this;
		},
		
		first: function() {
			// Returns an instance of selectah with only the first selected element
			if (!this.length) {
				return undefined;
			} else {
				return $(this[0]);
			}
		},
		
		last: function() {
			// Returns an instance of selectah with only the last selected element
			if (!this.length) {
				return undefined;
			} else {
				return $(this[this.length - 1]);
			}
		},
		
		each: function(handler = false) {
			// Runs a function on every selected element, passing it the element and the
			// element's index in the current selection
			// Will continue to do this until a function returns false, in which case it
			// will stop. I'm not 100% sure that's necessary, but I felt it would be
			// useful to know if your .each() failed
			if (!this.length || !handler) {
				return undefined;
			}
			
			var result;
			
			for (var i = 0; i < this.length; i++) {
				// Break out if the lasthandler returned false
				if (result === false) {
					return result;
				}
				
				// Run the given function
				result = handler(this[i], i);
			}
			
			return this;
		},

		addClass: function(className = false) {
			// Adds the given class to an element. Most browsers will use the first
			// case, using Node.classList, which has its own built in functions,
			// but there is a fallback to the string-based Node.className
			if (!this.length || !className) {
				return undefined;
			}
			
			for (var i = 0; i < this.length; i++) {
				if (this[i].classList) {
					// Node.classList is available
					this[i].classList.add(className);
				} else {
					// Fallback to Node.className
					this[i].className += ' ' + className;
				}
			}
			
			return this;
		},
		
		hasClass: function(className = false) {
			// Checks if the first selected element has the given class. Most 
			// browsers will use the first case, using Node.classList, which 
			// has its own built in functions, but there is a fallback to the 
			// string-based Node.className
			if (!this.length || !className) {
				return undefined;
			}
			
			if (this[0].classList) {
				// Node.classList is available
				return this[0].classList.contains(className);
			} else {
				// Fallback to Node.className
				return new Regexp('(^| )' + className + '( |$)', 'gi').test(this[0].className);
			}
		},
		
		removeClass: function(className = false) {
			// Removes the given class from all selected elements. Most 
			// browsers will use the first case, using Node.classList, which 
			// has its own built in functions, but there is a fallback to the 
			// string-based Node.className
			if (!this.length || !className) {
				return undefined;
			}
			
			for (var i = 0; i < this.length; i++) {
				if (this[i].classList) {
					// Node.classList is available
					this[i].classList.remove(className);
				} else {
					// Build the regex used to perform the check
					var classes = className.split(' ').join('|');
					var regex = new RegExp('(^| )' + classes + '( |$)', 'gi');
					// Search the className string for the given class(es)
					this[i].className = this[i].className.replace(regex, ' ');
				}
			}
			
			return this;	
		},

		toggleClass: function(className = false) {
			// Checks if Node.classList is available, and uses its toggle function.
			// Otherwise, it checks if the Node.className string contains the class,
			// and either adds or removes it
			if (!this.length || !className) {
				return undefined;
			}
			
			for (var i = 0; i < this.length; i++) {
				if (this[i].classList) {
					// Node.classList is available
					this[i].classList.toggle(className);
				} else {
					// Fallback to Node.className
					var classes = this[i].className.split(' ');
					var hasClass = classes.indexOf(className);
					
					if (hasClass !== -1) {
						// Remove the class 
						classes.splice(hasClass, 1);
					} else {
						// Add the class
						classes.push(className);
					}
					
					// Stitch the className string back together
					this[i].className = classes.join(' ');
				}
			}
			
			return this;	
		},

		hide: function() {
			// Hides all selected elements. Passthrough to .css('display', 'none')
			return this.css('display', 'none');
		},
		
		show: function() {
			// Shows the selected elements. Passthrough to .css('display', '')
			return this.css('display', '');
		},
		
		toggle: function() {
			// Shows hidden elements, and hides shown elements
			// This could easily just be a passthrough to .css(), but since 
			// it's such a simple thing, we'll just do it here
			if (!this.length) {
				return undefined;
			}
			
			for (var i = 0; i < this.length; i++) {
				if (this[i].style.display === 'none') {
					// Show the hidden
					this[i].style.display = '';
				} else {
					// Hide the shown
					this[i].style.display = 'none';
				}
			}
			
			return this;
		},
		
		children: function() {
			// Returns a new instance of selectah containing all child elements
			// of the first currently selected element
			if (!this.length) {
				return undefined;
			}
			
			// A Node list isn't an array, and is barely array-like, so we'll 
			// convert it to an array so it can be understood by selectah
			var children = Array.prototype.slice.call(this[0].children);
			return $(children, this[0]);
		},

		attr: function(attribute = false, value = false) {
			// Sets or gets the given attribute based on the presence of a given
			// value. If no value is given, retrieves the given attribute from the
			// first selected element
			if (!this.length || !attribute) {
				return undefined;
			}
			
			if (value) {
				for (var i = 0; i < this.length; i++) {
					// Set the attribute value
					this[i].setAttribute(attribute, value);
				}
				
				return this;
			} else {
				// Return the attribute's current value for the first selected element
				return this[0].getAttribute(attribute);
			}
		},
		
		text: function(value = false) {
			// Sets or returns the text component of an element based on the presence
			// of a given value. If no value is given, retrieves the textContent from
			// the first selected element
			if (!this.length) {
				return undefined;
			}
			
			// We make sure to include an empty string so you can un-set the text
			if (value === '' || value) {
				for (var i = 0; i < this.length; i++) {
					// Set the textContent
					this[i].textContent = value;
				}
				
				return this;
			}
			
			// Return the textContent from the first selected element
			return this[0].textContent;
		},
		
		find: function(selector = false) {
			// Returns an instance of selectah containing a subselection of the
			// first selected element's children based on a selection
			// If no selector is given, it behaves like .children(), since they're
			// more or less the same in concept
			if (!this.length) {
				return undefined;
			}
			
			if (!selector) {
				// Return all children
				return this.children();
			} else {
				// Return a list of children that match the selector, using the first
				// selected element as the context for a new selectah instance
				return $(selector, this[0]);
			}
		},

		html: function(value = false) {
			// Set the innerHTML of all selected elements, or returns the innerHTML property
			// of the first selected element
			if (!this.length) {
				return undefined;
			}
			
			if (value) {
				for (var i = 0; i < this.length; i++) {
					// Set the innerHTML
					this[i].innerHTML = value;
				}
				
				return this;
			}
			
			// Return the innerHTML from the first selected element
			return this[0].innerHTML;
		},

		is: function(value = false) {
			// Tests if the first selected element matches the given criterion
			// For non-Node tests, which are just straight comparisons of equal objects,
			// we'll use the matchesSelector that is set up at the top of the file
			if (!this.length || !value) {
				return undefined;
			}
			
			if (typeof value === 'object') {
				// Compare the two objects
				return this[0] === value;
			} else {
				// The common case, which uses the built in matchesSelector 
				return this[0].matches(value);
			}
		},

		parent: function() {
			// Returns a new instance of selectah containing the parent of the 
			// first selected element
			if (!this.length) {
				return undefined;
			} else {
				return $(this[0].parentNode);
			}
		},

		position: function() {
			// Returns the pixel offsets for all four boundaries of the first 
			// selected element
			if (!this.length) {
				return undefined;
			}
			
			var element = this[0];
			var position = {
				top: element.offsetTop, 
				left: element.offsetLeft,
				right: element.offsetWidth + element.offsetLeft,	// left + width = right
				bottom: element.offsetHeight + element.offsetTop,	// top + height = bottom
			}
			
			return position;
		},

		contains: function(selector = false) {
			// Determines if the first selected element has any children that match
			// the given selector. If a Node is given, we use the built in .contains,
			// and otherwise just run a querySelector on the element
			if (!this.length || !selector) {
				return undefined;
			}
			
			if (typeof selector === 'object') {
				// Use the built in .contains on Nodes
				return this[0].contains(selector);
			} else {
				// Use querySelector to search the children for a match
				return this[0].querySelector(selector) !== null;
			}
		},

		empty: function() {
			// Passthrough to .html(''). Will clear out all text nodes and child elements
			// from all selected elements
			return this.html('');
		},

		offset: function() {
			// Returns the position of the first selected element relative to the viewport
			if (!this.length) {
				return undefined;
			} else {
				return this[0].getBoundingClientRect();
			}
		},

		remove: function() {
			// Destroys all selected elements by removing them from their parents
			if (!this.length) {
				return undefined;
			}
			
			for (var i = 0; i < this.length; i++) {
				// This will remove all text nodes and child elements as well
				this[i].parentNode.removeChild(this[i]);
			}
			
			return true;
		},
		
		siblings: function() {
			// Returns an instance of selectah containing elements that are next to
			// the first selected element, not including that element
			if (!this.length) {
				return undefined;
			}
			
			var element = this[0];
			// Node lists aren't exactly arrays, so we'll convert it to one so selectah
			// has an easier time understanding it
			var children = Array.prototype.filter.call(element.parentNode.children, function(child) {
				return child !== element;
			});
			
			return $(children);
		},
		
		trigger: function(eventType = false) {
			// Simulates the given event on all selected elements
			if (!this.length || !eventType) {
				return undefined;
			}
			
			for (var i = 0; i < this.length; i++) {
				// If you don't care about IE, or it's the Future(TM), 
				// the following can be used instead:
				// var event = new Event(eventType); 
				// this[i].dispatchEvent(event);
				
				var event = document.createEvent('HTMLEvents');
				event.initEvent(eventType);
				this[i].dispatchEvent(event);
			}
			
			return this;
		},
		
		height: function(value = false, unit = false) {
			// Passthrough to .css('height'), because people are lazy
			return this.css('height', value, unit);
		},

		width: function(value = false, unit = false) {
			// Passthrough to .css('width'), because people are lazy
			return this.css('width', value, unit);
		},

		isVisible: function() {
			// Checks if the first selected element is at all visible in the viewport
			// "At all visible" means that any part of it is on-screen and theoretically
			// visible to the user. This is a vertical-only check.		
			if (!this.length) {
				return undefined;
			}
			
			var position = $(this[0]).offset();
			var clientHeight = document.documentElement.clientHeight;
			var winHeight = window.innerHeight;
			var viewportHeight = Math.max(clientHeight, winHeight);
			
			// Check if the element is visible
			return !(position.bottom < 0 || (position.top - viewportHeight) >= 0);
		},

		allVisible: function() {
			// Essentially the same as .isVisible(), but checks all selected elements,
			// and only returns true if ALL of them satisfy .isVisible()
			if (!this.length) {
				return undefined;
			}
			
			for (var i = 0; i < this.length; i++) {
				if (!$(this[i]).isVisible()) {
					return false;
				}
			}
			
			return true;
		},

		context: function() {
			// Passthrough to this.context
			var context = this.context || document;
			return context;
		},

		count: function() {
			// Passthrough to this.length
			var count = this.length || 0;
			return count;
		},
		
		val: function(value = false) {
			// Sets the value property of all selected elements if a value is given,
			// otherwise returns the value from the first selected element
			if (!this.length) {
				return undefined;
			}
			
			if (!value && value !== '') {
				// Return the value of the first selected element
				return this[0].value;
			}
			
			for (var i = 0; i < this.length; i++) {
				// Sets the value of all selected elements
				this[i].value = value;
			}
			
			return this;
		},

		clone: function() {
			// Returns a deep clone of the first selected element, not wrapped in
			// selectah so it can be used by DOM functions immediately.
			// Please do not $('body').clone() and then complain about it being slow
			if (!this.length) {
				return undefined;
			}
			
			return this[0].cloneNode(true);
		},
		
		append: function(element = false) {
			// Appends the given element(s) to all currently selected elements by
			// first making a clone
			if (!this.length || !element) {
				return undefined;
			}
			
			// For all selected elements...
			for (var i = 0; i < this.length; i++) {
				// For all given elements...
				for (var j = 0; j < element.length; j++) {
					// Make a clone and append it
					var clone = $(element[j]).clone();
					this[i].appendChild(clone);
				}
			}
			
			return this;
		},
		
		prepend: function(element = false) {
			// Similar to .append(), but places the new element above all of the
			// other children of each currently selected element
			if (!this.length || !element) {
				return undefined;
			}
			
			// For all selected elements...
			for (var i = 0; i < this.length; i++) {
				// For all given elements...
				for (var j = 0; j < element.length; j++) {
					// Make a clone and prepend it
					var clone = $(element[j]).clone();
					this[i].insertBefore(clone, this[i].firstChild);
				}
			}
			
			return this;
		},
		
		appendTo: function(element = false) {
			// Similar to .append(), but with the roles reversed. All currently selected
			// elements are appended to the given element(s)
			if (!this.length) {
				return undefined;
			}
			
			// For all given elements...
			for (var i = 0; i < element.length; i++) {
				// Convert it into something useable if it's not
				if (typeof element !== 'object') {
					element = $(element);
				}
				
				// For all selected elements...
				for (var j = 0; j < this.length; j++) {
					// Make a clone and append it
					var clone = $(this[j]).clone();
					element[i].appendChild(clone);
				}
			}
			
			return this;
		},
		
		prependTo: function(element = false) {
			// Similar to .prepend(), but with the roles reversed. All currently selected
			// elements are prepended to the top of the given element(s) child lists
			if (!this.length) {
				return undefined;
			}
			
			// For all given elements...
			for (var i = 0; i < element.length; i++) {
				// Convert it into something useable if it's not
				if (typeof element !== 'object') {
					element = $(element);
				}
				
				// For all selected elements...
				for (var j = 0; j < this.length; j++) {
					// Make a clone and prepend it
					var clone = $(this[j]).clone();
					element[i].insertBefore(clone, element[i].firstChild);
				}
			}
			
			return this;
		},
	}
})();
