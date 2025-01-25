'use client'; // Marks this as a client component

import React from 'react';
import { Provider } from 'react-redux';
import store from '../store/store';

const ProviderWrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
};

export default ProviderWrapper;
