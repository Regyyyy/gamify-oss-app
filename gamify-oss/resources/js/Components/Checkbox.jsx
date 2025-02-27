import { useTheme } from '@mui/material/styles';

export default function Checkbox({ className = '', ...props }) {
    const theme = useTheme();

    return (
        <input
            {...props}
            type="checkbox"
            className={`rounded border-gray-300 shadow-sm focus:ring-2 focus:ring-offset-2 ${className}`}
            style={{
                accentColor: theme.palette.primary.main, // Use the primary color from your theme.js
            }}
        />
    );
}
