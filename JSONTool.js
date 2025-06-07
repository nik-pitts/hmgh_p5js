class JSONTool {
  constructor(filepath = "result.json") {
    this.filepath = filepath; // Make this customizable or relative to project
    this.jsonData = null;
    this.xcoord = [60, 120, 180];
    this.ycoord = new Array(1000);
    this.storeYcoord();
  }

  loadData(callback) {
    loadJSON(this.filepath, (data) => {
      this.jsonData = data;
      const beatPatterns = [];

      for (let index = 0; index < data.length; index++) {
        const pattern = this.readJson(index);
        beatPatterns.push(pattern);
      }

      callback(beatPatterns); // Use callback to return result asynchronously
    });
  }

  storeYcoord() {
    for (let i = 0; i < 1000; i++) {
      this.ycoord[i] = -100 - 50 * i;
    }
  }

  readJson(index) {
    const data = this.jsonData[index];
    const patternNumber = index;
    const difficulty = data.difficulty;
    const morans_i = data.morans_i[0];
    const sparseness = data.sparseness;
    const jsonBeatsMatrix = data.matrix[0];
    const pattern = new BeatPattern(patternNumber, difficulty, morans_i, sparseness);
    this.readMatrix(jsonBeatsMatrix, pattern, patternNumber);
    return pattern;
  }

  readMatrix(jsonBeatsMatrix, pattern, patternNumber) {
    const NUM_OF_ROWS = jsonBeatsMatrix.length;
    const NUM_OF_COLS = jsonBeatsMatrix[0].length;
    let patternLength = 0;

    const binDuration = 0.2;
    const patternStartTime = patternNumber * NUM_OF_ROWS * binDuration;  

    for (let row = 0; row < NUM_OF_ROWS; row++) {
      const jsonBeatsRow = jsonBeatsMatrix[row];
      const onsetTime = patternStartTime + row * binDuration;

      for (let col = 0; col < NUM_OF_COLS; col++) {
        const beatInt = jsonBeatsRow[col];
        if (beatInt === 1) {
          const ycoordIdx = 10 * patternNumber + row;
          pattern.setBeatPatternMatrix(this.xcoord[col], onsetTime, row);
          patternLength++;
        }
      }
    }
    pattern.setPatternLength(patternLength);
  }
}