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

/**
 * Lấy thông tin user hiện tại bao gồm level, XP, streak, totalBadges
 * GET /api/users/me
 */
export const getMe = () => {
  return api.get('/users/me');
}

export const updateProfile = (data) => {
  return api.put('/users/update-profile', data);
}

export const changePassword = (data) => {
  return api.post('/users/change-password', data);
}

/**
 * Cập nhật stats (XP delta, streak, totalBadges) — level tự động tăng khi đủ XP
 * PUT /api/users/update-stats
 * @param {{ xpDelta?: number, streak?: number, totalBadges?: number }} data
 */
export const updateStats = (data) => {
  return api.put('/users/update-stats', data);
}