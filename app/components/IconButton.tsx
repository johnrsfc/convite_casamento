import Link from 'next/link';

interface IconButtonProps {
    icon: React.ReactNode;
    label: string;
    href: string;
}

export default function IconButton({ icon, label, href }: IconButtonProps) {
    return (
        <Link href={href} className="nav-icon-btn">
            <div className="icon-circle">
                {icon}
            </div>
            <span className="nav-icon-label">{label}</span>
        </Link>
    );
}
