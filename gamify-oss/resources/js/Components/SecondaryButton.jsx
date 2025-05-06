import { Button } from "@mui/material";

export default function SecondaryButton({ className = '', disabled, children, ...props }) {
    return (
        <Button
            {...props}
            variant="outlined"
            color="primary"
            disabled={disabled}
            className={className}
            sx={{
                textTransform: 'uppercase',
                fontWeight: 'bold',
                px: 2,
                py: 0.5,
                borderRadius: '6px',
            }}
        >
            {children}
        </Button>
    );
}