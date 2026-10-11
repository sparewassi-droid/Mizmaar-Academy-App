const BLOCKLIST = new Set([
  'admin',
  'root',
  'moderator',
  'system',
  'tajweed',
  'allah',
  'god',
  'prophet',
  'badword',
  'hate',
  'kill',
  'stupid',
  'fool',
  'dummy',
]);

export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username) {
    return { valid: false, error: 'Username cannot be empty.' };
  }

  const trimmed = username.trim().toLowerCase();

  if (trimmed.length < 3 || trimmed.length > 16) {
    return { valid: false, error: 'Username must be between 3 and 16 characters.' };
  }

  // Lowercase letters, numbers, and underscore only
  const validPattern = /^[a-z0-9_]+$/;
  if (!validPattern.test(trimmed)) {
    return { valid: false, error: 'Only lowercase letters, numbers, and underscores are allowed.' };
  }

  // Reject emails
  if (trimmed.includes('@') || trimmed.includes('.com') || trimmed.includes('.org') || trimmed.includes('.net')) {
    return { valid: false, error: 'Username cannot look like an email address.' };
  }

  // Reject phone numbers (e.g. 7 or more digits)
  const digitCount = (trimmed.match(/\d/g) || []).length;
  if (digitCount >= 7) {
    return { valid: false, error: 'Username cannot contain phone numbers.' };
  }

  // Reject basic blocklist
  for (const blocked of BLOCKLIST) {
    if (trimmed.includes(blocked)) {
      return { valid: false, error: 'Please choose another appropriate username.' };
    }
  }

  return { valid: true };
}
