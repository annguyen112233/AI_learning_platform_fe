import api from './api';

export const submitReview = (data) => {
  return api.post('/reviews', data);
};
