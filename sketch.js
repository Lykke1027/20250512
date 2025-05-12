let facemesh;
let video;
let predictions = [];
const points = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

function setup() {
  createCanvas(400, 400);
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
