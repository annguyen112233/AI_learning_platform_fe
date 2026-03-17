import api from "./api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ── Upload dùng fetch (không dùng axios) ─────────────────────────────────────
// Lý do: axios instance có default Content-Type: application/json
// → conflict với multipart/form-data boundary khi upload file.
// Dùng fetch + KHÔNG set Content-Type → browser tự set đúng boundary.
const fetchUpload = async (endpoint, formData) => {
    const token = sessionStorage.getItem("accessToken");
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    // KHÔNG set Content-Type → browser tự set: multipart/form-data; boundary=...

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers,
        body: formData,
        credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) {
        // Throw theo dạng axios-like để catch trong component dùng được
        const err = new Error(data?.message || "Upload thất bại");
        err.response = { status: response.status, data };
        throw err;
    }
    return { data };
};

// ── STAFF: Quản lý tài liệu ──────────────────────────────────────────────────

export const getAllPlacementDocuments = (type = null) => {
    const params = type ? { type } : {};
    return api.get("/placement-documents", { params });
};

export const uploadReadingDocument = (formData) =>
    fetchUpload("/placement-documents/reading", formData);

export const uploadListeningDocument = (formData) =>
    fetchUpload("/placement-documents/listening", formData);


export const generateReadingQuestions = (documentId, questionCount = 10) => {
    return api.post(`/placement-documents/${documentId}/generate-reading`, null, {
        params: { questionCount },
    });
};

export const generateListeningQuestions = (documentId, questionCount = 3) => {
    return api.post(`/placement-documents/${documentId}/generate-listening`, null, {
        params: { questionCount },
    });
};

export const generateMixedQuestions = (totalQuestions = 20) => {
    return api.post("/placement-documents/generate-mixed", null, {
        params: { totalQuestions },
    });
};

export const deletePlacementDocument = (documentId) => {
    return api.delete(`/placement-documents/${documentId}`);
};

// ── GUEST: Làm bài test ───────────────────────────────────────────────────────

export const getPlacementQuestions = (count = 25) => {
    return api.get("/placement-test/questions", { params: { count } });
};

export const submitPlacementTest = (answers) => {
    return api.post("/placement-test/submit", { answers });
};
