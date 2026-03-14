import api from './api';

/**
 * Gửi câu hỏi lên Sensei AI (RAG - có context từ nội dung khóa học)
 * @param {string} question - Câu hỏi của student
 * @param {string|null} lessonId - UUID của bài học đang xem (optional, để ưu tiên context)
 */
export const askSenseiAI = (question, lessonId = null) => {
  return api.post('/chat/ask', {
    question,
    lessonId: lessonId || undefined
  });
};
