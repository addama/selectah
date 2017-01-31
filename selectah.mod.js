var $=(function(id,sl){
	$=function(s,c){return new slct(s,c)}
	var uu=undefined,l='length',ch='children';
	var slct=function(s=!1,c=!1){
		c=(c)?$(c)[0]:document;
		this[l]=0;
		this.selector=s;
		this.context=c;
		if(s){
			if(typeof s==='object'){
				if(s instanceof Array){
					for(var i=0;i<s[l];i++)this[i]=s[i];
					this[l]=s[l];
				}else{this[0]=s;this[l]=1}
			}else{
				if(/^</.test(s)){
					var t=document.createElement('div');
					t.innerHTML=s;
					for(var i=0;i<t[ch][l];i++)this[i]=t[ch][i];
					this[l]=t[ch][l];
				}else{
					var e=c.querySelectorAll(s);
					for(var i=0;i<e[l];i++)this[i]=e[i];
					this[l]=e[l];
				}
			}
		}
		return this;
	};

	slct.prototype={
		on:function(t=!1,h=!1){
			if(!this[l]||!t||!h)return uu;
			var es=[];
			t.toLowerCase();
			if(~t.indexOf(/\s/g)){t.split(/\s/).forEach(function(e){es.push(e)})}
			else{es.push(t)}
			for(var i=0;i<this[l];i++){
				var el=this[i];
				el.s$=el.s$||++id;
				es.forEach(function(e){
					var i=e+el.s$;
					sl[i]=sl[i]||[];
					sl[i].push(h);
					el.addEventListener(e,h);
				});
			}
			return this;
		},
		off:function(t=!1){
			if(!this[l]||!t)return uu;
			var es=[];
			t.toLowerCase();
			if(~t.indexOf(/\s/g)){t.split(/\s/).forEach(function(e){es.push(e)})}
			else{es.push(t)}
			for(var i=0;i<this[l];i++){
				var el=this[i];
				es.forEach(function(e){
					var i=e+el.s$;
					if(i in sl){
						var h=sl[i];
						for(var j=0;j<h.length;j++)el.removeEventListener(e,h[j]);
						delete sl[i];
					}
				})
			}
			return this;
		},
		css:function(r=!1,v=!1,u=!1){
			if(!this[l]||(!r&&(!v&&v!=='')))return uu;
			if(r&&(!v&&v!=='')){
				var s=getComputedStyle(this[0],null);
				return s[r];
			}
			if(u)v=v+u;			
			for(var i=0;i<this[l];i++)this[i].style[r]=v;
			return this;
		},
		first:function(){
			if(!this[l])return uu;
			return $(this[0]);
		},
		last:function(){
			if(!this[l])return uu;
			return $(this[this[l]-1]);
		},
		each:function(h=!1){
			if(!this[l]||!h)return uu;			
			var r;
			for(var i=0;i<this[l];i++){
				if(r===!1)return r;
				r=h(this[i],i);
			}
			return this;
		},
		addClass:function(c=!1){
			if(!this[l]||!c)return uu;
			for(var i=0;i<this[l];i++){
				if(this[i].classList){this[i].classList.add(c)}
				else{this[i].className+=' '+c}
			}
			return this;
		},
		hasClass:function(cn=!1){
			if(!this[l]||!cn)return uu;
			if(this[0].classList)return this[0].classList.contains(cn);
			return new Regexp('(^| )'+cn+'( |$)','gi').test(this[0].cn);
		},
		removeClass:function(cn=!1){
			if(!this[l]||!cn)return uu;			
			for(var i=0;i<this[l];i++){
				if(this[i].classList){this[i].classList.remove(cn)}
				else{
					var cs=cn.split(' ').join('|');
					var r=new RegExp('(^| )'+cs+'( |$)','gi');
					this[i].className=this[i].className.replace(r,' ');
				}
			}
			return this;	
		},
		toggleClass:function(cn=!1){
			if(!this[l]||!cn)return uu;			
			for(var i=0;i<this[l];i++){
				if(this[i].classList){this[i].classList.toggle(cn)}
				else{
					var cs=this[i].className.split(' '),b=cs.indexOf(cn);
					if(b!==-1){cs.splice(b,1)}else{cs.push(cn)}
					this[i].className=cs.join(' ');
				}
			}
			return this;	
		},
		hide:function(){
			return this.css('display','none');
		},
		show:function(){
			return this.css('display','block');
		},
		toggle:function(){
			if(!this[l])return uu;
			for(var i=0;i<this[l];i++)this[i].style.display=(this[i].style.display==='none')?'block':'none';
			return this;
		},
		children:function(){
			if(!this[l])return uu;
			var c=Array.prototype.slice.call(this[0][ch]);
			return $(c,this[0]);
		},
		attr:function(k=!1,v=!1){
			if(!this[l]||!k)return uu;			
			if(v){
				for(var i=0;i<this[l];i++)this[i].setAttribute(k,v);
				return this;
			}
			return this[0].getAttribute(k);
		},
		text:function(v=!1){
			if(!this[l])return uu;
			if(v===''||v){
				for(var i=0;i<this[l];i++)this[i].textContent=v;
				return this;
			}
			return this[0].textContent;
		},
		find:function(s=!1){
			if(!this[l])return uu;			
			if(!s)return this[ch]();
			return $(s,this[0]);
		},
		html:function(v=!1){
			if(!this[l])return uu;
			if(v){
				for(var i=0;i<this[l];i++)this[i].innerHTML=v;
				return this;
			}
			return this[0].innerHTML;
		},
		is:function(v=!1){
			if(!this[l]||!v)return uu;
			if(typeof v==='object'){
				if(v[l]>=1)v=v[0];
				return this[0]===v;
			}else{
				return(this[0].matches||this[0].webkitMatchesSelector||this[0].mozMatchesSelector||this[0].msMatchesSelector||this[0].oMatchesSelector).call(this[0],v);
			}
		},
		parent:function(){
			if(!this[l])return uu;
			return $(this[0].parentNode);
		},
		position:function(){
			if(!this[l])return uu;
			var e=this[0];
			return {top:e.offsetTop,left:e.offsetLeft,right:e.offsetWidth+e.offsetLeft,bottom:e.offsetHeight+e.offsetTop}
		},
		contains:function(s=!1){
			if(!this[l]||!s)return uu;
			if(typeof s==='object')return this[0].contains(s);
			return this[0].querySelector(s)!==null;
		},
		empty:function(){
			return this.html('');
		},
		offset:function(){
			if(!this[l])return uu;
			return this[0].getBoundingClientRect();
		},
		remove:function(){
			if(!this[l])return uu;
			for(var i=0;i<this[l];i++)this[i].parentNode.removeChild(this[i]);
			return !0;
		},
		siblings:function(){
			if(!this[l])return uu;
			var e=this[0];
			var c=Array.prototype.filter.call(e.parentNode[ch],function(i){return i!==e});
			return $(c);
		},
		trigger:function(t=!1){
			if(!this[l]||!t)return uu;
			for(var i=0;i<this[l];i++){
				var e=document.createEvent('HTMLEvents');
				e.initEvent(t);
				this[i].dispatchEvent(e);
			}
			return this;
		},
		height:function(v=!1,u=!1){
			return this.css('height',v,u);
		},
		width:function(v=!1,u=!1){
			return this.css('width',v,u);
		},
		isVisible:function(){	
			if(!this.length)return uu;
			var p=$(this[0]).offset(),c=document.documentElement.clientHeight,w=window.innerHeight;
			var v=Math.max(c,w);
			return !(p.bottom<0||(p.top-v)>=0);
		},
		allVisible:function(){
			if(!this[l])return uu;
			for(var i=0;i<this[l];i++)if(!$(this[i]).isVisible())return !1;
			return !0;
		},
		context:function(){
			return this.context||document;
		},
		count:function(){
			return this[l]||0;
		},
		val:function(v=!1){
			if(!this[l])return uu;
			if(!v&&v!=='')return this[0].value;
			for(var i=0;i<this[l];i++)this[i].value=v;
			return this;
		},
		clone:function(){
			if(!this[l])return uu;
			return this[0].cloneNode(!0);
		},
		append:function(e=!1){
			if(!this[l]||!e)return uu;
			for(var i=0;i<this[l];i++)for(var j=0;j<e[l];j++)this[i].appendChild($(e[j]).clone());
			return this;
		},
		prepend:function(e=!1){
			if(!this[l]||!e)return uu;
			for(var i=0;i<this[l];i++)for(var j=0;j<e[l];j++)this[i].insertBefore($(e[j]).clone(),this[i].firstChild);
			return this;
		},
		appendTo:function(e=!1){
			if(!this[l])return uu;
			for(var i=0;i<e[l];i++){
				if(typeof e!=='object')e=$(e);
				for(var j=0;j<this[l];j++)e[i].appendChild($(this[j]).clone());
			}
			return this;
		},
		prependTo:function(e=!1){
			if(!this[l])return uu;
			for(var i=0;i<e[l];i++){
				if(typeof e!=='object')e=$(e);
				for(var j=0;j<this[l];j++)e[i].insertBefore($(this[j]).clone(),e[i].firstChild);
			}
			return this;
		}
	}
	return $
})(0,{});