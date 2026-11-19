(()=>{
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let product,index=0,view='drawing';
  window.renderProductExplorer=(p,i)=>{
    product=p;index=i;const panel=document.querySelector('#product-preview');if(!panel)return;
    panel.setAttribute('aria-labelledby',`product-tab-${i}`);
    const specs=[['Material families',p.materialFamilies?.join(' / ')||'Project-specific; confirm with enquiry'],['Published sizes',p.sizeRanges?.join(' / ')||'Confirm required size and configuration'],['Standard references',[...new Set(p.standards||[])].join(' · ')||'Project specification to be confirmed']];
    const sketch=document.querySelector(`#product-sketch-${i}`)?.innerHTML||'';
    panel.innerHTML=`<div class="explorer-stage"><div class="explorer-view-controls" role="group" aria-label="Product presentation"><button type="button" data-explorer-view="drawing" aria-pressed="${view==='drawing'}">Engineering sketch</button><button type="button" data-explorer-view="image" aria-pressed="${view==='image'}">Product image</button></div><div class="explorer-visual ${view==='drawing'?'sketch-active':''}">${view==='drawing'?`<div class="explorer-drawing" role="img" aria-label="Conceptual ${esc(p.name)} engineering sketch">${sketch}</div>`:`<div class="product-art" role="img" aria-label="Illustrative ${esc(p.name)}" style="--col:${i%4};--row:${Math.floor(i/4)}"></div>`}</div><div class="drawing-titleblock"><div><span>COMPONENT</span><strong>${esc(p.name)}</strong></div><div><span>VIEW</span><strong>${view==='drawing'?'SCHEMATIC':'ILLUSTRATIVE'}</strong></div><div><span>STATUS</span><strong>FOR ENQUIRY</strong></div></div></div><div class="explorer-specs"><p class="eyebrow">MATERIAL & TECHNICAL REFERENCE</p><h3>${esc(p.name)}</h3><p class="explorer-description">${esc(p.headline)}</p><dl>${specs.map(([k,v])=>`<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl><div class="explorer-actions"><button type="button" class="button add-product" data-id="${p.id}">Add to enquiry</button><a class="text-link" href="/products/${p.slug}/">View technical details</a></div><a class="spec-download" href="/documents/${p.id}-reference.csv" download>Download reference summary <span>CSV</span></a><p class="small-note">Starting references only. Confirm specifications and availability before procurement.</p></div>`;
    document.dispatchEvent(new CustomEvent('product-sketch-change'));
  };
  document.addEventListener('click',e=>{const button=e.target.closest('[data-explorer-view]');if(button&&product){view=button.dataset.explorerView;window.renderProductExplorer(product,index);document.querySelector(`[data-explorer-view="${view}"]`)?.focus({preventScroll:true})}});
  const dialog=document.querySelector('.drawing-dialog');let opener;
  document.querySelectorAll('[data-open-drawing]').forEach(b=>b.addEventListener('click',()=>{opener=b;dialog?.showModal()}));
  document.querySelector('[data-close-drawing]')?.addEventListener('click',()=>dialog.close());
  dialog?.addEventListener('close',()=>opener?.focus({preventScroll:true}));
  dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
  document.querySelectorAll('.service-step').forEach(el=>el.addEventListener('toggle',()=>{if(el.open)document.querySelectorAll('.service-step').forEach(other=>{if(other!==el)other.open=false})}));
  const video=document.querySelector('.hero-video');
  if(video){
    const hero=video.closest('.hero'),reduced=matchMedia('(prefers-reduced-motion: reduce)');let visible=false,paused=false,failed=false;
    const button=document.createElement('button');button.type='button';button.className='hero-film-control';button.textContent='Pause film';button.setAttribute('aria-label','Pause pipe interior film');hero.append(button);
    function sync(){const enabled=visible&&!paused&&!document.hidden&&!reduced.matches&&!document.body.classList.contains('motion-paused');button.hidden=reduced.matches;button.textContent=paused||failed?'Play film':'Pause film';button.setAttribute('aria-label',`${paused||failed?'Play':'Pause'} pipe interior film`);if(!enabled){video.pause();if(reduced.matches)hero.classList.remove('video-ready');return}if(!video.src)video.src=video.dataset.videoSrc;video.muted=true;video.play().then(()=>{failed=false;hero.classList.add('video-ready');button.textContent='Pause film'}).catch(()=>{failed=true;button.textContent='Play film'})}
    button.addEventListener('click',()=>{paused=!paused;if(failed){paused=false;failed=false}sync()});
    video.addEventListener('error',()=>{failed=true;hero.classList.remove('video-ready');button.hidden=true});
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.05}).observe(hero);
    new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
    reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
  }
})();
