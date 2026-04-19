import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            fallback: null,
            precompress: false,
            strict: true
        }),
        prerender: {
            // TODO: remove once static/resume.pdf is added
            handleHttpError: ({ path, message }) => {
                if (path === '/resume.pdf') return;
                throw new Error(message);
            }
        }
    }
};

export default config;
