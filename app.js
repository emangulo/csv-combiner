// User inputs:
const nameFilter = ""; // "" or JobFilters or Jobs

const inputFolder = "./input";
const outputFile = `./output/output-${nameFilter}.csv`;

// Program start. DO NOT MODIFY
const { combineTextFiles } = require("./src/main");
combineTextFiles(inputFolder, outputFile, nameFilter);
