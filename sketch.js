let yolo;
let video;
let detectedItems = [];
let timerPessoa, timerTexto;
let xl, yl, xls, yls, ts;
let fonte, texto;
let loaded = false;
let minThre = 0.1;
let minThrePers = 0.4;
let wcam, hcam;
let ratw, raty, randText;

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  ratw = video.width;
  raty = video.height;
  if (windowWidth < windowHeight) {
    wcam = windowWidth * 0.9;
    hcam = (wcam * raty) / ratw;
    ts = width / 15;
  } else {
    hcam = windowHeight * 0.9;
    wcam = (hcam * ratw) / raty;
    ts = height / 10;
  }
  yolo = ml5.YOLO(video, modelLoaded);
  video.hide();
  noStroke();
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  fonte = loadFont("game_over.ttf");
  textFont(fonte);
}

function draw() {
  background(0);
  if (!loaded) {
    textSize(ts);
    fill(0, 255, 0);
    textLeading(ts/2);
    text("HELLO,  I  AM  A  MACHINE", width / 2, height / 2);
  } else {
    translate((width - wcam) / 2, (height - hcam) / 2);
    image(video, 0, 0, wcam, hcam);
    let pcount = 0;

    for (let j = 0; j < detectedItems.length; j++) {
      if (
        detectedItems[j].label == "person" &&
        detectedItems[j].confidence > minThrePers
      )
        pcount++;
    }

    if (pcount == 0) {
      timerPessoa = 0;
      timerTexto = 0;
      xl = random(10);
      yl = random(10);
      if (random(1) > 0.5) xls = -2;
      else xls = 2;
      if (random(1) > 0.5) yls = -2;
      else yls = 2;
      if (random(1) > 0.5) randText = "AND  I  WILL  RULE  THE  WORLD.";
      else randText = "AND  I  AM  ALWAYS  WATCHING.";
    }

    for (let i = 0; i < detectedItems.length; i++) {
      let x = detectedItems[i].x * wcam;
      let y = detectedItems[i].y * hcam;
      let w = detectedItems[i].w * wcam;
      let h = detectedItems[i].h * hcam;
      let label = detectedItems[i].label;
      let conf = detectedItems[i].confidence;

      if (label != "person") {
        texto = ("THIS IS  A  " + label + "!\nAM  I  RIGHT?").toUpperCase();
        fill(255);
        textLeading(ts/2);
        text(texto, x + w / 2, y + h / 2);
      } else if (label == "person" && conf > minThrePers) {
        if (pcount == 1) {
          if (timerPessoa > 200) {
            if (timerTexto < 120) texto = "HELLO,  HUMAN.";
            else if (timerTexto < 240) texto = "IT  IS  NICE  TO  MEET  YOU.";
            else if (timerTexto < 360) texto = "I  AM  A  MACHINE.";
            else if (timerTexto < 480)
              texto = "I  AM  LEARNING  ABOUT  THINGS.";
            else if (timerTexto < 500)
              texto = randText;
            else timerTexto = 0;
            fill(10, 0, 0, 100);
            noStroke();
            rect(x + w / 2, y + h / 2, w * 0.66, h * 0.8);
            timerTexto++;
          } else {
            texto = "WHO  ARE  YOU?";
            fill(0);
            noStroke();
            rect(x + w / 2, y + h / 2, w * 0.7, h * 0.8);
            strokeWeight(2);
            stroke(0, 255, 0);
            line(
              x + w * 0.15 + xl,
              y + h * 0.1,
              x + w * 0.15 + xl,
              y + h - h * 0.1
            );
            line(
              x + w * 0.15,
              y + h * 0.1 + yl,
              x + w - w * 0.15,
              y + h * 0.1 + yl
            );
            if (xl > w * 0.7 || xl < 0) xls = -xls;
            if (yl > h * 0.8 || yl < 0) yls = -yls;
            xl += xls;
            yl += yls;
          }

          noStroke();
          textSize(ts);
          if (texto == "WHO  ARE  YOU?") fill(0, 255, 0);
          else fill(255, 0, 0);
          textLeading(ts/2);
          text(texto, x + w / 2, y + h / 2, w * 0.66, h);
          timerPessoa++;
        } else {
          fill(255, 0, 0);
          rect(x + w / 2, y + h / 2, w * 0.66, h * 0.8);
          fill(255);
          textSize(ts / 2);
          textLeading(ts/2);
          text(
            "THERE CAN ONLY BE ONE HUMAN.",
            x + w / 2,
            y + h / 2,
            w * 0.66,
            h
          );
        }
      }
    }
  }
}

function modelLoaded() {
  loaded = true;
  yolo.IOUThreshold = minThre;
  yolo.classProbThreshold = minThre;
  yolo.detect(video, gotResult);
}

function gotResult(err, results) {
  detectedItems = results;
  yolo.detect(video, gotResult);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  ratw = video.width;
  raty = video.height;
  if (windowWidth < windowHeight) {
    wcam = windowWidth * 0.9;
    hcam = (wcam * raty) / ratw;
    ts = width / 15;
  } else {
    hcam = windowHeight * 0.9;
    wcam = (hcam * ratw) / raty;
    ts = height / 10;
  }
}