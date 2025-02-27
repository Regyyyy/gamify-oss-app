import { Button } from "@mui/material";

export default function DangerButton({ className = '', disabled, children, ...props }) {
    return (
        <Button
            {...props}
            variant="contained"
            color="error"
            disabled={disabled}
            className={className}
            sx={{
                textTransform: 'uppercase',
                fontWeight: 'bold',
                px: 2,
                py: 0.5,
                borderRadius: '6px',
                color: 'white',
            }}
        >
            {children}
        </Button>
    );
}
