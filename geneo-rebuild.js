class Gen{
	constructor(value){
		if (value == undefined){
			this.value = 0;
		} else {
			this.value = value;
		}
		this.max = 1.0;
		this.min = 0.0;
		this.wrap = false;
	}
	get(){
		return map(this.value,0,1,this.min,this.max);
	}
	
	getRaw(){
		return this.value;
	}
	setRaw(input){
		this.value = constrain(input,this.min,this.max);
	}
	set(input){
		this.value = map(input,this.min,this.max,0,1);
	}
	mutate(rate){
		if (rate === undefined){
			var rate = 1.0;
		} else {
			rate = constrain(rate,0,1);
		}
		var difference = (this.max - this.min) * rate;
		var minValue = this.value - difference;
		var maxValue = this.value + difference;
		if (this.wrap){
			var newValue = map(Math.random(),0,1,minValue,maxValue);
			this.set((newValue - this.min)%(this.max - this.min) + this.min);
		} else { // not this.wrap
			minValue = constrain(minValue, this.min, this.max);
			maxValue = constrain(maxValue, this.min, this.max);
			var rnd = Math.random();
			var newValue = map(rnd,0,1,minValue,maxValue);
			// console.log(newValue,rnd,difference,minValue,maxValue); // debugg
			this.set(newValue);
		}
	}
}

class Dna{
	constructor(length){
		this.genes = []
		for(var i = 0; i < length; i++){
			this.genes.push(new Gen());
		}
	}
	get(index){
		return this.genes[index].get();
	}
	
	getRaw(index){
		return this.genome[index].getRaw();
	}
	
	set(index, value){
		this.genes[index].set(value);
	}
	
	setRaw(index){
		this.genome[index].setRaw();
	}
	
	mutate(chance, rate){
		for(var i = 0; i < this.genes.length; i++){
			if (Math.random() <= chance){
				this.genes[i].mutate(rate);
			}
		}
	}
	echo(decimals){
		if (decimals === undefined){
			decimals = 3;
		}
		var string = "[";
		for(var i = 0; i < this.genes.length; i++){
			string = string.concat(Number(this.genes[i].get()).toFixed(decimals));
			string = string.concat(", ");
		}
		string = string.concat("]");
		console.log(string);
	}
	length(){ // NOT TESTED
		return this.genes.length;
	}
}

function map(number, low, high, newLow, newHigh){
	if (low == high){
		return low
	}
	number = constrain(number,low,high);
	return ( ( (number - low)/(high - low) ) * (newHigh - newLow) + newLow );
}

function constrain(number, low, high){
	return Math.max(low, Math.min(number, high));
}

class Geneo{ // NOT TESTED YET
	constructor(){
		//this.mutationRate = 0.01; //mutation is not part of mating but dna itself
		this.length = 256;
		this.genWrap = [];
		this.genMode = [];
		this.genRange = [];
		
		# TODO initialize by setDnaLength()
		for (var i = 0; i < this.length; i++){
			this.setGenWrap(i,false);
			this.setGenMode(i,0);
			this.setGenRange(i,0,1);
		}
		
	}
	
	setDnaLength(length){
		if (length > 0){
			this.length = length
		}
		# TODO create update of genWrap, genMode and genRange
	}
	
	setGenWrap(index,wrap){
		if (index <= this.length){
			this.genWrap[index] = wrap;
		}
	}
	
	setGenMode(index,mode){
		if (index <= this.length){
			this.genMode[index] = mode;
		}
	}
	
	setGenRange(index,low,high){
		if (index <= this.length){
			this.genRange[index] = [low,high];
		}
	}
	
	randomDna(){
		var result = new Dna(this.length);
		for(var i = 0; i < this.length; i++){
			result.set(i,Math.random()); # TODO implement min/max (will it be on dna base or geneo base)?
		}
		return result;
	}
	
	newPopulation(count){
		var result = []
		for(var i = 0; i < count; i++){
			result.push(randomDna());
		}
		return result;
	}
	
	combine(dnaArray){
		if (this.lengthCheck(dnaArray)){
			var parentCount = dnaArray.length;
			var dnaLength = dnaArray[0].length();
			var result = new Dna(dnaLength);
			for (var i = 0; i < dnaLength; i++){
				var pick = Math.floor(Math.random()*parentCount);
				result.set(i,dnaArray[pick].get(i));
			}
			return result;
		}
	}

	lengthCheck(dnaArray){
		var result = true;
		var length = dnaArray[0].length(); // TODO method length()
		for (var i = 1; i < dnaArray.length; i++){
			if (length != dnaArray[i].length()){
				result = false;
			}
		}
		return result;
	}

	mattingPool(FitnessArray,count){
		result = [];
		for (var i = 0; i < count; i++){
			result.push(this.weightedRandom(fitnessArray));
		}
		return result;
	}

	weightedRandom(weightArray){
		var weightSum = 0;
		for weight in weightArray{
			weightSum += weight;
		}
		var pick = Math.random() * weightSum;
		for (var i = 0; i < weightArray.length; i++){
			weightSum -= weightArray[i];
			if (weightSum <= 0){
				return i
			}
		}
	}
}
