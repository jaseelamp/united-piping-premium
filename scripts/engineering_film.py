"""Original SVG motion-design source for the United Piping hero film.
All geometry is schematic, not a manufacturing drawing or operating simulation.
"""
from math import sin,cos,pi
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
def clamp(t):return max(0,min(1,t))
def ease(t):t=clamp(t);return t*t*(3-2*t)
def holes(cx,cy,rx=36,ry=92):return ''.join(f'<ellipse cx="{cx+rx*cos(a):.2f}" cy="{cy+ry*sin(a):.2f}" rx="5" ry="8" class="hole"/>' for a in [pi/4,3*pi/4,5*pi/4,7*pi/4])
def flange(cx,cy,side):
 d=-1 if side=='left' else 1
 return f'<path d="M{cx+d*175} {cy-47}H{cx+d*65}L{cx+d*15} {cy-88}V{cy+88}L{cx+d*65} {cy+47}H{cx+d*175}Z" class="metal"/><ellipse cx="{cx+d*175}" cy="{cy}" rx="22" ry="47" class="face"/><ellipse cx="{cx+d*175}" cy="{cy}" rx="14" ry="32" class="bore"/><ellipse cx="{cx-13}" cy="{cy}" rx="47" ry="116" class="metal"/><path d="M{cx-13} {cy-116}H{cx}M{cx-13} {cy+116}H{cx}"/><ellipse cx="{cx}" cy="{cy}" rx="47" ry="116" class="face"/><ellipse cx="{cx}" cy="{cy}" rx="25" ry="65" class="bore"/><ellipse cx="{cx}" cy="{cy}" rx="37" ry="97" class="engraving"/>'+holes(cx,cy)
def front(cx,cy,r=75):
 return f'<circle cx="{cx}" cy="{cy}" r="{r}"/><circle cx="{cx}" cy="{cy}" r="{r*.6}"/><circle cx="{cx}" cy="{cy}" r="{r*.43}"/>'+''.join(f'<circle cx="{cx+r*.78*cos(a):.2f}" cy="{cy+r*.78*sin(a):.2f}" r="5"/>' for a in [i*pi/4 for i in range(8)])
NAMES=['FLANGE CONNECTION','FLOW CONTROL','ENGINEERED FLEXIBILITY','CONNECTED SYSTEMS']
SUBS=['PIPE FLANGES / SEALING GASKET','VALVE BODY / STEM / HANDWHEEL','METALLIC BELLOWS / END CONNECTIONS','PIPES / FITTINGS / FLOW CONTROL']
def geometry(scene,t):
 a=ease((t-2.5)/2.0)
 if scene==0:
  left=350+195*a;right=850-195*a
  g=f'<g>{flange(left,330,"left")}</g><g class="copper"><ellipse cx="600" cy="330" rx="31" ry="91"/><ellipse cx="600" cy="330" rx="23" ry="70"/><ellipse cx="600" cy="330" rx="28" ry="84"/></g><g>{flange(right,330,"right")}</g>'
  call='<path d="M350 450V490H220 M600 425V500H670 M850 210V160H980"/><text x="116" y="495">PIPE FLANGE</text><text x="680" y="505">SEALING GASKET</text><text x="990" y="165">MATING FLANGE</text>'
  inset=front(150,640,50)+'<path d="M850 610H920V585H940V695H920V670H850Z M940 585H960V610H1030V670H960V695H940Z"/>'
 elif scene==1:
  y=-85*(1-a)
  g='<path d="M280 320H420L510 255H670L760 320H920V415H760L670 480H510L420 415H280Z" class="metal"/><ellipse cx="280" cy="368" rx="23" ry="48" class="face"/><ellipse cx="280" cy="368" rx="14" ry="32" class="bore"/><ellipse cx="920" cy="368" rx="23" ry="48" class="face"/><ellipse cx="920" cy="368" rx="14" ry="32" class="bore"/><path d="M510 285L670 440 M510 440L670 285" class="copper"/>'
  g+=f'<g transform="translate(0 {y})"><path d="M525 255L555 215H625L655 255Z" class="face"/><rect x="582" y="133" width="16" height="85" class="metal"/><ellipse cx="590" cy="125" rx="107" ry="26" class="wheel"/><ellipse cx="590" cy="125" rx="87" ry="18"/><path d="M490 125H690 M590 100V150"/><circle cx="590" cy="125" r="8" class="face"/></g>'
  call='<path d="M700 125H860V95H930 M925 370H1020V420H1080 M445 300H340V230H205"/><text x="940" y="100">HANDWHEEL + STEM</text><text x="990" y="445">VALVE BODY</text><text x="100" y="235">SECTION STUDY</text>'
  inset='<path d="M90 640H145L175 620H215L245 640H280V680H245L215 700H175L145 680H90Z M195 620V575 M145 575H245"/>'+front(970,650,45)
 elif scene==2:
  movement=(sin((t-4.1)*1.5)*18 if t>4.1 else 0)*a
  left=330+50*a;right=870-50*a+movement
  g=flange(left,330,'left')+flange(right,330,'right')
  gap=(right-left-40)/9
  for i in range(9):
   x=left+20+i*gap
   g+=f'<path d="M{x} 278Q{x+gap/2} 230 {x+gap} 278V382Q{x+gap/2} 430 {x} 382Z" class="metal"/><path d="M{x+gap/2} 265V395" class="engraving"/>'
  call='<path d="M600 245V185H725 M370 455V500H240 M830 450V500H960"/><text x="740" y="190">METALLIC BELLOWS</text><text x="100" y="505">END CONNECTION</text><text x="975" y="505">AXIAL MOVEMENT</text>'
  inset='<path d="M70 610H90V690H70Z M280 610H300V690H280Z M90 625H115 M260 625H280 M90 675H115 M260 675H280"/>'+''.join(f'<path d="M{x} 625Q{x+8} 605 {x+16} 625V675Q{x+8} 695 {x} 675Z"/>' for x in range(115,260,16))
 else:
  offset=100*(1-a)
  g=f'<g transform="translate({-offset} 0)"><path d="M155 390H350Q415 390 415 325V210" class="pipe-route"/><ellipse cx="155" cy="390" rx="18" ry="32" class="face"/><ellipse cx="155" cy="390" rx="10" ry="21" class="bore"/></g>'
  g+=f'<g transform="translate(0 {-offset})"><path d="M415 210H720" class="pipe-route"/><path d="M500 170V250 M515 170V250 M610 170V250 M625 170V250"/></g>'
  g+=f'<g transform="translate({offset} 0)"><path d="M720 210V335Q720 390 775 390H1045" class="pipe-route"/><ellipse cx="1045" cy="390" rx="18" ry="32" class="face"/><ellipse cx="1045" cy="390" rx="10" ry="21" class="bore"/></g>'
  g+='<path d="M500 177H610V243H500Z" class="metal"/><path d="M555 177V135"/><ellipse cx="555" cy="125" rx="60" ry="16" class="wheel"/><path d="M500 125H610"/>'
  call='<path d="M350 430V480H200 M720 180V115H880 M1000 430V480H1090"/><text x="95" y="485">DIRECTIONAL FITTING</text><text x="895" y="120">CONNECTED PIPEWORK</text><text x="950" y="510">CONTINUOUS FLOW</text>'
  inset='<path d="M75 690V630Q75 590 115 590H240 M95 690V630Q95 610 115 610H240"/>'+front(980,645,48)
 return g,call,inset

def frame(scene,t,poster=False):
 reveal=ease(t/1.65);metal=ease((t-1.4)/1.3);opacity=min(ease(t/.45),ease((7-t)/.6)) if not poster else 1
 g,call,inset=geometry(scene,t)
 callopacity=clamp(1-ease((t-3.0)/.6)) if scene==0 else .75
 flowpath='M130 330H1070' if scene!=3 else 'M155 390H350Q415 390 415 325V210H720V335Q720 390 775 390H1045'
 return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 1200 750"><defs><linearGradient id="steel" x1="0" y1="0" x2="0.15" y2="1"><stop stop-color="#344d5f"/><stop offset=".22" stop-color="#b5cad6"/><stop offset=".31" stop-color="#667f90"/><stop offset=".62" stop-color="#1b3040"/><stop offset=".87" stop-color="#7692a4"/><stop offset="1" stop-color="#304959"/></linearGradient><linearGradient id="face"><stop stop-color="#617e90"/><stop offset=".48" stop-color="#c3d8e3"/><stop offset="1" stop-color="#4a687d"/></linearGradient><linearGradient id="dark"><stop stop-color="#07131d"/><stop offset="1" stop-color="#284457"/></linearGradient><radialGradient id="bg"><stop stop-color="#203c50"/><stop offset="1" stop-color="#101e29"/></radialGradient><pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#6c8a9d" stroke-opacity=".09" stroke-width=".7"/></pattern><clipPath id="trace"><rect width="{1200*reveal}" height="750"/></clipPath><style>text{{font-family:monospace;font-size:12px;letter-spacing:1.3px;fill:#9eb6c5;stroke:none}}.geometry{{fill:none;stroke:#9ebed2;stroke-width:1.1}}.metal{{fill:url(#steel);fill-opacity:{metal}}}.face{{fill:url(#face);fill-opacity:{metal}}}.bore,.hole{{fill:url(#dark);fill-opacity:{metal}}}.engraving{{stroke:#526f81;stroke-width:.7;fill:none}}.copper{{fill:none;stroke:#d99f6f;stroke-width:1.7}}.wheel{{fill:#183040;fill-opacity:{metal};stroke:#b8d0de;stroke-width:2}}.pipe-route{{fill:none;stroke:url(#steel);stroke-width:54;stroke-linejoin:round}}.callout{{fill:none;stroke:#7195ac;stroke-width:.8}}.inset{{fill:none;stroke:#658aa3;stroke-width:.8;opacity:.38}}</style></defs><rect width="1200" height="750" fill="url(#bg)"/><rect width="1200" height="750" fill="url(#grid)"/><path d="M24 70V24H1176V70 M24 680V726H1176V680" fill="none" stroke="#66869a" stroke-opacity=".45"/><path d="M24 42V24H42 M1158 726H1176V708" fill="none" stroke="#cba17c" stroke-width="2"/><text x="55" y="58">UNITED PIPING / ENGINEERING MOTION STUDY</text><text x="810" y="58">DRAW · ASSEMBLE · CONNECT</text><g opacity="{opacity}"><g stroke="#6f91a6" stroke-width=".7" stroke-dasharray="6 9" opacity=".35"><path d="M75 330H1125 M600 105V535 M115 130H1085V535H115Z" fill="none"/></g><g class="geometry" opacity=".1">{g}</g><g class="geometry" clip-path="url(#trace)">{g}</g><g class="callout" opacity="{callopacity}">{call}</g><g class="inset">{inset}<path d="M330 585V690 M800 585V690 M55 565H1145"/></g><text x="410" y="610">{NAMES[scene]}</text><text x="410" y="640" style="font-size:10px">{SUBS[scene]}</text><text x="410" y="679" style="font-size:10px;fill:#b48e70">CONCEPTUAL VIEWS · NOT TO SCALE</text><path d="{flowpath}" stroke="#e0a875" stroke-width="1.8" stroke-dasharray="8 20" stroke-dashoffset="{-t*65}" opacity="{.65*ease((t-4.8)/.8)}" fill="none"/></g><path d="M{1200*reveal} 110V530" stroke="#bed4e2" stroke-width="1" opacity="{.25*(1-reveal)}"/></svg>'''

if __name__=='__main__':
 import argparse
 p=argparse.ArgumentParser();p.add_argument('--frames',default='/private/tmp/upg-hero-frames.ndjson');a=p.parse_args()
 for scene in range(4):(ROOT/f'dist/assets/engineering-poster-{scene}.svg').write_text(frame(scene,2.6,True))
 with open(a.frames,'w') as out:
  for scene in range(4):
   for n in range(168):out.write(json.dumps(frame(scene,n/24))+'\n')
 print('Prepared 672 SVG frames and 4 vector fallback posters')
