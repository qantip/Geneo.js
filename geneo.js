function Geneo(){
  var DNALENGTH = 100;
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

  this.setMin = function(value){
    for(var i = 0; i < this.dna.size; i++){
      this.dna.genom[i].min = value;
    }
  }

  this.setMax = function(value){
    for(var i = 0; i < this.dna.size; i++){
      this.dna.genom[i].max = value;
    }
  }

  this.randomize = function(index){
    this.dna.mute(index,1.0)
  }

  this.mute = function(index,rate){
    this.dna.mute(index,rate)
  }
}
