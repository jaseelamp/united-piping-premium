#!/bin/sh
# Render a seamless camera-motion study from the existing conceptual pipe image.
# Run from the project root. No audio; H.264/yuv420p for broad browser support.
ffmpeg -hide_banner -loop 1 -i dist/assets/pipe-hero.jpg \
  -vf "scale=2560:-1,crop=2560:1440:0:100,zoompan=z='1.03+0.14*(1-cos(2*PI*on/300))':x='(iw-iw/zoom)*0.84':y='(ih-ih/zoom)*0.44':d=1:s=1280x720:fps=25,format=yuv420p" \
  -t 12 -an -c:v libx264 -preset medium -crf 23 -movflags +faststart \
  dist/assets/pipe-interior-motion.mp4
