import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface EditorProps {
    onChange: (data: string) => void;
    data?: string;
    config?: any;
}

const Editor: React.FC<EditorProps> = ({ onChange, data = '', config }) => {
    return (
        <CKEditor
            editor={ClassicEditor}
            data={data}
            config={config}
            onChange={(event: any, editor: any) => {
                const data = editor.getData();
                onChange(data);
            }}
        />
    );
};

export default Editor;