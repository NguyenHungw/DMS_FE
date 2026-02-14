import React from 'react';
import { ConfigProvider, theme } from 'antd';
import { store } from './features/store';
import { Provider, useSelector } from 'react-redux';
import AppRoutes from './routes';
import './styles/global.scss';

const ThemedApp = () => {
  const { darkMode } = useSelector((state) => state.ui);

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <AppRoutes />
    </ConfigProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  );
};

export default App;
