// Validation utilities for form inputs

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Phone number validation (Cameroon format)
export const validatePhoneNumber = (phone: string): ValidationResult => {
  if (!phone.trim()) {
    return { isValid: true }; // Optional field
  }

  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Cameroon phone number patterns
  // Mobile: 6XXXXXXXX (9 digits starting with 6)
  // Landline: 2XXXXXXXX (9 digits starting with 2)
  // International: +237XXXXXXXXX or 237XXXXXXXXX
  
  if (cleanPhone.length === 9) {
    if (cleanPhone.startsWith('6') || cleanPhone.startsWith('2')) {
      return { isValid: true };
    }
    return { isValid: false, error: 'Phone number must start with 6 (mobile) or 2 (landline)' };
  }
  
  if (cleanPhone.length === 12 && cleanPhone.startsWith('237')) {
    const localNumber = cleanPhone.substring(3);
    if (localNumber.startsWith('6') || localNumber.startsWith('2')) {
      return { isValid: true };
    }
    return { isValid: false, error: 'Invalid Cameroon phone number format' };
  }
  
  return { isValid: false, error: 'Phone number must be 9 digits (local) or 12 digits with country code (+237)' };
};

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

// Name validation (letters, spaces, hyphens, apostrophes only)
export const validateName = (name: string, fieldName: string = 'Name'): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
  }
  
  if (name.trim().length > 100) {
    return { isValid: false, error: `${fieldName} must be less than 100 characters` };
  }
  
  // Allow letters, spaces, hyphens, apostrophes, and common accented characters
  const nameRegex = /^[a-zA-ZÀ-ÿ\s\-'\.]+$/;
  if (!nameRegex.test(name.trim())) {
    return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }
  
  return { isValid: true };
};

// Organization/Orphanage name validation
export const validateOrganizationName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, error: 'Organization name is required' };
  }
  
  if (name.trim().length < 3) {
    return { isValid: false, error: 'Organization name must be at least 3 characters long' };
  }
  
  if (name.trim().length > 150) {
    return { isValid: false, error: 'Organization name must be less than 150 characters' };
  }
  
  // Allow letters, numbers, spaces, common punctuation
  const orgNameRegex = /^[a-zA-ZÀ-ÿ0-9\s\-'\.&()]+$/;
  if (!orgNameRegex.test(name.trim())) {
    return { isValid: false, error: 'Organization name contains invalid characters' };
  }
  
  return { isValid: true };
};

// Address validation
export const validateAddress = (address: string): ValidationResult => {
  if (!address.trim()) {
    return { isValid: false, error: 'Address is required' };
  }
  
  if (address.trim().length < 10) {
    return { isValid: false, error: 'Please provide a complete address (at least 10 characters)' };
  }
  
  if (address.trim().length > 300) {
    return { isValid: false, error: 'Address is too long (maximum 300 characters)' };
  }
  
  return { isValid: true };
};

// Description validation
export const validateDescription = (description: string): ValidationResult => {
  if (!description.trim()) {
    return { isValid: false, error: 'Description is required' };
  }
  
  if (description.trim().length < 20) {
    return { isValid: false, error: 'Description must be at least 20 characters long' };
  }
  
  if (description.trim().length > 1000) {
    return { isValid: false, error: 'Description must be less than 1000 characters' };
  }
  
  return { isValid: true };
};

// Registration number validation
export const validateRegistrationNumber = (regNumber: string): ValidationResult => {
  if (!regNumber.trim()) {
    return { isValid: true }; // Optional field
  }
  
  if (regNumber.trim().length < 3) {
    return { isValid: false, error: 'Registration number must be at least 3 characters long' };
  }
  
  if (regNumber.trim().length > 50) {
    return { isValid: false, error: 'Registration number must be less than 50 characters' };
  }
  
  // Allow alphanumeric characters, hyphens, slashes, and spaces
  const regNumberRegex = /^[a-zA-Z0-9\s\-\/]+$/;
  if (!regNumberRegex.test(regNumber.trim())) {
    return { isValid: false, error: 'Registration number can only contain letters, numbers, hyphens, and slashes' };
  }
  
  return { isValid: true };
};

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 9) {
    return `+237 ${cleanPhone.substring(0, 1)} ${cleanPhone.substring(1, 3)} ${cleanPhone.substring(3, 5)} ${cleanPhone.substring(5, 7)} ${cleanPhone.substring(7)}`;
  }
  
  if (cleanPhone.length === 12 && cleanPhone.startsWith('237')) {
    const localNumber = cleanPhone.substring(3);
    return `+237 ${localNumber.substring(0, 1)} ${localNumber.substring(1, 3)} ${localNumber.substring(3, 5)} ${localNumber.substring(5, 7)} ${localNumber.substring(7)}`;
  }
  
  return phone; // Return as-is if doesn't match expected format
};
