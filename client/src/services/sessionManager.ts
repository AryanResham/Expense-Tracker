import { getMe } from './auth';

// Check if user has existing session on app startup
export const checkExistingSession = async () => {
  try {
    const user = await getMe();
    return user;
  } catch {
    return null;
  }
}

// Validate current session
export const validateSession = async () => {
  try {
    await getMe();
    return true;
  } catch {
    return false;
  }
}