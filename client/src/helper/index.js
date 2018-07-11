export function formatGrade(grade, to = 1) {
  return `${(grade * 100).toFixed(to)}%`;
}

export function getLetterGrade(grade) {
  let letterGrade = "";

  if (grade >= 0.9) {
    letterGrade = "A";
  } else if (grade >= 0.8) {
    letterGrade = "B";
  } else if (grade >= 0.7) {
    letterGrade = "C";
  } else if (grade >= 0.6) {
    letterGrade = "D";
  } else {
    return "F";
  }

  const symbols = ["-", " ", "+"];
  if (grade - 0.59 >= 0.4) {
    return "A+";
  }
  const letterArtifact =
    symbols[
      Math.floor(
        ((grade - 0.59) * 10 - Math.floor((grade - 0.59) * 10)) * symbols.length
      )
    ];

  return `${letterGrade}${letterArtifact}`;
}

export function findRandNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function capitalizeFirstLetters(text, everyWord = false) {
  if (everyWord) {
    const words = text.split(" ");
    const newString = [];
    for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
      const word = words[wordIndex];
      let newWord = `${word[0].toUpperCase()}${word.slice(1)}`;

      newString.push(newWord);
    }
    return newString.join(" ");
  } else {
    return `${text[0].toUpperCase()}${text.slice(1)}`;
  }
}
