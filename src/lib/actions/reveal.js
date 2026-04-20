export function reveal(node, options = {}) {
    const { threshold = 0.15, rootMargin = '0px 0px -10% 0px' } = options;

    if (typeof IntersectionObserver === 'undefined') {
        node.classList.add('is-revealed');
        return;
    }

    const observer = new IntersectionObserver(
        ([entry], obs) => {
            if (entry.isIntersecting) {
                node.classList.add('is-revealed');
                obs.unobserve(node);
            }
        },
        { threshold, rootMargin }
    );

    observer.observe(node);

    return {
        destroy() {
            observer.disconnect();
        }
    };
}
