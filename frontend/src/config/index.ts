export const JOB_TYPES = {
    FULL_TIME: 'full-time',
    PART_TIME: 'part-time',
    CONTRACT: 'contract',
    INTERNSHIP: 'internship',
    REMOTE: 'remote'
} as const;

export const JOB_TYPE_LABELS = {
    [JOB_TYPES.FULL_TIME]: 'Toàn thời gian',
    [JOB_TYPES.PART_TIME]: 'Bán thời gian',
    [JOB_TYPES.CONTRACT]: 'Hợp đồng',
    [JOB_TYPES.INTERNSHIP]: 'Thực tập',
    [JOB_TYPES.REMOTE]: 'Từ xa'
} as const;

export const JOB_TYPE_OPTIONS = [
    { value: JOB_TYPES.FULL_TIME, label: JOB_TYPE_LABELS[JOB_TYPES.FULL_TIME] },
    { value: JOB_TYPES.PART_TIME, label: JOB_TYPE_LABELS[JOB_TYPES.PART_TIME] },
    { value: JOB_TYPES.CONTRACT, label: JOB_TYPE_LABELS[JOB_TYPES.CONTRACT] },
    { value: JOB_TYPES.INTERNSHIP, label: JOB_TYPE_LABELS[JOB_TYPES.INTERNSHIP] },
    { value: JOB_TYPES.REMOTE, label: JOB_TYPE_LABELS[JOB_TYPES.REMOTE] }
];


export const JOB_STATUS = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    CLOSED: 'closed',
    EXPIRED: 'expired'
} as const;

export const JOB_STATUS_LABELS = {
    [JOB_STATUS.DRAFT]: 'Nháp',
    [JOB_STATUS.PUBLISHED]: 'Đã đăng',
    [JOB_STATUS.CLOSED]: 'Đã đóng',
    [JOB_STATUS.EXPIRED]: 'Hết hạn'
} as const;

export const JOB_STATUS_COLORS = {
    [JOB_STATUS.DRAFT]: 'default',
    [JOB_STATUS.PUBLISHED]: 'success',
    [JOB_STATUS.CLOSED]: 'error',
    [JOB_STATUS.EXPIRED]: 'warning'
} as const;