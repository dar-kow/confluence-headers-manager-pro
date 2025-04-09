import { useState, useCallback } from 'react';

interface FormState {
    parentPageUrl: string;
    useAutoDetect: boolean;
    manualUrls: string;
    headersAsHeadings: boolean;
    childPageIds: string[];
}

interface UseFormProps {
    initialState?: Partial<FormState>;
    onSubmit?: (formData: FormState) => void;
}

export const useForm = ({ initialState = {}, onSubmit }: UseFormProps = {}) => {
    // Form state w/ default vals
    const [formState, setFormState] = useState<FormState>({
        parentPageUrl: '',
        useAutoDetect: false,
        manualUrls: '',
        headersAsHeadings: false,
        childPageIds: [],
        ...initialState
    });

    // Handle change for singel field
    const handleChange = useCallback(<K extends keyof FormState>(field: K, value: FormState[K]) => {
        setFormState(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    // Set buncha values at once
    const setValues = useCallback((values: Partial<FormState>) => {
        setFormState(prev => ({
            ...prev,
            ...values
        }));
    }, []);

    // Reset form to initial state
    const resetForm = useCallback(() => {
        setFormState({
            parentPageUrl: '',
            useAutoDetect: false,
            manualUrls: '',
            headersAsHeadings: false,
            childPageIds: [],
            ...initialState
        });
    }, [initialState]);

    // Handle form submit
    const handleSubmit = useCallback((e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }

        if (onSubmit) {
            onSubmit(formState);
        }
    }, [formState, onSubmit]);

    // Check if form is valid
    const isValid = useCallback(() => {
        // Parent page is required
        if (!formState.parentPageUrl.trim()) {
            return false;
        }

        // If using auto detect, need at least one child page ID
        if (formState.useAutoDetect && formState.childPageIds.length === 0) {
            return false;
        }

        // If manually entering pages, need at least one URL
        if (!formState.useAutoDetect && !formState.manualUrls.trim()) {
            return false;
        }

        return true;
    }, [formState]);

    return {
        formState,
        handleChange,
        setValues,
        resetForm,
        handleSubmit,
        isValid
    };
};