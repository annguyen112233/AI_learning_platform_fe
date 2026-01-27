import api from './api';

export const sendOtp = (email) => {
  return api.post("/auth/send-otp", {
    email: email
  });
};


export const register = (data) => {
  return api.post(`/accounts`, data);
};

export const login = (email, password) => {
  return api.post('/auth/login', {
    email,
    password,
  });
};

export const forgotPassword = (email) => {
  return api.post('/accounts/forgot-password', null, {
    params: { email },
  });
};

export const resetPassword = (token, newPassword) => {
  return api.post('/accounts/reset-password', {
    token,
    newPassword,
  });
}