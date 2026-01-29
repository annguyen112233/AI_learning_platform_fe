import api from './api';

export const sendOtp = (email) => {
  return api.post("/auth/send-otp", {
    email: email
  });
};


export const register = (data) => {
  return api.post(`/accounts`, data);
};

export const login = async (email, password) => {
  const res = await api.post('/auth/login', {
    email,
    password,
  });

  // access token lưu FE
  sessionStorage.setItem('accessToken', res.data.accessToken);

  return res;
};
export const logout = async () => {
  await api.post('/auth/logout', {}, { withCredentials: true });
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

