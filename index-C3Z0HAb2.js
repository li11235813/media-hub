(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function a(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(n){if(n.ep)return;n.ep=!0;const o=a(n);fetch(n.href,o)}})();const v={music:[{id:"sample-track",title:"示例音乐",artist:"把你的 Drive 直链填进 data/library.json",src:"",cover:"",duration:""}],books:[{id:"welcome-book",title:"欢迎来到你的阅读中心",author:"xi",type:"text",content:`这里是你的在线阅读区。

你可以把书籍内容放进 data/library.json 里，或者接入公开可访问的 txt / html / pdf 链接。

阅读进度、字体大小、颜色、滚动位置都会自动保存在当前浏览器。`,cover:""}],notes:[{id:"welcome-note",title:"第一条便签",createdAt:"2026-06-18",content:"这里可以记录你的想法、摘抄、待办和随笔。",tags:["欢迎"]}]},N=[{name:"夜空黑",background:"#070b12",panel:"rgba(18, 25, 38, 0.88)",text:"#f7f1de",accent:"#8ee3c0"},{name:"蓝莓夜",background:"#0b1020",panel:"rgba(21, 28, 51, 0.92)",text:"#efe9ff",accent:"#9dc4ff"},{name:"抹茶夜",background:"#07120e",panel:"rgba(19, 32, 26, 0.92)",text:"#f4f1dc",accent:"#97e3b2"}],O={provider:"supabase",url:"",anonKey:"",projectName:"music-reading-hub",userSlug:"chad"},m={library:"mrh-library",player:"mrh-player",reader:"mrh-reader",ui:"mrh-ui",sync:"mrh-sync"};function f(e,r){try{const a=localStorage.getItem(e);return a?JSON.parse(a):r}catch{return r}}function y(e,r){try{localStorage.setItem(e,JSON.stringify(r))}catch{}}function E(e="id"){return`${e}-${Math.random().toString(36).slice(2,10)}`}function I(e=0){if(!Number.isFinite(e))return"00:00";const r=Math.floor(e/60),a=Math.floor(e%60);return`${String(r).padStart(2,"0")}:${String(a).padStart(2,"0")}`}function S(e){const r=[...e];for(let a=r.length-1;a>0;a-=1){const s=Math.floor(Math.random()*(a+1));[r[a],r[s]]=[r[s],r[a]]}return r}function $(){return new Date().toISOString().slice(0,10)}const w=document.querySelector("#app"),t={library:{music:[],books:[],notes:[]},player:f(m.player,{currentTrackId:null,volume:.72,mode:"random",currentTime:0,isPlaying:!1,shuffledOrder:[]}),reader:f(m.reader,{currentBookId:null,fontSize:24,textColor:"#ebe4d2",scrollMap:{}}),ui:f(m.ui,{theme:N[0],activeSection:"reading"}),sync:f(m.sync,{...O,enabled:!1,lastSyncedAt:"",status:"未开启跨设备同步"}),transient:{activeNoteId:null,syncing:!1}},i=new Audio;i.preload="metadata";i.volume=t.player.volume;function c(){y(m.player,t.player),y(m.reader,t.reader),y(m.ui,t.ui),y(m.sync,t.sync),y(m.library,{music:t.library.music,books:t.library.books,notes:t.library.notes})}async function L(){var r,a,s,n,o,l;const e=f(m.library,null);if(e!=null&&e.music||e!=null&&e.books||e!=null&&e.notes)t.library={music:(r=e.music)!=null&&r.length?e.music:v.music,books:(a=e.books)!=null&&a.length?e.books:v.books,notes:(s=e.notes)!=null&&s.length?e.notes:v.notes};else try{const u=await fetch("./data/library.json");if(!u.ok)throw new Error("library.json not found");const p=await u.json();t.library={music:(n=p.music)!=null&&n.length?p.music:v.music,books:(o=p.books)!=null&&o.length?p.books:v.books,notes:(l=p.notes)!=null&&l.length?p.notes:v.notes}}catch{t.library=structuredClone(v)}!t.player.currentTrackId&&t.library.music[0]&&(t.player.currentTrackId=t.library.music[0].id),!t.reader.currentBookId&&t.library.books[0]&&(t.reader.currentBookId=t.library.books[0].id),t.player.mode==="random"&&!t.player.shuffledOrder.length&&(t.player.shuffledOrder=S(t.library.music.map(u=>u.id))),c()}function q(e=""){const r=[/\/file\/d\/([a-zA-Z0-9_-]+)/,/[?&]id=([a-zA-Z0-9_-]+)/,/\/open\?id=([a-zA-Z0-9_-]+)/,/\/d\/([a-zA-Z0-9_-]+)/];for(const a of r){const s=e.match(a);if(s!=null&&s[1])return s[1]}return""}function j(e=""){const r=q(e);return r?`https://drive.google.com/uc?export=download&id=${r}`:e}function C(e=""){const r=q(e);return r?`https://drive.google.com/file/d/${r}/preview`:e}function h(){return t.library.music.find(e=>e.id===t.player.currentTrackId)||t.library.music[0]||null}function A(){return t.library.music.findIndex(e=>e.id===t.player.currentTrackId)}function k(){return t.library.books.find(e=>e.id===t.reader.currentBookId)||t.library.books[0]||null}function g(){document.documentElement.style.setProperty("--reader-font-size",`${t.reader.fontSize}px`),document.documentElement.style.setProperty("--reader-color",t.reader.textColor)}function x(e){e&&(i.src=j(e.src||""),i.currentTime=t.player.currentTime||0,i.volume=t.player.volume)}function M(){return t.library.music.map(e=>`
    <article class="music-card ${e.id===t.player.currentTrackId?"active":""}">
      <button data-action="select-track" data-id="${e.id}">
        <strong>${e.title}</strong>
        <div class="helper">点击切换到这首</div>
      </button>
    </article>
  `).join("")}function z(){return t.library.books.map(e=>`
    <article class="book-card ${e.id===t.reader.currentBookId?"active":""}">
      <button data-action="select-book" data-id="${e.id}">
        <strong>${e.title}</strong>
        <div class="helper">${e.type==="text"?"文本阅读":"PDF 在线阅读"}</div>
      </button>
    </article>
  `).join("")}function R(){return t.library.notes.map(e=>`
    <article class="note-card ${e.id===t.transient.activeNoteId?"active":""}">
      <button data-action="load-note" data-id="${e.id}">
        <strong>${e.title}</strong>
        <div class="timestamp">${e.createdAt||""}</div>
        <div class="note-tags">${(e.tags||[]).join(" / ")}</div>
      </button>
    </article>
  `).join("")}function D(e=""){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function F(){const e=k();return e?e.type==="pdf"?`<div class="reader-content"><iframe src="${C(e.src||"")}" title="${e.title}"></iframe></div>`:`<div id="readerScroll" class="reader-content text-view">${D(e.content||"暂无正文")}</div>`:'<div class="reader-content text-view">还没有书籍。</div>'}function d(){g();const e=h(),r=k();w.innerHTML=`
    <div class="app-shell">
      <header class="hero">
        <div class="hero-card">
          <div class="brand-row">
            <div>
              <div class="brand-badge">📚 沉浸阅读 · 🎧 随机音乐</div>
              <h1 class="title">个人音乐与阅读中心</h1>
              <p class="subtitle">更暗、更静、更适合长时间阅读。音乐以随机播放为主，书籍按你最终确认的清单导入。</p>
            </div>
          </div>
          <div class="nav-tabs">
            <button class="tab-btn ${t.ui.activeSection==="reading"?"active":""}" data-action="jump" data-target="reading">阅读</button>
            <button class="tab-btn ${t.ui.activeSection==="music"?"active":""}" data-action="jump" data-target="music">音乐</button>
            <button class="tab-btn ${t.ui.activeSection==="notes"?"active":""}" data-action="jump" data-target="notes">笔记</button>
          </div>
        </div>
      </header>

      <main class="layout">
        <section class="grid-stack">
          <article id="reading" class="panel reader-shell">
            <div class="section-title"><div><h2>阅读器</h2><p>Kindle 风格收敛版：更暗、更克制、默认更大字，更适合长时间阅读。</p></div></div>
            <div class="reader-toolbar">
              <div class="reader-controls">
                <label>字号<input id="fontSizeRange" type="range" min="20" max="34" step="1" value="${t.reader.fontSize}" /></label>
                <label>文字颜色<input id="textColorPicker" type="color" value="${t.reader.textColor}" /></label>
              </div>
              <div class="card-list">${z()}</div>
            </div>
            <div class="reader-stage">
              <div class="reader-head"><div><strong>${(r==null?void 0:r.title)||"暂无书籍"}</strong><div class="meta">${(r==null?void 0:r.type)==="pdf"?"PDF 在线预览":"文本阅读"}</div></div><div class="inline-actions">${r!=null&&r.src?`<a class="ghost-btn" href="${r.src}" target="_blank" rel="noreferrer">原链接</a>`:""}</div></div>
              ${F()}
            </div>
          </article>

          <article id="music" class="panel">
            <div class="section-title"><div><h2>音乐播放器</h2><p>仅保留你最终确认的音乐清单。重点是可播放、可随机、可循环。</p></div></div>
            <div class="cover-art">🎵</div>
            <div class="meta">正在播放</div>
            <h3 class="now-title">${(e==null?void 0:e.title)||"暂无歌曲"}</h3>
            <p class="now-subtitle">${t.player.mode==="random"?"当前为随机播放模式":"当前为顺序播放模式"}</p>
            <div class="range-row"><span>${I(i.currentTime||t.player.currentTime||0)}</span><input id="seekRange" type="range" min="0" max="${Number.isFinite(i.duration)?i.duration:0}" value="${i.currentTime||t.player.currentTime||0}" step="1" /><span>${I(i.duration||0)}</span></div>
            <div class="player-controls" style="margin-top:16px;"><button class="icon-btn" data-action="prev-track">⏮</button><button class="primary-btn" data-action="toggle-play">${t.player.isPlaying?"暂停":"播放"}</button><button class="icon-btn" data-action="next-track">⏭</button><button class="pill-btn" data-action="mode">模式：${t.player.mode==="sequence"?"顺序":t.player.mode==="random"?"随机":"单曲循环"}</button></div>
            <div class="range-row" style="margin-top:16px;"><span>🔉</span><input id="volumeRange" type="range" min="0" max="1" step="0.01" value="${t.player.volume}" /><span>${Math.round(t.player.volume*100)}%</span></div>
            <div class="card-list" style="margin-top:18px; max-height: 420px; overflow:auto;">${M()}</div>
          </article>

          <article id="notes" class="panel">
            <div class="section-title"><div><h2>个人笔记</h2><p>简单记录，不打扰阅读和播放主流程。</p></div></div>
            <div class="stats-grid">
              <div class="stat-card"><div class="meta">音乐数量</div><div class="stat-value">${t.library.music.length}</div></div>
              <div class="stat-card"><div class="meta">书籍数量</div><div class="stat-value">${t.library.books.length}</div></div>
              <div class="stat-card"><div class="meta">笔记数量</div><div class="stat-value">${t.library.notes.length}</div></div>
            </div>
            <div class="card-list" style="margin-top:18px;">${R()}</div>
          </article>
        </section>

        <aside class="grid-stack">
          <article class="panel form-card note-editor">
            <h3>写一条笔记</h3>
            <div class="two-col"><label>标题<input id="noteTitle" placeholder="例如：今天的灵感" /></label><label>标签<input id="noteTags" placeholder="例如：阅读, 想法, 待办" /></label></div>
            <label style="margin-top:12px;">日期<input id="noteDate" type="date" value="${$()}" /></label>
            <label style="margin-top:12px;">内容<textarea id="noteContent" placeholder="输入你的记录内容"></textarea></label>
            <div class="quick-actions" style="margin-top:14px;"><button class="primary-btn" data-action="add-note">保存笔记</button><button class="ghost-btn" data-action="new-note">新建空白笔记</button></div>
          </article>
        </aside>
      </main>

      <div class="footer-tip">默认保存在浏览器本地。后续如果你要跨设备同步，可以再补 Supabase 版。</div>
    </div>
  `,V(),_()}function _(){var a;const e=document.querySelector("#readerScroll"),r=k();!e||!r||(e.scrollTop=((a=t.reader.scrollMap)==null?void 0:a[r.id])||0,e.addEventListener("scroll",()=>{t.reader.scrollMap[r.id]=e.scrollTop,c()}))}function b(e,r=!0){t.player.currentTrackId=e,t.player.currentTime=0;const a=h();x(a),c(),d(),r&&(a!=null&&a.src)&&i.play().then(()=>{t.player.isPlaying=!0,c(),d()}).catch(()=>{t.player.isPlaying=!1,c(),d()})}function P(){const e=t.library.music;if(!e.length)return;if(t.player.mode==="random"){const a=t.player.shuffledOrder.length?t.player.shuffledOrder:S(e.map(n=>n.id));t.player.shuffledOrder=a;const s=a.indexOf(t.player.currentTrackId);b(a[(s+1)%a.length]||a[0]);return}if(t.player.mode==="single-loop"){b(t.player.currentTrackId);return}const r=A();b(e[(r+1)%e.length].id)}function B(){const e=t.library.music;if(!e.length)return;const r=A();b(e[(r-1+e.length)%e.length].id)}function K(){const e=h();e!=null&&e.src&&(i.src||x(e),i.paused?i.play().then(()=>{t.player.isPlaying=!0,c(),d()}).catch(()=>{}):(i.pause(),t.player.isPlaying=!1,c(),d()))}function Z(){const e=["sequence","random","single-loop"],r=e.indexOf(t.player.mode);t.player.mode=e[(r+1)%e.length],t.player.mode==="random"&&(t.player.shuffledOrder=S(t.library.music.map(a=>a.id))),c(),d()}function H(){var n,o,l,u;const e=((n=document.querySelector("#noteTitle"))==null?void 0:n.value.trim())||"未命名笔记",r=((o=document.querySelector("#noteTags"))==null?void 0:o.value.split(",").map(p=>p.trim()).filter(Boolean))||[],a=((l=document.querySelector("#noteDate"))==null?void 0:l.value)||$(),s=(u=document.querySelector("#noteContent"))==null?void 0:u.value.trim();if(!s)return alert("请输入笔记内容");t.library.notes.unshift({id:E("note"),title:e,tags:r,createdAt:a,content:s}),c(),d()}function J(e){const r=t.library.notes.find(a=>a.id===e);r&&(t.transient.activeNoteId=e,d(),document.querySelector("#noteTitle").value=r.title||"",document.querySelector("#noteTags").value=(r.tags||[]).join(", "),document.querySelector("#noteDate").value=r.createdAt||$(),document.querySelector("#noteContent").value=r.content||"")}function G(){t.transient.activeNoteId=null,d()}function V(){var e,r,a,s;w.querySelectorAll("[data-action]").forEach(n=>{n.addEventListener("click",o=>{var T;const{action:l,id:u,target:p}=o.currentTarget.dataset;l==="select-track"&&b(u,!1),l==="select-book"&&(t.reader.currentBookId=u,c(),d()),l==="toggle-play"&&K(),l==="next-track"&&P(),l==="prev-track"&&B(),l==="mode"&&Z(),l==="jump"&&(t.ui.activeSection=p,c(),(T=document.querySelector(`#${p}`))==null||T.scrollIntoView({behavior:"smooth",block:"start"}),d()),l==="add-note"&&H(),l==="load-note"&&J(u),l==="new-note"&&G()})}),(e=document.querySelector("#volumeRange"))==null||e.addEventListener("input",n=>{t.player.volume=Number(n.target.value),i.volume=t.player.volume,c()}),(r=document.querySelector("#seekRange"))==null||r.addEventListener("input",n=>{const o=Number(n.target.value);i.currentTime=o,t.player.currentTime=o,c()}),(a=document.querySelector("#fontSizeRange"))==null||a.addEventListener("input",n=>{t.reader.fontSize=Number(n.target.value),c(),g()}),(s=document.querySelector("#textColorPicker"))==null||s.addEventListener("input",n=>{t.reader.textColor=n.target.value,c(),g()})}i.addEventListener("timeupdate",()=>{t.player.currentTime=i.currentTime,c();const e=document.querySelector("#seekRange");e&&(e.value=String(i.currentTime||0))});i.addEventListener("ended",()=>{if(t.player.mode==="single-loop"){i.currentTime=0,i.play();return}P()});i.addEventListener("play",()=>{t.player.isPlaying=!0,c(),d()});i.addEventListener("pause",()=>{t.player.isPlaying=!1,c(),d()});(async function(){await L(),g();const r=h();r!=null&&r.src&&x(r),d()})();
