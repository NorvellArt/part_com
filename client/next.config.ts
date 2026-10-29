import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    async rewrites() {
        return [
            {
                source: '/api/:path((?!auth).*)*',
                destination: 'http://localhost:5286/api/:path*',
            },
            {
                source: '/images/:path*',
                destination: 'http://localhost:5286/images/:path*',
            },
        ];
    },
};

export default nextConfig;
