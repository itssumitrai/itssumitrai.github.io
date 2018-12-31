const navStyle = `
    <style>
        :host {
            display: block;
            width: 100%;
        }
        .topbar {
            display: none;
            max-width: 1260px;
            margin: auto;
            text-align: left;
            padding-top: 20px;
            padding-bottom: 15px;
            z-index: 10;
        }

        .topbar .navlink {
            color: white;
            font-size: 16px;
            font-weight: 500;
            text-decoration: none;
            padding-top: 20px;
            padding-bottom: 12px;
            padding-left: 20px;
            padding-right: 20px;
            margin-right: 30px;
        }

        .topbar .navlink.selected {
            border-bottom: 3px solid white;
        }

        .topbar .navlink:hover {
            text-decoration: underline;
        }

        @media (min-width: 460px) {
            .topbar {
                display: block;
            }
        }
    </style>
`;

const sidebarStyle = `
    <style>
        :host {
            display: inline-block;
            vertical-align: top;
        }
        .sidebar {
            display: none;
            position: fixed;
            left: 0;
            top: 0;
            z-index: 11;
            background-color: #3d4447;
            width: 95%;
            height: 100%;
            padding: 20px 0;
        }

        .sidebar .navlink {
            display: block;
            width: 100%;
            padding: 15px 0px;
            font-weight: 500;
            font-size: 16px;
            text-decoration: none;
            color: white;
        }

        .sidebar .close {
            position: absolute;
            right: 10px;
            top: 10px;
            padding: 10px;
            border-radius: 3px;
            border: 0px;
            background-color: white;
            color: black;
            font-size: 13px;
            font-weight: 500;
        }
        .hamburger {
            border: 0px;
            padding: 0px;
            margin: 0px 10px 0px 0px;
            color: black;
            height: 32px;
            width: 32px;
            border-radius: 2px;
        }

        @media (min-width: 460px) {
            .hamburger {
                display: none;
            }
        }
    </style>
`;

const avatarStyle = `
    <style>
        :host {
            display: none;
            vertical-align: top;
            float: right;
            margin-right: 20px;
        }
        @media (min-width: 460px) {
            :host {
                display: inline-block;
            }
        }
    </style>
`;

const avatarImage = 'https://avatars2.githubusercontent.com/u/4822956?s=40&v=4';

const NAV_LINKS = [
    {
        title: 'Home',
        href: '/'
    },
    {
        title: 'About',
        href: '/about'
    }
];

/**
 * Component for the Nav at the top
 * @class Nav
 */
class Nav extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        const selected = this.getAttribute('selected') || '/';
        let navLinks = '';
        NAV_LINKS.forEach(nav => {
            navLinks += `<a href="${nav.href}" class="navlink ${selected === nav.href ? 'selected' : ''}">${nav.title}</a>`;
        });

        const type = this.hasAttribute('type') && this.getAttribute('type') || 'top';
        if(type === 'side') {
            this.shadowRoot.innerHTML = `
                ${sidebarStyle}
                <button class="hamburger" id="hamburger-btn">
                    <svg height="24" viewBox="0 0 24 24" width="24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>
                </button>
                <nav class="sidebar">
                    <button class="close" id="sidebar-close">Close</button>
                    ${navLinks}
                </nav>
            `;
            this.shadowRoot.getElementById('sidebar-close').addEventListener('click', () => {
                this.shadowRoot.querySelector('.sidebar').style.display = 'none';
            });

            this.shadowRoot.getElementById('hamburger-btn').addEventListener('click', () => {
                this.shadowRoot.querySelector('.sidebar').style.display = 'block';
            });
        } else {
            // top
            this.shadowRoot.innerHTML = `
                ${navStyle}
                <nav class="topbar">
                    ${navLinks}
                </nav>
            `;
        }
    }
}

customElements.define('app-nav', Nav);

/**
 * Component for showing the Avatar
 * @class Avatar
 */
class Avatar extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: 'open'});

        shadowRoot.innerHTML = `
            ${avatarStyle}
            <div class="avatar">
                <img class="img" alt="Sumit Rai" src="${avatarImage}"/>
            </div>
        `;
    }
}

customElements.define('app-avatar', Avatar);