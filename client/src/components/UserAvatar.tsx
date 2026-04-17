type Props = {
    username: string;
    avatarFilename: string | null | undefined;
    size?: number;
    style?: React.CSSProperties;
    className?: string;
};

export default function UserAvatar({ username, avatarFilename, size = 40, style, className }: Props) {
    const base: React.CSSProperties = {
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
    };

    if (avatarFilename) {
        return (
            <img
                src={`http://localhost:8000/resources/${avatarFilename}`}
                alt={`${username}'s avatar`}
                className={className}
                style={{ ...base, objectFit: "cover" }}
            />
        );
    }

    return (
        <div
            className={className}
            style={{
                ...base,
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                color: "#fff",
                fontSize: Math.round(size * 0.42),
                fontWeight: 700,
                userSelect: "none",
                objectFit: undefined,
            }}
        >
            {username.charAt(0).toUpperCase()}
        </div>
    );
}
