import { backend } from './api';

// Send Firebase token to backend to create session
export const sessionLogin = async (idToken: string) => {
  const response = await backend.post('/auth/sessionLogin', { idToken });
  return response.data;
}

// Logout from backend
export const sessionLogout = async () => {
  const response = await backend.post('/auth/sessionLogout');
  return response.data;
}

// Get current user from backend
export const getMe = async () => {
  const response = await backend.get('/auth/me');
  return response.data;
}

export const isLoggedIn = async () => {
  try {
    await getMe();
    return true;
  } catch {
    return false;       
  }
}

export const completeLogin = async (firebaseUser: any) => {
  if (!firebaseUser) throw new Error("No Firebase user provided");

  const idToken = await firebaseUser.getIdToken();
  try {
    await sessionLogin(idToken);   
    const userData = await getMe();
    return userData;
  } catch (error) {
    throw error;
  }
}

export const completeLogout = async () => {
  try {
    await sessionLogout();    // Try to logout from backend
  } catch (error) {
    console.log('Backend logout failed, continuing...');  // Don't crash if backend fails
  }
}