import { ITemplate } from '../../services/types/template.types';

interface CvData {
    personalInfo: {
        name: string;
        title: string;
        email: string;
        phone: string;
        location: string;
    };
    experience: Array<{
        title: string;
        company: string;
        period: string;
    }>;
    education: Array<{
        degree: string;
        school: string;
        year: string;
    }>;
    skills: string[];
    description?: string;
}

interface CvPreviewProps {
    template: ITemplate;
    data: CvData;
    isPreviewMode?: boolean;
}

const CvPreview: React.FC<CvPreviewProps> = ({ template, data, isPreviewMode = false }) => {
    const renderContent = () => {
        let previewHtml = template.htmlStructure;

        // Hàm helper để kiểm tra và thay thế an toàn
        const safeReplace = (placeholder: string, value: string | undefined) => {
            return value ? value : isPreviewMode ? `[${placeholder}]` : '';
        };

        // Xử lý thông tin cá nhân
        previewHtml = previewHtml
            .replace(/\{\{name\}\}/g, safeReplace('name', data.personalInfo?.name))
            .replace(/\{\{title\}\}/g, safeReplace('title', data.personalInfo?.title))
            .replace(/\{\{email\}\}/g, safeReplace('email', data.personalInfo?.email))
            .replace(/\{\{phone\}\}/g, safeReplace('phone', data.personalInfo?.phone))
            .replace(/\{\{location\}\}/g, safeReplace('location', data.personalInfo?.location));

        // Xử lý kinh nghiệm làm việc
        if (data.experience?.length > 0) {
            const experienceHtml = data.experience.map(exp =>
                `<li>${exp.title} - ${exp.company} - ${exp.period}</li>`
            ).join('');
            previewHtml = previewHtml.replace(/\{\{experience\}\}/g, experienceHtml);
        } else {
            previewHtml = previewHtml.replace(/\{\{experience\}\}/g,
                isPreviewMode ? '[Experience list]' : '');
        }

        // Xử lý học vấn
        if (data.education?.length > 0) {
            const educationHtml = data.education.map(edu =>
                `<li>${edu.degree} - ${edu.school} - ${edu.year}</li>`
            ).join('');
            previewHtml = previewHtml.replace(/\{\{education\}\}/g, educationHtml);
        } else {
            previewHtml = previewHtml.replace(/\{\{education\}\}/g,
                isPreviewMode ? '[Education list]' : '');
        }

        // Xử lý kỹ năng
        if (data.skills?.length > 0) {
            previewHtml = previewHtml.replace(/\{\{skills\}\}/g, data.skills.join(', '));
        } else {
            previewHtml = previewHtml.replace(/\{\{skills\}\}/g,
                isPreviewMode ? '[Skills list]' : '');
        }

        // Xử lý mô tả
        previewHtml = previewHtml.replace(/\{\{description\}\}/g,
            safeReplace('description', data.description));

        return { __html: previewHtml };
    };

    return (
        <>
            <style>{template.cssStyles}</style>
            <div dangerouslySetInnerHTML={renderContent()} />
        </>
    );
};

export default CvPreview;