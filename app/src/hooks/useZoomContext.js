import { useContext } from 'react';
import { ZoomContext } from '../context/zoomContext.js';

export const useZoomContext = () => {
    const context = useContext(ZoomContext);

    if(!context) {
        throw Error('useZoomContext must be used inside a ZoomContextProvider');
    }

    return context;
}