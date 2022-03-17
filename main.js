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


function portfolio_value_no_parameter(data) {
  let dict_token = {};
  let token_list = [];
  let balance;
  for (let i = 0; i < data.length; i++) {
    if (token_list.includes(data[i].token)) {
      balance = dict_token[data[i].token];
      if (data[i].transaction_type === "DEPOSIT") {
        balance = balance + Number(data[i].amount);
      } else {
        balance = balance - Number(data[i].amount);
      }
      dict_token[data[i].token] = balance;
    } else {
      dict_token[data[i].token] = Number(data[i].amount);
      token_list.push(data[i].token);
    }
  }
  return dict_token;
}