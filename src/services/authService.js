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