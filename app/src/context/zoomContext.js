import { createContext, useReducer } from 'react';

export const ZoomContext = createContext();

export const zoomReducer = (state, action) => {
    switch(action.type) {
        case 'SET_ID':
            return {
                id: action.payload
            }
        case 'SET_JWT':
            return {
                jwt: action.payload
            }
        case 'SET_KEY':
            return {
                key: action.payload
            }
        case 'SET_PASS':
            return {
                pass: action.payload
            }
        default:
            return state
    }
}

export const ZoomContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(zoomReducer, {
        id: null,
        user: 'GPTz',
        pass: null,
        key: null,
        jwt: null
    })

    return(
        <ZoomContext.Provider value={{...state, dispatch}}>
            { children }
        </ZoomContext.Provider>
    )
}