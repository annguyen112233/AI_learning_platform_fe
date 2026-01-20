import React from 'react';

export default function Section({ children, className = '', id = '' }) {
  return (
    // py-12: Padding trên dưới (khoảng 48px), tạo độ thoáng cho thiết kế
    <section id={id} className={`py-12 md:py-16 ${className}`}>
      {children}
    </section>
  );
}