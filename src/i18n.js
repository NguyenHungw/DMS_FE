import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "dashboard_title": "System Overview",
            "total_docs": "Total Documents",
            "info_shares": "Information Shares",
            "active_users": "Active Users",
            "storage_allocation": "Storage Allocation",
            "recent_activities": "Recent System Activities",
            "settings_title": "System Settings",
            "dark_mode": "Dark Mode",
            "language": "Language",
            "save_changes": "Save All Changes",
            "profile": "Profile",
            "logout": "Logout",
            "doc_mgmt": "Document Management",
            "user_mgmt": "User Management",
            "internal_chat": "Internal Chat",
            "chat_placeholder": "Type your message here...",
        }
    },
    vi: {
        translation: {
            "dashboard_title": "Tổng quan hệ thống",
            "total_docs": "Tổng số tài liệu",
            "info_shares": "Chia sẻ thông tin",
            "active_users": "Người dùng hoạt động",
            "storage_allocation": "Phân bổ lưu trữ",
            "recent_activities": "Hoạt động hệ thống gần đây",
            "settings_title": "Cài đặt hệ thống",
            "dark_mode": "Chế độ tối",
            "language": "Ngôn ngữ",
            "save_changes": "Lưu tất cả thay đổi",
            "profile": "Trang cá nhân",
            "logout": "Đăng xuất",
            "doc_mgmt": "Quản lý tài liệu",
            "user_mgmt": "Quản lý người dùng",
            "internal_chat": "Trò chuyện nội bộ",
            "chat_placeholder": "Nhập tin nhắn của bạn...",
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
