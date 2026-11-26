"""Prepare a project-path build without modifying JS syntax or SVG markup."""
from pathlib import Path
import re,shutil,subprocess,xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[1]
dest=Path('/private/tmp/united-piping-pages-release')
base='/united-piping-premium'
routes={p.name for p in (root/'dist').iterdir() if p.is_dir()}
pattern=re.compile(r'''(["'`(])/(?=(?:'''+ '|'.join(map(re.escape,sorted(routes)))+r''')(?:/|["'`)]))''')
for p in (root/'dist').rglob('*'):
 if not p.is_file():continue
 out=dest/p.relative_to(root/'dist');out.parent.mkdir(parents=True,exist_ok=True)
 if p.suffix in {'.html','.css','.js','.json','.svg','.xml','.txt'} and 'vendor' not in p.parts:
  s=p.read_text();s=pattern.sub(lambda m:m[1]+base+'/',s)
  s=s.replace('href="/"','href="'+base+'/"').replace('href="/#','href="'+base+'/#')
  s=s.replace('https://united-piping-engineering.woollyfrost513.chatgpt.site','https://jaseelamp.github.io'+base)
  out.write_text(s)
 else:shutil.copy2(p,out)
(dest/'.nojekyll').touch()
for p in (dest/'assets').rglob('*.js'):subprocess.run(['node','--check',str(p)],check=True)
for p in dest.rglob('*.svg'):ET.parse(p)
print('GitHub build verified: all JavaScript syntax and SVG XML valid.')
