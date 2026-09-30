import React, {
    useEffect,
    useState,
} from 'react';

import {
    Link,
    router,
    usePage,
} from '@inertiajs/react';


/*
|--------------------------------------------------------------------------
| ICONS
|--------------------------------------------------------------------------
*/

function LogoIcon() {
    return (
        <svg
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="4"
            />

            <path d="M8 7v10" />
            <path d="M8 7h5a3 3 0 0 1 0 6H8" />
            <path d="M13 13a3 3 0 0 1 0 6" />
        </svg>
    );
}


function DashboardIcon() {
    return (
        <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect x="3" y="3" width="7" height="7" rx="2" />
            <rect x="14" y="3" width="7" height="7" rx="2" />
            <rect x="3" y="14" width="7" height="7" rx="2" />
            <rect x="14" y="14" width="7" height="7" rx="2" />
        </svg>
    );
}


function ProjectsIcon() {
    return (
        <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
            />

            <path d="M8 21V9h8v12" />
            <path d="M8 6h.01" />
            <path d="M12 6h.01" />
            <path d="M16 6h.01" />
        </svg>
    );
}


function CareersIcon() {
    return (
        <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect
                x="3"
                y="7"
                width="18"
                height="13"
                rx="2"
            />

            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M3 12h18" />
            <path d="M10 12v2h4v-2" />
        </svg>
    );
}


function EnquiriesIcon() {
    return (
        <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
            <path d="M8 9h8" />
            <path d="M8 13h5" />
        </svg>
    );
}


function ContactIcon() {
    return (
        <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
            />

            <path d="m3 7 9 6 9-6" />
        </svg>
    );
}


function MenuIcon() {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
        </svg>
    );
}


function CloseIcon() {
    return (
        <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}


function LogoutIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M10 17l5-5-5-5" />
            <path d="M15 12H3" />
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        </svg>
    );
}


function ChevronIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}

function OpportunityEnquiriesIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9 6h11" />
            <path d="M9 12h11" />
            <path d="M9 18h11" />

            <path d="M4 6h.01" />
            <path d="M4 12h.01" />
            <path d="M4 18h.01" />
        </svg>
    );
}


/*
|--------------------------------------------------------------------------
| NAVIGATION
|--------------------------------------------------------------------------
*/

const navigation = [
    {
        label: 'Dashboard',
        href: '/cms',
        icon: DashboardIcon,
        match: (url) =>
            url === '/cms' ||
            url === '/cms/',
    },

    {
        label: 'Projects',
        href: '/cms/projects',
        icon: ProjectsIcon,
        match: (url) =>
            url.startsWith('/cms/projects'),
    },

    {
        label: 'Careers',
        href: '/cms/careers',
        icon: CareersIcon,
        match: (url) =>
            url.startsWith('/cms/careers'),
    },

    {
    label: 'Opportunity Enquiries',

    href:
        '/cms/opportunity-enquiries',

    icon:
        OpportunityEnquiriesIcon,

    match: (url) =>
        url.startsWith(
            '/cms/opportunity-enquiries'
        ),
},

    {
        label: 'Enquiries',
        href: '/cms/enquiries',
        icon: EnquiriesIcon,
        match: (url) =>
            url.startsWith('/cms/enquiries'),
    },

    {
        label: 'Contact Enquiries',
        href: '/cms/contact-enquiries',
        icon: ContactIcon,
        match: (url) =>
            url.startsWith(
                '/cms/contact-enquiries'
            ),
    },
];


/*
|--------------------------------------------------------------------------
| SIDEBAR CONTENT
|--------------------------------------------------------------------------
*/

function SidebarContent({
    currentUrl,
    onNavigate,
    onLogout,
}) {

    return (
        <>

            <div className="cms-sidebar-brand">

                <Link
                    href="/cms"
                    className="cms-sidebar-brand-link"
                    onClick={onNavigate}
                >

                    <div className="cms-sidebar-logo">
                        <LogoIcon />
                    </div>

                    <div className="cms-sidebar-brand-text">

                        <div className="cms-sidebar-brand-name">
                            BILTRAX
                        </div>

                        <div className="cms-sidebar-brand-subtitle">
                            CMS ADMIN
                        </div>

                    </div>

                </Link>

            </div>


            <div className="cms-sidebar-navigation">

                <div className="cms-sidebar-section-label">
                    MAIN MENU
                </div>

                <nav className="cms-sidebar-nav">

                    {navigation.map(
                        (
                            item,
                            index
                        ) => {

                            const Icon =
                                item.icon;

                            const active =
                                item.match(
                                    currentUrl
                                );

                            return (

                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={
                                        `cms-sidebar-link ${
                                            active
                                                ? 'active'
                                                : ''
                                        }`
                                    }
                                    onClick={onNavigate}
                                    style={{
                                        '--nav-delay':
                                            `${index * 45}ms`,
                                    }}
                                >

                                    <span className="cms-sidebar-link-icon">
                                        <Icon />
                                    </span>

                                    <span className="cms-sidebar-link-label">
                                        {item.label}
                                    </span>

                                    <span className="cms-sidebar-link-arrow">
                                        <ChevronIcon />
                                    </span>

                                </Link>

                            );

                        }
                    )}

                </nav>

            </div>


            <div className="cms-sidebar-footer">

                {/* <div className="cms-sidebar-user">

                    <div className="cms-sidebar-user-avatar">
                        B
                    </div>

                    <div className="cms-sidebar-user-details">

                        <div className="cms-sidebar-user-name">
                            Biltrax Admin
                        </div>

                        <div className="cms-sidebar-user-role">
                            Administrator
                        </div>

                    </div>

                </div> */}


                {/* <button
                    type="button"
                    className="cms-sidebar-logout"
                    onClick={onLogout}
                >

                    <LogoutIcon />

                    <span>
                        Logout
                    </span>

                </button> */}

            </div>

        </>
    );
}


/*
|--------------------------------------------------------------------------
| CMS LAYOUT
|--------------------------------------------------------------------------
*/

export default function CmsLayout({
    title = 'Dashboard',
    children,
}) {

    const page = usePage();

    const currentUrl =
        String(
            page?.url || '/cms'
        ).split('?')[0];


    const [
        mobileSidebarOpen,
        setMobileSidebarOpen,
    ] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | CLOSE MOBILE MENU WHEN PAGE CHANGES
    |--------------------------------------------------------------------------
    */

    useEffect(
        () => {

            setMobileSidebarOpen(false);

        },
        [currentUrl]
    );


    /*
    |--------------------------------------------------------------------------
    | LOCK BODY WHEN MOBILE SIDEBAR IS OPEN
    |--------------------------------------------------------------------------
    */

    useEffect(
        () => {

            if (
                typeof document ===
                'undefined'
            ) {
                return undefined;
            }

            if (mobileSidebarOpen) {

                document.body.classList.add(
                    'cms-mobile-menu-open'
                );

            } else {

                document.body.classList.remove(
                    'cms-mobile-menu-open'
                );

            }

            return () => {

                document.body.classList.remove(
                    'cms-mobile-menu-open'
                );

            };

        },
        [mobileSidebarOpen]
    );


    /*
    |--------------------------------------------------------------------------
    | ESCAPE KEY
    |--------------------------------------------------------------------------
    */

    useEffect(
        () => {

            function handleKeyDown(event) {

                if (
                    event.key ===
                    'Escape'
                ) {

                    setMobileSidebarOpen(
                        false
                    );

                }

            }

            window.addEventListener(
                'keydown',
                handleKeyDown
            );

            return () => {

                window.removeEventListener(
                    'keydown',
                    handleKeyDown
                );

            };

        },
        []
    );


    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    function logout() {

        setMobileSidebarOpen(false);

        router.post(
            '/cms/logout'
        );
    }


    return (
        <>

            <style>{`

                /*
                |--------------------------------------------------------------------------
                | GLOBAL RESET
                |--------------------------------------------------------------------------
                */

                html,
                body,
                #app {
                    margin: 0;
                    padding: 0;

                    width: 100%;
                    max-width: none;

                    min-width: 0;
                    min-height: 100%;

                    background: #f5f6f8;
                }


                body {
                    overflow-x: hidden;
                }


                body.cms-mobile-menu-open {
                    overflow: hidden;
                }


                .cms-shell,
                .cms-shell *,
                .cms-shell *::before,
                .cms-shell *::after {
                    box-sizing: border-box;
                }


                /*
                |--------------------------------------------------------------------------
                | CMS SHELL
                |--------------------------------------------------------------------------
                */

                .cms-shell {
                    --cms-sidebar-width: 252px;
                    --cms-header-height: 70px;

                    position: relative;

                    display: block;

                    width: 100%;
                    max-width: none;

                    min-width: 0;
                    min-height: 100vh;

                    margin: 0;
                    padding: 0;

                    background: #f5f6f8;

                    color: #101828;

                    font-family:
                        Inter,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;
                }


                .cms-shell > .cms-main {
                    max-width: none;
                }


                .cms-main > .cms-header,
                .cms-main > .cms-content {
                    max-width: none;
                }


                .cms-content-inner > * {
                    min-width: 0;
                }


                /*
                |--------------------------------------------------------------------------
                | DESKTOP SIDEBAR
                |--------------------------------------------------------------------------
                */

                .cms-desktop-sidebar {
                    position: fixed;

                    z-index: 100;

                    left: 0;
                    top: 0;
                    bottom: 0;

                    width:
                        var(--cms-sidebar-width);

                    height: 100vh;

                    display: flex;

                    flex-direction: column;

                    background:
                        linear-gradient(
                            180deg,
                            #151c2b 0%,
                            #101623 100%
                        );

                    border-right:
                        1px solid
                        rgba(255,255,255,.055);

                    box-shadow:
                        10px 0 35px
                        rgba(15,23,42,.045);

                    overflow: hidden;
                }


                /*
                |--------------------------------------------------------------------------
                | SIDEBAR BRAND
                |--------------------------------------------------------------------------
                */

                .cms-sidebar-brand {
                    min-height: 84px;

                    padding:
                        18px 20px;

                    display: flex;

                    align-items: center;

                    border-bottom:
                        1px solid
                        rgba(255,255,255,.065);
                }


                .cms-sidebar-brand-link {
                    width: 100%;

                    display: flex;

                    align-items: center;

                    gap: 12px;

                    color: inherit;

                    text-decoration: none;
                }


                .cms-sidebar-logo {
                    width: 43px;
                    height: 43px;

                    flex:
                        0 0 43px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    border-radius: 12px;

                    background:
                        linear-gradient(
                            145deg,
                            #d01a39,
                            #aa0d29
                        );

                    color: #ffffff;

                    box-shadow:
                        0 8px 22px
                        rgba(192,18,47,.26);

                    transition:
                        transform .25s ease,
                        box-shadow .25s ease;
                }


                .cms-sidebar-brand-link:hover
                .cms-sidebar-logo {
                    transform:
                        rotate(-4deg)
                        scale(1.05);

                    box-shadow:
                        0 10px 26px
                        rgba(192,18,47,.34);
                }


                .cms-sidebar-brand-text {
                    min-width: 0;
                }


                .cms-sidebar-brand-name {
                    color: #ffffff;

                    font-size: 15px;

                    line-height: 1.2;

                    font-weight: 800;

                    letter-spacing: .055em;
                }


                .cms-sidebar-brand-subtitle {
                    margin-top: 4px;

                    color:
                        rgba(255,255,255,.37);

                    font-size: 9px;

                    font-weight: 650;

                    letter-spacing: .13em;
                }


                /*
                |--------------------------------------------------------------------------
                | SIDEBAR NAVIGATION
                |--------------------------------------------------------------------------
                */

                .cms-sidebar-navigation {
                    min-height: 0;

                    flex: 1;

                    padding:
                        22px 14px;

                    overflow-y: auto;

                    overflow-x: hidden;

                    scrollbar-width: thin;

                    scrollbar-color:
                        rgba(255,255,255,.12)
                        transparent;
                }


                .cms-sidebar-section-label {
                    margin:
                        0 10px 10px;

                    color:
                        rgba(255,255,255,.28);

                    font-size: 9px;

                    font-weight: 750;

                    letter-spacing: .13em;
                }


                .cms-sidebar-nav {
                    display: flex;

                    flex-direction: column;

                    gap: 5px;
                }


                .cms-sidebar-link {
                    position: relative;

                    min-height: 45px;

                    padding:
                        0 11px;

                    display: flex;

                    align-items: center;

                    gap: 11px;

                    overflow: hidden;

                    border-radius: 10px;

                    color:
                        rgba(255,255,255,.60);

                    text-decoration: none;

                    font-size: 12px;

                    font-weight: 600;

                    transition:
                        color .2s ease,
                        background .2s ease,
                        transform .2s ease;

                    animation:
                        cmsNavEnter
                        .4s ease
                        var(--nav-delay)
                        both;
                }


                .cms-sidebar-link::before {
                    content: "";

                    position: absolute;

                    left: 0;
                    top: 50%;

                    width: 3px;
                    height: 0;

                    border-radius:
                        0 4px 4px 0;

                    background: #e12948;

                    transform:
                        translateY(-50%);

                    transition:
                        height .2s ease;
                }


                .cms-sidebar-link:hover {
                    color: #ffffff;

                    background:
                        rgba(255,255,255,.055);

                    transform:
                        translateX(2px);
                }


                .cms-sidebar-link.active {
                    color: #ffffff;

                    background:
                        linear-gradient(
                            90deg,
                            rgba(192,18,47,.19),
                            rgba(192,18,47,.08)
                        );
                }


                .cms-sidebar-link.active::before {
                    height: 24px;
                }


                .cms-sidebar-link-icon {
                    width: 32px;
                    height: 32px;

                    flex:
                        0 0 32px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    border-radius: 8px;

                    color:
                        rgba(255,255,255,.48);

                    transition:
                        color .2s ease,
                        background .2s ease,
                        transform .2s ease;
                }


                .cms-sidebar-link:hover
                .cms-sidebar-link-icon {
                    color: #ffffff;

                    transform:
                        scale(1.05);
                }


                .cms-sidebar-link.active
                .cms-sidebar-link-icon {
                    color: #ef5570;

                    background:
                        rgba(192,18,47,.13);
                }


                .cms-sidebar-link-label {
                    flex: 1;

                    min-width: 0;
                }


                .cms-sidebar-link-arrow {
                    display: flex;

                    color:
                        rgba(255,255,255,.18);

                    opacity: 0;

                    transform:
                        translateX(-5px);

                    transition:
                        opacity .2s ease,
                        transform .2s ease;
                }


                .cms-sidebar-link:hover
                .cms-sidebar-link-arrow,
                .cms-sidebar-link.active
                .cms-sidebar-link-arrow {
                    opacity: 1;

                    transform:
                        translateX(0);
                }


                /*
                |--------------------------------------------------------------------------
                | SIDEBAR FOOTER
                |--------------------------------------------------------------------------
                */

                .cms-sidebar-footer {
                    flex-shrink: 0;

                    padding: 14px;

                    border-top:
                        1px solid
                        rgba(255,255,255,.065);
                }


                .cms-sidebar-user {
                    margin-bottom: 10px;

                    padding:
                        9px 8px;

                    display: flex;

                    align-items: center;

                    gap: 10px;
                }


                .cms-sidebar-user-avatar {
                    width: 34px;
                    height: 34px;

                    flex:
                        0 0 34px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    border-radius: 9px;

                    background:
                        rgba(255,255,255,.08);

                    color: #ffffff;

                    font-size: 12px;

                    font-weight: 750;
                }


                .cms-sidebar-user-details {
                    min-width: 0;
                }


                .cms-sidebar-user-name {
                    overflow: hidden;

                    color:
                        rgba(255,255,255,.84);

                    font-size: 11px;

                    font-weight: 650;

                    text-overflow: ellipsis;

                    white-space: nowrap;
                }


                .cms-sidebar-user-role {
                    margin-top: 2px;

                    color:
                        rgba(255,255,255,.30);

                    font-size: 9px;
                }


                .cms-sidebar-logout {
                    width: 100%;

                    min-height: 40px;

                    padding:
                        0 12px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    gap: 8px;

                    border:
                        1px solid
                        rgba(255,255,255,.075);

                    border-radius: 9px;

                    outline: none;

                    background:
                        rgba(255,255,255,.035);

                    color:
                        rgba(255,255,255,.60);

                    font-family: inherit;

                    font-size: 11px;

                    font-weight: 600;

                    cursor: pointer;

                    transition:
                        background .2s ease,
                        color .2s ease,
                        border-color .2s ease,
                        transform .2s ease;
                }


                .cms-sidebar-logout:hover {
                    color: #ffffff;

                    border-color:
                        rgba(192,18,47,.30);

                    background:
                        rgba(192,18,47,.13);

                    transform:
                        translateY(-1px);
                }


                /*
                |--------------------------------------------------------------------------
                | MAIN DESKTOP LAYOUT
                |--------------------------------------------------------------------------
                |
                | IMPORTANT:
                | Do not use:
                |
                | width: calc(100% - sidebar);
                |
                | together with margin-left.
                |
                | Let the browser calculate the remaining desktop width.
                |
                */

                .cms-main {
                    position: relative;

                    display: block;

                    width: auto;

                    max-width: none;

                    min-width: 0;

                    min-height: 100vh;

                    margin: 0;

                    margin-left:
                        var(--cms-sidebar-width);

                    padding: 0;

                    overflow-x: hidden;

                    background: #f5f6f8;

                    transition:
                        margin-left .3s ease;
                }


                /*
                |--------------------------------------------------------------------------
                | HEADER
                |--------------------------------------------------------------------------
                */

                .cms-header {
                    position: sticky;

                    z-index: 80;

                    top: 0;
                    left: 0;
                    right: 0;

                    width: 100%;
                    max-width: none;

                    min-width: 0;

                    min-height:
                        var(--cms-header-height);

                    padding:
                        0 28px;

                    display: flex;

                    align-items: center;

                    justify-content: space-between;

                    gap: 20px;

                    background:
                        rgba(255,255,255,.94);

                    border-bottom:
                        1px solid #e8ebef;

                    box-shadow:
                        0 1px 3px
                        rgba(16,24,40,.025);

                    backdrop-filter:
                        blur(14px);

                    -webkit-backdrop-filter:
                        blur(14px);
                }


                .cms-header-left {
                    min-width: 0;

                    display: flex;

                    align-items: center;

                    gap: 12px;
                }


                .cms-header-title-wrapper {
                    min-width: 0;
                }


                .cms-header-eyebrow {
                    margin-bottom: 2px;

                    color: #98a0ae;

                    font-size: 9px;

                    font-weight: 700;

                    letter-spacing: .08em;

                    text-transform: uppercase;
                }


                .cms-header-title {
                    margin: 0;

                    overflow: hidden;

                    color: #111827;

                    font-size: 18px;

                    line-height: 1.25;

                    font-weight: 750;

                    letter-spacing: -.025em;

                    text-overflow: ellipsis;

                    white-space: nowrap;
                }


                /*
                |--------------------------------------------------------------------------
                | HEADER RIGHT
                |--------------------------------------------------------------------------
                */

                .cms-header-right {
                    flex-shrink: 0;

                    display: flex;

                    align-items: center;

                    gap: 11px;
                }


                .cms-header-admin {
                    display: flex;

                    align-items: center;

                    gap: 9px;
                }


                .cms-header-avatar {
                    width: 34px;
                    height: 34px;

                    flex:
                        0 0 34px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    border-radius: 9px;

                    background: #fff0f3;

                    color: #c0122f;

                    font-size: 11px;

                    font-weight: 800;
                }


                .cms-header-admin-name {
                    color: #667085;

                    font-size: 11px;

                    font-weight: 600;

                    white-space: nowrap;
                }


                .cms-header-logout {
                    min-height: 36px;

                    padding:
                        0 12px;

                    display: inline-flex;

                    align-items: center;

                    justify-content: center;

                    gap: 7px;

                    border:
                        1px solid #e1e5eb;

                    border-radius: 8px;

                    outline: none;

                    background: #ffffff;

                    color: #475467;

                    font-family: inherit;

                    font-size: 11px;

                    font-weight: 600;

                    cursor: pointer;

                    white-space: nowrap;

                    transition:
                        color .2s ease,
                        border-color .2s ease,
                        background .2s ease,
                        transform .2s ease;
                }


                .cms-header-logout:hover {
                    color: #c0122f;

                    border-color: #f1c4cc;

                    background: #fff8f9;

                    transform:
                        translateY(-1px);
                }


                /*
                |--------------------------------------------------------------------------
                | MOBILE MENU BUTTON
                |--------------------------------------------------------------------------
                */

                .cms-mobile-menu-button {
                    width: 40px;
                    height: 40px;

                    flex:
                        0 0 40px;

                    display: none;

                    align-items: center;

                    justify-content: center;

                    border:
                        1px solid #e1e5eb;

                    border-radius: 10px;

                    outline: none;

                    background: #ffffff;

                    color: #344054;

                    cursor: pointer;

                    box-shadow:
                        0 2px 5px
                        rgba(16,24,40,.025);

                    transition:
                        color .2s ease,
                        background .2s ease,
                        border-color .2s ease,
                        transform .2s ease;
                }


                .cms-mobile-menu-button:hover {
                    color: #c0122f;

                    border-color: #f0c3cb;

                    background: #fff8f9;

                    transform:
                        scale(1.03);
                }


                /*
                |--------------------------------------------------------------------------
                | CONTENT
                |--------------------------------------------------------------------------
                */

                .cms-content {
                    position: relative;

                    display: block;

                    width: 100%;
                    max-width: 100%;

                    min-width: 0;

                    margin: 0;

                    padding:
                        26px 28px 38px;

                    overflow-x: hidden;

                    animation:
                        cmsContentEnter
                        .35s ease both;
                }


                .cms-content-inner {
                    display: block;

                    width: 100%;
                    max-width: 1600px;

                    min-width: 0;

                    margin:
                        0 auto;
                }


                /*
                |--------------------------------------------------------------------------
                | MOBILE OVERLAY
                |--------------------------------------------------------------------------
                */

                .cms-mobile-overlay {
                    position: fixed;

                    z-index: 998;

                    inset: 0;

                    display: none;

                    background:
                        rgba(15,23,42,.48);

                    opacity: 0;

                    visibility: hidden;

                    pointer-events: none;

                    backdrop-filter:
                        blur(2px);

                    -webkit-backdrop-filter:
                        blur(2px);

                    transition:
                        opacity .28s ease,
                        visibility .28s ease;
                }


                .cms-mobile-overlay.open {
                    opacity: 1;

                    visibility: visible;

                    pointer-events: auto;
                }


                /*
                |--------------------------------------------------------------------------
                | MOBILE SIDEBAR
                |--------------------------------------------------------------------------
                */

                .cms-mobile-sidebar {
                    position: fixed;

                    z-index: 999;

                    left: 0;
                    top: 0;
                    bottom: 0;

                    width:
                        min(
                            310px,
                            86vw
                        );

                    height: 100vh;

                    display: none;

                    flex-direction: column;

                    background:
                        linear-gradient(
                            180deg,
                            #151c2b 0%,
                            #101623 100%
                        );

                    box-shadow:
                        18px 0 50px
                        rgba(15,23,42,.22);

                    transform:
                        translateX(-102%);

                    transition:
                        transform
                        .32s
                        cubic-bezier(
                            .22,
                            .8,
                            .22,
                            1
                        );
                }


                .cms-mobile-sidebar.open {
                    transform:
                        translateX(0);
                }


                /*
                |--------------------------------------------------------------------------
                | MOBILE SIDEBAR CLOSE
                |--------------------------------------------------------------------------
                */

                .cms-mobile-sidebar-close {
                    position: absolute;

                    z-index: 10;

                    right: 13px;
                    top: 22px;

                    width: 36px;
                    height: 36px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    border:
                        1px solid
                        rgba(255,255,255,.08);

                    border-radius: 9px;

                    outline: none;

                    background:
                        rgba(255,255,255,.045);

                    color:
                        rgba(255,255,255,.68);

                    cursor: pointer;

                    transition:
                        color .2s ease,
                        background .2s ease,
                        transform .2s ease;
                }


                .cms-mobile-sidebar-close:hover {
                    color: #ffffff;

                    background:
                        rgba(192,18,47,.20);

                    transform:
                        rotate(4deg);
                }


                /*
                |--------------------------------------------------------------------------
                | GENERIC PAGE SAFETY
                |--------------------------------------------------------------------------
                */

                .cms-content img {
                    max-width: 100%;

                    height: auto;
                }


                .cms-content input,
                .cms-content select,
                .cms-content textarea {
                    box-sizing: border-box;
                }


                /*
                |--------------------------------------------------------------------------
                | TABLE SAFETY
                |--------------------------------------------------------------------------
                */

                .cms-content table {
                    max-width: none;
                }


                /*
                |--------------------------------------------------------------------------
                | TABLET
                |--------------------------------------------------------------------------
                */

                @media (
                    max-width: 1024px
                ) {

                    .cms-shell {
                        --cms-header-height:
                            66px;
                    }


                    .cms-desktop-sidebar {
                        display: none;
                    }


                    .cms-main {
                        width: 100%;

                        max-width: 100%;

                        margin-left: 0;

                        overflow-x: hidden;
                    }


                    .cms-mobile-menu-button {
                        display: flex;
                    }


                    .cms-mobile-overlay {
                        display: block;
                    }


                    .cms-mobile-sidebar {
                        display: flex;
                    }


                    .cms-header {
                        width: 100%;

                        max-width: 100%;

                        padding:
                            0 20px;
                    }


                    .cms-content {
                        width: 100%;

                        max-width: 100%;

                        padding:
                            22px 20px 32px;
                    }


                    .cms-content-inner {
                        width: 100%;

                        max-width: 100%;
                    }

                }


                /*
                |--------------------------------------------------------------------------
                | MOBILE
                |--------------------------------------------------------------------------
                */

                @media (
                    max-width: 640px
                ) {

                    .cms-shell {
                        --cms-header-height:
                            62px;
                    }


                    .cms-header {
                        min-height:
                            var(--cms-header-height);

                        padding:
                            0 14px;

                        gap: 10px;
                    }


                    .cms-mobile-menu-button {
                        width: 38px;
                        height: 38px;

                        flex-basis: 38px;

                        border-radius: 9px;
                    }


                    .cms-header-eyebrow {
                        display: none;
                    }


                    .cms-header-title {
                        max-width:
                            calc(100vw - 150px);

                        font-size: 15px;
                    }


                    .cms-header-admin {
                        display: none;
                    }


                    .cms-header-logout {
                        width: 38px;
                        height: 38px;

                        min-height: 38px;

                        padding: 0;

                        justify-content: center;

                        border-radius: 9px;
                    }


                    .cms-header-logout span {
                        display: none;
                    }


                    .cms-content {
                        padding:
                            16px 12px 26px;
                    }


                    .cms-mobile-sidebar {
                        width:
                            min(
                                300px,
                                88vw
                            );
                    }


                    .cms-content input,
                    .cms-content select,
                    .cms-content textarea,
                    .cms-content button {
                        max-width: 100%;
                    }


                    .cms-content table {
                        font-size: 12px;
                    }

                }


                /*
                |--------------------------------------------------------------------------
                | VERY SMALL MOBILE
                |--------------------------------------------------------------------------
                */

                @media (
                    max-width: 390px
                ) {

                    .cms-header {
                        padding:
                            0 10px;
                    }


                    .cms-header-title {
                        max-width:
                            calc(100vw - 135px);

                        font-size: 14px;
                    }


                    .cms-content {
                        padding:
                            13px 9px 22px;
                    }


                    .cms-mobile-sidebar {
                        width: 90vw;
                    }

                }


                /*
                |--------------------------------------------------------------------------
                | NAVIGATION ANIMATION
                |--------------------------------------------------------------------------
                */

                @keyframes cmsNavEnter {

                    from {
                        opacity: 0;

                        transform:
                            translateX(-7px);
                    }

                    to {
                        opacity: 1;

                        transform:
                            translateX(0);
                    }

                }


                /*
                |--------------------------------------------------------------------------
                | CONTENT ANIMATION
                |--------------------------------------------------------------------------
                */

                @keyframes cmsContentEnter {

                    from {
                        opacity: 0;

                        transform:
                            translateY(5px);
                    }

                    to {
                        opacity: 1;

                        transform:
                            translateY(0);
                    }

                }


                /*
                |--------------------------------------------------------------------------
                | REDUCED MOTION
                |--------------------------------------------------------------------------
                */

                @media (
                    prefers-reduced-motion:
                    reduce
                ) {

                    .cms-shell *,
                    .cms-shell *::before,
                    .cms-shell *::after {
                        animation-duration:
                            .01ms !important;

                        animation-iteration-count:
                            1 !important;

                        transition-duration:
                            .01ms !important;
                    }

                }

            `}</style>


            <div className="cms-shell">


                {/*
                |--------------------------------------------------------------------------
                | DESKTOP SIDEBAR
                |--------------------------------------------------------------------------
                */}

                <aside className="cms-desktop-sidebar">

                    <SidebarContent
                        currentUrl={currentUrl}
                        onNavigate={() => {}}
                        onLogout={logout}
                    />

                </aside>


                {/*
                |--------------------------------------------------------------------------
                | MOBILE OVERLAY
                |--------------------------------------------------------------------------
                */}

                <div
                    className={
                        `cms-mobile-overlay ${
                            mobileSidebarOpen
                                ? 'open'
                                : ''
                        }`
                    }
                    onClick={() =>
                        setMobileSidebarOpen(
                            false
                        )
                    }
                    aria-hidden="true"
                />


                {/*
                |--------------------------------------------------------------------------
                | MOBILE SIDEBAR
                |--------------------------------------------------------------------------
                */}

                <aside
                    className={
                        `cms-mobile-sidebar ${
                            mobileSidebarOpen
                                ? 'open'
                                : ''
                        }`
                    }
                    aria-hidden={
                        !mobileSidebarOpen
                    }
                >

                    <button
                        type="button"
                        className="cms-mobile-sidebar-close"
                        onClick={() =>
                            setMobileSidebarOpen(
                                false
                            )
                        }
                        aria-label="Close menu"
                    >
                        <CloseIcon />
                    </button>


                    <SidebarContent
                        currentUrl={currentUrl}
                        onNavigate={() =>
                            setMobileSidebarOpen(
                                false
                            )
                        }
                        onLogout={logout}
                    />

                </aside>


                {/*
                |--------------------------------------------------------------------------
                | MAIN
                |--------------------------------------------------------------------------
                */}

                <div className="cms-main">


                    {/*
                    |--------------------------------------------------------------------------
                    | HEADER
                    |--------------------------------------------------------------------------
                    */}

                    <header className="cms-header">

                        <div className="cms-header-left">


                            <button
                                type="button"
                                className="cms-mobile-menu-button"
                                onClick={() =>
                                    setMobileSidebarOpen(
                                        true
                                    )
                                }
                                aria-label="Open menu"
                                aria-expanded={
                                    mobileSidebarOpen
                                }
                            >
                                <MenuIcon />
                            </button>


                            <div className="cms-header-title-wrapper">

                                <div className="cms-header-eyebrow">
                                    Biltrax CMS
                                </div>

                                <h1 className="cms-header-title">
                                    {title}
                                </h1>

                            </div>

                        </div>


                        <div className="cms-header-right">

                            <div className="cms-header-admin">

                                <div className="cms-header-avatar">
                                    B
                                </div>

                                <div className="cms-header-admin-name">
                                    Biltrax Admin
                                </div>

                            </div>


                            <button
                                type="button"
                                className="cms-header-logout"
                                onClick={logout}
                                title="Logout"
                            >
                                <LogoutIcon />

                                <span>
                                    Logout
                                </span>
                            </button>

                        </div>

                    </header>


                    {/*
                    |--------------------------------------------------------------------------
                    | CONTENT
                    |--------------------------------------------------------------------------
                    */}

                    <main className="cms-content">

                        <div className="cms-content-inner">
                            {children}
                        </div>

                    </main>

                </div>

            </div>

        </>
    );
}