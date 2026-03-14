import api from './api';

export const getReports = (status = 'PENDING', search = '', page = 1, size = 10) => {
    const params = { status, page, size };
    if (search) params.search = search;
    return api.get('/reports', { params });
};

export const processReport = (reportId, action, adminReply = '') => {
    return api.put(`/reports/${reportId}/process`, { action, adminReply });
};
