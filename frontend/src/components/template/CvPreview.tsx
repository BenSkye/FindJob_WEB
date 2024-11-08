import { ITemplate } from '../../services/types/template.types';
import { ICV } from '../../services/types/cv.types';
import Handlebars from 'handlebars';

interface CvPreviewProps {
    template: ITemplate;
    cvData: ICV;
}

const CvPreview: React.FC<CvPreviewProps> = ({ template, cvData }) => {
    const renderContent = () => {
        try {
            // Convert Map to plain object for Handlebars
            const templateData = Object.fromEntries(cvData.content);

            // Register custom helpers
            Handlebars.registerHelper('isSelected', function (fieldName) {
                return cvData.selectedFields.includes(fieldName);
            });

            // Register each helper for array iteration
            Handlebars.registerHelper('each', function (context, options) {
                if (!context) return '';
                return context.map((item: any) => options.fn(item)).join('');
            });

            const compiledTemplate = Handlebars.compile(template.htmlStructure);
            const renderedHtml = compiledTemplate(templateData);
            return { __html: renderedHtml };
        } catch (error) {
            console.error('Template rendering error:', error);
            return {
                __html: '<div style="color: red;">Error rendering template. Please try again later.</div>'
            };
        }
    };

    return (
        <div className="cv-preview">
            <style>{template.cssStyles}</style>
            <div
                dangerouslySetInnerHTML={renderContent()}
                style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
            />
        </div>
    );
};

export default CvPreview;