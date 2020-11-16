import {withPluginApi} from 'discourse/lib/plugin-api';import {relativeAge} from 'discourse/lib/formatter';import {iconHTML} from 'discourse-common/lib/icon-library';import User from 'discourse/models/user';import TopicNavigationComponent from 'discourse/components/topic-navigation';import ApplicationRoute from 'discourse/routes/application';var x=(...a)=>{a=["%cDiscPage -","color:grey",...a];console.log(...a)},z=(...a)=>{a=["%cDiscPage Error -","color:red",...a];console.log(...a)},A=(...a)=>{a=["%cDiscPage Warning -","color:orange",...a];console.log(...a)},C=class extends Error{constructor(a){super(a);this.constructor=C;this.__proto__=C.prototype;this.message=a;this.name="DiscpageError"}},D=(a,b)=>{if(!a)throw new C(`Assertion Failed${b?" - "+b:""}`);};
function E(a,b,d,f,e=0){let l=(c,h)=>{try{const k=b(a[e],e,a);k&&k.then?k.then(c).catch(h):c(k)}catch(k){h(k)}},g=(c,h)=>()=>E(a,b,c,h,++e),p=(c,h)=>e<a.length?(new Promise(l)).then(g(c,h)).catch(h):c();return d?p(d,f):new Promise(p)}var F=a=>new Promise(b=>{setTimeout(()=>{b(void 0)},a)});function H(a,b,d){let f=e=>F(d).then(()=>a(e));try{return 0===b?Promise.reject(void 0):Promise.resolve(a(b)).then(e=>e||H(f,b-1))}catch(e){return Promise.reject(e)}}var I=/^[0-9]+$/,J=/^[0-9A-Za-z_]+$/;
function aa({a,s:b}){if(!I.test(a))throw new C(`Invalid pageId "${a}"`);if(b&&!J.test(b))throw new C(`Invalid balloon id "${b}". Valid characters are: [0-9A-Za-z_].`);return b?`${"dpg"}-${a}-${b}`:`${"dpg"}-${a}`}function K(a){var b=a.split("-");if("dpg"!==b.shift())return null;a=b.shift();return I.test(a)?(b=b.shift())&&!J.test(b)?null:{a,s:b}:null}
function L({method:a,path:b,I:d}){return new Promise((f,e)=>{$.ajax({type:a,url:b,data:d,success:l=>f(l)}).fail(l=>e(l.responseText))})}function ba({tag:a}){return L({method:"GET",path:`/tag/${a}.json`}).then(b=>b.topic_list.topics)}function ca({name:a,D:b,P:d=!1,R:f=!1}){L({method:"POST",path:"/tag_groups",I:{name:a,tag_names:b,one_per_topic:d,permissions:f?{staff:1}:void 0}})}
function da({id:a,D:b}){L({method:"PUT",path:`/tag_groups/${a}.json`,I:{tag_names:b}})}
function M(a,{f:b}){var d=$(a.left);d.find(".dpg-balloon-text, .dpg-subsec").removeClass("dpg-highlighted");b&&(d=d.find(`.dpg-balloon-text[data-dpg-id=${b}]`),d.length?(d.addClass("dpg-highlighted"),d.parent().is("h1,h2,h3,h4,h5,h6")&&d.closest(".dpg-subsec").addClass("dpg-highlighted"),b=d[0].getBoundingClientRect(),a=a.left.getBoundingClientRect(),b.top<a.bottom&&b.bottom>=a.top||d[0].scrollIntoView()):A(`selected balloon "${b}" has not been found in page "${a.a}"`))}
function N(a,{a:b,i:d,h:f,g:e,m:l,c:g,title:p,f:c}){D("string"==typeof b,`invalid pageId "${b}"`);g=g.replace("{dpg-show-rev-button}","").replace("{dpg-title-balloon}","");let h=$(`
      <div class="dpg-page-content">
        <div class="dpg-buttons ${"nodiff"!==e?"selected":""}">
          <div class="dpg-buttons-left"></div><div class="dpg-buttons-center"></div><div class="dpg-buttons-right"></div>        
        </div>
        <div class="dpg-header">
          <div class="dpg-header-1"><div class="dpg-header-2"><div class="dpg-header-3"></div></div></div>
        </div>
        <div class="dpg-body">
          <div class="wrap">
            <!-- <div class="posts-wrapper"> FIX FOR ISSUE https://github.com/sylque/discpage/issues/6 --> 
              <div class="topic-body">
                <!-- Cooked post to be inserted here -->
              </div>
            <!-- </div> -->
          </div>
        </div>
        <div class="dpg-footer">
          <div class="dpg-footer-1"><div class="dpg-footer-2"><div class="dpg-footer-3"></div></div></div>
        </div>
      </div>
    `);var k=a.c.includes("{dpg-title-balloon}")?'<span class="dpg-balloon-text" data-dpg-id="title"></span>':"";k=a.G.cooked(`<h1>${p+k}</h1>\n`+g).init();h.find(".dpg-body .topic-body").append(k);let u=a.j.siteSettings.force_lowercase_tags,t=a.j.siteSettings.max_tag_length;h.find(".dpg-badge").hide();let w={};h.find(".dpg-balloon-text").each((m,q)=>{let n,r=q.dataset.dpgId;m=$(q);try{if(!r)throw new C("Missing balloon id. The correct syntax is [dpgb id=something][/dpgb].");n=aa({a:b,s:r});if(n.length>
t)throw new C(`Balloon id is too long. Resulting tag is \"${n}\", which has a length of ${n.length}. This doesn't fit max_tag_length=${t} in Discourse settings. Fix: either shorten the balloon id, or increase max_tag_length.`);if(u&&n!==n.toLowerCase())throw new C("Balloon id has uppercase. This doesn't fit force_lowercase_tags=true in Discourse settings. Fix: either make your balloon id all lowercase, or set force_lowercase_tags to false.");w[n]&&A(`Duplicate balloon id "${n}". This is usually a bad idea.`)}catch(v){if(v instanceof
C){z(v.message);m.append(`<span class="dpg-error" title="${v.message}">DiscPage Error</span>`);return}throw v;}w[n]=!0;if(0===q.childNodes.length){q=m.parent().is(".cooked,.dpg-subsec");let v=m.prev();q=q&&v.length?v:m.parent();m.detach();q.addClass("dpg-balloon-parent").wrapInner(m)}else m.wrap('<span class="dpg-balloon-parent" />'),q=m.parent();q.append(`
        <span class="dpg-icons" title="Click to discuss this part">
          <span class="dpg-balloon">${iconHTML("comment")}</span>
          <span class="dpg-badge" style="display:none">99</span>
        </span>
      `);q.is("h1,h2,h3,h4,h5,h6")&&q.nextUntil("h1,h2,h3,h4,h5,h6").addBack().wrapAll('<div class="dpg-subsec"></div>');q.find(".dpg-icons").click(v=>{a.j.get("router").transitionTo(`/tag/${n}`);M(a,{f:r});v.stopPropagation()})});let y=Object.keys(w);a.F&&y.length&&a.M.then(m=>{let q=`dpg-${b}`;m=m.find(n=>n.name===q);y.sort();m?ea(m.J,y)||da({id:m.id,D:y}):ca({name:q,D:y})});a.N.then(m=>{m=m.reduce((q,n)=>{if(n.count&&n.parsed.a===b){const r=h.find(`.dpg-balloon-text[data-dpg-id="${n.parsed.s}"]`);
r.length?(n.K=r.next().find(".dpg-badge"),q.push(n)):A(`In page "${b}": missing balloon for tag "${n.id}"`)}return q},[]);E(m,q=>ba({tag:q.id}).then(n=>{(n=n.filter(r=>r.visible).length)&&q.K.text(n).show()}).then(()=>F(250)))});k=h.find(".dpg-buttons-right");let B=h.find(".dpg-buttons-center");var G=a.c.includes("{dpg-show-rev-button}");if(!a.C&&1<f&&G){let m=({g:n,rev:r=null})=>{N(a,{a:b,i:d,h:f,g:n,m:r?r.created_at:void 0,c:r?r.body_changes.inline:a.c,title:p,f:c})},q="nodiff"!==e;O({o:"history",
title:"Show page revisions",id:"dpg-show-rev-nav"}).click(()=>{q?m({g:"nodiff"}):P(`/posts/${d}/revisions/${f}.json`).then(n=>{m({g:f,rev:n})})}).appendTo(k);if(q){O({o:"backward",title:"Previous revisions",id:"dpg-prev-rev",disabled:2===e}).appendTo(B).click(()=>{let r=e-1;P(`/posts/${d}/revisions/${r}.json`).then(v=>{m({g:r,rev:v})})});G=new Date(l);let n=relativeAge(G,{format:"medium-with-ago"});B.append(`<span class="dpg-date" title=${G}>${n}</span>`);O({o:"forward",title:"Next revision",id:"dpg-next-rev",
disabled:e===f}).appendTo(B).click(()=>{let r=e+1;P(`/posts/${d}/revisions/${r}.json`).then(v=>{m({g:r,rev:v})})})}}a.F&&(O({o:"wrench",title:"Edit title",id:"dpg-edit-title-button"}).click(()=>{$("html").toggleClass("dpg",!1);$("a.edit-topic").click();$("#main-outlet").click(m=>{m.target.closest(".edit-controls .btn, .topic-admin-popup-menu .topic-admin-reset-bump-date, .topic-admin-popup-menu .topic-admin-visible")&&(N(a,{a:b,i:d,h:f,g:e,m:l,c:g,title:$("input#edit-title").val(),f:c}),$("html").toggleClass("dpg",
!0))})}).wrap("<div><div>").parent().appendTo(k),O({o:"pencil-alt",title:"Edit page",id:"dpg-edit-page-button"}).click(()=>{let m=$("article#post_1 button.edit");m.length?(m.click(),Q(a.C)):($("article#post_1 button.show-more-actions").click(),setTimeout(()=>{$("article#post_1 button.edit").click();Q(a.C)},0))}).wrap("<div><div>").parent().appendTo(k));$(a.left).empty().append(h);M(a,{f:c});document.documentElement.dispatchEvent(new CustomEvent("dpg_displaypage",{detail:{pageId:parseInt(b),title:p,
cooked:g,node:h[0],selTriggerId:c,curRevNum:e,curRevDate:l}}))}function R(a){N(a,{a:"error",i:void 0,h:void 0,g:"nodiff",m:void 0,c:"<p>Please contact your administrator.</p>",title:"Oops! That page doesn't exist anymore",f:null})}
function S(a,{a:b,i:d,h:f,c:e,title:l,f:g}){D("string"===typeof b);b===a.a&&1!==a.l||g||a.left.scrollTo(0,0);d&&f&&e&&l?b===a.a&&e===a.c?M(a,{f:g}):(a.a=b,a.c=e,N(a,{a:b,i:d,h:f,g:"nodiff",m:void 0,c:e,title:l,f:g})):b===a.a?M(a,{f:g}):P(`/t/${b}.json`).then(p=>{a.a=b;if(a.L.find(c=>c.id===p.category_id)){let c=p.post_stream.posts[0];a.c=c.cooked;N(a,{a:b,i:c.id,h:c.version,g:"nodiff",m:void 0,c:a.c,title:p.fancy_title,f:g})}else a.c="error",x(`Won't display static page ${b}, because category ${p.category_id} is not a static page`),
R(a)}).catch(()=>{a.c="error";x(`Won't display static page ${b}, because it doesn't exist or is private`);R(a)})}function T(a,b,d,f){a.H.animate?(a=a.H.animate([{left:b},{left:d}],{duration:200}),f&&(a.onfinish=f)):f&&f()}function fa(a,b){T(a,"100%",1035<=window.innerWidth?"50%":"0%",b)}
function U(a,b){if(b!==a.l){switch(a.l){case null:case 1:$("html").attr("data-dpg-layout",b);break;case 0:case 2:3===b?fa(a,()=>{$("html").attr("data-dpg-layout",b)}):$("html").attr("data-dpg-layout",b);break;case 3:$("html").attr("data-dpg-layout",b);0!==b&&2!==b||T(a,1035<=window.innerWidth?"50%":"0%","100%");break;default:throw new C(void 0);}if(2==b){let d=$(a.left).find(".dpg-balloon-text.dpg-highlighted");d.length&&d[0].scrollIntoView()}a.l=b}}
class ha{constructor(a,b){this.j=a;this.L=b;this.C=a.site.mobileView;this.left=document.getElementById("dpg-left");this.H=document.getElementById("dpg-ghost");this.c=this.a=this.l=null;this.F=(a=User.current())&&a.admin;this.N=L({method:"GET",path:"/tags.json"}).then(d=>d.tags.reduce((f,e)=>{e.parsed=K(e.id);return e.parsed?[...f,e]:f},[]));this.F&&(this.M=L({method:"GET",path:"/tag_groups.json"}).then(d=>d.tag_groups.reduce((f,e)=>{e={id:e.id,name:e.name,J:e.tag_names};if(e.name&&e.name.startsWith("dpg-")){if(J.test(e.name.substring(4)))return e.J.sort(),
[...f,e];A(`Invalid discpage tag group "${e.name}"`)}return f},[])))}}function V(){$("html").toggleClass("dpg-wide",1035<=window.innerWidth)}window.addEventListener("resize",V);V();let P=a=>new Promise((b,d)=>{$.get(a,f=>b(f)).fail(()=>d(`get "${a}" failed`))});function ea(a,b){return a.length===b.length&&a.every((d,f)=>d===b[f])}function O({o:a,title:b,id:d="",O:f="",disabled:e=!1}){return $(`    
    <button ${b?`title="${b}"`:""} ${d?`id="${d}"`:""} ${e?'disabled=""':""} class="btn-default btn no-text btn-icon ${f||""}" type="button">    
      <svg class="fa d-icon d-icon-${a} svg-icon svg-string" xmlns="http://www.w3.org/2000/svg">
        <use xlink:href="#${a}"></use>
      </svg>
    </button>
  `)}function Q(a){a||setTimeout(()=>{$("button.toggle-fullscreen").click();setTimeout(()=>{$(".save-or-cancel").append('<span style="color:#646464">ctrl+enter = submit | esc = exit</span>')},500)},500)}
function ia(a,b,d){function f(c){let h=a.b.left;h.scrollTop>=h.scrollHeight-h.clientHeight-1&&c.preventDefault()}let e=a.lookup("controller:application"),l="dpg",g=document.createElement("style");document.head.appendChild(g);b.forEach(c=>{c=c.topic_url.split("/").pop();g.sheet.insertRule(`html.dpg .category-page .topic-list-item.category-page[data-topic-id="${c}"] { display: none; }`)});d&&(l+=" dpg-hide-balloon-cat",d.forEach(c=>{let h=c.slug;g.sheet.insertRule(`html.dpg.dpg-hide-balloon-cat .category-chooser .category-row[data-name="${c.name}"] { display: none; }`);
(c=c.parentCategory)?(c=c.slug,g.sheet.insertRule(`html.dpg body.category-${c} button#create-topic { opacity: 0.5; pointer-events: none; }`),g.sheet.insertRule(`html.dpg body.category-${c} .topic-list-bottom .footer-message { display: none; }`),g.sheet.insertRule(`html.dpg body.category-${c}-${h} button#create-topic { opacity: 0.5; pointer-events: none; }`),g.sheet.insertRule(`html.dpg body.category-${c}-${h} .topic-list-bottom .footer-message { display: none; }`)):(g.sheet.insertRule(`html.dpg body.category-${h} button#create-topic { opacity: 0.5; pointer-events: none; }`),
g.sheet.insertRule(`html.dpg body.category-${h} .topic-list-bottom .footer-message { display: none; }`))}));e.siteSettings.discpage_hide_sugg_topics&&(l+=" dpg-disable-sugg");e.siteSettings.discpage_hide_tags&&(l+=" dpg-hide-tags");$("html").addClass(l);$("body").prepend('\n    <div id="dpg-ghost">\n      <div class="dpg-ghost-splitbar"></div>\n    </div>\n    <div id="dpg-container">\n      \x3c!-- <div id="dpg-ios-wrapper" tabindex="0"> --\x3e\n        <div id="dpg-left" tabindex="0">\n          \x3c!--\n          <div class="container">\n            <div class="loading-container visible ember-view">    \n              <div class="spinner "></div>\n            </div>      \n          </div>                \n          --\x3e\n        </div>\n        \x3c!-- </div> --\x3e\n      <div id="dpg-splitbar">\n        <div style="flex:1 0 0"></div>\n        <div id="dpg-splitbar-text">&gt;</div>\n        <div style="flex:1 0 0"></div>\n      </div>\n    </div>\n  ');
$("#main-outlet").wrap('<div id="dpg-right"></div>');a.b=new ha(e,b);a.b.left.addEventListener("wheel",c=>{0>c.deltaY?0===a.b.left.scrollTop&&c.preventDefault():0<c.deltaY&&f(c)},{passive:!1});a.b.left.addEventListener("keydown",c=>{c.shiftKey||c.altKey||c.ctrlKey||c.metaKey||("ArrowUp"!==c.code&&"PageUp"!==c.code||0!==a.b.left.scrollTop||c.preventDefault(),"ArrowDown"!==c.code&&"PageDown"!==c.code||f(c))});let p=a.lookup("router:main");$("#dpg-splitbar").click(function(){let c=!a.b.j.get("showRight");
p.transitionTo({queryParams:{showRight:c}})});a.b.left.addEventListener("click",c=>{2!==a.b.l&&3!==a.b.l||c.shiftKey||c.ctrlKey||window.getSelection().toString()||c.target.closest(".lightbox-wrapper")||c.target.closest(".dpg-buttons")||p.transitionTo(`/t/${a.b.a}`)});document.addEventListener("click",c=>{c.target.closest(".dpg-on-off")&&$("html").toggleClass("dpg")});$(document).keydown(function(c){65===c.keyCode&&c.altKey&&((c=User.current())&&c.admin?$("html").toggleClass("dpg"):x("Only admins can do that"))})}
function ja({u:a,A:b,w:d,v:f,B:e}){if(b.startsWith("topic.")){let l=a.lookup("route:topic").modelFor("topic");if(!f.includes(l.get("category_id"))){H(()=>l.hasOwnProperty("tags"),15,200).then(()=>{W({u:a,A:b,w:d,v:f,B:e})},()=>{U(a.b,1)});return}}W({u:a,A:b,w:d,v:f,B:e})}
function W({u:a,A:b,w:d,v:f,B:e}){let l=$("html");l.removeClass("dpg-page dpg-tag dpg-topic dpg-comment dpg-discuss");l.removeAttr("data-dpg-page-id");if(b.startsWith("topic.")){let g=a.lookup("route:topic").currentModel;if(f.includes(g.get("category_id"))){l.addClass("dpg-page");l.attr("data-dpg-page-id",g.get("id"));return}let p,c=(g.get("tags")||[]).find(h=>{p=K(h);return!!p});if(c){let {a:h,s:k}=p;b=a.b.j.get("showRight")?3:2;S(a.b,{a:h,f:k});l.addClass("dpg-topic dpg-discuss");l.attr("data-dpg-page-id",
h);d||X().then(()=>{$("#dpg-back").length||$("#topic-title .title-wrapper").append(`
        <div id="dpg-back" style="margin-bottom:5px">
          <a href="/tag/${c}">
            &#8630; Back to topic list
          </a>
        </div>
      `)});U(a.b,b);return}}if("tag.show"===b&&(b=a.lookup("route:tag.show").currentModel,b=K(b.get("id")))){l.addClass("dpg-tag dpg-discuss");l.attr("data-dpg-page-id",b.a);if(!d){S(a.b,{a:b.a,f:b.s});if(e){let g=a.lookup("controller:tags-show");1===e.length?(g.set("category",e[0]),g.set("canCreateTopicOnCategory",!0)):ka(`/t/${b.a}.json`).then(p=>{let c=p.category_id,h=a.lookup("controller:application").site.categories.find(k=>k.id===c).parent_category_id;p=h&&e.find(k=>k.parent_category_id===h||
k.id===h)||e[0];g.set("category",p);g.set("canCreateTopicOnCategory",!0)})}X().then(()=>{{let g=$("footer.topic-list-bottom");$("table.topic-list").length?g.html(""):g.html('\n      <div style="margin-left:12px">\n        <p><i>No topic yet</i></p>\n      </div>\n    ')}})}d=a.b.j.get("showRight")?3:2;U(a.b,d);return}U(a.b,1)}
let X=()=>new Promise(a=>{Ember.run.schedule("afterRender",null,()=>a(void 0))}),ka=a=>new Promise((b,d)=>{$.get(a,f=>b(f)).fail(()=>d(`get "${a}" failed`))}),Y=()=>new Promise(a=>{Ember.run.schedule("afterRender",null,()=>a(void 0))});function Z(a,b){z(`Invalid Discourse setting "${a.replace(/_/g," ")}": ${b}`)}
export function init(a,b){let d=User.current(),f=d&&d.admin;if(b.SiteSettings.discpage_enabled&&(!b.SiteSettings.login_required||d))if(b.SiteSettings.tagging_enabled)if(b.SiteSettings.discpage_page_categories){var e=b.SiteSettings.discpage_page_categories.split("|").map(k=>parseInt(k)),l=a.lookup("controller:application"),g=!1,p=e.reduce((k,u)=>{const t=l.site.categories.find(w=>w.id===u);t?k.push(t):f&&(Z("discpage_page_categories",`category "${u}" not found. Please reset this setting and add your category(ies) again`),
g=!0);return k},[]);if(!g){b=l.siteSettings.discpage_balloon_category;g=!1;var c=b&&b.split("|").reduce((k,u)=>{const t=parseInt(u);(u=l.site.categories.find(w=>w.id===t))?k.push(u):f&&(Z("discpage_balloon_category",`category "${t}" not found. Please reset this setting and add your category(ies) again`),g=!0);return k},[]);if(!g){Y().then(()=>{ia(a,p,c)});a.lookup("controller:application").reopen({queryParams:{showRight:"r"},showRight:!0});var h="";withPluginApi("0.8.30",k=>{k.modifyClass("component:discourse-topic",
{shouldShowTopicInHeader(){return!1}});f&&k.decorateWidget("hamburger-menu:footerLinks",()=>({href:void 0,rawLabel:"DiscPage On/Off",className:"dpg-on-off"}));k.decorateWidget("header:before",u=>{Y().then(()=>{a.b.G=u;a.b.G.widget.model={can_edit:!1}})});k.decorateWidget("post:after",u=>{let t=u.attrs;if(t.firstPost){var w=$("#topic-title .category-name").map((y,B)=>B.innerText).get();p.find(y=>w.includes(y.name))&&Y().then(()=>{S(a.b,{a:t.topicId.toString(),i:t.id,h:t.version,
c:t.cooked,title:$(".fancy-title").text().trim()});U(a.b,0)})}});k.onAppEvent("page:changed",({["currentRouteName"]:u,["url"]:t})=>{if(t!==h){var w=t.split("?")[0]===h.split("?")[0];h=t;ja({u:a,A:u,w,v:e,B:c})}})});TopicNavigationComponent.reopen({_performCheckSize(){this._super();1005>=$("#main-outlet").width()&&this.info.setProperties({renderTimeline:!1})},didInsertElement(){this._super(...arguments);this.observer=new MutationObserver(k=>{k.forEach(u=>{"class"===u.attributeName&&u.target.classList.contains("dpg-topic")&&
this._performCheckSize()})});this.observer.observe(document.documentElement,{attributes:!0})},willDestroyElement(){this.observer.disconnect();this._super(...arguments)}});ApplicationRoute.reopen({S:Ember.observer("topicTrackingState.messageCount",function(){})})}}}else Z("discpage_page_categories","missing setting");else Z("tagging_enabled","this must be set to true")};
