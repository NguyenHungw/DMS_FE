import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taiLieuApi from '../api/taiLieuApi';
import nguoiDungApi from '../api/nguoiDungApi';
import nhatKyApi from '../api/nhatKyApi';

export const fetchDashboardData = createAsyncThunk(
    'dashboard/fetchData',
    async (_, { rejectWithValue }) => {
        try {
            const [docs, users] = await Promise.all([
                taiLieuApi.getAll(),
                nguoiDungApi.getAll().catch(() => [])
            ]);

            let recentActivities = [];
            try {
                const logs = await nhatKyApi.getAll();
                recentActivities = logs.slice(0, 10).map(log => ({
                    id: log.id,
                    user: log.nguoiDung?.hoTen || 'System',
                    action: log.hanHdong, // Note: fixing typo if exists in dashboard.jsx it was item.action
                    hanhDong: log.hanhDong,
                    target: log.doiTuong,
                    time: new Date(log.ngayTao).toLocaleString()
                }));
            } catch (logError) {
                console.warn('Activities restricted:', logError);
            }

            return {
                stats: {
                    totalDocs: docs.length,
                    infoShares: 0,
                    activeUsers: users.length,
                },
                recentActivities
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
    },
    recentActivities: [],
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
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default dashboardSlice.reducer;
