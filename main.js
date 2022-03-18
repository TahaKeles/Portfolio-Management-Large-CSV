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


const learnValues = async token => {
  let result = await axios.get(
    "https://min-api.cryptocompare.com/data/price?fsym=" + token + "&tsyms=USD"
  );
  return result.data.USD;
};

async function portfolio_value_no_parameter(data) {
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
  let result_dict = {};
  for (i = 0; i < token_list.length; i++) {
    result_dict[token_list[i]] =
      dict_token[token_list[i]] * (await learnValues(token_list[i]));
  }
  return result_dict;
}

async function portfolio_value_with_token_parameter(data, token) {
  let balance = 0;
  for (let i = 0; i < data.length; i++) {
    if (token === data[i].token) {
      if (data[i].transaction_type === "DEPOSIT") {
        balance = balance + Number(data[i].amount);
      } else {
        balance = balance - Number(data[i].amount);
      }
    }
  }
  let result = await learnValues(token);
  let new_dict = {};
  new_dict[token] = result * balance;
  return new_dict;
}

async function portfolio_value_date_parameter(data, date) {
  let dict_token = {};
  let token_list = [];
  let balance;
  for (let i = 0; i < data.length; i++) {
    if (token_list.includes(data[i].token)) {
      if (data[i].timestamp < date.getTime()) {
        balance = dict_token[data[i].token];
        if (data[i].transaction_type === "DEPOSIT") {
          balance = balance + Number(data[i].amount);
        } else {
          balance = balance - Number(data[i].amount);
        }
        dict_token[data[i].token] = balance;
      }
    } else {
      if (data[i].timestamp < date.getTime()) {
        dict_token[data[i].token] = Number(data[i].amount);
        token_list.push(data[i].token);
      }
    }
  }
  let result_dict = {};
  for (i = 0; i < token_list.length; i++) {
    result_dict[token_list[i]] =
      dict_token[token_list[i]] * (await learnValues(token_list[i]));
  }
  return result_dict;
}

async function portfolio_value_with_token_date_parameter(data, token, date) {
  let balance = 0;
  for (let i = 0; i < data.length; i++) {
    if (token === data[i].token) {
      if (data[i].timestamp < date.getTime()) {
        if (data[i].transaction_type === "DEPOSIT") {
          balance = balance + Number(data[i].amount);
        } else {
          balance = balance - Number(data[i].amount);
        }
      }
    }
  }
  let result = await learnValues(token);
  let new_dict = {};
  new_dict[token] = result * balance;
  return new_dict;
}
