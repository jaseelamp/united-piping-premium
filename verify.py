from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json
D=Path(__file__).parent/'dist'
class Doc(HTMLParser):
 def __init__(self): super().__init__();self.links=[];self.ids=[];self.h1=0;self.canonical=False;self.desc=False
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if tag=='h1':self.h1+=1
  if tag=='link' and a.get('rel')=='canonical':self.canonical=True
  if tag=='meta' and a.get('name')=='description':self.desc=True
  for k in ['href','src']:
   if k in a:self.links.append(a[k])
errors=[];files=list(D.rglob('*.html'));refs=0
for f in files:
 d=Doc();d.feed(f.read_text())
 if d.h1!=1:errors.append(f'{f}: expected one h1')
 if len(d.ids)!=len(set(d.ids)):errors.append(f'{f}: duplicate IDs')
 if not(d.canonical and d.desc):errors.append(f'{f}: missing SEO metadata')
 for link in d.links:
  u=urlsplit(link)
  if u.scheme or u.netloc:continue
  p=(D/unquote(u.path).lstrip('/')) if u.path.startswith('/') else (f.parent/unquote(u.path) if u.path else f)
  if p.is_dir():p=p/'index.html'
  refs+=1
  if not p.exists():errors.append(f'{f.relative_to(D)}: broken {link}')
  elif u.fragment and p.suffix=='.html':
   target=Doc();target.feed(p.read_text())
   if u.fragment not in target.ids:errors.append(f'{f}: missing anchor {link}')
for f in (D/'data').glob('*.json'):json.loads(f.read_text())
products=json.loads((D/'data/products.json').read_text());assert len(products)==8
assert len(json.loads((D/'data/materials.json').read_text()))==9
assert len(json.loads((D/'data/services.json').read_text()))==4
assert len(json.loads((D/'data/industries.json').read_text()))==4
assert not json.loads((D/'data/config.json').read_text())['rfqEndpoint']
if errors:raise SystemExit('\n'.join(errors))
print(f'PASS: {len(files)} HTML documents, {refs} local references, unique IDs, headings, metadata, and JSON datasets.')
