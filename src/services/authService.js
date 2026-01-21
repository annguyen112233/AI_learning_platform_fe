import api from './api';

export const sendOtp = (email) => {
  return api.post("/accounts/send-otp", {
    email: email
  });
};


export const register = (data) => {
  return api.post(`/accounts`, data);
};
