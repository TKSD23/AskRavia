// A helper to reduce a number to a single digit or a master number (11, 22, 33).
// Note: 33 is sometimes considered a master number, but we'll stick to 11 and 22 for standard Pythagorean practice.
const reduceToSingleDigit = (num: number): number => {
  if (num === 11 || num === 22) {
    return num;
  }
  let sum = num
    .toString()
    .split('')
    .map(Number)
    .reduce((a, b) => a + b, 0);

  // If the sum is a master number, don't reduce further.
  if (sum === 11 || sum === 22) {
    return sum;
  }

  // If the sum is still greater than 9, recurse.
  if (sum > 9) {
    sum = reduceToSingleDigit(sum);
  }
  return sum;
};

// Calculate Life Path Number from a date of birth string (MM/DD/YYYY)
export const calculateLifePathNumber = (dateOfBirth: string): number => {
  const [month, day, year] = dateOfBirth.split('/').map(Number);
  
  if(isNaN(month) || isNaN(day) || isNaN(year)) {
    throw new Error("Invalid date format. Please use MM/DD/YYYY.");
  }

  const monthReduced = reduceToSingleDigit(month);
  const dayReduced = reduceToSingleDigit(day);
  const yearReduced = reduceToSingleDigit(year);

  let lifePath = monthReduced + dayReduced + yearReduced;
  lifePath = reduceToSingleDigit(lifePath);

  return lifePath;
};

// Pythagorean chart for letter values
const charValueMap: { [key: string]: number } = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9,
};

const getCharValue = (char: string): number => {
  return charValueMap[char.toLowerCase()] || 0;
};

const isVowel = (char: string): boolean => {
  return 'aeiou'.includes(char.toLowerCase());
};

const sumChars = (name: string, filter: (char: string) => boolean): number => {
  const sum = name
    .split('')
    .filter(char => char.match(/[a-z]/i) && filter(char))
    .map(getCharValue)
    .reduce((a, b) => a + b, 0);
  return reduceToSingleDigit(sum);
}

// Calculate Destiny (Expression) Number from the full name
export const calculateDestinyNumber = (fullName: string): number => {
  return sumChars(fullName, () => true);
};

// Calculate Soul Urge (Heart's Desire) Number from vowels in the full name
export const calculateSoulUrgeNumber = (fullName:string): number => {
    return sumChars(fullName, isVowel);
};

// Calculate Personality Number from consonants in the full name
export const calculatePersonalityNumber = (fullName: string): number => {
  return sumChars(fullName, char => !isVowel(char));
};

// Calculate Birthday Number from the day of birth
export const calculateBirthdayNumber = (dateOfBirth: string): number => {
  const day = parseInt(dateOfBirth.split('/')[1], 10);
  if(isNaN(day)) {
    throw new Error("Invalid date format. Could not parse day.");
  }
  return reduceToSingleDigit(day);
};


export interface NumerologyProfile {
    lifePathNumber: number;
    destinyNumber: number;
    soulUrgeNumber: number;
    personalityNumber: number;
    birthdayNumber: number;
}

export const calculateNumerologyProfile = (fullName: string, dateOfBirth: string): NumerologyProfile => {
    return {
        lifePathNumber: calculateLifePathNumber(dateOfBirth),
        destinyNumber: calculateDestinyNumber(fullName),
        soulUrgeNumber: calculateSoulUrgeNumber(fullName),
        personalityNumber: calculatePersonalityNumber(fullName),
        birthdayNumber: calculateBirthdayNumber(dateOfBirth)
    };
};
