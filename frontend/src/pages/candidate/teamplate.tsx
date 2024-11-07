import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ITemplate } from '../../services/types/template.types';
import { getAllTemplates } from '../../services/api/templateApi';
import { SAMPLE_CV_CONTENT } from '../../services/api/sampleData';
import CvPreview from '../../components/template/CvPreview';
import { colors } from '../../config/theme';
const Template = () => {
    const [templates, setTemplates] = useState<ITemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<ITemplate | null>(null);
    const [loading, setLoading] = useState(true);

    const styles: { [key: string]: React.CSSProperties } = {
        container: {
            // maxWidth: '1400px',
            margin: '0 auto',
            // padding: '3rem 2rem',
            // backgroundColor: '#f8fafc'
        },
        header: {
            marginBottom: '3rem'
        },
        title: {
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1e293b',
            textAlign: 'center',
            marginBottom: '1rem'
        },
        subtitle: {
            fontSize: '1.125rem',
            color: '#64748b',
            textAlign: 'center'
        },
        gridContainer: {
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: '3rem',
            alignItems: 'start'
        },
        templateGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1.5rem'
        },
        templateCard: {
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            transform: 'translateY(0)'
        },
        templateCardHover: {
            transform: 'translateY(-4px)',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
        },
        templateCardSelected: {
            border: '2px solid #3b82f6',
            boxShadow: '0 0 0 2px rgba(59,130,246,0.3)'
        },
        cardContent: {
            padding: '1.5rem'
        },
        templateName: {
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#334155',
            marginBottom: '1rem'
        },
        statusContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        statusBadge: {
            padding: '0.375rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '500',
            display: 'inline-block'
        },
        activeStatus: {
            backgroundColor: '#dcfce7',
            color: '#166534'
        },
        inactiveStatus: {
            backgroundColor: '#fee2e2',
            color: '#991b1b'
        },
        previewPanel: {
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: '2rem'
        },
        previewTitle: {
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#334155',
            marginBottom: '1.5rem',
            textAlign: 'center'
        },
        previewContainer: {
            maxHeight: '70vh',
            overflowY: 'auto',
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '1.5rem'
        },
        button: {
            backgroundColor: colors.brand.primary.main,
            color: '#ffffff',
            padding: '0.75rem 2rem',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '500',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            border: 'none',
            cursor: 'pointer'
        },
        loadingContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontSize: '1.25rem',
            color: '#64748b'
        },
        noTemplates: {
            textAlign: 'center',
            color: '#64748b',
            padding: '3rem',
            fontSize: '1.125rem'
        },
        scrollbar: {
            scrollbarWidth: 'thin',
            scrollbarColor: '#cbd5e1 #f1f5f9'
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const response = await getAllTemplates();
            console.log(response);
            setTemplates(response.metadata);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching templates:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={styles.loadingContainer}>Đang tải template...</div>;
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Chọn Template CV của bạn</h1>
                <p style={styles.subtitle}>Chọn từ các template được thiết kế chuyên nghiệp để tạo CV của bạn</p>
            </header>

            <div style={styles.gridContainer}>
                <div style={styles.templateGrid}>
                    {templates.map((template) => (
                        <div
                            key={template._id}
                            style={{
                                ...styles.templateCard,
                                ...(selectedTemplate?._id === template._id ? styles.templateCardSelected : {})
                            }}
                            onClick={() => setSelectedTemplate(template)}
                            onMouseEnter={(e) => {
                                Object.assign(e.currentTarget.style, styles.templateCardHover);
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = styles.templateCard.transform || '';
                                e.currentTarget.style.boxShadow = styles.templateCard.boxShadow || '';
                            }}
                        >
                            <div style={styles.cardContent}>
                                <h3 style={styles.templateName}>{template.name}</h3>
                                <div style={styles.statusContainer}>
                                    <span style={{
                                        ...styles.statusBadge,
                                        ...(template.isActive ? styles.activeStatus : styles.inactiveStatus)
                                    }}>
                                        {template.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={styles.previewPanel}>
                    <h2 style={styles.previewTitle}>Template Preview</h2>
                    {selectedTemplate ? (
                        <>
                            <div style={{ ...styles.previewContainer, ...styles.scrollbar }}>
                                <CvPreview template={selectedTemplate} data={SAMPLE_CV_CONTENT} />
                            </div>
                            <div style={styles.buttonContainer}>
                                <Link
                                    to={`/create-template/${selectedTemplate._id}`}
                                    style={{ ...styles.button, backgroundColor: colors.brand.primary.main }}
                                    onMouseEnter={(e) => {
                                        Object.assign(e.currentTarget.style, styles.buttonHover);
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = styles.button.backgroundColor || '';
                                    }}
                                    className="button-hover"
                                    type='primary'
                                >
                                    Sử dụng Template này
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div style={styles.noTemplates}>
                            Chọn một template từ bên trái để xem trước
                        </div>
                    )}
                </div>
            </div>


            {
                templates.length === 0 && (
                    <div style={styles.noTemplates}>
                        Template hiện tại không có sẵn. Vui lòng kiểm tra lại sau.
                    </div>
                )
            }
        </div >
    );
};

export default Template;