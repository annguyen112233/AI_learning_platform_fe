import api from './api';

export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append('file', file); 
  
  return api.post('/users/upload-avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', 
    },
  });
}

export const getProfile = () => {
  return api.get('/accounts/me');
}

export const updateProfile = (data) => {
  return api.put('/users/update-profile', data);
}

export const changePassword = (data) => {
  return api.post('/users/change-password', data);
}