var tester, tester2;

function setup(){
  createCanvas(windowWidth,windowHeight);
  background(0);
  tester = new Geneo(200,200);
  tester2 = new Geneo(125,12);
  tester.setDna(80,150,128);
  tester2.setDna(90,140,255);
}

function draw(){
  background(0);
  tester2.dna.mute(0,1);
  tester2.dna.mute(1,1);
  tester.display();
  tester2.display();
}
