import type { ThemeConfig } from 'antd';

// Brand Colors - Màu thương hiệu
const BRAND = {
  primary: {
    lighter: '#FFF3E0', // Màu nền nhạt nhất
    light: '#FFB74D',   // Màu cam nhạt
    main: '#FF9800',    // Màu cam chính
    dark: '#F57C00',    // Màu cam đậm
    darker: '#E65100',  // Màu cam đậm nhất
    contrast: '#ffffff' // Màu chữ trên nền cam
  },
  secondary: {
    lighter: '#E3F2FD',
    light: '#64B5F6',
    main: '#2196F3',    // Màu xanh dương làm màu phụ
    dark: '#1976D2',
    darker: '#0D47A1',
    contrast: '#ffffff'
  }
};

// Neutral Colors - Màu trung tính
const NEUTRAL = {
  0: '#ffffff',
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#eeeeee',
  300: '#e0e0e0',
  400: '#bdbdbd',
  500: '#9e9e9e',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
};

// Status Colors - Màu trạng thái
const STATUS = {
  success: {
    lighter: '#E8F5E9',
    light: '#81C784',
    main: '#4CAF50',
    dark: '#388E3C',
    darker: '#1B5E20',
    contrast: '#ffffff'
  },
  warning: {
    lighter: '#FFF3E0',
    light: '#FFB74D',
    main: '#FF9800',
    dark: '#F57C00',
    darker: '#E65100',
    contrast: '#ffffff'
  },
  error: {
    lighter: '#FFEBEE',
    light: '#E57373',
    main: '#F44336',
    dark: '#D32F2F',
    darker: '#B71C1C',
    contrast: '#ffffff'
  },
  info: {
    lighter: '#E3F2FD',
    light: '#64B5F6',
    main: '#2196F3',
    dark: '#1976D2',
    darker: '#0D47A1',
    contrast: '#ffffff'
  }
};

// Gradients - Màu gradient
const GRADIENTS = {
  primary: {
    light: 'linear-gradient(135deg, #FFB74D 0%, #FF9800 100%)',
    main: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
    dark: 'linear-gradient(135deg, #F57C00 0%, #E65100 100%)',
  },
  secondary: {
    light: 'linear-gradient(135deg, #64B5F6 0%, #2196F3 100%)',
    main: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
    dark: 'linear-gradient(135deg, #1976D2 0%, #0D47A1 100%)',
  },
  success: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
  warning: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
  error: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
  info: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
  dark: 'linear-gradient(135deg, #424242 0%, #212121 100%)',
};

const theme: ThemeConfig = {
  token: {
    // Brand Colors
    colorPrimary: BRAND.primary.main,
    colorPrimaryBg: BRAND.primary.lighter,
    colorPrimaryBgHover: BRAND.primary.light,
    colorPrimaryBorder: BRAND.primary.light,
    colorPrimaryBorderHover: BRAND.primary.main,
    colorPrimaryHover: BRAND.primary.light,
    colorPrimaryActive: BRAND.primary.dark,
    colorPrimaryTextHover: BRAND.primary.light,
    colorPrimaryText: BRAND.primary.main,
    colorPrimaryTextActive: BRAND.primary.dark,
    
    // Text Colors
    colorText: NEUTRAL[900],
    colorTextSecondary: NEUTRAL[700],
    colorTextDescription: NEUTRAL[500],
    colorTextDisabled: NEUTRAL[400],
    colorTextPlaceholder: NEUTRAL[400],
    
    // Background Colors
    colorBgContainer: NEUTRAL[0],
    colorBgElevated: NEUTRAL[0],
    colorBgLayout: NEUTRAL[50],
    colorBgSpotlight: NEUTRAL[100],
    colorBgMask: 'rgba(0, 0, 0, 0.45)',
    
    // Border Colors
    colorBorder: NEUTRAL[200],
    colorBorderSecondary: NEUTRAL[300],
    
    // Status Colors
    colorSuccess: STATUS.success.main,
    colorWarning: STATUS.warning.main,
    colorError: STATUS.error.main,
    colorInfo: STATUS.info.main,
    
    // Link Colors
    colorLink: BRAND.secondary.main,
    colorLinkHover: BRAND.secondary.light,
    colorLinkActive: BRAND.secondary.dark,

    // Font Settings
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    fontSizeSM: 12,
    fontSizeLG: 16,
    fontSizeXL: 20,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,

    // Line Heights
    lineHeight: 1.5715,
    lineHeightLG: 1.5,
    lineHeightSM: 1.66,

    // Border Radius
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,
    borderRadiusXS: 2,

    // Spacing
    marginXS: 8,
    marginSM: 12,
    margin: 16,
    marginMD: 20,
    marginLG: 24,
    marginXL: 32,

    // Box Shadows
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
    boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
  },
  
  components: {
    Button: {
      borderRadius: 6,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      paddingContentHorizontal: 24,
      paddingContentHorizontalSM: 16,
      paddingContentHorizontalLG: 32,
      algorithm: true,
    },
    
    Input: {
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      borderRadius: 6,
      paddingInline: 16,
      algorithm: true,
    },
    
    Select: {
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      borderRadius: 6,
      algorithm: true,
    },
    
    Card: {
      borderRadius: 12,
      padding: 24,
      algorithm: true,
    },
    
    Menu: {
      itemHeight: 40,
      itemHoverBg: BRAND.primary.lighter,
      itemSelectedBg: BRAND.primary.light,
      algorithm: true,
    },
    
    Table: {
      borderRadius: 8,
      algorithm: true,
    },
    
    Modal: {
      borderRadius: 12,
      paddingContentHorizontalLG: 32,
      algorithm: true,
    },
    
    Drawer: {
      borderRadius: 12,
      algorithm: true,
    },
  },
};

export const colors = {
  brand: BRAND,
  neutral: NEUTRAL,
  status: STATUS,
  gradients: GRADIENTS,
  
  text: {
    primary: NEUTRAL[900],
    secondary: NEUTRAL[700],
    disabled: NEUTRAL[400],
    inverse: NEUTRAL[0],
  },
  
  background: {
    default: NEUTRAL[50],
    paper: NEUTRAL[0],
    spotlight: NEUTRAL[100],
  },
  
  border: {
    light: NEUTRAL[200],
    main: NEUTRAL[300],
    dark: NEUTRAL[400],
  },
  
  action: {
    hover: 'rgba(0, 0, 0, 0.04)',
    selected: 'rgba(0, 0, 0, 0.08)',
    disabled: 'rgba(0, 0, 0, 0.26)',
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
    focus: 'rgba(0, 0, 0, 0.12)',
  },
};

export default theme;