function generateAvatar(name: string): string {
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return "NA"; // Return 'NA' for invalid or empty names
  }

  const sanitized: string = name.trim(); // Remove leading/trailing whitespace

  if (sanitized.length === 1) {
    return sanitized.toUpperCase(); // Return single letter as the avatar
  }

  const names: string[] = sanitized.split(" "); // Split the name into first and last names
  let firstName = "N",
    lastName = "A";
  if (names.length > 2) {
    firstName = names[0] as string;
    lastName = names[names.length - 1] as string;
  }

  if (firstName.length === 1 && lastName.length === 1) {
    return `${firstName.toUpperCase()}${lastName.toUpperCase()}`; // Return initials if both names are single letters
  } else if (firstName.length >= 2) {
    return firstName.slice(0, 2).toUpperCase(); // Return first two letters of the first name
  } else if (lastName.length >= 2) {
    return lastName.slice(0, 2).toUpperCase(); // Return first two letters of the last name
  }

  return "NA"; // Default case if no initials can be generated
}

export { generateAvatar };
