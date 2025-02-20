import { Button } from "@mui/material";

export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <Button
            {...props}
            variant="contained"
            color="primary"
            disabled={disabled}
            className={className}
            type="submit"
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
