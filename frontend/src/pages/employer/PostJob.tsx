import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, DatePicker, InputNumber, Switch, Button, message } from 'antd';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getListCategory } from '../../services/api/categoryService';
import { getListLevel } from '../../services/api/levelService';
import { createJob } from '../../services/api/jobService';
import './PostJob.css';

const { Option } = Select;

const PostJob = () => {
    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isNegotiable, setIsNegotiable] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, levelsRes] = await Promise.all([
                    getListCategory(),
                    getListLevel()
                ]);
                setCategories(categoriesRes.metadata);
                setLevels(levelsRes.metadata);
            } catch (error) {
                message.error('Lỗi khi tải dữ liệu');
            }
        };
        fetchData();
    }, []);

    const handleNegotiableChange = (checked: boolean) => {
        setIsNegotiable(checked);
        if (checked) {
            // Nếu bật lương thỏa thuận, xóa giá trị lương min/max
            form.setFieldsValue({
                salaryMin: undefined,
                salaryMax: undefined
            });
        }
    };

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            const jobData = {
                ...values,
                salary: {
                    min: values.salaryMin,
                    max: values.salaryMax,
                    negotiable: values.negotiable
                },
            };
            delete jobData.salaryMin;
            delete jobData.salaryMax;

            await createJob(jobData);
            message.success('Tạo tin tuyển dụng thành công');
            form.resetFields();
        } catch (error) {
            message.error('Lỗi khi tạo tin tuyển dụng');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="post-job-container">
            <Card className="post-job-card" title="Đăng tin tuyển dụng">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="title"
                        label="Tiêu đề công việc"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề công việc' }]}
                    >
                        <Input placeholder="Nhập tiêu đề công việc" />
                    </Form.Item>

                    <Form.Item
                        name="mainCategory"
                        label="Ngành nghề"
                        rules={[{ required: true, message: 'Vui lòng chọn ngành nghề' }]}
                    >
                        <Select
                            placeholder="Chọn ngành nghề"
                            onChange={(value, option: any) => setSelectedCategory(option)}
                        >
                            {categories.map((category: any) => (
                                <Option key={category._id} value={category._id} subCategories={category.subCategories}>
                                    {category.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="subCategory"
                        label="Chuyên ngành"
                        rules={[{ required: true, message: 'Vui lòng chọn chuyên ngành' }]}
                    >
                        <Select placeholder="Chọn chuyên ngành" disabled={!selectedCategory}>
                            {selectedCategory?.subCategories?.map((sub: any) => (
                                <Option key={sub} value={sub.name}>{sub.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="requirements"
                        label="Yêu cầu công việc"
                        rules={[{ required: true, message: 'Vui lòng nhập yêu cầu công việc' }]}
                    >
                        <CKEditor
                            editor={ClassicEditor}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                form.setFieldsValue({ requirements: data });
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả công việc"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả công việc' }]}
                    >
                        <CKEditor
                            editor={ClassicEditor}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                form.setFieldsValue({ description: data });
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="negotiable"
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren="Lương thỏa thuận"
                            unCheckedChildren="Lương cố định"
                            onChange={handleNegotiableChange}
                        />
                    </Form.Item>

                    {!isNegotiable && (
                        <Form.Item label="Mức lương">
                            <Input.Group compact>
                                <Form.Item
                                    name="salaryMin"
                                    rules={[{ required: true, message: 'Vui lòng nhập mức lương tối thiểu' }]}
                                    style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        placeholder="Lương tối thiểu"
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>
                                <span style={{ display: 'inline-block', width: '24px', lineHeight: '32px', textAlign: 'center' }}>-</span>
                                <Form.Item
                                    name="salaryMax"
                                    rules={[{ required: true, message: 'Vui lòng nhập mức lương tối đa' }]}
                                    style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        placeholder="Lương tối đa"
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>
                            </Input.Group>
                        </Form.Item>
                    )}
                    <Form.Item
                        name="benefits"
                        label="Phúc lợi"
                        rules={[{ required: true, message: 'Vui lòng nhập phúc lợi' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Nhập phúc lợi" />
                    </Form.Item>

                    <Form.Item
                        name="location"
                        label="Địa điểm làm việc"
                        rules={[{ required: true, message: 'Vui lòng nhập địa điểm làm việc' }]}
                    >
                        <Input placeholder="Nhập địa điểm làm việc" />
                    </Form.Item>

                    <Form.Item
                        name="jobType"
                        label="Loại công việc"
                        rules={[{ required: true, message: 'Vui lòng chọn loại công việc' }]}
                    >
                        <Select placeholder="Chọn loại công việc">
                            <Option value="full-time">Toàn thời gian</Option>
                            <Option value="part-time">Bán thời gian</Option>
                            <Option value="contract">Hợp đồng</Option>
                            <Option value="internship">Thực tập</Option>
                            <Option value="remote">Từ xa</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="level"
                        label="Cấp bậc"
                        rules={[{ required: true, message: 'Vui lòng chọn cấp bậc' }]}
                    >
                        <Select placeholder="Chọn cấp bậc">
                            {levels.map((level: any) => (
                                <Option key={level._id} value={level._id}>
                                    {level.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="expiryDate"
                        label="Ngày hết hạn"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="isHot"
                        valuePropName="checked"
                        label="Tin tuyển dụng gấp"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Đăng tin
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default PostJob;
