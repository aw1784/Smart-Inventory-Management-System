const TOKEN_KEY = 'imn_token';
const USER_KEY = 'imn_user';

export const saveAuth = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const loadAuth = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const userRaw = localStorage.getItem(USER_KEY);
  return {
    token: token || null,
    user: userRaw ? JSON.parse(userRaw) : null,
  };
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
