let img;
let colors = [];
let sortMode = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  const input = document.getElementById('imgInput');
  input.addEventListener('change', handleFile);

  document.getElementById('modeOriginal').addEventListener('click', () => sortMode = null);
  document.getElementById('modeHue').addEventListener('click', () => sortMode = 'hue');
  document.getElementById('modeSat').addEventListener('click', () => sortMode = 'sat');
  document.getElementById('modeBri').addEventListener('click', () => sortMode = 'bri');

}

function draw() {
  background(20);
  noStroke();

  if (!img) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    text('Upload an image to start', width / 2, height / 2);
    return;
  }

  // -------------------------------
  // 1. Define a centered "window"
  // -------------------------------
  // make a square window in the middle of the screen
  let windowSize = min(width, height) * 0.8; // 80% of the smaller side
  let windowX = (width - windowSize) / 2;
  let windowY = (height - windowSize) / 2;

  // how many tiles across that window?
  let tileCount = max(4, floor(map(mouseX, 0, width, 6, 200))); // resolution control
  let rectSize = windowSize / float(tileCount); // pixel size inside the window

  // -------------------------------
  // 2. Sample colours from the IMAGE
  // -------------------------------
  colorMode(RGB, 255);
  colors = [];
  noStroke();

  for (let gridY = 0; gridY < tileCount; gridY++) {
    for (let gridX = 0; gridX < tileCount; gridX++) {

      // map grid position (0..tileCount) into image space (0..img.width/height)
      // sample from the center of each cell
      let px = int(map(gridX + 0.5, 0, tileCount, 0, img.width  - 1));
      let py = int(map(gridY + 0.5, 0, tileCount, 0, img.height - 1));

      let c = img.get(px, py);
      colors.push(color(c));
    }
  }

  // -------------------------------
  // 3. Sort colours if needed
  // -------------------------------
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

  // -------------------------------
  // 4. Draw the mosaic INSIDE the window
  // -------------------------------
  colorMode(RGB, 255);

  let i = 0;
  for (let gridY = 0; gridY < tileCount; gridY++) {
    for (let gridX = 0; gridX < tileCount; gridX++) {
      fill(colors[i]);
      rect(
        windowX + gridX * rectSize,
        windowY + gridY * rectSize,
        rectSize + 1,
        rectSize + 1
      );
      i++;
    }
  }

  // optional: draw the window border
  noFill();
  //stroke(255, 80);
  noStroke();
  //strokeWeight(2);
  rect(windowX, windowY, windowSize, windowSize);
}

// you can keep your existing handleFile:
function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  loadImage(url, loaded => {
    img = loaded;
    // resize to fit canvas nicely, preserving aspect ratio
    const scale = Math.min(width / img.width, height / img.height);
    img.resize(img.width * scale, img.height * scale);
  });
}
