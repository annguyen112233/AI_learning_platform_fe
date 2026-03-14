import api from './api';

export const getDiscussions = (filter = 'ALL', search = '', page = 1, size = 20) => {
    const params = { page, size };
    if (filter && filter !== 'ALL') params.filter = filter;
    if (search) params.search = search;
    return api.get('/discussions', { params });
};

export const replyDiscussion = (discussionId, reply) => {
    return api.post(`/discussions/${discussionId}/reply`, { reply });
};

export const deleteDiscussion = (discussionId) => {
    return api.delete(`/discussions/${discussionId}`);
};
