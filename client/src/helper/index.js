export function removeSlashes(text) {
  return text.replace("\\", "");
}

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

export function getTabColor(index) {
  switch (index % 4) {
    case 1:
      return "#A5D4EC";
    case 2:
      return "#A5B5EC";
    case 3:
      return "#F5ECB5";
    default:
      return "#B8F4D6";
  }
}

export function getAverageFromAssignments(assignment_list, currentClass) {
  return assignment_list.reduce((prev, assignment) => {
    if (assignment.class_id === currentClass.class_id) {
      if (!prev[assignment.assignment_id]) {
        if (assignment.points_total > 0) {
          const startingAvg = { ...prev };
          startingAvg[assignment.assignment_id] = {
            avg: assignment.score / assignment.points_total,
            count: 1
          };
          return Object.assign(prev, startingAvg);
        } else {
          return prev;
        }
      }
      if (assignment.points_total > 0) {
        const continuingAvg = { ...prev };
        continuingAvg[assignment.assignment_id] = {
          avg:
            continuingAvg[assignment.assignment_id].avg +
            assignment.score / assignment.points_total,
          count: ++continuingAvg[assignment.assignment_id].count,
          assignment_name: assignment.assignment_name,
          assignment_id: assignment.assignment_id
        };
        return Object.assign(prev, continuingAvg);
      } else {
        return prev;
      }
    } else {
      return prev;
    }
  }, {});
}

export function getDailyGreeting() {
  const now = new Date();
  const hour = now.getHours();

  let greeting = "";
  if (hour > 0 && hour < 12) {
    greeting = "Good Morning, ";
  } else if (hour > 12 && hour < 17) {
    greeting = "Good Afternoon, ";
  } else if (hour > 17) {
    greeting = "Good Evening, ";
  }
  return greeting;
}
