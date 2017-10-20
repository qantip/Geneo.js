function DNA(length){
  this.genom = [];
  this.size = length;

  for(var i = 0; i < this.size; i++){
    this.genom.push(new Gen());
  }

  this.set = function(index, value){
    this.genom[index].set(value);
  }

  this.get = function(index){
    return this.genom[index].get();
  }

  this.mute = function(index, rate){
    this.genom[index].mute(rate);
  }
}


function Gen(){
  this.value = 0;
  this.min = 0;
  this.max = 255;

  this.set = function(value){
    this.value = value;
  }
  this.get = function(){
    return this.value;
  }

  this.mute = function(rate){
    if (rate === undefined){
      rate = 1.0;
    }
  this.value = random(this.min, this.max);
  }
}
