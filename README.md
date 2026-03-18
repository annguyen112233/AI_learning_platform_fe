# 🎨 AI-Powered Online Learning Platform (Frontend)

Giao diện người dùng cho hệ thống quản lý học tập (LMS) tích hợp AI, được thiết kế để mang lại trải nghiệm học tập hiện đại, trực quan và mượt mà.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

### Core Frontend
*   **React 19**: Phiên bản mới nhất của React với hiệu năng tối ưu.
*   **Vite**: Build tool cực nhanh (sử dụng Rolldown engine).
*   **React Router DOM v7**: Quản lý điều hướng và routing mạnh mẽ.
*   **Axios**: Giao tiếp với Backend API.

### Styling & UI
*   **Tailwind CSS v4**: Framework CSS utility-first mới nhất, cực kỳ linh hoạt.
*   **Lucide React**: Bộ icon đẹp mắt và nhẹ nhàng.
*   **React Hot Toast**: Hiển thị thông báo (notifications) chuyên nghiệp.
*   **Recharts**: Thư viện biểu đồ giúp hiển thị dashboard (thống kê doanh thu, tiến độ học tập).

### State & Utilities
*   **Context API**: Quản lý trạng thái xác thực (AuthContext) và theme toàn ứng dụng.
*   **Date-fns**: Xử lý và định dạng thời gian.
*   **JWT Decode**: Giải mã token để kiểm tra vai trò người dùng (Roles).

---

## ✨ Các tính năng nổi bật của Giao diện

| Tính năng | Mô tả |
| :--- | :--- |
| **Responsive Design** | Giao diện hoạt động tốt trên cả máy tính, máy tính bảng và điện thoại. |
| **Authentication UI** | Luồng đăng ký, đăng nhập chuyên nghiệp với validation đầy đủ. |
| **Instructor Dashboard** | Biểu đồ thống kê khóa học, quản lý doanh thu và danh sách bài học. |
| **Course Player** | Giao diện xem video bài giảng kết hợp với danh sách bài học và tài liệu đính kèm. |
| **AI Quiz Interface** | Khu vực làm bài Quiz được tạo bởi AI với giao diện trực quan và phản hồi tức thì. |
| **Payment Workflow** | Tích hợp luồng thanh toán nâng cấp tài khoản qua Momo và VNPay. |
| **Placement Test UI** | Giao diện kiểm tra trình độ với audio (nghe) và phân tích AI trực quan. |

---

## 🎭 Trải nghiệm theo Vai trò (User Roles)

### 👨‍🏫 Giảng viên (Instructor)
*   **Quản lý Khóa học**: Dashboard chuyên dụng để theo dõi stats, quản lý video bài giảng và tài liệu.
*   **AI Power**: Nút bấm "Generate Quiz" giúp tự động tạo đề bài từ video transcript đã được xử lý ngầm.
*   **Approval Flow**: Theo dõi trạng thái khóa học từ Draft đến Approved/Rejected.

### 🎓 Học viên (Student)
*   **Personalization**: Sau khi làm Placement Test, học viên nhận được nhận xét từ AI và gợi ý khóa học phù hợp.
*   **Learning Experience**: Player học tập tích hợp đa phương tiện, theo dõi tiến độ thời gian thực (Progress bar).
*   **Community**: Tham gia hỏi đáp trực tiếp ngay dưới mỗi bài giảng.

### 🛡️ Nhân viên (Staff)
*   **Course Moderation**: Giao diện kiểm duyệt video và tài liệu của giảng viên trước khi cho phép xuất bản.
*   **Business Insights**: Theo dõi biểu đồ doanh thu và lượng học viên đăng ký mới mỗi ngày.

## 🚀 Hướng dẫn cài đặt (Local Setup)

### 1. Yêu cầu hệ thống
*   **Node.js 18+** (Khuyên dùng 20 hoặc 22).
*   **npm** hoặc **yarn**.

### 2. Cấu hình Biến môi trường
Copy file `.env.example` thành `.env`:
```bash
cp .env.example .env
```
Mở file `.env` và cấu hình URL của Backend:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Cài đặt Dependencies
```bash
npm install
```

### 4. Chạy ứng dụng (Development)
```bash
npm run dev
```
Ứng dụng sẽ chạy tại: `http://localhost:5173`

### 5. Build dự án (Production)
```bash
npm run build
```
Thư mục `dist` sẽ được tạo ra sẵn sàng để deploy.

---

## 🏗️ Cấu trúc thư mục Frontend

```text
AI_learning_platform_fe/
├── src/
│   ├── components/  # Reusable UI components (Buttons, Inputs, Modals)
│   ├── pages/       # Các trang chính của ứng dụng
│   ├── services/    # API calls sử dụng Axios
│   ├── context/     # Quản lý Global State (Auth, Theme)
│   ├── layouts/     # Base layouts (AdminLayout, ClientLayout)
│   ├── hooks/       # Custom React hooks
│   ├── assets/      # Hình ảnh, icons, styles
│   └── utils/       # Helper functions
├── public/          # Tài nguyên tĩnh
├── vite.config.js   # Cấu hình Vite & Tailwind
└── package.json     # Scripts & dependencies
```

---

## 🌐 Deployment
Dự án được cấu hình sẵn sàng để deploy trên các nền tảng như **Netlify** hoặc **Vercel** thông qua file `netlify.toml`.

---
*Dự án được phát triển bởi Group 5 - Lớp SWD392.*
