let facemesh;
let video;
let predictions = [];
const points = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

function setup() {
  const canvas = createCanvas(400, 400);
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2); // 將畫布置中
  video = createCapture(VIDEO);
  video.size(400, 400);
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

    stroke(255, 0, 0); // 紅色線條
    strokeWeight(15);   // 線條粗細
    noFill();

    beginShape();
    for (let i = 0; i < points.length; i++) {
      const index = points[i];
      if (keypoints[index]) {
        const [x, y] = keypoints[index];
        console.log(`Point ${index}: (${x}, ${y})`); // 檢查每個點的座標
        vertex(x, y);
      } else {
        console.log(`Invalid point index: ${index}`);
      }
    }
    endShape(CLOSE); // 將最後一點與第一點連接
  }
}

function windowResized() {
  // 當視窗大小改變時，重新置中畫布
  resizeCanvas(400, 400);
  const canvas = document.querySelector("canvas");
  canvas.style.position = "absolute";
  canvas.style.left = `${(windowWidth - width) / 2}px`;
  canvas.style.top = `${(windowHeight - height) / 2}px`;
}
