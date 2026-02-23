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
            "live_stream": "Live Stream",
            "no_activities": "No activities records accessible or found.",
            "requiring_attention": "Requiring Your Attention",
            "view_all": "View All",
            "handle": "Handle",
            "all_clear": "All clear! No pending approvals.",
            "storage_usage": "Storage Usage Overview",
            "total_used": "Total Used",
            "settings_title": "System Settings",
            "dark_mode": "Dark Mode",
            "language": "Language",
            "save_changes": "Save All Changes",
            "profile": "Profile",
            "logout": "Logout",
            "doc_mgmt": "Document Management",
            "user_mgmt": "User Management",
            "perms_mgmt": "Permissions Management",
            "internal_chat": "Internal Chat",
            "chat_placeholder": "Type your message here...",
            "welcome_back": "Welcome back!",
            "dashboard_subtitle": "Here's what's happening in your document management system today.",
            "documents": "Documents",
            "information_sharing": "Information Sharing",
            "quick_actions": "Quick Actions",
            "settings": "Settings"
        }
    },
    vi: {
        translation: {
            "dashboard_title": "Tổng quan hệ thống",
            "total_docs": "Tổng số tài liệu",
            "info_shares": "Chia sẻ thông tin",
            "active_users": "Người dùng hoạt động",
            "storage_allocation": "Phân bổ lưu trữ",
            "recent_activities": "Hoạt động hệ thống",
            "live_stream": "Trực tiếp",
            "no_activities": "Không có hồ sơ hoạt động nào được tìm thấy.",
            "requiring_attention": "Cần bạn xử lý",
            "view_all": "Xem tất cả",
            "handle": "Xử lý",
            "all_clear": "Đã hoàn thành! Không có tài liệu chờ duyệt.",
            "storage_usage": "Tổng quan dung lượng",
            "total_used": "Đã sử dụng",
            "settings_title": "Cài đặt hệ thống",
            "dark_mode": "Chế độ tối",
            "language": "Ngôn ngữ",
            "save_changes": "Lưu tất cả thay đổi",
            "profile": "Trang cá nhân",
            "logout": "Đăng xuất",
            "doc_mgmt": "Quản lý tài liệu",
            "user_mgmt": "Quản lý người dùng",
            "perms_mgmt": "Quản lý phân quyền",
            "internal_chat": "Trò chuyện nội bộ",
            "chat_placeholder": "Nhập tin nhắn của bạn...",
            "welcome_back": "Chào mừng trở lại!",
            "dashboard_subtitle": "Dưới đây là tóm tắt các hoạt động trong hệ thống quản lý tài liệu hôm nay.",
            "documents": "Tài liệu",
            "information_sharing": "Chia sẻ thông tin",
            "quick_actions": "Thao tác nhanh",
            "settings": "Cài đặt"
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
