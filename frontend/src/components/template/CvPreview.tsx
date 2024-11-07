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
            const compiledTemplate = Handlebars.compile(template.htmlStructure);
            const templateData = {
                ...data,
                isPreviewMode
            };
            const renderedHtml = compiledTemplate(templateData);
            return { __html: renderedHtml };
        } catch (error) {
            console.error('Template rendering error:', error);
            return { __html: '<div style="color: red;">Error rendering template. Please try again later.</div>' };
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