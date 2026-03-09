'use client';

import { useEffect } from 'react';

interface AdSlotProps {
    slot?: string;
    format?: 'auto' | 'fluid' | 'rectangle';
    responsive?: 'true' | 'false';
    className?: string;
}

const AdSlot = ({
    slot = 'default-slot', // Replace with real slot IDs when available
    format = 'auto',
    responsive = 'true',
    className = ''
}: AdSlotProps) => {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

    return (
        <div className={`my-8 flex justify-center overflow-hidden min-h-[100px] w-full bg-muted/30 rounded-lg p-2 ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block', minWidth: '250px' }}
                data-ad-client="ca-pub-4456192191942998"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive}
            />
        </div>
    );
};

export default AdSlot;
