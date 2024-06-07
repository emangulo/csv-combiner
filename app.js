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

async function combineTextFiles(inputFolder, outputFile, nameFilter) {
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

  for (const file of textFiles) {
    try {
      const data = await fs.promises.readFile(file, "utf8");
      const inputLines = data
        .split("\n")
        .filter((line) => line.trim() !== "").length;
      totalInputLines += inputLines;

      combinedData += data.endsWith("\n") ? data : data + "\n";
    } catch (error) {
      console.error(`Error reading file ${file}: ${error}`);
    }
  }

  try {
    await fs.promises.writeFile(outputFile, combinedData, "utf8");
    console.log(`Combined text file created at ${outputFile}`);

    const totalOutputLines = combinedData
      .split("\n")
      .filter((line) => line.trim() !== "").length;
    if (totalInputLines === totalOutputLines) {
      console.log(`Line count verification passed: ${totalInputLines} lines.`);
    } else {
      console.error(
        `Line count verification failed: ${totalInputLines} input lines, but ${totalOutputLines} output lines.`
      );
    }
  } catch (error) {
    console.error(`Error writing to file ${outputFile}: ${error}`);
  }
}

combineTextFiles(inputFolder, outputFile, nameFilter);
