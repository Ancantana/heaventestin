let bgImage;
let textInput;
let galleryVisible = false;
let galleryImages = [];
let draggedImages = [];
let plusButton, downloadButton;
let selectedImage = null;
let draggedImage = null;
let dragOffsetX, dragOffsetY;
let resizeDirection = '';

function preload() {
  bgImage = loadImage('AFTERLIFE.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textInput = createInput('');
  textInput.position(width / 2 - textInput.width / 2, height / 2);

  plusButton = createImg('plusbutton.png', 'plus button');
  plusButton.position(20, 20);
  plusButton.size(40, 40);
  plusButton.mousePressed(toggleGallery);

  downloadButton = createImg('heaveanangel.png', 'download button');
  downloadButton.position(20, 70);
  downloadButton.size(40, 40);
  downloadButton.mousePressed(() => saveCanvas('myCanvas', 'png'));

  loadGalleryImages();
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
}

function loadGalleryImages() {
  let imgUrls = [
    'https://ancantana.github.io/heaventestin/original_77f8f96b25a80928f3f31b83d967fd2d.png',
    'https://ancantana.github.io/heaventestin/original_052e51d86c2267360a21d5e9bfb41935.png',
    'https://ancantana.github.io/heaventestin/original_29ab04b0486cb7c8845a663e33adfb13.png',
    'https://ancantana.github.io/heaventestin/original_372f6230eb41e5f365737fcda89f50c3.png',
    'https://ancantana.github.io/heaventestin/original_bd74eb6f0884a30cfb2d0af7943a14f9.png',
    'https://ancantana.github.io/heaventestin/original_c14396968eb286bfacdd00e9a0577937.png',
    'https://ancantana.github.io/heaventestin/original_c3c5f8eec85f4387b6a842cef208d51b.png'
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
  if (dist(mouseX, mouseY, 20, 20) < 20) {
    toggleGallery();
  } else {
    galleryImages.forEach((img, i) => {
      if (img && img.width > 0 && img.height > 0) {
        let imgX = width - 320;
        let imgY = i * 110 + 10;
        let imgW = 100;
        let imgH = 100;

        if (mouseX >= imgX && mouseX <= imgX + imgW && mouseY >= imgY && mouseY <= imgY + imgH) {
          draggedImage = img;
          dragOffsetX = mouseX - imgX;
          dragOffsetY = mouseY - imgY;
        }
      }
    });

    // Check if the mouse is over a dragged image
    draggedImages.forEach((draggedImg, i) => {
      let { img, x, y, w, h } = draggedImg;
      if (
        mouseX >= x &&
        mouseX <= x + w &&
        mouseY >= y &&
        mouseY <= y + h
      ) {
        selectedImage = draggedImg;
        selectedImage.selected = true;
        dragOffsetX = mouseX - x;
        dragOffsetY = mouseY - y;

        // Check if the mouse is over the resize button of the selected image
        if (
          mouseX >= x + w - 65 &&
          mouseX <= x + w - 10 &&
          mouseY >= y + h - 32 &&
          mouseY <= y + h - 10
        ) {
          resizeDirection = 'se';
        }
      }
    });

    // Deselect the image if clicked outside
    if (!selectedImage) {
      draggedImages.forEach((draggedImg) => {
        draggedImg.selected = false;
      });
    }
  }
}

function mouseDragged() {
  if (draggedImage) {
    // Update the position of the dragged image
    let imgX = mouseX - dragOffsetX;
    let imgY = mouseY - dragOffsetY;
    let imgW = draggedImage.width;
    let imgH = draggedImage.height;

    // Check if the dragged image is outside the gallery
    if (
      imgX < width - 330 ||
      imgX + imgW > width - 3 ||
      imgY < 0 ||
      imgY + imgH > height
    ) {
      // Add the dragged image to the draggedImages array
      draggedImages.push({ img: draggedImage, x: imgX, y: imgY, w: imgW, h: imgH, selected: false });
      draggedImage = null;
    }
  } else if (selectedImage) {
    // Check if the selected image is being moved
    if (resizeDirection === '') {
      selectedImage.x = mouseX - dragOffsetX;
      selectedImage.y = mouseY - dragOffsetY;
    }

    // Check if the selected image is being resized
    if (resizeDirection === 'se') {
      selectedImage.w = mouseX - selectedImage.x;
      selectedImage.h = mouseY - selectedImage.y;
    }
  }
}

function mouseReleased() {
  draggedImage = null;
  resizeDirection = '';
}

function keyPressed() {
  if (keyCode === BACKSPACE && selectedImage) {
    const index = draggedImages.indexOf(selectedImage);
    if (index !== -1) {
      draggedImages.splice(index, 1);
      selectedImage = null;
    }
  }
}
