import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ITemplate } from '../../services/types/template.types';
import { getAllTemplates } from '../../services/api/templateApi';
import { colors } from '../../config/theme';

const Template = () => {
    const [templates, setTemplates] = useState<ITemplate[]>([]);
    const [loading, setLoading] = useState(true);

    const styles: { [key: string]: React.CSSProperties } = {
        container: {
            padding: '2rem',
            maxWidth: '1200px',
            margin: '0 auto'
        },
        header: {
            marginBottom: '2rem',
            textAlign: 'center'
        },
        title: {
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '1rem'
        },
        subtitle: {
            fontSize: '1.1rem',
            color: '#64748b'
        },
        templateGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem',
            padding: '1rem'
        },
        templateCard: {
            backgroundColor: '#ffffff',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer'
        },
        thumbnailContainer: {
            position: 'relative',
            paddingTop: '141.4%', // Aspect ratio 1:1.414 (A4 paper)
            overflow: 'hidden'
        },
        thumbnail: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        },
        cardContent: {
            padding: '1rem'
        },
        templateName: {
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#334155',
            marginBottom: '0.5rem'
        },
        useButton: {
            backgroundColor: colors.brand.primary.main,
            color: '#ffffff',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            textDecoration: 'none',
            display: 'inline-block',
            textAlign: 'center',
            width: '100%',
            marginTop: '0.5rem'
        },
        loadingContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            fontSize: '1.25rem',
            color: '#64748b'
        },
        noTemplates: {
            textAlign: 'center',
            padding: '2rem',
            color: '#64748b'
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const response = await getAllTemplates();
            setTemplates(response.metadata);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching templates:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={styles.loadingContainer}>Đang tải templates...</div>;
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Chọn Template CV của bạn</h1>
                <p style={styles.subtitle}>Chọn mẫu CV phù hợp với bạn</p>
            </header>

            <div style={styles.templateGrid}>
                {templates.map((template) => (
                    <div
                        key={template._id}
                        style={styles.templateCard}
                        className="card-hover" // Add hover styles in CSS
                    >
                        <div style={styles.thumbnailContainer}>
                            <img
                                src={template.thumbnail}
                                alt={template.name}
                                style={styles.thumbnail}
                            />
                        </div>
                        <div style={styles.cardContent}>
                            <h3 style={styles.templateName}>{template.name}</h3>
                            <Link
                                to={`/create-template/${template._id}`}
                                style={styles.useButton}
                                className="button-hover" // Add hover styles in CSS
                            >
                                Sử dụng Template
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {templates.length === 0 && (
                <div style={styles.noTemplates}>
                    Không có template nào. Vui lòng thử lại sau.
                </div>
            )}
        </div>
    );
};

export default Template;