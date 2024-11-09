import { useEffect, useRef } from 'react';

interface EditorProps {
    onChange: (data: string) => void;
    data?: string;
    config?: any;
}

declare global {
    interface Window {
        ClassicEditor: any;
    }
}

const Editor: React.FC<EditorProps> = ({ onChange, data = '', config }) => {
    const editorRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current && window.ClassicEditor) {
            window.ClassicEditor
                .create(containerRef.current, {
                    ...config,
                    removePlugins: ['Title'],
                    toolbar: {
                        items: [
                            'heading',
                            '|',
                            'bold',
                            'italic',
                            'link',
                            'bulletedList',
                            'numberedList',
                            '|',
                            'outdent',
                            'indent',
                            '|',
                            'undo',
                            'redo'
                        ]
                    }
                })
                .then((editor: any) => {
                    editorRef.current = editor;
                    editor.setData(data);
                    editor.model.document.on('change:data', () => {
                        const data = editor.getData();
                        onChange(data);
                    });
                })
                .catch((error: any) => {
                    console.error('Error initializing editor:', error);
                });
        }

        return () => {
            if (editorRef.current) {
                editorRef.current.destroy();
            }
        };
    }, []);

    return <div ref={containerRef} />;
};

export default Editor;