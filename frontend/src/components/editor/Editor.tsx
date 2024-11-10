import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface EditorProps {
    onChange: (data: string) => void;
    data?: string;
}

const Editor: React.FC<EditorProps> = ({ onChange, data }) => {
    const [value, setValue] = useState(data || '');

    useEffect(() => {
        setValue(data || '');
    }, [data]);

    const handleChange = (content: string) => {
        setValue(content);
        onChange(content);
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            ['clean']
        ]
    };

    return (
        <div className="editor-wrapper" style={{ minHeight: '300px' }}>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={handleChange}
                modules={modules}
                style={{ height: '250px' }}
            />
        </div>
    );
};

export default Editor;