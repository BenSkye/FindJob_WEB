
export const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('vi-VN');
};



export const formatDateTime = {
    // Format: DD/MM/YYYY HH:mm
    short: (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    },

    // Format: DD tháng MM, YYYY HH:mm
    full: (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate()} tháng ${date.getMonth() + 1}, ${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    },

    // Chỉ lấy ngày tháng năm
    dateOnly: (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    },

    // Chỉ lấy giờ phút
    timeOnly: (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    },

    //nếu thời gian trong ngày thì hiện giờ, nếu ngày khác thì hiện ngày tháng, nếu năm khác thì hiện ngày tháng năm
    timeMessage: (dateString: string) => {
        const date = new Date(dateString);
        if (date.getDate() === new Date().getDate()) {
            return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        } else if (date.getFullYear() === new Date().getFullYear()) {
            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        } else {
            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        }
    }
};