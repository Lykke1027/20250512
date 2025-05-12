let facemesh;
let video;
let predictions = [];
const points = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
const leftEyePoints = [133, 173, 157, 158, 159, 160, 161, 246, 33, 7, 163, 144, 145, 153, 154, 155]; // 左眼周圍
const rightEyePoints = [263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249]; // 右眼周圍

function setup() {
  const canvas = createCanvas(640, 480); // 修改畫布大小為 640x480
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2); // 將畫布置中
  video = createCapture(VIDEO);
  video.size(640, 480); // 修改攝影機大小為 640x480
  video.hide();

  console.log("Loading Facemesh model...");
  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on("predict", (results) => {
    predictions = results;
    console.log(predictions); // 檢查預測結果
  });
}

function modelReady() {
  console.log("Facemesh model loaded!");
}

function draw() {
  image(video, 0, 0, width, height);
  drawFacemesh();
}

function drawFacemesh() {
  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 繪製嘴唇
    stroke(255, 0, 0); // 紅色線條
    strokeWeight(15);   // 線條粗細
    noFill();
    beginShape();
    for (let i = 0; i < points.length; i++) {
      const index = points[i];
      if (keypoints[index]) {
        const [x, y] = keypoints[index];
        vertex(x, y);
      }
    }
    endShape(CLOSE);

    // 繪製左眼周圍
    stroke(0, 255, 0); // 綠色線條
    beginShape();
    for (let i = 0; i < leftEyePoints.length; i++) {
      const index = leftEyePoints[i];
      if (keypoints[index]) {
        const [x, y] = keypoints[index];
        vertex(x, y);
      }
    }
    endShape(CLOSE);

    // 繪製右眼周圍
    stroke(0, 0, 255); // 藍色線條
    beginShape();
    for (let i = 0; i < rightEyePoints.length; i++) {
      const index = rightEyePoints[i];
      if (keypoints[index]) {
        const [x, y] = keypoints[index];
        vertex(x, y);
      }
    }
    endShape(CLOSE);
  }
}

function windowResized() {
  // 當視窗大小改變時，重新置中畫布
  resizeCanvas(640, 480); // 修改畫布大小為 640x480
  const canvas = document.querySelector("canvas");
  canvas.style.position = "absolute";
  canvas.style.left = `${(windowWidth - width) / 2}px`;
  canvas.style.top = `${(windowHeight - height) / 2}px`;
}
