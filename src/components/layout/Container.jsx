import React from 'react';

export default function Container({ children, className = '' }) {
  return (
    // max-w-7xl: Giới hạn chiều rộng tối đa (khoảng 1280px)
    // mx-auto: Căn giữa
    // px-4: Padding trái phải để nội dung không dính sát mép màn hình mobile
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}