/* Code-native industrial motion. No new libraries or live operational telemetry. */
window.initIndustrialMotion=function(){
  const all=(s,r=document)=>[...r.querySelectorAll(s)];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const toggle=document.querySelector('.motion-toggle');
  let userPaused=false,context=null;
  const drawingTweens=new Set();
  try{userPaused=sessionStorage.getItem('up-motion-paused')==='true'}catch{}
  const stages=all('.engineering-studio').map(el=>({el,view:'exploded',manual:false,sequence:null,transition:null,draw:null}));
  const motionAllowed=()=>!userPaused&&!reduced.matches;
  function status(stage,view){stage.view=view;stage.el.querySelector('.studio-state').textContent=view==='connected'?'Connected view':'Exploded view';all('[data-assembly-view]',stage.el).forEach(b=>b.setAttribute('aria-pressed',b.dataset.assemblyView===view))}
  function position(stage,view,animate=true){
    stage.transition?.kill();
    const left=stage.el.querySelector('.assembly-left'),right=stage.el.querySelector('.assembly-right');
    const x=view==='connected'?195:0;
    if(window.gsap){stage.transition=gsap.timeline().to(left,{x,duration:motionAllowed()&&animate?1.4:0,ease:'power3.inOut'},0).to(right,{x:-x,duration:motionAllowed()&&animate?1.4:0,ease:'power3.inOut'},0).to(stage.el.querySelector('.assembly-callouts'),{opacity:view==='connected'?0:1,duration:motionAllowed()&&animate?.4:0},0)}else{left.style.transform=`translateX(${x}px)`;right.style.transform=`translateX(${-x}px)`;stage.el.querySelector('.assembly-callouts').style.opacity=view==='connected'?0:1}
    status(stage,view);
  }
  function pathsDraw(paths,duration=1.8){
    if(!window.gsap||!motionAllowed())return null;
    const tl=gsap.timeline({onComplete:()=>drawingTweens.delete(tl)});drawingTweens.add(tl);paths.forEach((path,i)=>{const length=path.getTotalLength?.();if(!length)return;tl.fromTo(path,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration,ease:'power2.inOut',clearProps:'strokeDasharray,strokeDashoffset'},Math.min(i*.025,.5))});return tl;
  }
  function playAssembly(stage){
    if(!window.gsap||!motionAllowed())return;
    stage.sequence?.kill();stage.transition?.kill();stage.draw?.kill();
    position(stage,'exploded',false);
    const parts=all('.machined-body,.flange-face,.flange-edge,.pipe-end,.pipe-bore,.bolt-hole',stage.el);
    stage.draw=pathsDraw(all('.assembly-svg path:not(.assembly-flow),.assembly-svg ellipse',stage.el),2.2);
    stage.sequence=gsap.timeline({onComplete:()=>status(stage,'connected')});
    stage.sequence.fromTo(parts,{fillOpacity:0},{fillOpacity:1,duration:1.6,stagger:.025,ease:'power2.inOut'},1.7)
      .to(stage.el.querySelector('.assembly-callouts'),{opacity:0,duration:.5},3.3)
      .to(stage.el.querySelector('.assembly-left'),{x:195,duration:1.8,ease:'power3.inOut'},3.5)
      .to(stage.el.querySelector('.assembly-right'),{x:-195,duration:1.8,ease:'power3.inOut'},3.5);
  }
  stages.forEach(stage=>{
    all('[data-assembly-view]',stage.el).forEach(button=>button.addEventListener('click',()=>{stage.manual=true;stage.sequence?.kill();stage.draw?.progress(1);stage.draw?.kill();if(window.gsap)gsap.set(all('.machined-body,.flange-face,.flange-edge,.pipe-end,.pipe-bore,.bolt-hole',stage.el),{fillOpacity:1});position(stage,button.dataset.assemblyView)}));
    stage.el.querySelector('.studio-blueprint').addEventListener('change',e=>stage.el.classList.toggle('studio-blueprint-on',e.target.checked));
    stage.el.querySelector('.replay-drawing').addEventListener('click',()=>{stage.manual=true;if(motionAllowed())playAssembly(stage);else position(stage,'exploded',false)});
  });
  document.addEventListener('product-sketch-change',()=>pathsDraw(all('#product-preview .product-outline>*'),1.3));
  all('.blueprint-toggle').forEach(input=>input.addEventListener('change',()=>{if(input.checked)pathsDraw(all('.product-outline>*',input.closest('.product-visual')),1.5)}));
  // Only animate CSS loops while their section is visible.
  const loopTargets=all('.hero,.engineering-studio,.industry-tile,.flow-track,.material-teaser,.global-section');
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('in-view',e.isIntersecting)),{threshold:.08});loopTargets.forEach(el=>observer.observe(el));
  function setUp(){
    context?.revert();context=null;
    drawingTweens.forEach(t=>{t.progress(1);t.kill()});drawingTweens.clear();
    stages.forEach(stage=>{stage.sequence?.kill();stage.draw?.progress(1);stage.draw?.kill();stage.transition?.kill()});
    const active=motionAllowed();document.body.classList.toggle('motion-active',active);document.body.classList.toggle('motion-paused',!active);
    toggle.hidden=reduced.matches;toggle.textContent=userPaused?'Enable motion':'Pause motion';toggle.setAttribute('aria-pressed',String(userPaused));
    if(!window.gsap||!window.ScrollTrigger){stages.forEach(s=>position(s,s.view,false));return}
    gsap.registerPlugin(ScrollTrigger);
    if(!active){stages.forEach(s=>{position(s,s.view,false);gsap.set(all('.machined-body,.flange-face,.flange-edge,.pipe-end,.pipe-bore,.bolt-hole',s.el),{fillOpacity:1})});return}
    context=gsap.context(()=>{
      const mm=gsap.matchMedia();
      mm.add('(min-width: 901px)',()=>{
        const hero=document.querySelector('.hero');
        if(hero){gsap.fromTo('.hero-image',{scale:1.06},{scale:1,duration:9,ease:'power2.out'});gsap.to('.hero-engineering',{y:65,opacity:0,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1}})}
        all('.story-image,.sector-photo').forEach(el=>gsap.fromTo(el,{clipPath:'inset(8% 0 0 0)'},{clipPath:'inset(0% 0 0 0)',duration:1.2,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}}));
        all('.connection-art').forEach(el=>gsap.to(el.children,{x:0,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top 90%',end:'top 35%',scrub:1}}));
      });
      all('.flow-line').forEach(el=>gsap.fromTo(el,{strokeDashoffset:1000},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:el.closest('.flow-section'),start:'top 75%',end:'bottom 65%',scrub:1}}));
      all('.section-heading h2,.story-section h2,.studio-heading h2').forEach(el=>gsap.from(el,{y:24,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 93%',once:true}}));
      const drawingPreview=document.querySelector('#product-preview');
      if(drawingPreview)ScrollTrigger.create({trigger:drawingPreview,start:'top 85%',once:true,onEnter:()=>pathsDraw(all('.product-outline>*',drawingPreview),1.8)});
      all('.industry-drawing').forEach(svg=>ScrollTrigger.create({trigger:svg.closest('.industry-tile'),start:'top 85%',once:true,onEnter:()=>pathsDraw(all('path,circle',svg),2)}));
      stages.forEach(stage=>{position(stage,stage.view,false);if(!stage.manual)ScrollTrigger.create({trigger:stage.el.querySelector('.assembly-stage'),start:'top 78%',once:true,onEnter:()=>playAssembly(stage)})});

    });
  }
  const preview=document.querySelector('#product-preview');
      if(preview){let tween;new MutationObserver(()=>{if(!motionAllowed())return;tween?.kill();const art=preview.querySelector('.product-art');if(art)tween=gsap.fromTo(art,{x:15,opacity:.5},{x:0,opacity:1,duration:.55,ease:'power2.out'})}).observe(preview,{childList:true})}
  toggle.addEventListener('click',()=>{userPaused=!userPaused;try{sessionStorage.setItem('up-motion-paused',String(userPaused))}catch{}setUp()});
  reduced.addEventListener('change',setUp);
  document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('motion-paused',document.hidden||!motionAllowed());if(window.gsap)gsap.globalTimeline.paused(document.hidden)});
  setUp();
};
