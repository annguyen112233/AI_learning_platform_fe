import api from "./api";

export const createLessonByUpload = ({
  title,
  moduleId,
  videoFile,
  documentFile,
}) => {
  const formData = new FormData();
  
  // ✅ Append với tên file gốc
  formData.append("videoFile", videoFile, videoFile.name);

  if (documentFile) {
    // ✅ Append với tên file gốc
    formData.append("documentFile", documentFile, documentFile.name);
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