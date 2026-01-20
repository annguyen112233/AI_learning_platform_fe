import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 fixed top-0 w-full z-50">
      <div className="text-2xl font-bold text-blue-600">NihongoAI</div>
      <nav className="flex items-center gap-4">
        <Link to="/login" className="text-slate-600 hover:text-blue-600 font-medium">Đăng nhập</Link>
        <Link to="/register">
          <Button>Đăng ký miễn phí</Button>
        </Link>
      </nav>
    </header>
  );
}