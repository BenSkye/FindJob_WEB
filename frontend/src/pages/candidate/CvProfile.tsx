import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button, message, Spin } from 'antd';
import { getCvByUserId } from '../../services/api/cvApi';
import { ICV } from '../../services/types/cv.types';
import { ITemplate } from '../../services/types/template.types';
import Handlebars from 'handlebars';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { checkoutCVBuilder, savePaymentCodeCVBuilder } from '../../services/api/checkoutService';

interface CVResponse {
    message: string;
    status: number;
    metadata: Array<ICV & {
        templateId: ITemplate;
    }>;
}

const CvProfile: React.FC = () => {
    const { user } = useAuth();
    const [cvs, setCvs] = useState<CVResponse['metadata']>([]);
    const [loading, setLoading] = useState(true);
    const [shouldDownload, setShouldDownload] = useState<string | null>(null);
    const [paymentCode, setPaymentCode] = useState<string | null>(null);

    useEffect(() => {
        const fetchCVs = async () => {
            try {
                if (!user?.userId) return;
                const response = await getCvByUserId(user.userId);
                if (response.status === 200) {
                    setCvs(response.metadata);
                }
            } catch (error) {
                console.error('Error fetching CVs:', error);
                message.error("Không thể tải danh sách CV");
            } finally {
                setLoading(false);
            }
        };

        fetchCVs();
    }, [user]);

    useEffect(() => {
        const savePaymentCode = async () => {
            const query = new URLSearchParams(window.location.search);
            if (query.get("code") === '00') {
                const paymentCodeCVBuilder = JSON.parse(localStorage.getItem('paymentCodeCVBuilder') || '{}');
                if (query.get("orderCode")?.toString() === paymentCodeCVBuilder.paymentCode?.toString()) {
                    message.success("Thanh toán thành công!");
                    setShouldDownload(paymentCodeCVBuilder.cvId.toString());
                    setPaymentCode(paymentCodeCVBuilder.paymentCode?.toString());
                    await savePaymentCodeCVBuilder(paymentCodeCVBuilder.paymentCode?.toString());
                    localStorage.removeItem('paymentCodeCVBuilder');
                }
            } else if (query.get("code")) {
                message.error("Thanh toán thất bại.");
            }
        }
        savePaymentCode();
    }, []);


    useEffect(() => {
        const downloadPDF = async () => {
            if (shouldDownload && !loading && cvs.length > 0) {
                const element = document.getElementById(`cv-preview-${shouldDownload}`);
                if (element) {
                    try {
                        message.loading("Đang tạo PDF...");
                        await handleDownloadPDF(shouldDownload);
                        message.success("Tải PDF thành công!");
                        setShouldDownload(null);
                    } catch (error) {
                        console.error('Download error:', error);
                        message.error("Có lỗi xảy ra khi tạo PDF");
                    }
                }
            }
        };

        downloadPDF();
    }, [shouldDownload, loading, cvs]);

    const handlePaymentConfirm = async (cvId: string) => {
        try {
            const response = await checkoutCVBuilder(cvId);
            if (response.metadata && response.metadata.paymentUrl) {
                const paymentCode = response.metadata.paymentCode;
                localStorage.setItem('paymentCodeCVBuilder', JSON.stringify({ paymentCode, cvId }));
                window.location.href = response.metadata.paymentUrl;
            } else {
                message.error('Không thể tạo URL thanh toán');
            }
        } catch (error) {
            console.error('Payment error:', error);
            message.error('Có lỗi xảy ra khi tạo thanh toán');
        }
    };

    const handleDownloadPDF = async (cvId: string) => {
        const cvElement = document.getElementById(`cv-preview-${cvId}`);
        if (!cvElement) {
            throw new Error('Cannot find CV preview element');
        }
        // Lưu style hiện tại
        const originalStyle = {
            width: cvElement.style.width,
            height: cvElement.style.height,
            transform: cvElement.style.transform,
            position: cvElement.style.position
        };

        // Set kích thước cố định cho element (tương đương A4)
        cvElement.style.width = '794px';  // A4 width in pixels at 96 DPI
        cvElement.style.height = 'auto';
        cvElement.style.transform = 'none';
        cvElement.style.position = 'relative';

        // Tạo canvas với scale cao hơn để đảm bảo chất lượng
        const canvas = await html2canvas(cvElement, {
            scale: 3, // Tăng scale để có độ phân giải cao hơn
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            windowWidth: 794, // Đảm bảo render ở kích thước cố định
            windowHeight: cvElement.scrollHeight,
            onclone: (document, element) => {
                // Fix font rendering
                (element.style as any).fontSmoothing = 'antialiased';
                (element.style as any).webkitFontSmoothing = 'antialiased';
                (element.style as any).mozOsxFontSmoothing = 'grayscale';
            }
        });

        // Khôi phục style ban đầu
        Object.assign(cvElement.style, originalStyle);

        // Tính toán kích thước cho PDF A4 (210mm x 297mm)
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Tạo PDF với chất lượng cao
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true
        });

        // Thêm ảnh vào PDF với chất lượng cao
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');

        // Lưu file với tên có timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        pdf.save(`cv-${timestamp}.pdf`);
    };

    const renderCV = (cv: CVResponse['metadata'][0]) => {
        try {
            if (!cv.templateId) {
                return <div>Template not found</div>;
            }

            const template = Handlebars.compile(cv.templateId.htmlStructure);
            const html = template(cv.content);

            return (
                <div key={cv._id} className="cv-preview-wrapper" id={`cv-preview-${cv._id}`}>
                    <style>{cv.templateId.cssStyles}</style>
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                </div>
            );
        } catch (error) {
            console.error('Error rendering CV:', error);
            return <div>Error rendering CV template</div>;
        }
    };
    if (loading) {
        return <Spin size="large" />;
    }

    if (!cvs.length) {
        return (
            <div className="no-cvs-container" style={{
                textAlign: 'center',
                padding: '2rem'
            }}>
                <h2>No CVs found</h2>
                <p>Create your first CV to get started</p>
            </div>
        );
    }

    return (
        <div className="cv-profile-container" style={{
            padding: '2rem',
            maxWidth: '800px', // Giảm maxWidth xuống
            margin: '0 auto'
        }}>
            <div className="cv-list" style={{
                display: 'flex',
                flexDirection: 'column', // Thay đổi thành column
                gap: '2rem'
            }}>
                {cvs.map((cv) => {
                    if (!cv.templateId) return null;

                    return (
                        <div key={cv._id} className="cv-item" style={{
                            border: '1px solid #eee',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            backgroundColor: 'white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            width: '100%' // Đảm bảo chiều rộng 100%
                        }}>
                            <div className="cv-header" style={{
                                padding: '1rem',
                                borderBottom: '1px solid #eee',
                                display: 'flex',
                                justifyContent: 'space-between', // Căn chỉnh header
                                alignItems: 'center'
                            }}>
                                <h3 style={{ margin: 0 }}>{cv.templateId.name}</h3>
                                <div className="cv-status" style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    alignItems: 'center'
                                }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.875rem',
                                        backgroundColor: cv.status === 'active' ? '#e6f7ff' : '#fff1f0',
                                        color: cv.status === 'active' ? '#1890ff' : '#ff4d4f'
                                    }}>
                                        {cv.status.toUpperCase()}
                                    </span>
                                    {cv.isPaid && (
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.875rem',
                                            backgroundColor: '#f6ffed',
                                            color: '#52c41a'
                                        }}>
                                            PAID
                                        </span>
                                    )}
                                    <Button
                                        type="primary"
                                        onClick={() => handlePaymentConfirm(cv._id!)}
                                    >
                                        Download PDF
                                    </Button>
                                </div>
                            </div>
                            <div className="cv-preview" style={{
                                padding: '1rem',
                                maxHeight: '800px', // Tăng maxHeight
                                overflow: 'auto',
                                backgroundColor: '#f5f5f5' // Thêm background để phân biệt
                            }}>
                                {renderCV(cv)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CvProfile;