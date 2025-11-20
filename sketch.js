let img;
let colors = [];
let sortMode = null; // 'hue', 'sat', 'bri', 'gray', or null

function setup() {
  createCanvas(600, 600);
  noStroke();

  // hook up file input (HTML element)
  const input = document.getElementById('imgInput');
  input.addEventListener('change', handleFile);

  // hook up buttons
  document.getElementById('modeOriginal').addEventListener('click', () => sortMode = null);
  document.getElementById('modeHue').addEventListener('click', () => sortMode = 'hue');
  document.getElementById('modeSat').addEventListener('click', () => sortMode = 'sat');
  document.getElementById('modeBri').addEventListener('click', () => sortMode = 'bri');
  document.getElementById('modeGray').addEventListener('click', () => sortMode = 'gray');
}

function draw() {
  background(20);

  if (!img) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    text('Upload an image to start', width / 2, height / 2);
    return;
  }

  // how many tiles? mouseX controls resolution but clamp it
  let tileCount = max(4, floor(map(mouseX, 0, width, 4, 80)));
  let rectSize = width / float(tileCount);

  // sample colours (RGB)
  colorMode(RGB, 255);
  colors = [];

  for (let gridY = 0; gridY < tileCount; gridY++) {
    for (let gridX = 0; gridX < tileCount; gridX++) {
      let px = int(gridX * rectSize);
      let py = int(gridY * rectSize);
      let c = img.get(px, py);
      colors.push(color(c));
    }
  }

  // sort if needed
  if (sortMode !== null) {
    colorMode(HSB, 360, 100, 100, 255);

    colors.sort((a, b) => {
      if (sortMode === 'hue') return hue(a) - hue(b);
      if (sortMode === 'sat') return saturation(a) - saturation(b);
      if (sortMode === 'bri') return brightness(a) - brightness(b);
      if (sortMode === 'gray') {
        let ga = 0.299 * red(a) + 0.587 * green(a) + 0.114 * blue(a);
        let gb = 0.299 * red(b) + 0.587 * green(b) + 0.114 * blue(b);
        return ga - gb;
      }
      return 0;
    });
  }

  // draw in RGB so colours are accurate
  colorMode(RGB, 255);
  let i = 0;

  for (let gridY = 0; gridY < tileCount; gridY++) {
    for (let gridX = 0; gridX < tileCount; gridX++) {
      fill(colors[i]);
      rect(gridX * rectSize, gridY * rectSize, rectSize + 1, rectSize + 1);
      i++;
    }
  }
}

// handle file input from <input type="file">
function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  loadImage(url, loaded => {
    img = loaded;
    // resize to fit canvas nicely, preserving aspect ratio
    img.resize(width, 0);
    if (img.height > height) {
      img.resize(0, height);
    }
  });
}
