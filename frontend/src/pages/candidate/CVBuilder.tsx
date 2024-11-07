import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ICv } from '../../services/types/cv.types';
import { ITemplate } from '../../services/types/template.types';
import { getTemplateById } from '../../services/api/templateApi';
import CvPreview from '../../components/template/CvPreview';
import { Layout, Row, Col, Form, Input, Button, Card, Select } from 'antd';
import ImageUploader from '../../components/upload/ImageUploader';
import { FIREBASE_STORAGE_PATH } from '../../utils/constants';
import { createCv } from '../../services/api/cvApi';

const { Content } = Layout;

const CVBuilder = () => {
    const { templateId } = useParams();
    const [template, setTemplate] = useState<ITemplate | null>(null);
    const [cvData, setCvData] = useState<ICv>({
        templateId: templateId || '',
        fullName: '',
        email: '',
        phone: '',
        address: '',
        avatar: '',
        level: '',
        jobTitle: '',
        jobType: '',
        jobDescription: '',
        skills: [],
        experiences: [],
        education: '',
        salaryExpectation: 0,
        status: 'draft',
        isPaid: false
    });

    useEffect(() => {
        const fetchTemplate = async () => {
            if (templateId) {
                try {
                    const response = await getTemplateById(templateId);
                    setTemplate(response.metadata);
                } catch (error) {
                    console.error('Error fetching template:', error);
                }
            }
        };
        fetchTemplate();
    }, [templateId]);

    const handleAvatarUploadSuccess = (urls: string[]) => {
        setCvData(prev => ({
            ...prev,
            avatar: urls[0] || '' // Assuming only one avatar is uploaded
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCvData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleArrayInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: 'skills' | 'experiences') => {
        const values = e.target.value.split('\n').filter(item => item.trim() !== '');
        setCvData(prev => ({
            ...prev,
            [field]: values
        }));
    };

    const handleCvDataChange = (field: keyof ICv, value: string | number | string[]) => {
        setCvData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Implement CV submission logic here
        console.log('CV Data:', cvData);
    };



    return (
        <Layout>
            <Content style={{ padding: '50px' }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card title="Thông tin CV" bordered={false}>
                            <Form layout="vertical" onFinish={handleSubmit}>
                                <Form.Item label="Ảnh đại diện">
                                    <ImageUploader
                                        onUploadSuccess={handleAvatarUploadSuccess}
                                        maxCount={1}
                                        storagePath={`${FIREBASE_STORAGE_PATH.AVATAR_ME}/${templateId}`}
                                    />
                                </Form.Item>

                                <Form.Item label="Họ và tên">
                                    <Input
                                        name="fullName"
                                        value={cvData.fullName}
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item label="Email">
                                    <Input
                                        name="email"
                                        type="email"
                                        value={cvData.email}
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item label="Số điện thoại">
                                    <Input
                                        name="phone"
                                        type="tel"
                                        value={cvData.phone}
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item label="Địa chỉ">
                                    <Input
                                        name="address"
                                        value={cvData.address}
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item label="Cấp bậc">
                                    <Input
                                        name="level"
                                        value={cvData.level}
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item label="Vị trí công việc">
                                    <Input
                                        name="jobTitle"
                                        value={cvData.jobTitle}
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item label="Loại công việc">
                                    <Input
                                        name="jobType"
                                        value={cvData.jobType}
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item label="Mô tả công việc">
                                    <Input.TextArea
                                        name="jobDescription"
                                        rows={4}
                                        value={cvData.jobDescription}
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item label="Kỹ năng">
                                    <Select
                                        mode="tags"
                                        style={{ width: '100%' }}
                                        placeholder="Nhập kỹ năng và nhấn Enter"
                                        value={cvData.skills}
                                        onChange={(value) => handleCvDataChange('skills', value)}
                                    />
                                </Form.Item>
                                <Form.Item label="Kinh nghiệm">
                                    <Select
                                        mode="tags"
                                        style={{ width: '100%' }}
                                        placeholder="Nhập kinh nghiệm và nhấn Enter"
                                        value={cvData.experiences}
                                        onChange={(value) => handleCvDataChange('experiences', value)}
                                    />
                                </Form.Item>

                                <Form.Item label="Học vấn">
                                    <Input.TextArea
                                        name="education"
                                        rows={4}
                                        value={cvData.education}
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>
                                <Form.Item label="Mức lương mong muốn">
                                    <Input
                                        name="salaryExpectation"
                                        type="number"
                                        value={cvData.salaryExpectation}
                                        onChange={handleInputChange}
                                        addonAfter="$"
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block>
                                        Lưu CV
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Xem trước CV" bordered={false}>
                            {template && (
                                <CvPreview
                                    template={template}
                                    data={cvData}
                                    onDataChange={handleCvDataChange}
                                />
                            )}
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default CVBuilder;