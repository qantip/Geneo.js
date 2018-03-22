/**
* @file Main library of classes and function for evolutionary equations.
* @author Lukáš Matěja
* @copyright Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International Public License
* @version 0.3.22
* @see {@link https://github.com/qantip/Geneo.js | Github }
*/

/**
* Class for elementry data handling. Simulation of signle gen behaviour.
* @class
*/
class Gen{
	/**
	* Gen construtor
	* @constructor
	* @param {float} value - setting raw (in range 0.0 to 1.1) value of gen.
	*/
	constructor(value){
		if (isNaN(value)){
			throw new Error("Value is not a number");
		} else {
			this.setRaw(value);
		}
		this.max = 1.0;
		this.min = 0.0;
		this.wrap = false;
		this.mode = 0;
	}

	/**
	* Return phenotype value of gen (in range this.min to this.max).
	* @returns {float|integer} value in range this.min to this.max interpolated by mode of gen.
	*/
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

	/**
	* Return raw value of gen (in range 0.0 to 1.0).
	* @returns {float} value in range 0.0 to 1.0
	*/
	getRaw(){
		return this.value;
	}

	/**
	* Seting raw value of gen (in range 0.0 to 1.0).
	* @param {float} input - raw value to set
	*/
	setRaw(input){
			if ((input < 0) || (input > 1)){
				throw new Error("input value not in range 0.0 to 1.0");
			}
			//console.log(input); // DEBUG
			this.value = input;
		}

	/**
	* Seting phenotype value of gen (in range this.min to this.max)
	*	@param {float} input - value to set
	*/
	set(input){
		this.value = map(input,this.min,this.max,0,1);
	}

	/**
	* Seting phenotype range of gen. Max and min value. By changing this range internal raw value will not change but interpolated Phenotype value will be different!
	* @param {float} low - minimum value of phenotype (when raw value is equal to 0.0)
	* @param {float} high - maximum value of phenotype (when raw value is equal to 1.0)
	*/
	setRange(low,high){
		// TODO: raw value to change to keep phenotype value same
		// TODO: maintain phenotype value out of low high when value will be reinterpolated
		this.min = low;
		this.max = high;
		//this.value = constrain(this.value,this.min,this.max);
	}

	/**
	* Setting-up wrap of gen. When wrap is True: there is a chance to mutate value from max to min. Values are in a imaginary loop where min value is just next to max value on one side.
	* @param {boolean} bool - Enable / Disable wrap of gen.
	*/
	setWrap(bool){
		this.wrap = bool;
	}

	/**
	* Setting phenotype mode of gen. 0 - float, 1 - integer.
	* @param {integer} mode - mode mumber
	* @todo mode control
	*/
	setMode(mode){
		// TODO: Mode control - to be only possible values
		this.mode = mode;
	}

	/**
	* Random change of gen value.
	*	@param {float} rate - Max perecentage of value change in range 0.0 to 1.0
	*/
	mutate (rate){
		if (isNaN(rate)){
			throw new Error("Gen.mutate(rate) argument is not a number.");
		} else if((rate < 0) || (rate > 1)) {
			throw new Error("Gen.mutate(rate) is not in range 0.0 to 1.0");
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

	/**
	* Returns one (unchanged) gen, randomly selected.
	*	@returns {Gen} Picked gen
	*/
	orPick(){
		// TODO: Make it array input not args
		// if (Array.isArray(somebody)) {
		var args = Array.prototype.slice.call(arguments)
		args.push(this);
		var pick = Math.floor(Math.random()*args.length);
		console.log(args.length,pick);
		return args[pick];
	}

	/**
	* Blending two or more genes together.
	*	@param {Gen[]} genArray - Array of genes to blend together. Excluding parent gen.
	* @returns {Gen} Blended gen
	*/
	blend(genArray){
		// if (Array.isArray(somebody)) {
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
		// TODO: use Dna.copy() once it's done
		var result = new Gen(this.length); // TODO: mistake
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

	/**
	 * Checks compatibility of two genes
	 * @param {Gen[] | Gen} genArray - Array of genes to compare (excluding parent one)
	 * @returns {boolean} - true when compatible
	 **/
	compatibleWith(genArray){
		if (!(genArray instanceof Array)){
			genArray = [genArray]
		}
		for (var i = 0; i < genArray.length; i++){
			if (!(genArray[i].mode === this.mode)){ return false; }
			if (!(genArray[i].wrap === this.wrap)){ return false; }
			if (!(genArray[i].min === this.min)){ return false; }
			if (!(genArray[i].max === this.max)){ return false; }
		}
		return true;
	}
	/**
	* Returns copy of itself
	* @returns {Gen} copy
	*/
	copy(){
		// NOT TESTED
		var result = new Gen(this.getRaw());
		result.setWrap(this.wrap);
		result.setMode(this.mode);
		result.setRange(this.min,this.max);
		return result;
	}
}



/*******************************************************************************
* Class for handling DNA informations. Each Dna object contains multiple Gen objects.
* @class
*/
class Dna{
	/**
	* Dna class constructor
	* @constructor
	* @param {integer} length - count of genes in Dna
	*/
	constructor(length){
		this.genes = []
		for(var i = 0; i < length; i++){
			this.genes.push(new Gen(0));
		}
	}

	/**
	* Geting single Gen phenotype value from Dna object
	* @param {integer} index - gen index in Dna
	* @returns {float | integer} selected gen value in range gen.min to gen.max interpolated by mode of gen.
	*/
	get(index){
		return this.genes[index].get();
	}

	getRaw(index){
		return this.genes[index].getRaw();
	}

	getGen(index){
		return this.genes[index].copy();
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

	setGen(index, gen){
		this.genes[index] = gen;
	}

	mutate(chance, rate){
		for(var i = 0; i < this.genes.length; i++){
			if (Math.random() <= chance){
				this.genes[i].mutate(rate);
			}
		}
	}

	/**
	* Combination of two or more DNA objects.
	* @param {Array DNA | DNA} dnaArray - array of DNA objects (not including parent object)
	*/
	combine(dnaArray){
		if (!(dnaArray instanceof Array)){
			dnaArray = [dnaArray]
		}
		dnaArray.push(this);
		// TODO: compatibilityCheck
		var count = dnaArray.length;
		var dnaLength = this.length();
		var result = new Dna(dnaLength);
		for (var i = 0; i < dnaLength; i++){
			var pick = Math.floor(Math.random() * count);
			console.log(pick);
			result.setRaw(i, dnaArray[pick].getRaw(i) );
		}
		return result;
	}

	blend(dna){
		// TODO: compatibilityCheck
		var result = new Dna(this.length());
		result.dnaMode = this.dnaMode;
		result.dnaWrap = this.dnaWrap;
		result.dnaRange = this.dnaRange;
		for (var i = 0; i < this.length(); i++){
			var ratio = Math.random();
			var value = this.getRaw(i)*ratio + dna.getRaw(i)*(1-ratio);
			result.setRaw(i,value);
		}
		return result;
	}

	/**
	* Debug printout of dna values
	* @param {integer} decimals - count of decimals
	*/
	echo(decimals){
		// TODO: Something wrong with decimals
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

	/**
	* Return amount of genes in Dna objects.
	* @returns {integer} count of Genes
	*/
	length(){
		return this.genes.length;
	}

	/**
	* Returns copy of itself. Genes are also transformed as copy not reference.
	* @returns {Dna} copy
	*/
	copy() {
		var result = new Dna(this.length());
		for (var i = 0; i < this.length(); i++){
			result.setGen(i,this.getGen(i));
		}
		return result;
	}
}

/******************************************************************************
* Class for advanced working with DNA populations.
* @class
*/
class Geneo{
	/**
	* Constructor
	* @constructor
	*/
	constructor(){
		this.genLength = 1;
		this.genWrap = [false];
		this.genMode = [0];
		this.genRange = [{min:0, max:1}];
		this.setDnaLength(256); // default length
		// This is a kind strange ... Could be done better

	}

	/**
	*
	*
	*/
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

	/**
	*
	*
	*/
	setGenWrap(index,wrap){
		if (index < this.genLength){
			this.genWrap[index] = wrap;
		} else {
			throw new Error("Geneo.setGenWrap() index atribute is off the length")
		}

	}

	/**
	*
	*
	*/
	setAllWrap(wrap){
		for (var i = 0; i < this.genLength; i++){
			this.genWrap[i] = wrap;
		}
	}

	/**
	*
	*
	*/
	setAllMode(mode){
		for (var i = 0; i < this.genLength; i++){
			this.genMode[i] = mode;
		}
	}

	/**
	*
	*
	*/
	setAllRange(low,high){
		// TODO: Low high swicth
		for (var i = 0; i < this.genLength; i++){
			this.genRange[i] = {min:low, max:high};
		}
	}

	/**
	*
	*
	*/
	setGenMode(index,mode){
		if (index < this.genLength){
			this.genMode[index] = mode;
		} else {
			throw new Error("Geneo.setGenMode() index atribute is off the length")
		}
	}

	/**
	*
	*
	*/
	setGenRange(index,low,high){
		if (index < this.genLength){
			this.genRange[index] = {min:low, max:high};
		} else {
			throw new Error("Geneo.setGenRange() index atribute is off the length")
		}
	}

	/**
	*
	*
	*/
	newDna(){
		var result = new Dna(this.genLength);
		for (var i = 0; i < this.genLength; i++){
			result.setWrap(i,this.genWrap[i]);
			result.setRange(i,this.genRange[i].min,this.genRange[i].max);
			result.setMode(i,this.genMode[i]);
		}
		return result;
	}

	/**
	*
	*
	*/
	randomDna(){
		var result = this.newDna(0);
		for(var i = 0; i < this.genLength; i++){
			result.setRaw(i,Math.random());
		}
		return result;
	}

	/**
	*
	*
	*/
	newPopulation(count){
		var result = []
		for(var i = 0; i < count; i++){
			result.push(this.randomDna());
		}
		return result;
	}

	/**
	*
	*
	*/
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

	/**
	*
	*
	*/
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

	/**
	*
	*
	*/
	compatibilityCheck(dnaArray){
		var result = true;
		var length = dnaArray[0].length();
		for (var i = 1; i < dnaArray.length; i++){
		// TODO: finish this method
		}
	}

	/**
	*
	*
	*/
	getMattingPool(FitnessArray,count){
		var result = [];
		for (var i = 0; i < count; i++){
			result.push(weightedRandom(fitnessArray));
		}
		return result;
	}

	/**
	*
	*
	*/
	nextGeneration(dnaArray,fitnessArray){
		var result = [];
		var count = this.length;
		var selectionPool = this.getMattingPool(fitnessArray,count)
		for (selection in selectionPool){
			var parentArray = [];
			for (index in selection){
				parentArray.push(dnaArray[index]);
			}
			this.combine(parentArray) // TODO: Finish this method
		}
	}

	/**
	*
	*
	*/
	evaluateFitness(dnaArray, fitnessFunction){ // NOT TESTED
		var fitness = [];
		for (var i = 0; i < dnaArray.length; i++){
			fitness.push(fitnessFunction(dnaArray[i]));
		}
		return fitness;
	}

	/**
	*
	*
	*/
	getChildren(dnaArray, fitnessFunction){ // Should replace nextGeneration()
		var fitness = evaluateFitness(dnaArray, fitnessFunction);
		var nextDnaArray = [];
		var count = dnaArray.length;
		var father = this.getMattingPool(fitnessArray, count);
		var mother = this.getMattingPool(fitnessArray, count);
		for (var i = 0; i < count; i++){
			nextDnaArray.push(dnaArray[father[i]].blend(dnaArray[mother[i]]));
		}
		return nextDnaArray;
	}

	/**
	* Returns length of Dna (count of genes in Dna) managed by Geneo object
	* @returns {integer} Number
	*/
	dnaLength(){
		return this.genLength;
		// Not sure about it
	}
}

/****************************************************************/

/**
* Map values from one range to another
* @param {float} number - Number to remap
* @param {float} low - minimum of original domain
* @param {float} high - maximum of original domain
* @param {float} newLow - minimum of target domain
* @param {float} newHight - maximum of targer domain
* @returns {float} remaped value to target domain
*/
function map(number, low, high, newLow, newHigh){
	if (low == high){
		return low;
	}
	var number = constrain(number,low,high);
	return ( ( (number - low)/(high - low) ) * (newHigh - newLow) + newLow );
}

/**
* Limit the number to domain
* @param {float} number - number to remap
* @param {float} low - minimum limit number
* @param {float} high - maximum limit number
* @returns {float} - number
*/
function constrain(number, low, high){
	return Math.max(low, Math.min(number, high));
}

/**
* Returns weighted random index based on value in Array
* @param {float[]} weightArray - Array of (positive) numeric values
* @returns {integer} (weighted) random index from array
*/
function weightedRandom(weightArray){
	var weightSum = 0.0;
	for (var i = 0; i < weightArray.length; i++){
		weightSum += weightArray[i];
	}
	var pick = Math.random() * weightSum;
	for (var i = 0; i < weightArray.length; i++){
		pick -= weightArray[i];
		if (pick <= 0){
			return i
		}
	}
}
