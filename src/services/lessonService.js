import api from "./api";

export const createLessonByUpload = ({
  title,
  moduleId,
  videoFile,
  documentFile,
}) => {
  const formData = new FormData();
  formData.append("videoFile", videoFile);

  if (documentFile) {
    formData.append("documentFile", documentFile);
  }

  return api.post(
    `/lessons/upload`,
    formData,
    {
      params: {
        title,
        moduleId,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
export const getLessonsByModule = (moduleId) => {
  return api.get(`/lessons/module/${moduleId}`);
};