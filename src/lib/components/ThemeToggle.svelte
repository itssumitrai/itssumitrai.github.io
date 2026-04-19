<script>
    import { preference } from '$lib/stores/theme.js';

    const options = [
        { value: 'light', label: 'Light theme' },
        { value: 'system', label: 'System theme' },
        { value: 'dark', label: 'Dark theme' }
    ];

    let buttons = [];

    function handleKeydown(e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault();
        const currentIndex = options.findIndex((o) => o.value === $preference);
        const delta = e.key === 'ArrowRight' ? 1 : -1;
        const next = (currentIndex + delta + options.length) % options.length;
        preference.set(options[next].value);
        buttons[next]?.focus();
    }
</script>

<div
    class="theme-toggle"
    role="radiogroup"
    aria-label="Color theme"
    tabindex={-1}
    on:keydown={handleKeydown}
>
    {#each options as opt, i}
        <button
            type="button"
            role="radio"
            aria-checked={$preference === opt.value}
            aria-label={opt.label}
            class:active={$preference === opt.value}
            tabindex={$preference === opt.value ? 0 : -1}
            bind:this={buttons[i]}
            on:click={() => preference.set(opt.value)}
        >
            {#if opt.value === 'light'}
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                    <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <line x1="12" y1="2" x2="12" y2="5" />
                        <line x1="12" y1="19" x2="12" y2="22" />
                        <line x1="2" y1="12" x2="5" y2="12" />
                        <line x1="19" y1="12" x2="22" y2="12" />
                        <line x1="4.9" y1="4.9" x2="7" y2="7" />
                        <line x1="17" y1="17" x2="19.1" y2="19.1" />
                        <line x1="4.9" y1="19.1" x2="7" y2="17" />
                        <line x1="17" y1="7" x2="19.1" y2="4.9" />
                    </g>
                </svg>
            {:else if opt.value === 'system'}
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <rect
                        x="3"
                        y="4"
                        width="18"
                        height="13"
                        rx="2"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    />
                    <line
                        x1="8"
                        y1="21"
                        x2="16"
                        y2="21"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                    <line
                        x1="12"
                        y1="17"
                        x2="12"
                        y2="21"
                        stroke="currentColor"
                        stroke-width="2"
                    />
                </svg>
            {:else}
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <path
                        d="M21 12.8A9 9 0 0 1 11.2 3a7 7 0 1 0 9.8 9.8z"
                        fill="currentColor"
                    />
                </svg>
            {/if}
        </button>
    {/each}
</div>

<style>
    .theme-toggle {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        padding: 4px;
        background: var(--surface-container-high);
        border-radius: var(--radius-full);
    }
    button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        padding: 0;
        background: transparent;
        border: none;
        border-radius: var(--radius-full);
        color: var(--on-surface-variant);
        transition:
            background 150ms ease,
            color 150ms ease;
    }
    button:hover {
        background: var(--surface-container-highest);
        color: var(--on-surface);
    }
    button.active {
        background: var(--surface-container-lowest);
        color: var(--primary);
    }
    button:focus-visible {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
    }
</style>
