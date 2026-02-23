import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taiLieuApi from '../api/taiLieuApi';
import nguoiDungApi from '../api/nguoiDungApi';
import nhatKyApi from '../api/nhatKyApi';
import thongBaoApi from '../api/thongBaoApi';

export const fetchDashboardData = createAsyncThunk(
    'dashboard/fetchData',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const currentUser = auth.user;
            const isAdmin = currentUser?.role === 'Administrator';

            const [docs, users, pending, announcements] = await Promise.all([
                taiLieuApi.getAll(),
                isAdmin ? nguoiDungApi.getAll().catch(() => []) : Promise.resolve([]),
                isAdmin ? taiLieuApi.getPending().catch(() => []) : Promise.resolve([]),
                thongBaoApi.getAll().catch(() => [])
            ]);

            let recentActivities = [];
            if (isAdmin) {
                try {
                    const logs = await nhatKyApi.getAll();
                    recentActivities = logs.slice(0, 10).map(log => ({
                        id: log.id,
                        user: log.nguoiDung?.hoTen || 'System',
                        action: log.hanHdong,
                        hanhDong: log.hanhDong,
                        target: log.doiTuong,
                        time: new Date(log.ngayTao).toLocaleString()
                    }));
                } catch (logError) {
                    console.warn('Activities restricted:', logError);
                }
            }

            const userDocs = docs.filter(d => d.chuSoHuuId === currentUser?.id);

            return {
                stats: {
                    totalDocs: docs.length,
                    infoShares: announcements.length,
                    activeUsers: users.length,
                    userDocsCount: userDocs.length,
                    newSharesCount: announcements.length, // Using total announcements as shares for now
                },
                recentActivities,
                pendingApprovals: pending,
                userDocs: userDocs.slice(0, 5) // For recent docs widget
            };
        } catch (error) {
            return rejectWithValue('Lỗi khi tải dữ liệu dashboard');
        }
    }
);

const initialState = {
    stats: {
        totalDocs: 0,
        infoShares: 0,
        activeUsers: 0,
        userDocsCount: 0,
        newSharesCount: 0,
    },
    recentActivities: [],
    pendingApprovals: [],
    userDocs: [],
    loading: false,
    error: null,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload.stats;
                state.recentActivities = action.payload.recentActivities;
                state.pendingApprovals = action.payload.pendingApprovals;
                state.userDocs = action.payload.userDocs || [];
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default dashboardSlice.reducer;
