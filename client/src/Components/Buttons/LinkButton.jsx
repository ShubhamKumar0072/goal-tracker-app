import Link from "@mui/material/Link"
export default function LinkButton({link, text, bc, col="black"}) {
    return (
        <Link
            href={link}
            sx={{
                textDecoration: "none",
                backgroundColor: bc,
                color: col,
                fontSize: "22px",
                padding: "0.7rem",
                borderRadius: "10px",
                transition: "box-shadow 0.3s",
                '&:hover': {
                    boxShadow: "0 4px 16px rgba(0,0,0,0.18)"
                }
            }}
        >
            {text}
        </Link>
    );
}