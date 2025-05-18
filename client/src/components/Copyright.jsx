import { useState, useEffect } from "react";
import { Link, Typography } from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';

function formatDate(date) {
  const day = date.getDate();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export default function Copyright() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString();

  return (
    <Typography
      mt={-2}
      variant="body2"
      align="center"
      sx={{
        color: 'text.secondary',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
        flexWrap: 'wrap',
      }}
    >
      <span>{formatDate(currentTime)} {timeString}</span>

      <Link
        href="https://github.com/pratikabhang"
        target="_blank"
        rel="noopener noreferrer"
        underline="none"
        sx={{
          color: 'text.secondary',
          cursor: 'pointer',
          '&:hover, &:focus': {
            textDecoration: 'none',
            backgroundColor: 'transparent',
          },
        }}
      >
        © PRATIK ABHANG
      </Link>
    </Typography>
  );
}
