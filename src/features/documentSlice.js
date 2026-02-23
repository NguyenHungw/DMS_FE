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

export const updateDocument = createAsyncThunk(
    'documents/update',
    async ({ id, data }, { dispatch, rejectWithValue }) => {
        try {
            const response = await taiLieuApi.update(id, data);
            dispatch(fetchDocuments());
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Lỗi khi cập nhật tài liệu');
        }
    }
);

export const fetchCategories = createAsyncThunk(
    'documents/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await taiLieuApi.getCategories();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Không thể tải danh mục');
        }
    }
);

export const createCategory = createAsyncThunk(
    'documents/createCategory',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await taiLieuApi.createCategory(data);
            dispatch(fetchCategories());
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Lỗi khi tạo danh mục');
        }
    }
);

const initialState = {
    items: [],
    categories: [],
    selectedItem: null,
    previewItem: null,
    loading: false,
    error: null,
    searchText: '',
    selectedCategoryId: null,
    previewVisible: false,
    drawerVisible: false,
    uploadModalVisible: false,
    editModalVisible: false,
};

const documentSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        setSearchText: (state, action) => {
            state.searchText = action.payload;
        },
        setCategoryId: (state, action) => {
            state.selectedCategoryId = action.payload;
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
        setEditModalVisible: (state, action) => {
            state.editModalVisible = action.payload;
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
            // Fetch Categories
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
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
            })
            // Update
            .addCase(updateDocument.fulfilled, (state, action) => {
                state.selectedItem = action.payload;
            });
    },
});

export const {
    setSearchText,
    setCategoryId,
    setPreviewItem,
    clearSelectedItem,
    setUploadModalVisible,
    setEditModalVisible,
    setDrawerVisible
} = documentSlice.actions;

export default documentSlice.reducer;
