const fs = require("fs");
const path = require("path");

function combineTextFiles(inputFolder, outputFile, nameFilter) {
  fs.readdir(inputFolder, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err}`);
      return;
    }

    const textFiles = files.filter(
      (file) =>
        path.extname(file).toLowerCase() === ".csv" && file.includes(nameFilter)
    );

    if (textFiles.length === 0) {
      console.log(
        `No CSV files found in the directory with "${nameFilter}" in the title.`
      );
      return;
    }

    let combinedData = "";
    let totalInputLines = 0;

    textFiles.forEach((file, index) => {
      const filePath = path.join(inputFolder, file);

      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error(`Error reading file ${file}: ${err}`);
          return;
        }

        const inputLines = data
          .split("\n")
          .filter((line) => line.trim() !== "").length;
        totalInputLines += inputLines;

        combinedData += data + "\n";

        if (index === textFiles.length - 1) {
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
        }
      });
    });
  });
}

// Example usage:
const inputFolder = "./input/folder1";
const outputFile = "./output/output.csv";
const nameFilter = ""; // "" or JobFilters or Jobs

combineTextFiles(inputFolder, outputFile, nameFilter);
