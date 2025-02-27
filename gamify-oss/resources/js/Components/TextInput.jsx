import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);
    const theme = useTheme();

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <TextField
            {...props}
            type={type}
            inputRef={localRef}
            variant="outlined"
            size="small"
            fullWidth
            sx={{
                borderRadius: '8px',
                boxShadow: theme.shadows[1],
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: theme.palette.grey[300],
                    },
                    '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                        boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
                    },
                },
            }}
        />
    );
});
