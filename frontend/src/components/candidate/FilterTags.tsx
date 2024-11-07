import React from 'react';
import { Button } from 'antd';

interface FilterTagsProps {
    filters: string[];
    activeFilter: string;
    onFilterChange: (filter: string) => void;
    color?: string;
}

const styles = {
    filterTags: {
        display: 'flex',
        gap: '8px',
        overflowX: 'auto' as const,
        padding: '4px 0',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    },
    filterButton: {
        borderRadius: '16px',
    },
};

const FilterTags: React.FC<FilterTagsProps> = ({
    filters,
    activeFilter,
    onFilterChange,
    color = '#00b14f'
}) => {
    return (
        <div style={styles.filterTags}>
            {filters.map((filter) => (
                <Button
                    key={filter}
                    type={activeFilter === filter ? 'primary' : 'default'}
                    style={{
                        ...styles.filterButton,
                        ...(activeFilter === filter && {
                            backgroundColor: color,
                            borderColor: color
                        })
                    }}
                    onClick={() => onFilterChange(filter)}
                >
                    {filter}
                </Button>
            ))}
        </div>
    );
};

export default FilterTags;