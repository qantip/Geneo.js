# Geneo.js
Geneo port to JavaScript ... with some tweaks <br>
System for evolution based graphic and product design. <br>

### Example<br>

```
geneo = new Geneo(); // create main object for working with DNA
geneo.setDnaLength(5); // set lenght of future DNAs to 5
dna = geneo.newDna(); // create new DNA by geneo settings
dna.echo(2); // print DNA to console
dna. geneo.randomDna(); // create new DNA with random values 
dna.echo();
dna = new Dna(10); // creating DNA without Geneo object
dna.echo();
dna.mutate(0.5,0.1); // mutating values of DNA
dna.echo();
population = geneo.newPopulation(50);
...
```



