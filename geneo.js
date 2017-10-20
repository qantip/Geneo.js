function Geneo(x,y){
  var DNALENGTH = 100;
  this.origin = new p5.Vector(x,y);
  this.dna = new DNA(DNALENGTH);

  this.display = function(){
    fill(this.dna.get(2));
    ellipse(this.dna.get(0),this.dna.get(1),20,20);
  }

  this.setDna = function(){
    for (var i = 0; i < this.dna.size; i++){
      if (arguments[i]){
        this.dna.set(i,arguments[i]);
      }
    }
  }
}
