import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ICV } from '../../services/types/cv.types';
import { ITemplate } from '../../services/types/template.types';
import { getTemplateById } from '../../services/api/templateApi';
import CvPreview from '../../components/template/CvPreview';
import { Layout, Row, Col, Form, Input, Button, Card, Select, Tabs, Space, Spin, message, Affix } from 'antd';
import ImageUploader from '../../components/upload/ImageUploader';
import { createCv } from '../../services/api/cvApi';
import { FIREBASE_STORAGE_PATH } from '../../utils/constants';
import PaymentConfirmModal from '../../components/payment/PaymentConfirmModal';
import {
    DeleteOutlined,
    PlusOutlined,
    SaveOutlined,
    EyeOutlined,
    EditOutlined,
    UserOutlined,
    ProfileOutlined,
    BookOutlined,
    ToolOutlined,
    HistoryOutlined,
    DownloadOutlined
} from '@ant-design/icons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useAuth } from '../../hooks/useAuth';



const { Content } = Layout;
const { TextArea } = Input;

const CVBuilder = () => {
    const { templateId } = useParams();
    const [template, setTemplate] = useState<ITemplate | null>(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('edit');
    const [saving, setSaving] = useState(false);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [processing, setProcessing] = useState(false);

    const { user } = useAuth();

    const [cvData, setCvData] = useState<ICV>({
        userId: user?.userId || '', // Will be set from auth context
        templateId: templateId || '',
        content: new Map<string, any>(),
        selectedFields: [],
        status: 'draft',
        isPaid: false
    });

    const createActiveCV = async () => {
        const contentObject = Object.fromEntries(cvData.content);
        const cvPayload = {
            ...cvData,
            content: contentObject,
            status: 'active',
            isPaid: true
        };
        cvPayload.content.avatar = cvPayload.content.avatar.url;
        const response = await createCv(cvPayload as ICV);
        if (response.status !== 201) {
            throw new Error('Failed to create CV');
        }
        return response;
    };




    useEffect(() => {
        fetchTemplate();
    }, [templateId]);

    const fetchTemplate = async () => {
        if (!templateId) return;
        try {
            setLoading(true);
            const response = await getTemplateById(templateId);
            setTemplate(response.metadata);

            // Set default required fields
            const requiredFields = response.metadata.fields
                .filter(field => field.required)
                .map(field => field.name);

            setCvData(prev => ({
                ...prev,
                selectedFields: requiredFields
            }));
        } catch (error) {
            console.error('Error fetching template:', error);
            message.error('Failed to load template');
        } finally {
            setLoading(false);
        }
    };

    const handleContentChange = (fieldName: string, value: any) => {
        setCvData(prev => {
            const newContent = new Map(prev.content);

            // Nếu là trường ảnh và value là UploadedImage
            if (fieldName === 'avatar' || fieldName === 'photo') {
                // Lưu cả object UploadedImage
                newContent.set(fieldName, value);
            } else {
                // Các trường khác giữ nguyên logic cũ
                newContent.set(fieldName, value);
            }

            return {
                ...prev,
                content: newContent
            };
        });
    };

    const renderArrayField = (field: any, value: any[] = []) => {
        switch (field.section) {
            case 'experience':
                return (
                    <Form.List name={field.name}>
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((f, index) => (
                                    <Card
                                        key={f.key}
                                        size="small"

                                        extra={
                                            <DeleteOutlined

                                                onClick={() => {
                                                    remove(f.name);
                                                    const newValue = [...value];
                                                    newValue.splice(index, 1);
                                                    handleContentChange(field.name, newValue);
                                                }}
                                            />
                                        }
                                    >
                                        <Form.Item label="Title" required>
                                            <Input
                                                value={value[index]?.title || ''}
                                                onChange={e => {
                                                    const newValue = [...value];
                                                    newValue[index] = {
                                                        ...newValue[index],
                                                        title: e.target.value
                                                    };
                                                    handleContentChange(field.name, newValue);
                                                }}
                                                placeholder="Enter job title"
                                            />
                                        </Form.Item>
                                        <Form.Item label="Company" required>
                                            <Input
                                                value={value[index]?.company || ''}
                                                onChange={e => {
                                                    const newValue = [...value];
                                                    newValue[index] = {
                                                        ...newValue[index],
                                                        company: e.target.value
                                                    };
                                                    handleContentChange(field.name, newValue);
                                                }}
                                                placeholder="Enter company name"
                                            />
                                        </Form.Item>
                                        <Form.Item label="Duration" required>
                                            <Input
                                                value={value[index]?.duration || ''}
                                                onChange={e => {
                                                    const newValue = [...value];
                                                    newValue[index] = {
                                                        ...newValue[index],
                                                        duration: e.target.value
                                                    };
                                                    handleContentChange(field.name, newValue);
                                                }}
                                                placeholder="e.g. Jan 2020 - Present"
                                            />
                                        </Form.Item>
                                        <Form.Item label="Description">
                                            <TextArea
                                                rows={4}
                                                value={value[index]?.description || ''}
                                                onChange={e => {
                                                    const newValue = [...value];
                                                    newValue[index] = {
                                                        ...newValue[index],
                                                        description: e.target.value
                                                    };
                                                    handleContentChange(field.name, newValue);
                                                }}
                                                placeholder="Describe your responsibilities and achievements"
                                                showCount
                                                maxLength={500}
                                            />
                                        </Form.Item>
                                    </Card>
                                ))}
                                <Button
                                    type="dashed"
                                    onClick={() => {
                                        add();
                                        handleContentChange(field.name, [...value, {}]);
                                    }}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Add Experience
                                </Button>
                            </>
                        )}
                    </Form.List>
                );

            case 'education':
                return (
                    <Form.List name={field.name}>
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((f, index) => (
                                    <Card
                                        key={f.key}
                                        size="small"

                                        extra={
                                            <DeleteOutlined
                                                className="delete-icon"
                                                onClick={() => {
                                                    remove(f.name);
                                                    const newValue = [...value];
                                                    newValue.splice(index, 1);
                                                    handleContentChange(field.name, newValue);
                                                }}
                                            />
                                        }
                                    >
                                        <Form.Item label="School" required>
                                            <Input
                                                value={value[index]?.school || ''}
                                                onChange={e => {
                                                    const newValue = [...value];
                                                    newValue[index] = {
                                                        ...newValue[index],
                                                        school: e.target.value
                                                    };
                                                    handleContentChange(field.name, newValue);
                                                }}
                                                placeholder="Enter school name"
                                            />
                                        </Form.Item>
                                        <Form.Item label="Degree" required>
                                            <Input
                                                value={value[index]?.degree || ''}
                                                onChange={e => {
                                                    const newValue = [...value];
                                                    newValue[index] = {
                                                        ...newValue[index],
                                                        degree: e.target.value
                                                    };
                                                    handleContentChange(field.name, newValue);
                                                }}
                                                placeholder="Enter degree"
                                            />
                                        </Form.Item>
                                        <Form.Item label="Duration" required>
                                            <Input
                                                value={value[index]?.duration || ''}
                                                onChange={e => {
                                                    const newValue = [...value];
                                                    newValue[index] = {
                                                        ...newValue[index],
                                                        duration: e.target.value
                                                    };
                                                    handleContentChange(field.name, newValue);
                                                }}
                                                placeholder="e.g. 2016 - 2020"
                                            />
                                        </Form.Item>
                                        <Form.Item label="Description">
                                            <TextArea
                                                rows={4}
                                                value={value[index]?.description || ''}
                                                onChange={e => {
                                                    const newValue = [...value];
                                                    newValue[index] = {
                                                        ...newValue[index],
                                                        description: e.target.value
                                                    };
                                                    handleContentChange(field.name, newValue);
                                                }}
                                                placeholder="Describe your achievements"
                                                showCount
                                                maxLength={500}
                                            />
                                        </Form.Item>
                                    </Card>
                                ))}
                                <Button
                                    type="dashed"
                                    onClick={() => {
                                        add();
                                        handleContentChange(field.name, [...value, {}]);
                                    }}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Add Education
                                </Button>
                            </>
                        )}
                    </Form.List>
                );

            default: // For skills, languages, certificates
                return (
                    <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder={`Enter ${field.label}`}
                        value={value || []}
                        onChange={v => handleContentChange(field.name, v)}
                        tokenSeparators={[',']}
                    />
                );
        }
    };

    const renderSectionCard = (section: string, fields: any[]) => {
        return (
            <Card
                key={section}
                title={
                    <Space>
                        {getSectionIcon(section)}
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                    </Space>
                }

                bordered={false}
            >
                {fields.map(field => renderField(field))}
            </Card>
        );
    };

    const getSectionIcon = (section: string) => {
        const icons: { [key: string]: React.ReactNode } = {
            personal: <UserOutlined />,
            professional: <ProfileOutlined />,
            education: <BookOutlined />,
            skills: <ToolOutlined />,
            experience: <HistoryOutlined />
        };
        return icons[section] || null;
    };

    const renderField = (field: any) => {
        const value = cvData.content.get(field.name);

        return (
            <Form.Item
                key={field.name}
                label={field.label}
                required={field.required}
                tooltip={field.description}

            >
                {getFieldInput(field, value)}
            </Form.Item>
        );
    };

    const getFieldInput = (field: any, value: any) => {
        switch (field.type) {
            case 'image':
                return (
                    <div>
                        <ImageUploader
                            onUploadSuccess={urls => handleContentChange(field.name, urls[0])}
                            maxCount={1}
                            storagePath={`${FIREBASE_STORAGE_PATH.AVATAR_ME}/${templateId}`}
                            value={value}
                            showPreview
                        />
                    </div>
                );
            case 'array':
                return renderArrayField(field, value);
            case 'textarea':
                return (
                    <TextArea
                        rows={4}
                        value={value || ''}
                        onChange={e => handleContentChange(field.name, e.target.value)}
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                        showCount
                        maxLength={1000}
                    />
                );
            default:
                return (
                    <Input
                        value={value || ''}
                        onChange={e => handleContentChange(field.name, e.target.value)}
                        type={field.type === 'number' ? 'number' : 'text'}
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                    />
                );
        }
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            await form.validateFields();

            // Convert Map to regular object
            const contentObject = Object.fromEntries(cvData.content);

            const cvPayload = {
                ...cvData,
                content: contentObject
            };

            console.log(cvPayload);
            const response = await createCv(cvPayload as ICV);

            if (response.status === 201) {
                console.log(response);
                message.success('CV saved successfully!');
            } else {
                console.log(response);
                message.error('Failed to save CV');
            }
        } catch (error) {
            console.log(error);
            message.error('Please fill in all required fields');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div >
                <Spin size="large" tip="Loading CV builder..." />
            </div>
        );
    }

    // Group fields by section
    const groupedFields = template?.fields.reduce((acc, field) => {
        if (!acc[field.section]) {
            acc[field.section] = [];
        }
        acc[field.section].push(field);
        return acc;
    }, {} as { [key: string]: typeof template.fields }) || {};

    // Sort fields by order within each section
    Object.values(groupedFields).forEach(fields => {
        fields.sort((a, b) => a.order - b.order);
    });

    const generatePDF = async () => {
        const cvElement = document.getElementById('cv-preview');
        if (!cvElement) {
            throw new Error('Cannot find CV preview element');
        }

        const canvas = await html2canvas(cvElement, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('my-cv.pdf');
    };

    // Xử lý khi người dùng xác nhận thanh toán
    const handlePaymentConfirm = async () => {
        try {
            setProcessing(true);

            // 1. Create CV with active status
            message.loading('Creating CV...');
            await createActiveCV();

            // 2. Generate and download PDF
            message.loading('Generating PDF...');
            await generatePDF();

            message.success('CV downloaded successfully!');
            setPaymentModalVisible(false);
        } catch (error) {
            console.error('Error:', error);
            message.error(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setProcessing(false);
        }
    };

    // Xử lý khi click nút download
    const downloadPDF = async () => {
        try {
            // Validate form trước khi hiện modal
            await form.validateFields();
            setPaymentModalVisible(true);
        } catch (error) {
            message.error('Please fill in all required fields');
        }
    };

    <Card style={{ marginBottom: '24px' }}>
        <Space>
            <Button
                type={activeTab === 'edit' ? 'primary' : 'default'}
                icon={<EditOutlined />}
                onClick={() => setActiveTab('edit')}
            >
                Edit
            </Button>
            <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSubmit}
                loading={saving}
            >
                Save CV
            </Button>
            <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={downloadPDF}
            >
                Download PDF
            </Button>
        </Space>
    </Card>

    return (
        <Layout style={{ minHeight: '100vh', padding: '24px', background: '#f0f2f5' }}>
            <Content style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={8}>
                        <Affix offsetTop={20}>
                            <Card style={{ marginBottom: '24px' }}>
                                <Space>
                                    <Button
                                        type={activeTab === 'edit' ? 'primary' : 'default'}
                                        icon={<EditOutlined />}
                                        onClick={() => setActiveTab('edit')}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        type="primary"
                                        icon={<SaveOutlined />}
                                        onClick={handleSubmit}
                                        loading={saving}
                                    >
                                        Save CV
                                    </Button>

                                </Space>
                            </Card>
                        </Affix>

                        <div style={{ background: 'white', padding: '24px', borderRadius: '8px' }}>
                            <Form
                                form={form}
                                layout="vertical"
                            >
                                <Tabs
                                    type="card"
                                    style={{ marginBottom: '24px' }}
                                    items={Object.entries(groupedFields).map(([section, fields]) => ({
                                        key: section,
                                        label: (
                                            <Space>
                                                {getSectionIcon(section)}
                                                {section.charAt(0).toUpperCase() + section.slice(1)}
                                            </Space>
                                        ),
                                        children: renderSectionCard(section, fields)
                                    }))}
                                />
                            </Form>
                        </div>
                    </Col>

                    <Col xs={24} lg={16}>
                        <Affix offsetTop={20}>
                            <Card
                                title={
                                    <Space>
                                        <EyeOutlined />
                                        Preview
                                    </Space>
                                }
                                style={{
                                    width: '100%',
                                    height: 'calc(100vh - 40px)', // Chiều cao cố định
                                    overflow: 'hidden' // Ẩn overflow của Card
                                }}
                                bodyStyle={{
                                    padding: '0',
                                    height: '100%',
                                    overflow: 'auto' // Cho phép cuộn nội dung
                                }}
                            >
                                {template && <div id="cv-preview">  {/* Add this wrapper div with ID */}
                                    <CvPreview template={template} cvData={cvData} />
                                </div>}
                            </Card>
                        </Affix>
                    </Col>
                    <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={downloadPDF}
                    >
                        Download PDF
                    </Button>
                    <PaymentConfirmModal
                        visible={paymentModalVisible}
                        onConfirm={handlePaymentConfirm}
                        onCancel={() => setPaymentModalVisible(false)}
                        loading={processing}
                    />
                </Row>
            </Content>
        </Layout>
    );
};

export default CVBuilder;