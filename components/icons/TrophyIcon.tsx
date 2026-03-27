interface TrophyIconProps {
  variant: "gold" | "silver" | "bronze";
  className?: string;
}

const colors = {
  gold: "#FFD700",
  silver: "#C0C0C0",
  bronze: "#CD7F32",
};

export default function TrophyIcon({ variant, className }: TrophyIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={colors[variant]}
      className={className || "w-5 h-5"}
    >
      <path d="M5 3h14v2h-1v1a7.003 7.003 0 01-5 6.71V15h2a3 3 0 013 3v1H6v-1a3 3 0 013-3h2v-2.29A7.003 7.003 0 016 6V5H5V3zm3 3a5 5 0 005 5 5 5 0 005-5V5H8v1zM4 5H2v3a3 3 0 003 3V8a5.002 5.002 0 01-1-3V5zm16 0v3a5.002 5.002 0 01-1 3v3a3 3 0 003-3V5h-2z" />
    </svg>
  );
}
