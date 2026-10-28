'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Wrench } from 'lucide-react';

interface ProductImageProps {
    src?: string | null;
    alt: string;
    brand?: string;
    className?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
    src,
    alt,
    brand,
    className = '',
}) => {
    const [imageError, setImageError] = useState(false);

    const safeSrc = src ?? '';
    const internalApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5286';
    const fullSrc = safeSrc.startsWith('/') ? `${internalApiUrl}${safeSrc}` : safeSrc;
    console.log('fullSrc', fullSrc)

    if (!src || imageError) {
        return (
            <div
                className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-400 select-none overflow-hidden ${className}`}
            >
                <Wrench className="w-8 h-8 opacity-40 mb-1 stroke-[1.5]" />
                {brand && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider opacity-60">
                        {brand}
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${className}`}>
            <Image
                src={fullSrc}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setImageError(true)}
                unoptimized
            />
        </div>
    );
};
