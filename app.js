// User inputs:
const inputFolder = "./input"; // set to input folder
const outputFile = "./output/output.csv"; // set to output file name
const nameFilter = ""; // "" or JobFilters or Jobs

// Program start. DO NOT MODIFY

const fs = require("fs");
const path = require("path");

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

function combineTextFiles(inputFolder, outputFile, nameFilter) {
  const allFiles = getAllFiles(inputFolder);
  const textFiles = allFiles.filter(
    (file) =>
      path.extname(file).toLowerCase() === ".csv" && file.includes(nameFilter)
  );

  if (textFiles.length === 0) {
    console.log(
      `No CSV files found in the directory and its subdirectories with "${nameFilter}" in the title.`
    );
    return;
  }

  let combinedData = "";
  let totalInputLines = 0;

  const readPromises = textFiles.map((file) => {
    return fs.promises
      .readFile(file, "utf8")
      .then((data) => {
        const inputLines = data
          .split("\n")
          .filter((line) => line.trim() !== "").length;
        totalInputLines += inputLines;
        combinedData += data + "\n";
      })
      .catch((err) => {
        console.error(`Error reading file ${file}: ${err}`);
      });
  });

  Promise.all(readPromises)
    .then(() => {
      fs.writeFile(outputFile, combinedData, "utf8", (err) => {
        if (err) {
          console.error(`Error writing to file ${outputFile}: ${err}`);
          return;
        }
        console.log(`Combined text file created at ${outputFile}`);

        // Verify the line counts
        const totalOutputLines = combinedData
          .split("\n")
          .filter((line) => line.trim() !== "").length;
        if (totalInputLines === totalOutputLines) {
          console.log(
            `Line count verification passed: ${totalInputLines} lines.`
          );
        } else {
          console.error(
            `Line count verification failed: ${totalInputLines} input lines, but ${totalOutputLines} output lines.`
          );
        }
      });
    })
    .catch((err) => {
      console.error(`Error combining files: ${err}`);
    });
}

combineTextFiles(inputFolder, outputFile, nameFilter);
