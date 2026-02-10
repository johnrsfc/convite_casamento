'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const MusicPlayer = dynamic(() => import('./MusicPlayer'), { ssr: false });

export default function MusicWrapper() {
    const pathname = usePathname();

    // Não mostra na página de pagamento (checkout)
    if (pathname?.includes('/checkout')) return null;

    return <MusicPlayer />;
}
