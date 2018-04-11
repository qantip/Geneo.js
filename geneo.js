/**
* @file Main library of classes and function for evolutionary equations.
* @author Lukáš Matěja
* @copyright Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International Public License
* @version 0.4.11
* @see {@link https://github.com/qantip/Geneo.js | Github }
*/

/**
* @class
* @classdesc Class for elementry data handling. Simulation of signle gen behaviour.
*/
class Gen{
	/**
	* Gen construtor
	* @constructor
	* @param {float} value - setting raw (in range 0.0 to 1.1) value of gen.
	*/
	constructor(value){
		if (isNaN(value)){
			throw new Error("Gen.constructor(): argument is not a number");
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
	* Returns mode number of Gene
	* @returns {integer} mode number
	*/
	getMode(){
		return this.mode;
	}

	/**
	* Returns if value wrap is enabled or not.
	* @returns {boolean} wrap enabled
	*/
	getWrap(){
		return this.wrap;
	}

	/**
	* Returns Range of phenotype of Gene.
	* @returns {float[]} [Bottom limit, Top limit]
	*/
	getRange(){
		return [this.min, this.max];
	}

	/**
	* Returns minimum phenotype value of Gene.
	* @returns {float} phenotype minimum
	*/
	getMin(){
		return this.min;
	}

	/**
	* Returns maximum phenotype value of Gene.
	* @returns {float} phenotype maximum
	*/
	getMax(){
		return this.max;
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
	* Randomize Gen value
	*/
	randomize(){
		this.value = Math.random();
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
	*	@param {Gen} gen - gen to blend with
	* @returns {Gen} Blended gen
	*/
	blend(gen){
		var result = this.copy();
		var ratio = Math.random();
		result.setRaw( this.getRaw()*ratio + gen.getRaw()*(1-ratio));
		return result;
	}

	blendOld(genArray){
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
		var result = new Gen(0);
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
  * Checks compatibility with another gen
  * @param {Gen[] | Gen} genArray Description
  * @return {type} Description
  */
	compatibleWith(genArray){
		if (!(genArray instanceof Array)){
			genArray = [genArray]
		}
		try {
			for (var i = 0; i < genArray.length; i++){
				if (!(genArray[i].mode === this.mode)){ return false; }
				if (!(genArray[i].wrap === this.wrap)){ return false; }
				if (!(genArray[i].min === this.min)){ return false; }
				if (!(genArray[i].max === this.max)){ return false; }
			}
			return true;
		}
		catch(error) {
		 return false;
		}
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
* @class
* @classdesc Class for handling DNA informations. Each Dna object contains multiple Gen objects.
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
	* Geting single Gen phenotype value from Dna object.
	* @param {integer} index - gen index in Dna
	* @returns {float | integer} selected gen value in range gen.min to gen.max interpolated by mode of gen.
	*/
	get(index){
		return this.genes[index].get();
	}

	/**
	*	Return all phenotype values in array
	* @returns {float[]} phenotype values in array
	*/
	getAll(){
		var result = [];
		for (var i = 0; i < this.length(); i++){
			result.push(this.get(i));
		}
		return result;
	}

	/**
	* Returns Raw (in range 0.0 to 1.0) value from Dna object.
	* @param {integer} index - gen index in Dna
	* @returns {float} selected gen raw value (in range 0.0 to 1.1)
	*/
	getRaw(index){
		return this.genes[index].getRaw();
	}

	/**
	*	Return all raw values in array
	* @returns {float[]} raw values (in range 0.0 to 1.0) in array
	*/
	getRawAll(){
		var result = [];
		for (var i = 0; i < this.length(); i++){
			result.push(this.getRaw(i));
		}
		return result;
	}

	/**
	* Returns copy of Gen from Dna object.
	* @param {integer} index - gen index in Dna
	* @returns {Gen} Gen copy
	*/
	getGen(index){
		return this.genes[index].copy();
	}

	/**
	* Returns mode number of Gen from Dna object.
	* @param {integer} index - gen index in Dna
	* @returns {integer} mode number
	*/
	getMode(index){
		return this.genes[index].getMode();
	}

	/**
	* Returns if wrap of Gen from Dna object is enabled.
	* @param {integer} index - gen index in Dna
	* @returns {boolean} wrap enabled
	*/
	getWrap(index){
		return this.genes[index].getWrap();
	}

	/**
	* Returns Range of phenotype of Gen.
	* @param {integer} index - gen index in Dna
	* @returns {float[]} [Bottom limit, Top limit]
	*/
	getRange(index){
		return this.genes[index].getRange();
	}

	/**
	* Returns maximum pheontype value of Gen.
	* @param {integer} index - gen index in Dna
	* @returns {float} Maximum phenotype value
	*/
	getMax(index){
		return this.genes[index].getMax();
	}

	/**
	* Returns minimum pheontype value of Gen.
	* @param {integer} index - gen index in Dna
	* @returns {float} minimum phenotype value
	*/
	getMin(index){
		return this.genes[index].getMin();
	}

	/**
	* Set phenotype value of single Gen in Dna object.
	* @param {integer} index - gen index in Dna
	* @param {float} value - phenotype value to set
	*/
	set(index, value){
		this.genes[index].set(value);
	}

	/**
	*	Set all phenotype values in array
	* @param {float[]} valueArray - phenotype values in array
	*/
	setAll(valuesArray){
		for (var i = 0; i < this.length(); i++){
			this.set(i,valuesArray[i]);
		}
	}

	/**
	* Set raw value (in range 0.0 to 1.0) of single Gen in Dna object.
	* @param {integer} index - gen index in Dna
	* @param {float} value - raw value (in range 0.0 to 1.0) to set
	*/
	setRaw(index, value){
		this.genes[index].setRaw(value);
	}

	/**
	*	Set all raw values in array
	* @param {float[]} valueArray - raw values (in range 0.0 to 1.0) in array
	*/
	setRawAll(valuesArray){
		for (var i = 0; i < this.length(); i++){
			this.setRaw(i,valuesArray[i]);
		}
	}

	/**
	* Set if wrap i enabled in a single Gen of Dna object. If wrap is enabled values can overflow form minimum to maximum and oposite way.
	* @param {integer} index - gen index in Dna
	* @param {float} boolean - wrap enable to set
	*/
	setWrap(index, bool){
		this.genes[index].setWrap(bool);
	}

	/**
	* Set range of values for single Gen in Dna object.
	* @param {integer} index - gen index in Dna
	* @param {float} low - minimum phenotype limit to set
	* @param {float} high - maximum pehotype limit to set
	*/
	setRange(index, low, high){
		this.genes[index].setRange(low, high);
	}

	/**
	* Set mode for single Gen in Dna object.
	* @param {integer} index - gen index in Dna
	* @param {integer} mode - mode number
	*/
	setMode(index, mode){
		this.genes[index].setMode(mode);
	}

	/**
	* Replace single gen in Dna object
	* @param {integer} index - gen index in Dna
	* @param {Gen} gen - Gen object to put in Dna
	*/
	setGen(index, gen){
		this.genes[index] = gen;
	}

	/**
	* Set count of Genes in Dna object
	* @param {integer} length - count of Genes
	*/
	setLength(length){
		if (length > this.genes.length){
			for (var i = this.genes.length; i < lenght; i++){
				this.genes.push(new Gen(0));
			}
		} else if (length < this.genes.length){
			this.genes.slice(0,length);
		}
	}

	/**
	* Mutate (Change) values in Dna object. If wrap is enabled values can overflow from minumum to maximum and other way.
	* @param {float} chance - precentage chance that each one gen will get mutated. 0.0 - no gen will change, 1.0 - every gen will get mutated.
	* @param {float} rate - percentage of maximum change of gen values, that will change. 0.0 - no change, 0.1 - value will change by max 10%, 1.0 - gen value will randomly mutate to whole range
	*/
	mutate(chance, rate){
		for(var i = 0; i < this.genes.length; i++){
			if (Math.random() <= chance){
				this.genes[i].mutate(rate);
			}
		}
	}

	/**
	* Randomize Dna values
	*/
	randomize(){
		for(var i = 0; i < this.genes.length; i++){
			this.genes[i].randomize();
		}
	}

	/**
	* Combination of two or more Dna objects. Each gen position will be picked as whole from one of parents.
	* @param {DNA[] | DNA} dnaArray - array of DNA objects (not including parent object)
	* @returns {DNA} combined Dna object
	* @todo compatibilityCheck
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
			//console.log(pick);
			result.setRaw(i, dnaArray[pick].getRaw(i) );
		}
		return result;
	}

	/**
	* Combination of two Dna objects by blending values on each gen position. Each Gen value will be partly taken from each of parents, which leads to much smoother mechanismu then just picking gen as whole from one of parents.
	* @param {Dna} dna - Second Dna object to blend with
	* @returns {Dna} Blended Dna object
	*/
	blend(dna){
		var result = this.copy();
		for (var i = 0; i < result.length(); i++){
			result.genes[i] = this.genes[i].blend(dna.genes[i])
		}
		return result;
	}

	/**
	* Legacy Dna.blend() method
	* @private
	*/
	blendOld(dna){
		// TODO: compatibilityCheck
		var result = new Dna(this.length());
		for (var i = 0; i < this.lenght; i++){
			result.setMode(i,this.getMode(i));
			result.setWrap(i,this.getWrap(i));
			result.setRange(i,this.getMin(i),this.getMax(i));
		}
		for (var i = 0; i < this.length(); i++){
			var ratio = Math.random();
			var value = this.getRaw(i)*ratio + dna.getRaw(i)*(1-ratio);
			// TODO: why not Gen.blend()?
			//console.log(value);
			result.setRaw(i,value);
			//console.log("Fen:",result.get(i));
		}
		//console.log("1:",this,"\n2:",dna,"\n1+2:",result);
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

	compatibleWith(dnaArray){
		if (!(dnaArray instanceof Array)){
			dnaArray = [dnaArray]
		}
		for (var i = 0; i < this.length(); i++){
			//TODO: Unfinished
		}
	}
}

/******************************************************************************
* @class
* @classdesc Class for advanced working with DNA populations.
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
	* Sets lenght of generated Dna objects.
	* @param {integer} newLength - lenght of Dna (Count of genes in Dna)
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
	* Sets wrap for single Gen of generated Dna objects.
	* @param {integer} index - gen index in Dna
	* @param {boolean} wrap - wrap enabled
	*/
	setGenWrap(index,wrap){
		if (index < this.genLength){
			this.genWrap[index] = wrap;
		} else {
			throw new Error("Geneo.setGenWrap() index atribute is off the length")
		}

	}

	/**
	* Sets wrap for all Genes of generated Dna objects.
	* @param {boolean} wrap - wrap enabled
	*/
	setAllWrap(wrap){
		for (var i = 0; i < this.genLength; i++){
			this.genWrap[i] = wrap;
		}
	}

	/**
	* Sets mode for all Genes of generated Dna objects.
	* @param {boolean} mode - mode number to set
	*/
	setAllMode(mode){
		for (var i = 0; i < this.genLength; i++){
			this.genMode[i] = mode;
		}
	}

	/**
	* Sets minimum and maximum phenotype value for all Genes of generated Dna objects.
	* @param {float} low - minimum phenotype limit to set
  * @param {float} high - maximum pehotype limit to set
	*/
	setAllRange(low,high){
		// TODO: Low high swicth
		for (var i = 0; i < this.genLength; i++){
			this.genRange[i] = {min:low, max:high};
		}
	}

	/**
	* Sets mode for single Gen of generated Dna objects.
	* @param {integer} index - gen index in Dna
	* @param {integer} mode - mode number to set
	*/
	setGenMode(index,mode){
		if (index < this.genLength){
			this.genMode[index] = mode;
		} else {
			throw new Error("Geneo.setGenMode() index atribute is off the length")
		}
	}

	/**
	* Sets minimum and maximum phenotype value for single Gene of generated Dna objects.
	* @param {integer} index - gen index in Dna
	* @param {float} low - minimum value of phenotype (when raw value is equal to 0.0)
	* @param {float} high - maximum value of phenotype (when raw value is equal to 1.0)
	*/
	setGenRange(index,low,high){
		if (index < this.genLength){
			this.genRange[index] = {min:low, max:high};
		} else {
			throw new Error("Geneo.setGenRange() index atribute is off the length")
		}
	}

	/**
	* Generates single Dna by inner setup of this object with 0 raw value of each Gene.
	* @returns {Dna} Dna object
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
	* Generates single Dna by inner setup of this object with random value of each Gene.
	* @returns {Dna} Dna object
	*/
	randomDna(){
		var result = this.newDna();
		for(var i = 0; i < this.genLength; i++){
			result.setRaw(i,Math.random());
		}
		return result;
	}

	/**
	* Generate Array of genes with random gene values.
	* @param {integer} count - count of generated Dna objects in array.
	* @returns {Dna[]} Array of Dna objects
	* @todo Rename to newPool()
	*/
	newPopulation(count){
		var result = []
		for(var i = 0; i < count; i++){
			result.push(this.randomDna());
		}
		return result;
	}

	/**
	* I have no idea what I wanted to do with this.
	* @todo delete this if it is not needed
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
	* Checks if lenght of all Dna objects is the same.
	* @param {Dna[]} dnaArray - Array of Dna object to check
	* @return {boolean} true if the lenght is same for all Dnas, otherwise false
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
	* Checks if parameters of all Dna objects is the same (Everything excluding values).
	* @param {Dna[]} dnaArray - Array of Dna object to check
	* @return {boolean} not done yet
	*/
	compatibilityCheck(dnaArray){
		var result = true;
		var length = dnaArray[0].length();
		for (var i = 1; i < dnaArray.length; i++){
		// TODO: finish this method
		}
	}

	/**
	* Returns array of indexes based on fitness array. Higher number makes higher chance of index to be picked.
	* @param {float[]} fitnessArray - array of fitness values
	* @param {integer} count - count of generated indexes (lenght of returned array)
	* @returns {integer[]} array of indexes of atribute array
	*/
	getMattingPool(fitnessArray,count){
		var result = [];
		for (var i = 0; i < count; i++){
			result.push(weightedRandom(fitnessArray));
		}
		return result;
	}

	/**
	* Generate new generation
	* @param {Dna[]} dnaArray - Array of Dna objects to compute with
	* @param {float[]} fitnessArray - Array of fitness values compatible with dnaArray.
	* @returns not finished yet
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
	* Evaluate fitness number of each gen form array. Fitness is evalueated by funtion in argument
	* @param {Dna[]} dnaArray - array of Dna objects to evaluate from
	* @param {function} fitnessFunction - function to work with
	* @returns {float[]} fitness array
	* @todo make it more easy to customize
	* @private
	*/
	evaluateFitness(dnaArray, fitnessFunction){ // NOT TESTED
		var fitness = [];
		for (var i = 0; i < dnaArray.length; i++){
			//console.log(dnaArray[i].get(0),dnaArray[i].get(1));
			fitness.push(fitnessFunction(dnaArray[i].get(0),dnaArray[i].get(1))); // TODO: Can't be done this way
		}
	 	//console.log(fitness);
		return fitness;
	}

	/**
	* Generate a new Dna array based on existing Dna array and evaluating function. New Dna Array will have same length as one in argument. Each new Dna will be generated by law of survaival of fittest. Where parrents will be chosen by its fitness and then 'blended' together. There is no mutation included yet.
	* @param {Dna[]} dnaArray - array of parent Dnas
	* @param {function} fitnessFunction - function to evaluate fitness
	*/
	nextGeneration(dnaArray, fitnessFunction){ // Should replace nextGeneration()
		var fitnessArray = this.evaluateFitness(dnaArray, fitnessFunction); // TODO: fitness function have a great mistakes in it
		var nextDnaArray = [];
		var count = dnaArray.length;
		var father = this.getMattingPool(fitnessArray, count);
		var mother = this.getMattingPool(fitnessArray, count);
		//console.log(father,mother);
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

/*******************************************************************************
* @class
* @classdesc Genepool simply.
*/
class Genepool{
	/**
	* Genepool constructor
	* @constructor
	*/
  constructor(){
    this.pool = [];
    this.template = new Dna(256);
    this.fitness = [];
    //this.genLength = 1;
    //this.genWrap = [false];
    //this.genMode = [0];
    //this.genRange = [{min:0, max:1}];
    //this.setDnaLength(256)
  }

  /**
  * Seting new count of Dna objects in genepool.
  * @param {integer} newCount - new count of Dna objects in genepool
  */
  setCount(newCount){
    oldCount = this.pool.length;
    if (newCount > oldCount){
      for (var i = oldCount; i < newCount; i++){
        this.pool.push(this.template.copy())
      }
    } else {
      this.pool.slice(0,newCount);

    }
  }

	count(){
		return this.pool.length;
	}

  setDnaLenth(length){
    this.template.setLength(length);
  }

  setWrapAll(bool){
    for (var i = 0; i < this.genLength; i++){
      this.template.setWrap(i,bool);
    }
  }

  setWrap(index,bool){
    this.template.setWrap(index,bool);
  }

  setMode(index,mode){
    this.template.setMode(index,bool);
  }

  setModeAll(mode){
    for (var i = 0; i < this.genLength; i++){
      this.template.setMode(i,bool);
    }
  }

  setRange(index,low,high){
    this.template.setRenge(index,low,high);
  }

  setRangeAll(low,high){
    for (var i = 0; i < this.genLength; i++){
      this.template.setRenge(i,low,high);
    }
  }

	/**
	* Set new template of generated Dna objects.
	* @param {Dna} dna - Dna to set as template
	*/
  setTemplate(dna){
    // TODO: test dna type
    this.template = dna;
    // NOTE: It's questionable if that shoult be copy or not.
  }

	/**
	* Returns template Dna object.
	* @returns {Dna} template Dna object
	*/
	getTemplate(){
		return this.template;
	}

  /**
  * Updated genepool by template.
  * @param {Dna[]} PhenotypeBool - (Optional) if true it will try to keep phenotype value of genes.
  * @return {Dna[]} New genepool
  */
  updatePoll(phenotypeMode){
    if (typeof phenotypeMode === undefined){
      phenotypeMode = false; // default value
    }
    for (var i = 0; i < this.pool.length; i++){
      if (phenotypeMode == true){
        var values = this.pool[i].getAll(); // Error: not on Gen level (it will need something like getAll)
        this.pool[i] = this.template.copy();
        this.pool[i].setAll(values);
      } else {
        var values = this.pool[i].getRawAll(); // Error as above (it will need something like getRawAll)
        this.pool[i] = this.template.copy();
        this.pool[i].setRawAll(values);
      }
    }
  }

  /**
  * Create new (random) set ot of Dna objects. They will keep the parameters of template dna, just values will be random.
  * @param {integer} count - number of Dna objects in pool
	* @param {boolean} randomly - (OPTIONAL) if true the gen values will be random, otherwise same as template
  */
  createPool(count,randomly){
    if (typeof randomly === undefined){
      randomly = false;  // default value
    }
    this.pool = [];
    for(var i = 0; i < count; i++){
      this.pool.push(this.template.copy())
      if (randomly == true){
				this.pool[i].randomize();
			}
    }
  }

	/**
	* Add Dna to genepool
	* @param {Dna} dna - Dna to add
	*/
	push(dna){
		this.pool.push(dna)
	}

	/**
	* remove dna to genepool
	* @param {integer} index - Index of
	*/
	slice(index){
		this.pool.slice(index);
	}

	/**
	* Replace Dna in pool
	* @param {integer} index - index of element to replace
	* @param {Dna} dna - Dna object for replacement
	*/
	replace(index,dna){
		this.pool[index] = dna;
	}

  /**
  * Return Dna from genepool
	* @param {integer} index - Index of Dna object to get
	* @returns {Dna} - Dna object
  */
  get(index){
    if (index <= this.pool.length){
      return this.pool[index];
    }
    else {
      throw new Error("Genepool.get() argument out of range.");
    }
  }

	getValue(dnaIndex,genIndex){
		return this.pool[dnaIndex].get(genIndex);
	}

	/**
	* Evaluete fittnes for genepool
	* @param {function} fitnessFunction - function
	*/
  evaluateFitness(fitnessFunction){
		for (var i = 0; i < this.pool.length; i++){
			this.pool[i].fitness = fitnessFunction(this.pool[i]);
		}
	}

	getFitnessRange(){
		var max = this.pool[0].fitness;
		var min = this.pool[0].fitness;
		for (var i = 1; i < this.pool.length; i++){
			if (this.pool[i].fitness > max){
				max = this.pool[i].fitness;
			} else if (this.pool[i].fitness < min){
				min = this.pool[i].fitness;
			}
		}
		return [min, max];
	}

	getMattingPool(count){
		var result = [];
		for (var i = 0; i < count; i++){
			result.push(weightedRandom(this.fitness)) //BUG: no more this.fitness but this.pool[i].fitness
		}
		return result;
	}

	crossover(count){
		if (count == undefined){
			count = this.count();
		}
		var nextPool = [];
		var fatherPool = this.getMattingPool(count);
		var motherPool = this.getMattingPool(count);
		for (var i = 0; i < count; i++){
			nextPool.push(this.get(motherPool[i]).blend(this.get(fatherPool[i])));
		}
		return nextPool;
	}
  /**
  * Mutate everything in genepool.
	* @param {float} chance - precentage chance that each one gen will get mutated. 0.0 - no gen will change, 1.0 - every gen will get mutated.
	* @param {float} rate - percentage of maximum change of gen values, that will change. 0.0 - no change, 0.1 - value will change by max 10%, 1.0 - gen value will randomly mutate to whole range
	*/
  mutate(chance,rate){
    for (var i = 0; i < this.pool.length; i++){
      this.pool[i].mutate(chance,rate);
    }
  }

	slice(begin,end){
		if (end === undefined){
			this.pool.slice(begin);
		} else {
			this.pool.slice(begin,end);
		}
	}

	concat(dnaArray){
		if (!(dnaArray instanceof Array)){
			dnaArray = [dnaArray];
		}
		this.pool.concat(dnaArray);
	}
	/**
	*	Sort genepool by its fitness (from highest to lowest). Throws error while no fitness is defined.
	*/
	sort(){
		this.pool.sort(function(a,b){return b.fitness - a.fitness});
	}

  /**
  * Generates random dna by template setting inside genepool object.
  */
  randomDna(){
    result = this.template.copy()
    result.randomize();
    return result;
  }

  /**
  * Randomize all Dna objects in genepool.
  */
  randomize(){
    for (var i = 0; i < this.pool.length; i++){
      this.pool[i].randomize();
    }
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

//export {Gen, Dna, Geneo, Genepool, map, constrain, weightedRandom};
