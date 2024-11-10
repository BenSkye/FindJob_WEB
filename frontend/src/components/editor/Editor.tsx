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

// ... existing imports ...

const Editor: React.FC<EditorProps> = ({ onChange, data = '', config }) => {
    const editorRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isEditorInitialized = useRef(false); // Thêm flag kiểm tra

    useEffect(() => {
        // Kiểm tra nếu editor đã được khởi tạo
        if (isEditorInitialized.current) {
            return;
        }

        if (containerRef.current && window.ClassicEditor) {
            isEditorInitialized.current = true; // Đánh dấu đã khởi tạo

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
                    isEditorInitialized.current = false; // Reset flag nếu có lỗi
                });
        }

        return () => {
            if (editorRef.current) {
                editorRef.current.destroy();
                isEditorInitialized.current = false; // Reset flag khi unmount
            }
        };
    }, [config, data, onChange]); // Thêm dependencies

    return <div ref={containerRef} />;
};

export default Editor;