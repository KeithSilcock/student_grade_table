import { findRandNumberBetween, capitalizeFirstLetters } from "../helper/";

export function createClassLevel() {
  const randNum1 = findRandNumberBetween(1, 5);
  const randNum2 = findRandNumberBetween(0, 9);
  const randNum3 = findRandNumberBetween(0, 1);
  return `${randNum1}${randNum2}${randNum3}`;
}

export function commentRandomizer(student_name) {
  const comments = [
    `Great job there, ${student_name}!`,
    "Wow look at that!",
    `You've done great here, ${student_name}`,
    "I kind of hoped you'd do better, here",
    "Wow, that is definitely a score!",
    "Please see me after class",
    `You've improved a lot since the beginning of the year, ${student_name}!`,
    "I don't know if this counts, but you sure do!",
    "Great job here!",
    "Well, maybe next time...",
    `You're better than this, ${student_name}`,
    "Maybe you can find a tutor...",
    "I have office hours from 3-6 every day, you know...",
    "Where has this been all year?",
    "I'm surprised you've never seen Rain Man"
  ];
  return comments[findRandNumberBetween(0, comments.length - 1)];
}

export function homeworkRandomizer(course) {
  const assignmentTypes = [
    "chapter",
    "problem set",
    "homework",
    "Web Activity",
    "worksheet",
    "essay"
  ];

  const assignment =
    assignmentTypes[findRandNumberBetween(0, assignmentTypes.length - 1)];

  let namedAssignment = "";
  switch (assignment) {
    case "Web Activity":
      if (course) {
        namedAssignment = `${capitalizeFirstLetters(
          course,
          true
        )} ${capitalizeFirstLetters(assignment, true)}`;
        break;
      }

    default:
      namedAssignment = `${capitalizeFirstLetters(
        assignment,
        true
      )} ${findRandNumberBetween(1, 9)}`;
      break;
  }

  return namedAssignment;
}

export const courses = [
  "Accounting & Finance",
  "Aeronautical & Manufacturing Engineering",
  "Agriculture & Forestry",
  "American Studies",
  "Anatomy & Physiology",
  "Anthropology",
  "Archaeology",
  "Architecture",
  "Art & Design",
  "Aural & Oral Sciences",
  "Biological Sciences",
  "Building",
  "Business & Management Studies",
  "Celtic Studies",
  "Chemical Engineering",
  "Chemistry",
  "Civil Engineering",
  "Classics & Ancient History",
  "Communication & Media Studies",
  "Complementary Medicine",
  "Computer Science",
  "Counselling",
  "Creative Writing",
  "Criminology",
  "Dentistry",
  "Drama, Dance & Cinematics",
  "East & South Asian Studies",
  "Economics",
  "Education",
  "Electrical & Electronic Engineering",
  "English",
  "Fashion",
  "Film Making",
  "Food Science",
  "Forensic Science",
  "French",
  "Geography & Environmental Sciences",
  "Geology",
  "General Engineering",
  "German",
  "History",
  "History of Art, Architecture & Design",
  "Hospitality, Leisure, Recreation & Tourism",
  "Iberian Languages/Hispanic Studies",
  "Italian",
  "Land & Property Management",
  "Law",
  "Librarianship & Information Management",
  "Linguistics",
  "Marketing",
  "Materials Technology",
  "Mathematics",
  "Mechanical Engineering",
  "Medical Technology",
  "Medicine",
  "Middle Eastern & African Studies",
  "Music",
  "Nursing",
  "Occupational Therapy",
  "Optometry, Ophthalmology & Orthoptics",
  "Pharmacology & Pharmacy",
  "Philosophy",
  "Physics and Astronomy",
  "Physiotherapy",
  "Politics",
  "Psychology",
  "Robotics",
  "Russian & East European Languages",
  "Social Policy",
  "Social Work",
  "Sociology",
  "Sports Science",
  "Theology & Religious Studies",
  "Town & Country Planning and Landscape Design",
  "Veterinary Medicine",
  "Youth Work"
];
