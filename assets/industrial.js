(()=>{
  const esc=s=>String(s??'').replace(/united-piping-premium/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let product,index=0,view='drawing';
  window.renderProductExplorer=(p,i)=>{
    product=p;index=i;const panel=document.querySelector('#product-preview');if(!panel)return;
    panel.setAttribute('aria-labelledby',`product-tab-${i}`);
    const specs=[['Material families',p.materialFamilies?.join(' / ')||'Project-specific; confirm with enquiry'],['Published sizes',p.sizeRanges?.join(' / ')||'Confirm required size and configuration'],['Standard references',[...new Set(p.standards||[])].join(' · ')||'Project specification to be confirmed']];
    const sketch=document.querySelector(`#product-sketch-${i}`)?.innerHTML||'';
    panel.innerHTML=`<div class="explorer-stage"><div class="explorer-view-controls" role="group" aria-label="Product presentation"><button type="button" data-explorer-view="drawing" aria-pressed="${view==='drawing'}">Engineering sketch</button><button type="button" data-explorer-view="image" aria-pressed="${view==='image'}">Product image</button></div><div class="explorer-visual ${view==='drawing'?'sketch-active':''}">${view==='drawing'?`<div class="explorer-drawing" role="img" aria-label="Conceptual ${esc(p.name)} engineering sketch">${sketch}</div>`:`<div class="product-art" role="img" aria-label="Illustrative ${esc(p.name)}" style="--col:${i%4};--row:${Math.floor(i/4)}"></div>`}</div><div class="drawing-titleblock"><div><span>COMPONENT</span><strong>${esc(p.name)}</strong></div><div><span>VIEW</span><strong>${view==='drawing'?'SCHEMATIC':'ILLUSTRATIVE'}</strong></div><div><span>STATUS</span><strong>FOR ENQUIRY</strong></div></div></div><div class="explorer-specs"><p class="eyebrow">MATERIAL & TECHNICAL REFERENCE</p><h3>${esc(p.name)}</h3><p class="explorer-description">${esc(p.headline)}</p><dl>${specs.map(([k,v])=>`<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl><div class="explorer-actions"><button type="button" class="button add-product" data-id="${p.id}">Add to enquiry</button><a class="text-link" href="/united-piping-premium/products/${p.slug}/">View technical details</a></div><a class="spec-download" href="/united-piping-premium/documents/${p.id}-reference.csv" download>Download reference summary <span>CSV</span></a><p class="small-note">Starting references only. Confirm specifications and availability before procurement.</p></div>`;
    document.dispatchEvent(new CustomEvent('product-sketch-change'));
  };
  document.addEventListener('click',e=>{const button=e.target.closest('[data-explorer-view]');if(button&&product){view=button.dataset.explorerView;window.renderProductExplorer(product,index);document.querySelector(`[data-explorer-view="${view}"]`)?.focus({preventScroll:true})}});
  const dialog=document.querySelector('.drawing-dialog');let opener;
  document.querySelectorAll('[data-open-drawing]').forEach(b=>b.addEventListener('click',()=>{opener=b;dialog?.showModal()}));
  document.querySelector('[data-close-drawing]')?.addEventListener('click',()=>dialog.close());
  dialog?.addEventListener('close',()=>opener?.focus({preventScroll:true}));
  dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
  document.querySelectorAll('.service-step').forEach(el=>el.addEventListener('toggle',()=>{if(el.open){document.querySelectorAll('.service-step').forEach(other=>{if(other!==el)other.open=false});document.querySelectorAll('[data-service-photo]').forEach(photo=>photo.hidden=photo.dataset.servicePhoto!==el.dataset.service);document.querySelector('#service-caption').textContent=el.dataset.caption;document.querySelector('#service-image-note').textContent=el.dataset.service==='1'?'Supplied reference image':'Illustrative scene'}}));
  const cinematic=document.querySelector('.industrial-cinematic');
  if(cinematic){
    const film=cinematic.querySelector('video'),control=cinematic.querySelector('button'),reduced=matchMedia('(prefers-reduced-motion: reduce)');let visible=false,paused=false,source='';
    function syncCinema(){if(!source)return;const active=visible&&!paused&&!document.hidden&&!reduced.matches&&!document.body.classList.contains('motion-paused');control.textContent=paused?'Play film':'Pause film';if(!active){film.pause();return}if(!film.src)film.src=source;film.play().then(()=>{film.hidden=false;control.hidden=false}).catch(()=>{film.hidden=true;control.hidden=true})}
    fetch('/united-piping-premium/data/config.json').then(r=>r.json()).then(config=>{source=config.industrialFilmSrc||'';syncCinema()}).catch(()=>{});
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;syncCinema()}).observe(cinematic);
    new MutationObserver(syncCinema).observe(document.body,{attributes:true,attributeFilter:['class']});
    document.addEventListener('visibilitychange',syncCinema);reduced.addEventListener('change',()=>{if(reduced.matches){film.hidden=true;control.hidden=true}syncCinema()});
    control.addEventListener('click',()=>{paused=!paused;syncCinema()});film.addEventListener('error',()=>{film.hidden=true;control.hidden=true});
  }
  const video=document.querySelector('.hero-video');
  if(video){
    const hero=video.closest('.hero'),reduced=matchMedia('(prefers-reduced-motion: reduce)'),button=hero.querySelector('.hero-film-control'),poster=hero.querySelector('.film-poster'),chapters=[...hero.querySelectorAll('[data-scene]')],phase=hero.querySelector('.film-phase');let visible=false,paused=false,failed=false,selected=0,loading=false;
    const names=['flange connection','flow control valve','expansion joint','connected piping system'];
    function update(scene,time=0){selected=scene;chapters.forEach((el,i)=>{el.setAttribute('aria-pressed',String(i===scene));el.style.setProperty('--progress',i===scene?`${time/7*100}%`:'0%')});poster.src=`/united-piping-premium/assets/engineering-poster-${scene}.svg`;poster.alt=`Technical illustration of a ${names[scene]}`;phase.textContent=reduced.matches?'Engineering study':time<1.6?'Tracing the geometry':time<3.2?'Revealing the material':time<5?'Assembling the connection':'Connecting the system'}
    function sync(){const enabled=visible&&!paused&&!document.hidden&&!reduced.matches&&!document.body.classList.contains('motion-paused');button.hidden=reduced.matches;button.textContent=paused||failed?'Play film':'Pause film';if(!enabled){video.pause();if(reduced.matches){hero.classList.remove('video-ready');update(selected)}return}if(!video.src){if(!loading){loading=true;fetch(video.dataset.videoSrc).then(r=>{if(!r.ok)throw Error('Film unavailable');return r.blob()}).then(blob=>{video.src=URL.createObjectURL(blob);video.load();sync()}).catch(()=>{failed=true;button.hidden=true})}return}video.muted=true;video.play().then(()=>{failed=false;hero.classList.add('video-ready')}).catch(()=>{failed=true;button.textContent='Play film'})}
    button.addEventListener('click',()=>{paused=!paused;if(failed){paused=false;failed=false}sync()});
    chapters.forEach((el,i)=>el.addEventListener('click',()=>{update(i);if(video.readyState)video.currentTime=i*7+.1;sync()}));
    video.addEventListener('timeupdate',()=>update(Math.min(3,Math.floor(video.currentTime/7)),video.currentTime%7));
    video.addEventListener('error',()=>{failed=true;hero.classList.remove('video-ready');button.hidden=true});
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.05}).observe(hero);
    new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
    reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
  }
})();
