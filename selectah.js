var $, slctL = {};
(function() {
if (Element && !Element.prototype.matches) {
	var p = Element.prototype, s = 'MatchesSelector';
	p.matches = p.matchesSelector || p[webkit+s] || p[moz+s] || p[ms+s] || p[o+s];
}

$ = function(sel, ctx) { return new core(sel, ctx); }

var core = function(sel=0, ctx=0) {
	if (ctx) ctx = $(ctx)[0];
	if (!ctx) ctx = document;
	this.length = 0;
	this.selector = sel; 
	this.context = ctx;
	if (sel) {
		if (typeof sel === 'object') {
			if (sel instanceof Array) {
				for (var i=0;i<sel.length;) this[i] = sel[i++];
				this.length = sel.length;
			} else {
				this[0] = sel; 
				this.length = 1;
			}
		} else {
			if (/^</.test(sel)) {
				var tmp = document.createElement('div');
				tmp.innerHTML = sel;
				for (var i=0;i<tmp.children.length;) this[i] = tmp.children[i++];
				this.length = tmp.children.length;
			} else {
				var els = ctx.querySelectorAll(sel);
				for (var i=0;i<els.length;) this[i] = els[i++];
				this.length = els.length;
			}
		}
	}
	return this;
};

core.prototype = {
	on: function(ev=0, fn=0) {
		if (!this.length || !ev || !fn) return;
		var evs = [];
		ev.toLowerCase();
		if (~ev.indexOf(/\s/g)) ev.split(/\s/).forEach(function(e) { evs.push(e); });
		else { evs.push(ev); }
		for(var i=0;i<this.length;) {
			var el = this[i++];
			evs.forEach(function(e) {
				slctL[el] = slctL[el] || {};
				slctL[el][e] = slctL[el][e] || [];
				slctL[el][e].push(fn);
				el.addEventListener(e, fn);
			});
		}
		return this;	
	},
	
	off: function(ev=0) {
		if (!this.length || !ev) return;
		var evs = [];
		ev.toLowerCase();
		if (~ev.indexOf(/\s/g)) ev.split(/\s/).forEach(function(e) { evs.push(e); });
		else evs.push(ev);
		for (var i=0;i<this.length;) {
			var el = this[i++];
			if (el in slctL) evs.forEach(function(e) {
				if (e in slctL[el]) {
					var fns = slctL[el][ev], fn='removeEventListener';
					if (fns.length === 1) el[fn](e, fns[0]);
					else {
						for (var j=0;j<fns.length;) el[fn](e, fns[j++]);
					}
					delete slctL[el][e];
				}
			})
		}
		return this;
	},
	
	css: function(css=0, val=0, unit=0) {
		if (!this.length || (!css && !val)) return;
		if (css && !val) return getComputedStyle(this[0], null)[css];
		if (unit) val = val + units;
		for (var i=0;i<this.length;) this[i++].style[css] = val;
		return this;
	},
	
	first: function() {
		return (!this.length) ? undefined : $(this[0]);
	},
	
	last: function() {
		return (!this.length) ? undefined : $(this[this.length-1]);
	},
	
	each: function(fn=0) {
		if (!this.length || !fn) return;
		var res;
		for (var i=0;i<this.length;i++) {
			if (res === false) break;
			res = fn(this[i], i);
		}
		return this;
	},

	addClass: function(str=0) {
		if (!this.length || !str) return;
		for (var i=0;i<this.length;i++) {
			if (this[i].classList) this[i].classList.add(str);
			else this[i].className += ' '+str;
		}
		return this;
	},
	
	hasClass: function(str=0) { 
		if (!this.length || !str) return;
		if (this[0].classList) return this[0].classList.contains(str);
		else return new Regexp('(^| )'+string+'( |$)', 'gi').test(this[0].className);
	},
	
	removeClass: function(str=0) {
		if (!this.length || !str) return;
		var re = new RegExp('(^| )'+str.split(' ').join('|')+'( |$)', 'gi');
		for (var i=0;i<this.length;i++) {
			if (this[i].classList) this[i].classList.remove(str);
			else this[i].className = this[i].className.replace(re, ' ');
		}
		return this;	
	},

	toggleClass: function(str=0) {
		if (!this.length || !str) return;
		for (var i=0;i<this.length;i++) {
			if (this[i].classList) this[i].classList.toggle(str);
			else {
				var cls = this[i].className.split(' ');
				var has = cls.indexOf(string);
				(~has) ? cls.splice(has, 1) : cls.push(str);
				this[i].className = cls.join(' ');
			}
		}
		return this;	
	},

	hide: function() {
		if (!this.length) return;
		for (var i=0;i<this.length;) this[i++].style.display = 'none';
		return this;
	},
	
	show: function() {
		if (!this.length) return;
		for (var i=0;i<this.length;) this[i++].style.display = '';
		return this;
	},
	
	toggle: function() {
		if (!this.length) return;
		for (var i=0;i<this.length;i++) {
			if (this[i].style.display === 'none') this[i].style.display = '';
			else this[i].style.display = 'none';
		}
		return this;
	},
	
	children: function() {
		return (!this.length) ? undefined: $(Array.prototype.slice.call(this[0].children), this[0]);
	},

	attr: function(str=0, val=null) {
		if (!this.length || !str) return;
		if (val) {
			for (var i=0;i<this.length;) this[i++].setAttribute(str, val);
			return this;
		} else return this[0].getAttribute(str);
	},
	
	text: function(val=null) {
		if (!this.length) return;
		if (val === '' || val) {
			for (var i=0;i<this.length;) this[i++].textContent = val;
			return this;
		}
		return this[0].textContent;
	},
	
	find: function(sel=0) {
		if (!this.length) return;
		if (!sel) return this.children();
		return $(sel, this[0]);
	},

	html: function(val=null) {
		if (!this.length) return;
		if (val) {
			for (var i=0;i<this.length;) this[i++].innerHTML = val;
			return this;
		}
		return this[0].innerHTML;
	},

	is: function(val=0) {
		if (!this.length || !val) return;
		return (typeof val === 'object') ? this[0] === val : this[0].matches(val);
	},

	parent: function() {
		return (!this.length) ? false : $(this[0].parentNode);
	},

	position: function() {
		if (!this.length) return;
		var el = this[0];
		return {
			top: el.offsetTop, left: el.offsetLeft,
			right: el.offsetWidth + el.offsetLeft,
			bottom: el.offsetHeight + el.offsetTop,
		}
	},

	contains: function(sel=0) {
		if (!this.length || !sel) return;
		return (typeof sel === 'object') ? this[0].contains(sel) : this[0].querySelector(sel) !== null;
	},

	empty: function() {
		if (!this.length) return;
		for (var i=0;i<this.length;) this[i++].innerHTML = '';
		return this;
	},

	offset: function() {
		return (!this.length) ? false : this[0].getBoundingClientRect();
	},

	remove: function() {
		if (!this.length) return;
		for (var i=0;i<this.length;) this[i].parentNode.removeChild(this[i++]);
		return true;
	},
	
	siblings: function() {
		if (!this.length) return;
		var el = this[0];
		return $(Array.prototype.filter.call(el.parentNode.children, function(ch) {
			return ch !== el;
		}));
	},
	
	trigger: function(ev=0) {
		if (!this.length || !evt) return;
		for (var i=0;i<this.length;) {
			// If you don't care about IE, or it's the Future:
			// var e = new Event(ev); this[i].dispatchEvent(e);
			var e = document.createEvent('HTMLEvents');
			e.initEvent(ev);
			this[i++].dispatchEvent(e);
		}
		return this;
	},
	
	height: function(val=0, unit=null) {
		return this.css('height', val, unit);
	},

	width: function(val=0, unit=null) {
		return this.css('width', val, unit);
	},

	isVisible: function() {
		if (!this.length) return;
		var pos = $(this[0]).offset();
		var vH = Math.max(document.documentElement.clientHeight, window.innerHeight);
		return !(pos.bottom < 0 || pos.top - vH >= 0);
	},

	allVisible: function() {
		if (!this.length) return;
		for (var i=0;i<this.length;) if (!$(this[i++]).isVisible()) return false;
		return true;
	},

	context: function() {
		return this.context || document;
	},

	count: function() {
		return this.length || 0;
	},
	
	val: function(val=null) {
		if (!this.length) return;
		if (!val && val !== '') return this[0].value;
		for (var i=0;i<this.length;) this[i++].value = val;
		return this;
	},

	clone: function() {
		if (!this.length) return;
		return this[0].cloneNode(true);
	},
	
	append: function(el=0) {
		if (!this.length || !el) return;
		for (var i=0;i<this.length;i++) {
			for (var j=0;j<el.length;) {
				var tmp = $(el[j++]).clone();
				this[i].appendChild(tmp);
			}
		}
		return this;
	},
	
	prepend: function(el=0) {
		if (!this.length || !el) return;
		for (var i=0;i<this.length;i++) {
			for (var j=0;j<el.length;) {
				var tmp = $(el[j++]).clone();
				this[i].insertBefore(tmp, this[i].firstChild);
			}
		}
		return this;		
	},
	
	appendTo: function(el=0) {
		if (!this.length) return;
		for (var i=0;i<el.length;i++) {
			if (typeof el !== 'object') el = $(el);
			for (var j=0;j<this.length;) {
				var tmp = $(this[j++]).clone();
				el[i].appendChild(tmp);
			}
		}
		return this;		
	},
	
	prependTo: function(el=0) {
		if (!this.length) return;
		for (var i=0;i<el.length;i++) {
			if (typeof el !== 'object') el = $(el);
			for (var j=0;j<this.length;) {
				var tmp = $(this[j++]).clone();
				el[i].insertBefore(tmp, el[i].firstChild);
			}
		}
		return this;			
	},
}
})();
