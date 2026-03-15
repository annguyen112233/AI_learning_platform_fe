import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Share2, Award, CheckCircle2, ChevronLeft, MapPin, Calendar } from 'lucide-react';
import { getCertificate } from '@/services/courseService';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef } from 'react';

export default function Certificate() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const certificateRef = useRef(null);

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    
    const toastId = toast.loading("Đang xuất chứng chỉ chuyên nghiệp...");
    
    // Lưu lại trạng thái style để khôi phục
    const styleSheets = Array.from(document.styleSheets);
    const disabledStates = styleSheets.map(ss => ss.disabled);
    
    try {
      await document.fonts.ready;
      
      // TẠM THỜI VÔ HIỆU HÓA TOÀN BỘ CSS CỦA TRANG WEB
      styleSheets.forEach(ss => {
          try {
              if (ss.ownerNode?.tagName === 'STYLE' || ss.ownerNode?.tagName === 'LINK') {
                  ss.disabled = true;
              }
          } catch(e) {}
      });

      const canvas = await html2canvas(certificateRef.current, {
        scale: 3, 
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // CHIẾN THUẬT CÔ LẬP TUYỆT ĐỐI (NUCLEAR ISOLATION)
          // Bước 1: Tìm phần tử chứng chỉ trong bản clone
          const clonedCert = clonedDoc.querySelector('[data-cert-area="true"]');
          
          if (clonedCert) {
              // Bước 2: Xóa sạch toàn bộ Document và chỉ giữ lại chứng chỉ + Font
              clonedDoc.documentElement.innerHTML = `
                <head>
                  <style>
                    @import url('https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&family=Playfair+Display:ital,wght@0,700;1,700&family=Montserrat:wght@400;700&display=swap');
                    .font-signature { font-family: 'Mrs Saint Delafield', cursive !important; }
                    .font-serif { font-family: 'Playfair Display', serif !important; }
                    .font-mont { font-family: 'Montserrat', sans-serif !important; }
                    body { margin: 0; padding: 0; background: white; }
                    * { box-sizing: border-box !important; -webkit-print-color-adjust: exact; }
                  </style>
                </head>
                <body style="display: flex; justify-content: center; align-items: center; min-height: 100vh;">
                  <div id="capture-root"></div>
                </body>
              `;
              
              const root = clonedDoc.getElementById('capture-root');
              root.appendChild(clonedCert);

              // Bước 3: QUAN TRỌNG NHẤT - Xóa sạch mọi ClassName để html2canvas không bao giờ đọc được biến oklch từ CSS
              const allElements = clonedDoc.querySelectorAll('*');
              allElements.forEach(el => {
                  el.removeAttribute('class');
                  // Nếu là SVG, đảm bảo stroke/fill không dùng biến CSS
                  if (el.tagName.toLowerCase() === 'svg' || el.tagName.toLowerCase() === 'path' || el.tagName.toLowerCase() === 'circle') {
                      const color = el.getAttribute('stroke') || el.getAttribute('fill');
                      if (color && color.includes('var')) {
                          el.setAttribute('stroke', '#065F46');
                      }
                  }
              });
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'l',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Certificate_SABO_${certData.studentName.replace(/\s+/g, '_')}.pdf`);
      toast.success("Tải xuống thành công!", { id: toastId });
    } catch (error) {
      console.error("PDF Final Error:", error);
      toast.error("Lỗi xuất PDF. Hãy thử lại (nên dùng Chrome).", { id: toastId });
    } finally {
        // KHÔI PHỤC LẠI STYLE CHO TRANG WEB
        styleSheets.forEach((ss, i) => {
            try { ss.disabled = disabledStates[i]; } catch(e) {}
        });
    }
  };

  useEffect(() => {
    const fetchCert = async () => {
      try {
        setLoading(true);
        const res = await getCertificate(courseId);
        const data = res.data.data || res.data;
        setCertData(data);
      } catch (err) {
        console.error(err);
        toast.error("Không thể lấy dữ liệu chứng chỉ.");
      } finally {
        setLoading(false);
      }
    };
    fetchCert();
  }, [courseId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!certData) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 overflow-x-hidden font-sans">
      <link href="https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&family=Playfair+Display:ital,wght@0,700;1,700&family=Montserrat:wght@400;700&display=swap" rel="stylesheet" />
      
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-emerald-700 font-bold transition-all">
            <ChevronLeft size={24} /> Quay lại
          </button>
          <button onClick={handleDownloadPDF} className="px-10 py-3 bg-[#065F46] text-white rounded-2xl font-bold shadow-xl shadow-emerald-200 hover:bg-[#044e3a] transition-all flex items-center gap-3">
             <Download size={20} /> Tải PDF cao cấp
          </button>
        </div>

        {/* CONTAINER CHỨNG CHỈ */}
        <div className="relative flex justify-center">
          <div 
            ref={certificateRef}
            data-cert-area="true"
            style={{ 
              backgroundColor: '#ffffff', 
              padding: '20px',
              position: 'relative',
              width: '1000px',
              height: '800px',
              boxShadow: '0 50px 100px -20px rgba(0,0,0,0.12)',
              boxSizing: 'border-box'
            }}
          >
            {/* Viền đôi màu vàng Gold */}
            <div 
              style={{ 
                border: '3px solid #D4AF37', 
                height: '100%',
                width: '100%',
                padding: '10px', 
                boxSizing: 'border-box'
              }}
            >
              <div 
                style={{ 
                  border: '6px double #D4AF37', 
                  height: '100%',
                  width: '100%',
                  padding: '40px 60px', 
                  position: 'relative',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#ffffff'
                }}
              >
                {/* Họa tiết góc */}
                <div style={{ position: 'absolute', top: '15px', left: '15px', color: '#D4AF37' }}>
                   <svg width="70" height="70" viewBox="0 0 100 100"><path d="M0 30 L0 0 L30 0" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M10 30 L10 10 L30 10" fill="none" stroke="currentColor" strokeWidth="1"/></svg>
                </div>
                <div style={{ position: 'absolute', top: '15px', right: '15px', color: '#D4AF37', transform: 'rotate(90deg)' }}>
                   <svg width="70" height="70" viewBox="0 0 100 100"><path d="M0 30 L0 0 L30 0" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M10 30 L10 10 L30 10" fill="none" stroke="currentColor" strokeWidth="1"/></svg>
                </div>
                <div style={{ position: 'absolute', bottom: '15px', left: '15px', color: '#D4AF37', transform: 'rotate(-90deg)' }}>
                   <svg width="70" height="70" viewBox="0 0 100 100"><path d="M0 30 L0 0 L30 0" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M10 30 L10 10 L30 10" fill="none" stroke="currentColor" strokeWidth="1"/></svg>
                </div>
                <div style={{ position: 'absolute', bottom: '15px', right: '15px', color: '#D4AF37', transform: 'rotate(180deg)' }}>
                   <svg width="70" height="70" viewBox="0 0 100 100"><path d="M0 30 L0 0 L30 0" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M10 30 L10 10 L30 10" fill="none" stroke="currentColor" strokeWidth="1"/></svg>
                </div>

                {/* Huy hiệu */}
                <div style={{ width: '90px', height: '90px', backgroundColor: '#065F46', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 10px 20px rgba(6, 95, 70, 0.2)' }}>
                   <Award size={50} color="#ffffff" />
                </div>

                <div style={{ color: '#059669', fontSize: '15px', fontWeight: 'bold', letterSpacing: '6px', textTransform: 'uppercase', marginBottom: '15px' }}>
                   Hệ thống đào tạo quốc tế Sabo
                </div>
                
                <h1 
                  style={{ 
                     color: '#1a1a1a', 
                     fontSize: '56px', 
                     fontFamily: "'Playfair Display', serif", 
                     fontWeight: '700',
                     fontStyle: 'italic',
                     marginBottom: '25px', 
                     lineHeight: '1.2'
                  }}
                  className="font-serif"
                >
                  Certificate of Achievement
                </h1>

                <div style={{ height: '3px', width: '250px', backgroundColor: '#D4AF37', marginBottom: '40px' }}></div>

                <p style={{ color: '#666', fontSize: '19px', fontStyle: 'italic', marginBottom: '10px' }}>Trân trọng trao tặng cho</p>
                
                <h2 style={{ color: '#111', fontSize: '52px', fontWeight: '800', marginBottom: '35px', letterSpacing: '1px' }}>
                  {certData.studentName}
                </h2>

                <p style={{ color: '#444', fontSize: '20px', maxWidth: '800px', textAlign: 'center', lineHeight: '1.7', fontFamily: "'Montserrat', sans-serif", marginBottom: '50px' }}>
                  Đã hoàn thành xuất sắc chương trình đào tạo chuyên sâu:
                  <br/>
                  <span style={{ color: '#065F46', fontWeight: 'bold', fontSize: '26px' }}>"{certData.courseTitle}"</span> 
                  <br/>
                  Tại hệ thống học tập trực tuyến <span style={{ fontWeight: 'bold' }}>SABO Academy</span>.
                </p>

                {/* Thông tin xác thực */}
                <div style={{ display: 'flex', width: '90%', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '35px', marginBottom: '60px' }}>
                   <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#999', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>NGÀY PHÁT HÀNH</div>
                      <div style={{ color: '#000', fontWeight: 'bold', fontSize: '16px' }}>{new Date(certData.completionDate).toLocaleDateString('vi-VN')}</div>
                   </div>
                   <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#999', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>MÃ CHỨNG CHỈ</div>
                      <div style={{ color: '#000', fontWeight: 'bold', fontSize: '16px', textTransform: 'uppercase' }}>{certData.enrollmentId ? certData.enrollmentId.substring(0, 10).toUpperCase() : 'SABO-CER-01'}</div>
                   </div>
                   <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#999', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>TỔ CHỨC CẤP</div>
                      <div style={{ color: '#000', fontWeight: 'bold', fontSize: '16px' }}>SABO Academy</div>
                   </div>
                </div>

                {/* Chữ ký nghệ thuật */}
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', position: 'relative' }}>
                   <div style={{ textAlign: 'center', position: 'relative', width: '400px' }}>
                      
                      <div 
                        style={{ 
                          fontFamily: "'Mrs Saint Delafield', cursive", 
                          fontSize: '85px', 
                          color: '#064E3B', 
                          position: 'absolute', 
                          top: '-85px', 
                          left: '0', 
                          right: '0', 
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.1))'
                        }}
                        className="font-signature"
                      >
                         Trần Thanh Nam
                      </div>
                      
                      <div style={{ width: '100%', height: '1.5px', backgroundColor: '#111', margin: '0 auto' }}></div>
                      <div style={{ marginTop: '12px', color: '#888', fontSize: '12px', fontWeight: 'bold', letterSpacing: '3px' }}>
                         ĐẠI DIỆN HỘI ĐỒNG SABO ACADEMY
                      </div>
                   </div>

                   {/* Con dấu đỏ */}
                   <div 
                     style={{ 
                       position: 'absolute', 
                       right: '40px', 
                       top: '-30px', 
                       width: '120px', 
                       height: '120px', 
                       border: '4px solid rgba(185, 28, 28, 0.25)', 
                       borderRadius: '50%', 
                       display: 'flex', 
                       alignItems: 'center', 
                       justifyContent: 'center', 
                       transform: 'rotate(-15deg)',
                       color: 'rgba(185, 28, 28, 0.35)',
                       fontWeight: 'bold',
                       fontSize: '11px',
                       textAlign: 'center',
                       lineHeight: '1.3',
                       pointerEvents: 'none'
                     }}
                   >
                      OFFICIAL SEAL<br/>SABO ACADEMY<br/>CERTIFIED
                   </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-slate-400 text-sm">
           Mã định danh chứng thực: {certData.enrollmentId || 'N/A'} - Xác minh tại saboacademy.com/verify
        </div>
      </div>
    </div>
  );
}
