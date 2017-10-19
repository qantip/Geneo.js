function DNA(length){
  this.genom = []
  for(var i = 0; i < length; i++){
    genom.append(new Gen())
  }
}


function Gen(){
  this.value = None;
  this.set = function(value){
    this.value = value
  }
  this.get = function(){
    return this.value
  }
}
