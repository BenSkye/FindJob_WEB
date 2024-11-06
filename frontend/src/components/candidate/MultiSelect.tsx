import React from 'react';
import { Select, Tag } from 'antd';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';

interface MultiSelectProps {
    placeholder?: string;
    options: Array<{
        value: string;
        label: string;
    }>;
    value?: string[];
    onChange?: (value: string[]) => void;
    maxTagCount?: number;
    style?: React.CSSProperties;
}

const styles = {
    select: {
        width: '100%',
        height: '50px',
    },
    tag: {
        marginRight: 3,
        padding: '0 7px',
        borderRadius: '12px',
    },
};

const MultiSelect: React.FC<MultiSelectProps> = ({
    placeholder,
    options,
    value,
    onChange,
    maxTagCount = 2,
    style,
}) => {
    // Custom tag render function
    const tagRender = (props: CustomTagProps) => {
        const { label, closable, onClose } = props;
        return (
            <Tag
                style={styles.tag}
                closable={closable}
                onClose={onClose}
            >
                {label}
            </Tag>
        );
    };

    return (
        <Select
            mode="multiple"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            style={{ ...styles.select, ...style }}
            maxTagCount={maxTagCount}
            maxTagPlaceholder={(omittedValues) => `+${omittedValues.length}`}
            tagRender={tagRender}
            options={options}
            showArrow
            showSearch
        />
    );
};

export default MultiSelect;