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

export const generateQuizForLesson = (lessonId) => {
  return api.post(`/lessons/${lessonId}/generate-quiz`);
};

// ✅ Get latest quiz của lesson
export const getLessonQuiz = (lessonId) => {
  return api.get(`/lessons/${lessonId}/quiz`);
};

// ✅ Get all quizzes của lesson
export const getAllLessonQuizzes = (lessonId) => {
  return api.get(`/lessons/${lessonId}/quizzes`);
};

// ✅ Delete lesson
export const deleteLesson = (lessonId) => {
  return api.delete(`/lessons/${lessonId}`);
};

// ✅ Delete video from lesson
export const deleteLessonVideo = (lessonId) => {
  return api.delete(`/lessons/${lessonId}/video`);
};

// ✅ Student mark lesson là đã hoàn thành → cập nhật progress
export const completeLesson = (lessonId) => {
  return api.post(`/lessons/${lessonId}/complete`);
};