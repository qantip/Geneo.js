class Gen{
	constructor(value){
		if (isNaN(value)){
			this.value = 0;
		} else {
			this.set(value);
		}
		this.max = 1.0;
		this.min = 0.0;
		this.wrap = false;
		this.mode = 0;
	}

	get(){
		switch(this.mode){
			case 0: // return float
				return map(this.value,0,1,this.min,this.max);
			case 1: // return integer
				return Math.round(
					map(this.value,0,1,this.min,this.max)
					);
		}
	}

	getRaw(){
		return this.value;
	}

	setRaw(input){
		this.value = constrain(input,0,1);
	}

	set(input){
		this.value = map(input,this.min,this.max,0,1);
	}

	setRange(low,high){
		this.min = low;
		this.max = high;
		//this.value = constrain(this.value,this.min,this.max);
	}

	setWrap(bool){
		this.wrap = bool;
	}

	setMode(mode){
		this.mode = mode;
	}

	mutate (rate){
		if (isNaN(rate)){
			rate = 1;
		} else {
			rate = constrain(rate,0,1);
		       }
		if (this.wrap){
			var minValue = this.getRaw() - rate;
			var maxValue = this.getRaw() + rate;
			var newValue = map(Math.random(),0,1,minValue,maxValue);
			newValue = ((newValue+1)%1); // overflow
		} else {
			var minValue = constrain(this.getRaw() - rate,0,1);
			var maxValue = constrain(this.getRaw() + rate,0,1);
			var newValue = map(Math.random(),0,1,minValue,maxValue);
		}
		this.setRaw(newValue);
	}

	orPick(){
		var args = Array.prototype.slice.call(arguments)
		args.push(this);
		var pick = Math.floor(Math.random()*args.length);
		console.log(args.length,pick);
		return args[pick];
	}


	blend(genArray){
		var args = Array.prototype.slice.call(arguments)
		args.push(this);
		var weight = [];
		var weightSum = 0;
		for (var i = 0; i < args.length; i++){
			weight[i] = Math.random();
			weightSum += weight[i];
		}
		var weightPick = Math.random()*weightSum;

		// Dna copy of this
		var result = new Gen(this.length);
		result.setRange(this.min,this.max);
		result.setMode(this.mode);
		result.setWrap(this.wrap);

		var weightedValue = 0;
		for (var i = 0; i < args.length; i++){
			weightedValue += args[i].getRaw()*weight[i];
		}
		result.setRaw(weightedValue); // set new value
		return result;

	}
}
/**
* Class for handling DNA informations
*/
class Dna{
	/**
	* Constructor
	* @constructor
	* @param {integer} length - count of genes in DNA
	*/
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
		return this.genes[index].getRaw();
	}

	set(index, value){
		this.genes[index].set(value);
	}

	setRaw(index, value){
		this.genes[index].setRaw(value);
	}

	setWrap(index, bool){
		this.genes[index].setWrap(bool);
	}

	setRange(index, low, high){
		this.genes[index].setRange(low, high);
	}

	setMode(index, mode){
		this.genes[index].setMode(mode);
	}

	mutate(chance, rate){
		for(var i = 0; i < this.genes.length; i++){
			if (Math.random() <= chance){
				this.genes[i].mutate(rate);
			}
		}
	}

	combineNew(){
		var args = Array.prototype.slice.call(arguments)
		args.push(this);
		for(var i = 0; i < this.length(); i++){
			// I have no idea how to make something like function(arg1,arg2, .. ,argN) ... I can do it by Array, which means to rewrite Gen.orPick()
			// this.orPick(//);
		}
	}

	combine(){ // NOT TESTED
		arguments.push(this);
		var count = arguments.length;
		var resultDna = new Dna(this.length);
		resultDna.dnaMode = this.dnaMode;
		resultDna.dnaWrap = this.dnaWrap;
		resultDna.dnaRange = this.dnaRange;
		for (var i = 0; i < resultDna.length; i++){
			var pick = floor(Math.random() * count);
			var newValue = arguments[pick].getRaw();
			if(isNaN(newValue)){
				newValue = 0;
			}
			resultDna.setRaw(newValue);
		}
		return resultDna;
	}

	/**
	* Combination of two or more DNA objects.
	* @param {Array DNA} dnaArray - array of DNA objects (not including parent object)
	*/
	combine2(dnaArray){ // NOT TESTED
		dnaArray.push(this);
		// TODO: compatibilityCheck for DNA
		var count = dnaArray.length;
		var result = new DNA(this.length);
		result.setMode(this.dnaMode);
		result.setWrap(this.dnaWrap);
		result.setRange(this.dnaRange);
		for (var i = 0; i < result.length; i++){
			var pick = floor(Math.random() * count);
			var newValue = dnaArray[pick].getRaw;
			result.setRaw(newValue);
		}
		return result;
	}

	blend(){ // NOT TESTED
		arguments.push(this);
		var count = arguments.length;
		var resultDna = new Dna(this.length);
		resultDna.dnaMode = this.dnaMode;
		resultDna.dnaWrap = this.dnaWrap;
		resultDna.dnaRange = this.dnaRange;
		for (var i = 0; i < resultDna.length; i++){
			var massAddition = 0;
			var weight = [];
			for (var j = 0; j < arguments.length; j++){
				weight.push(Math.random());
				massAddition += weight[j];
			}
			for (var j = 0; j < arguments.length; j++){
				newValue = 0;
				newValue = arguments[j].getRaw()*(weight/massAddition);
			}
		resultDna.setRaw(newValue);
		}
		return resultDna;
	}

	echo(decimals){
		if (decimals === undefined){
			decimals = 3;
		}
		var string = "[";
		for(var i = 0; i < this.genes.length; i++){
			if (i != 0){
				string = string.concat(", ");
			}
			string = string.concat(Number(this.genes[i].get()).toFixed(decimals));
		}
		string = string.concat("]");
		console.log(string);
	}

	length(){
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

class Geneo{
	constructor(){
		this.genLength = 1;
		this.genWrap = [false];
		this.genMode = [0];
		this.genRange = [{min:0, max:1}];
		this.setDnaLength(256); // default length
		// This is a kind strange ... Could be done better

	}

	setDnaLength(newLength){
		if (newLength > 0){
			var oldLength = this.genLength;
			this.genLength = newLength;
			if (newLength > oldLength){ // if longer repeat values from last
				for (var i = oldLength; i < newLength; i++){
					this.setGenWrap(i,this.genWrap[i-1]);
					this.setGenMode(i,this.genMode[i-1]);
					this.setGenRange(i,
									 this.genRange[i-1].min,
									 this.genRange[i-1].max
									);
				}
			} else if (newLength < oldLength){ // else cut to size
				this.genWrap = this.genWrap.slice(0,newLength);
				this.genMode = this.genMode.slice(0,newLength);
				this.genRange = this.genRange.slice(0,newLength);
			}
		}
		else{
			throw new Error("Geneo.setDnaLength() atribute is < 0");
		}
	}

	setGenWrap(index,wrap){
		if (index < this.genLength){
			this.genWrap[index] = wrap;
		} else {
			throw new Error("Geneo.setGenWrap() index atribute is off the length")
		}

	}

	setAllWrap(wrap){
		for (var i = 0; i < this.genLength; i++){
			this.genWrap[i] = wrap;
		}
	}

	setAllMode(mode){
		for (var i = 0; i < this.genLength; i++){
			this.genMode[i] = mode;
		}
	}

	setAllRange(low,high){
		for (var i = 0; i < this.genLength; i++){
			this.genRange[i] = {min:low, max:high};
		}
	}

	setGenMode(index,mode){
		if (index < this.genLength){
			this.genMode[index] = mode;
		} else {
			throw new Error("Geneo.setGenMode() index atribute is off the length")
		}
	}

	setGenRange(index,low,high){
		if (index < this.genLength){
			this.genRange[index] = {min:low, max:high};
		} else {
			throw new Error("Geneo.setGenRange() index atribute is off the length")
		}
	}

	newDna(){
		var result = new Dna(this.genLength);
		for (var i = 0; i < this.genLength; i++){
			result.setWrap(i,this.genWrap[i]);
			result.setRange(i,this.genRange[i].min,this.genRange[i].max);
			result.setMode(i,this.genMode[i]);
		}
		return result;
	}

	randomDna(){
		var result = this.newDna();
		for(var i = 0; i < this.genLength; i++){
			result.setRaw(i,Math.random());
		}
		return result;
	}

	newPopulation(count){
		var result = []
		for(var i = 0; i < count; i++){
			result.push(this.randomDna());
		}
		return result;
	}

	combine(dnaArray){
		if (this.lengthCheck(dnaArray)){
			var parentCount = dnaArray.length;
			var dnaLength = dnaArray[0].length();
			// TODO: port other atributes too (wrap, range, mode, ...)
			// TODO: compatibility check for genes
			// TODO: consider global setting dna atributes by parent object -> Geneo.
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
		var length = dnaArray[0].length();
		for (var i = 1; i < dnaArray.length; i++){
			if (length != dnaArray[i].length()){
				result = false;
			}
		}
		return result;
	}

	compatibilityCheck(dnaArray){
		var result = true;
		var length = dnaArray[0].length();
		for (var i = 1; i < dnaArray.length; i++){
		// TODO: finish this method
		}
	}

	mattingPool(FitnessArray,count){
		var result = [];
		for (var i = 0; i < count; i++){
			result.push(this.weightedRandom(fitnessArray));
		}
		return result;
	}

	nextGeneration(dnaArray,fitnessArray){
		var result = [];
		var count = this.length;
		var selectionPool = this.mattingPool(fitnessArray,count)
		for (selection in selectionPool){
			var parentArray = [];
			for (index in selection){
				parentArray.push(dnaArray[index]);
			}
			this.combine(parentArray) // TODO: Finish this method
		}

	}

	weightedRandom(weightArray){
		var weightSum = 0;
		for (var i = 0; i < weightArray.length; i++){
			weightSum += weightArray[i];
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
