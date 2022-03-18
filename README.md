For running main.js ( write node --max-old-space-size=8192 main.js) after installing dependencies. (npm install axios, npm install csv-parser, npm install axios).

For reading large csv files,  I used createReadStream function because it will read the file in chunks of the size we specify. On the other hand ,  if I use readFile, it will load the entire file into memory. We do not want it. This technique prevent from running out of memory.

I guess I prepared understandable interface for the command line inputs. For the date, you have to write like "13-03-2011" and press the enter. Others can be done smoothly.

I used loop technique for user inputs because I wanna read transactions.csv once. After getting our data, we can use this array infinitely.

I know that cryptocurrencies are not stable. They are always changing. Therefore, I fetched USD data from cryptocompare just before returning any value.


Author  : Taha Keles
