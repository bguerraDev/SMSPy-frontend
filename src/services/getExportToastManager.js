// This file is for managing the toast notifications in the application. It provides a context to manage the state of the toast notifications and a custom hook to access that context.
import { createContext, useContext } from 'react';

export const ToastContext = createContext();

export function useToast() {
    return useContext(ToastContext);
}