export function formatGrade(grade) {
  return `${(grade * 100).toFixed(1)}%`;
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
    symbols[Math.floor(((grade - 0.59) * 10 - Math.floor((grade - 0.59) * 10)) * symbols.length)];

  return `${letterGrade}${letterArtifact}`;
}
