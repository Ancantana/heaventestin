let bgImage;
let textInput;
let galleryVisible = false;
let galleryImages = [];
let draggedImages = [];
let plusButton, downloadButton;
let selectedImage = null;
let offsetX, offsetY;
let draggedImage = null;
let dragOffsetX, dragOffsetY;
let imageScaleFactor = 1;
let resizeHandleSize = 10;
let resizeDirection = '';

function preload() {
  bgImage = loadImage('AFTERLIFE.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textInput = createInput('');
  textInput.position(width / 2 - textInput.width / 2, height / 2);

  plusButton = createImg('plusbutton.png', 'plus button');
  plusButton.position(20, 80);
  plusButton.size(30, 30);
  plusButton.mousePressed(toggleGallery);

  downloadButton = createImg('heaveanangel.png', 'download button');
  downloadButton.position(20, 120);
  downloadButton.size(30, 30);
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

  // Draw dragged images on top
  draggedImages.forEach(({ img, x, y, w, h, isDragged }, i) => {
    if (isDragged) {
      image(img, mouseX - dragOffsetX, mouseY - dragOffsetY, w * imageScaleFactor, h * imageScaleFactor);
    } else {
      image(img, x, y, w, h);
    }
  });

  // Draw resize handles on the selected image
  if (selectedImage && selectedImage.selected) {
    let { x, y, w, h } = selectedImage;
    fill(255, 0, 0);
    rect(x + w - resizeHandleSize, y + h - resizeHandleSize, resizeHandleSize, resizeHandleSize);
  }
}

function loadGalleryImages() {
  let imgUrls = [
    'https://ancantana.github.io/heaven/original_77f8f96b25a80928f3f31b83d967fd2d.png',
    'https://ancantana.github.io/heaven/original_77f8f96b25a80928f3f31b83d967fd2d.png',
    'https://ancantana.github.io/heaven/original_77f8f96b25a80928f3f31b83d967fd2d.png'
  ];

  imgUrls.forEach((url, i) => {
    let img = loadImage(url, () => {
      galleryImages[i] = img;
    });
  });
}

function toggleGallery() {
  galleryVisible = !galleryVisible;
}

function drawGallery() {
  fill(255);
  rect(width - 330, 0, 327, 344);

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
  if (dist(mouseX, mouseY, 20, 80) < 15) {
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
    draggedImages.forEach(({ img, x, y, w, h }, i) => {
      if (
        mouseX >= x &&
        mouseX <= x + w &&
        mouseY >= y &&
        mouseY <= y + h
      ) {
        selectedImage = draggedImages[i];
        selectedImage.selected = true; // Set selected property to true
        dragOffsetX = mouseX - x;
        dragOffsetY = mouseY - y;

        // Check if the mouse is over the resize handle of the selected image
        if (
          mouseX >= x + w - resizeHandleSize &&
          mouseX <= x + w &&
          mouseY >= y + h - resizeHandleSize &&
          mouseY <= y + h
        ) {
          resizeDirection = 'se';
        }
      }
    });

    // Deselect the image if clicked outside
    if (!selectedImage) {
      draggedImages.forEach((img) => {
        img.selected = false;
      });
    }
  }
}

function mouseDragged() {
  if (draggedImage) {
    // Update the position of the dragged image
    let imgX = mouseX - dragOffsetX;
    let imgY = mouseY - dragOffsetY;
    let imgW = draggedImage.width * imageScaleFactor;
    let imgH = draggedImage.height * imageScaleFactor;

    // Check if the dragged image is outside the gallery
    if (
      imgX < width - 330 ||
      imgX + imgW > width - 3 ||
      imgY < 0 ||
      imgY + imgH > height
    ) {
      // Add the dragged image to the draggedImages array
      draggedImages.push({ img: draggedImage, x: imgX, y: imgY, w: imgW, h: imgH, isDragged: false, selected: false });
      draggedImage = null; // Reset draggedImage to allow dragging a new image from the gallery
    }
  } else {
    // Check if the selected image is being moved
    if (selectedImage && resizeDirection === '') {
      selectedImage.x = mouseX - dragOffsetX;
      selectedImage.y = mouseY - dragOffsetY;
    }

    // Check if the selected image is being resized
    if (selectedImage && resizeDirection === 'se') {
      let { x, y } = selectedImage;
      selectedImage.w = mouseX - x;
      selectedImage.h = mouseY - y;
    }
  }
}

function mouseReleased() {
  draggedImage = null;
  resizeDirection = '';
  
  // Remove the code that sets selectedImage to null
}

function keyPressed() {
  if (keyCode === DELETE && selectedImage) {
    const index = draggedImages.indexOf(selectedImage);
    if (index !== -1) {
      draggedImages.splice(index, 1);
      selectedImage = null;
    }
  }
}
