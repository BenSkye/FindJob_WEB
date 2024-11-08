import { useAuth } from '../../hooks/useAuth';
import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { getCvByUserId } from '../../services/api/cvApi';
import { ICV } from '../../services/types/cv.types';
import { ITemplate } from '../../services/types/template.types';
import Handlebars from 'handlebars';

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

    useEffect(() => {
        const fetchCVs = async () => {
            try {
                if (!user?.userId) return;

                const response = await getCvByUserId(user.userId);
                console.log(response);
                if (response.status === 200) {
                    setCvs(response.metadata);
                }
            } catch (error) {
                console.error('Error fetching CVs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCVs();
    }, [user]);

    const renderCV = (cv: CVResponse['metadata'][0]) => {
        try {
            if (!cv.templateId) {
                return <div>Template not found</div>;
            }

            const template = Handlebars.compile(cv.templateId.htmlStructure);
            const html = template(cv.content);

            return (
                <div key={cv._id} className="cv-preview-wrapper">
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
        return (
            <div className="loading-container" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <Spin size="large" />
            </div>
        );
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
            maxWidth: '1200px',
            margin: '0 auto'
        }}>
            <div className="cv-list" style={{
                display: 'grid',
                gap: '2rem',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
            }}>
                {cvs.map((cv) => {
                    // Kiểm tra nếu không có templateId thì skip
                    if (!cv.templateId) return null;

                    return (
                        <div key={cv._id} className="cv-item" style={{
                            border: '1px solid #eee',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            backgroundColor: 'white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <div className="cv-header" style={{
                                padding: '1rem',
                                borderBottom: '1px solid #eee'
                            }}>
                                <h3 style={{ margin: 0 }}>{cv.templateId.name}</h3>
                                <div className="cv-status" style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    marginTop: '0.5rem'
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
                                </div>
                            </div>
                            <div className="cv-preview" style={{
                                padding: '1rem',
                                maxHeight: '600px',
                                overflow: 'auto'
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