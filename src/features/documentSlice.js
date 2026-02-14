import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taiLieuApi from '../api/taiLieuApi';

export const fetchDocuments = createAsyncThunk(
    'documents/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await taiLieuApi.getAll();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Không thể tải danh sách tài liệu');
        }
    }
);

export const fetchDocumentDetail = createAsyncThunk(
    'documents/fetchDetail',
    async (id, { rejectWithValue }) => {
        try {
            const response = await taiLieuApi.getDetail(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Không thể tải chi tiết tài liệu');
        }
    }
);

export const deleteDocument = createAsyncThunk(
    'documents/delete',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            await taiLieuApi.delete(id);
            dispatch(fetchDocuments());
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Lỗi khi xóa tài liệu');
        }
    }
);

export const createDocument = createAsyncThunk(
    'documents/create',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await taiLieuApi.create(data);
            dispatch(fetchDocuments());
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Lỗi khi tạo tài liệu');
        }
    }
);

const initialState = {
    items: [],
    selectedItem: null,
    previewItem: null,
    loading: false,
    error: null,
    searchText: '',
    previewVisible: false,
    drawerVisible: false,
    uploadModalVisible: false,
};

const documentSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        setSearchText: (state, action) => {
            state.searchText = action.payload;
        },
        setPreviewItem: (state, action) => {
            state.previewItem = action.payload;
            state.previewVisible = !!action.payload;
        },
        clearSelectedItem: (state) => {
            state.selectedItem = null;
            state.drawerVisible = false;
        },
        setUploadModalVisible: (state, action) => {
            state.uploadModalVisible = action.payload;
        },
        setDrawerVisible: (state, action) => {
            state.drawerVisible = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchDocuments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDocuments.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchDocuments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Detail
            .addCase(fetchDocumentDetail.pending, (state) => {
                state.loading = false; // Don't block UI for detail load
                state.error = null;
            })
            .addCase(fetchDocumentDetail.fulfilled, (state, action) => {
                state.selectedItem = action.payload;
                state.drawerVisible = true;
            })
            .addCase(fetchDocumentDetail.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const {
    setSearchText,
    setPreviewItem,
    clearSelectedItem,
    setUploadModalVisible,
    setDrawerVisible
} = documentSlice.actions;

export default documentSlice.reducer;
