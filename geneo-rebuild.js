function Gen(){
			this.value = 0;
			this.max = 1.0;
			this.min = 0.0;
			this.wrap = false;
			
			this.get = function(){
				return this.value;
			}
			this.set = function(input){
				this.value = constrain(input,this.min,this.max);
			}
			this.mutate = function(rate){
				if (rate === undefined){
					rate = 1.0;
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
		
		function Dna(length){
			this.genes = []
			for(var i = 0; i < length; i++){
				this.genes.push(new Gen());
			}
			
			this.get = function(index){
				return this.genes[index].get();
			}
			
			this.set = function(index, value){
				this.genes[index].set(value);
			}
			
			this.mutate = function(chance, rate){
				for(var i = 0; i < this.genes.length; i++){
					if (Math.random() <= chance){
						this.genes[i].mutate(rate);
					}
				}
			}
			
			this.echo = function(){
				string = "["
				for(var i = 0; i < this.genes.length; i++){
					string = string.concat(this.genes[i].get());
					string = string.concat(", ");
				}
				string = string.concat("]");
				console.log(string);
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
