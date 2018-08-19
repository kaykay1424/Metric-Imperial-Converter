// server.js
// where your node app starts

// init project
const express = require('express')
const app = express()
const helmet = require('helmet');
const bodyParser = require('body-parser');

app.use(helmet());
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

app.get("/api/convert",(req,res) => {
  let input = req.query.input || req.body.input ;
  let inputUnit = input.replace(/[^a-zA-Z]/g, "");
  if (inputUnit === "l") {
    inputUnit = inputUnit.toUpperCase();
  }
  else {
    inputUnit = inputUnit.toLowerCase();
  }
  let regex = new RegExp(inputUnit, "i");
  let inputUnitStart = input.search(regex);
  let inputNum = input.slice(0,inputUnitStart);
  if (inputNum === "") {
    inputNum = 1;
  }
  inputNum = eval(inputNum);
  console.log(inputNum + " " + inputUnit)
  let units = {
    "mi": "mile(s)",
    "km": "kilometer(s)",
    "gal": "gallon(s)",
    "l": "liter(s)",
    "kg": "kilogram(s)",
    "lbs": "pound(s)"
  }
  let newUnit;
  let newNum;
  if (inputUnit === "gal") {
    if (isNaN(inputNum) || inputNum < 0) {
      res.send("invalid number");
    }
    newUnit = "L";
    newNum = inputNum * 3.78541;
  }
  else if (inputUnit === "L" ) {
    
    if (isNaN(inputNum) || inputNum < 0) {
      res.send("invalid number");
    }
    newUnit = "gal";
    newNum = inputNum / 3.78541;
  }
   else if (inputUnit === "lbs") {
    if (isNaN(inputNum) || inputNum < 0) {
      res.send("invalid number");
    }
    newUnit = "kg";
    newNum = inputNum * .453592;
  }
  else if (inputUnit === "kg") {
    if (isNaN(inputNum) || inputNum < 0) {
      res.send("invalid number");
    }
    newUnit = "lbs";
    newNum = inputNum / .453592;
  }
  else if (inputUnit === "mi") {
    if (isNaN(inputNum) || inputNum < 0) {
      res.send("invalid number");
    }
    newUnit = "km";
    newNum = inputNum * 1.60934;
  }
  else if (inputUnit === "km") {
    if (isNaN(inputNum) || inputNum < 0) {
      res.send("invalid number");
    }
    newUnit = "mi";
    newNum = inputNum / 1.60934;
  }
  else {
    if (isNaN(inputNum) || inputNum < 0) {
      res.send("invalid number and unit");
    }
    res.send("invalid unit");
  }
  res.json({initNum: inputNum, initUnit: inputUnit, returnNum: parseFloat(newNum.toFixed(5)) , returnUnit: newUnit, string: `${inputNum} ${units[inputUnit.toLowerCase()]} converts to ${newNum.toFixed(5)} ${units[newUnit.toLowerCase()]}`});
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
