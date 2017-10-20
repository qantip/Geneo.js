function DNA(length){
  this.genom = [];
  this.size = length;

  for(var i = 0; i < this.size; i++){
    this.genom.push(new Gen());
  }

  this.set = function(index, value){
    if (index <= this.size){
      this.genom[index].set(value);
    }
  }

  this.get = function(index){
    if (index <= this.size){
      return this.genom[index].get();
    }
  }

  this.mute = function(index, rate){
    if (index <= this.size){
      this.genom[index].mute(rate);
    }
  }
}


function Gen(){
  this.value = 0;
  this.min = 0;
  this.max = 255;

  this.set = function(value){
    this.value = constrain(value,this.low,this.high);
  }
  this.get = function(){
    return this.value;
  }

  this.mute = function(rate){
    if (rate === undefined){
      rate = 1.0;
    }
    var range = (this.max - this.min) * rate;
    var minVal = constrain(this.value - range,this.min,this.max);
    var maxVal = constrain(this.value + range,this.min,this.max);
    this.value = random(minVal, maxVal);
    print(range,this.value,minVal,maxVal);
  }
}
