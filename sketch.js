var tester = [];
var POPULATIONSIZE = 10;

function setup(){
  createCanvas(windowWidth,windowHeight);

  for (var i = 0; i < POPULATIONSIZE; i++){
    tester.push(new Geneo());
    tester[i].setMin(0);
    tester[i].setMax(400);
    tester[i].randomize(0);
    tester[i].randomize(1);
    tester[i].randomize(2);
  }

}

function draw(){
  background(0);
  for (var i = 0; i < POPULATIONSIZE; i++){
    tester[i].mute(0,0.005);
    tester[i].mute(1,0.005);
    tester[i].display();
  }
}
