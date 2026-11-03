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

    if (!src || imageError) {
        return (
            <div
                className={`relative z-20 aspect-[4/3] w-full flex flex-col items-center justify-center bg-slate-50 border-b border-slate-100 text-slate-400 select-none p-2 ${className}`}
            >
                <div className="bg-white p-2 rounded-full border border-slate-100 shadow-sm mb-1 flex items-center justify-center">
                    <Wrench className="w-4 h-4 opacity-60 text-slate-400 stroke-[1.5]" />
                </div>
                <span className="text-[10px] font-medium tracking-wide text-slate-400/80">
                    Нет фото
                </span>
                {brand && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-primary/60 mt-0.5">
                        {brand}
                    </span>
                )}
            </div>
        );
    }

    return (
        <Image
            src={fullSrc}
            alt={alt}
            width={400} 
            height={300}
            className={`relative z-20 aspect-[4/3] w-full object-cover ${className}`}
            onError={() => setImageError(true)}
            unoptimized
        />
    );
};
