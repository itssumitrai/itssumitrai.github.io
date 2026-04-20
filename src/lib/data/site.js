import { env } from '$env/dynamic/public';

export const site = {
    name: 'Sumit Rai',
    role: 'Sr Principal Software Engineer at Yahoo',
    tagline: 'Building scalable web experiences at global scale.',
    bio: 'I lead frontend architecture and engineering for large-audience web products. I care about craft, performance, and teams that ship with clarity.',
    location: 'Sunnyvale, CA',
    profilePicture: env.PUBLIC_PROFILE_PICTURE_URL || null,
    resume: env.PUBLIC_RESUME_URL || null,
    social: {
        github: env.PUBLIC_GITHUB_URL || null,
        linkedin: env.PUBLIC_LINKEDIN_URL || null,
        email: env.PUBLIC_EMAIL ? `mailto:${env.PUBLIC_EMAIL}` : null
    },
    nav: [
        { label: 'About', href: '#about' },
        { label: 'Experience', href: '#experience' },
        { label: 'Skills', href: '#skills' },
        { label: 'Contact', href: '#contact' }
    ]
};
