let bgImage;
let textInput;
let galleryVisible = false;
let galleryImages = [];
let draggedImages = [];
let plusButton, downloadButton, snapButton;
let selectedImage = null;
let draggedImage = null;
let dragOffsetX, dragOffsetY;
let resizeDirection = '';
let video;
let videoStream;
let videoVisible = true; // Changed to true to initially display video

function preload() {
  bgImage = loadImage('AFTERLIFE.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textInput = select('#text-input');
  textInput.hide();

  plusButton = createImg('plusbutton.png', 'plus button');
  plusButton.position(20, 20);
  plusButton.size(40, 40);
  plusButton.mousePressed(toggleGallery);

  downloadButton = createImg('heaveanangel.png', 'download button');
  downloadButton.position(20, 70);
  downloadButton.size(40, 40);
  downloadButton.mousePressed(toggleVideoAndText);

  snapButton = select('#snap-button');
  snapButton.mousePressed(takeSnapshot);
  snapButton.hide();

  loadGalleryImages();

  video = createCapture(VIDEO);
  video.size(320, 240); // Size adjusted to be more standard
  video.parent('video-container'); // Ensures the video is within the container div
  video.show();

  textInput.show();
  snapButton.show();
}

function draw() {
  if (bgImage) {
    background(bgImage);
  }
  if (galleryVisible) {
    drawGallery();
  }

  // Draw dragged images
  draggedImages.forEach(({ img, x, y, w, h }) => {
    image(img, x, y, w, h);
  });

  // Draw resize button on the selected image
  if (selectedImage && selectedImage.selected) {
    let { x, y, w, h } = selectedImage;

    // Draw the resize button
    fill('#E8E8E8');
    stroke('#6A6142');
    strokeWeight(1);
    rect(x + w - 65, y + h - 32, 55, 22, 18);

    // Draw the "Resize" text
    fill('#6A6142');
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(12);
    text('Resize', x + w - 37.5, y + h - 21);
  }

  // Display video feed
  if (videoVisible) {
    image(video, 0, 0, 320, 240); // Updated to use new video size
  }
}

function loadGalleryImages() {
  let imgUrls = [
    // URLs here
  ];

  imgUrls.forEach((url, i) => {
    loadImage(url, (img) => {
      galleryImages.push(img);
    });
  });
}

function toggleGallery() {
  galleryVisible = !galleryVisible;
}

function toggleVideoAndText() {
  videoVisible = !videoVisible;
  if (videoVisible) {
    textInput.show();
    snapButton.show();
  } else {
    textInput.hide();
    snapButton.hide();
  }
}

function takeSnapshot() {
  let snapshot = video.get();
  let snapshotX = width / 2 - 160; // Half of the video's width
  let snapshotY = height / 2 - 120; // Half of the video's height
  draggedImages.push({ img: snapshot, x: snapshotX, y: snapshotY, w: 320, h: 240, selected: false });
}

function drawGallery() {
  fill(255);
  rect(width - 330, 0, 327, height);

  galleryImages.forEach((img, i) => {
    if (img && img.width > 0 && img.height > 0) {
      let imgX = width - 320;
      let imgY = i * 110 + 10;
      let imgW = 100;
      let imgH = 100;

      if (galleryVisible) {
        image(img, imgX, imgY, imgW, imgH);
      }

      // Check if the mouse is over this image
      if (mouseX >= imgX && mouseX <= imgX + imgW && mouseY >= imgY && mouseY <= imgY + imgH) {
        cursor(MOVE);
      } else {
        cursor(ARROW);
      }
    }
  });
}

function mousePressed() {
  // Mouse pressed events
}

function mouseDragged() {
  // Mouse dragged events
}

function mouseReleased() {
  // Mouse released events
}

function keyPressed() {
  // Key pressed events
}
