/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@supabase/supabase-js': '@supabase/supabase-js/dist/module/index.js',
        }
        return config;
    },
};

export default nextConfig;
