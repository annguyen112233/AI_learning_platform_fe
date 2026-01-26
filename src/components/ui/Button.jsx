export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyle =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200",
    outline: "border-2 border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-600 bg-white",
    ghost: "text-slate-600 hover:bg-slate-100",

    // 👉 THÊM 2 VARIANT XANH LÁ
    success: "bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-200",
    successLight: "bg-green-100 hover:bg-green-200 text-green-800 shadow-sm",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant] || ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
