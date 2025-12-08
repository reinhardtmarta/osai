const PHI = 1.618033988749895;
let angle = 0;

function bootAnimation() {
  angle += 0.05;
  const scale = Math.sin(angle) * 0.1 + 1;
  document.body.style.transform = `scale(${scale})`;
  if (angle < Math.PI * 4) requestAnimationFrame(bootAnimation);
  else document.getElementById('boot').remove();
}
bootAnimation();
