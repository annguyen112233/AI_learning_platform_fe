import api from "./api";

export const generateQuestionsFromDocument = (documentId) => {
  return api.post(`/placement-documents/${documentId}/generate-reading`);
};