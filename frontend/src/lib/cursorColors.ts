// Define an array of great cursor colors
const cursorColors: string[] = [
  "#0096C7", // Vibrant Blue
  "#F94144", // Bright Red
  "#F3722C", // Deep Orange
  "#F8961E", // Golden Yellow
  "#90BE6D", // Soft Green
  "#43AA8B", // Teal Green
  "#577590", // Slate Blue
  "#277DA1", // Rich Blue
  "#4D908E", // Muted Turquoise
  "#F9C74F", // Mustard Yellow
];

// Function to get a random cursor color
export function getRandomColor(): string {
  const randomIndex = Math.floor(Math.random() * cursorColors.length);
  return cursorColors[randomIndex];
}
