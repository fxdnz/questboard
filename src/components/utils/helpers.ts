// utils/helpers.ts (or anywhere in your project)

export const getOrdinalSuffix = (number: number): string => {
    // Get the last digit (1-9)
    const lastDigit = number % 10;
    
    // Get the last two digits (10-99)
    const lastTwoDigits = number % 100;
    
    // If the number ends in 11, 12, or 13 (special case)
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
      return 'th';
    }
    
    // Check for the last digit (1st, 2nd, 3rd, or th for others)
    switch (lastDigit) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };
  