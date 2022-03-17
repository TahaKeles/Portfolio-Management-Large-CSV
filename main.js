const csv = require("csv-parser");
const fs = require("fs");

let data = [];

fs.createReadStream("transactions.csv")  // We need to stream because of large csv file we can not use readFile (!!!!)
  .pipe(csv())                            // --max-old-space-size=8192
  .on("data", row => {
    data.push(row);
  })
  .on("end", () => {
    console.log("CSV file successfully processed");
    //console.log("Data : ", data);
  });

console.log("Data : ", data);