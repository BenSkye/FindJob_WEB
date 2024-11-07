import { ITemplate } from '../../services/types/template.types';
import { ICv } from '../../services/types/cv.types';
import Handlebars from 'handlebars';

interface CvPreviewProps {
    template: ITemplate;
    data: ICv;
    isPreviewMode?: boolean;
}

const CvPreview: React.FC<CvPreviewProps> = ({ template, data, isPreviewMode = false }) => {
    const renderContent = () => {
        try {
            // Compile template với Handlebars
            const compiledTemplate = Handlebars.compile(template.htmlStructure);

            // Chuẩn bị dữ liệu để render
            const templateData = {
                ...data,
                // Thêm các helper data nếu cần
                isPreviewMode
            };

            // Render template với dữ liệu
            const renderedHtml = compiledTemplate(templateData);

            return { __html: renderedHtml };
        } catch (error) {
            console.error('Template rendering error:', error);
            return { __html: 'Error rendering template' };
        }
    };

    return (
        <>
            <style>{template.cssStyles}</style>
            <div dangerouslySetInnerHTML={renderContent()} />
        </>
    );
};

export default CvPreview;