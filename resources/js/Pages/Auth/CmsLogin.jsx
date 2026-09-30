import React, {
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    Head,
    useForm,
} from '@inertiajs/react';


/*
|--------------------------------------------------------------------------
| ICONS
|--------------------------------------------------------------------------
*/

function MailIcon() {
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


function LockIcon() {
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
                x="4"
                y="10"
                width="16"
                height="11"
                rx="2"
            />

            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
    );
}


function EyeIcon() {
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
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />

            <circle
                cx="12"
                cy="12"
                r="3"
            />
        </svg>
    );
}


function EyeOffIcon() {
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
            <path d="m3 3 18 18" />

            <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />

            <path d="M9.9 4.2A10.6 10.6 0 0 1 12 4c6.5 0 10 8 10 8a17.7 17.7 0 0 1-2.1 3.2" />

            <path d="M6.6 6.6C3.7 8.4 2 12 2 12s3.5 8 10 8a9.8 9.8 0 0 0 5.4-1.6" />
        </svg>
    );
}


function ArrowIcon() {
    return (
        <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
        </svg>
    );
}


function CheckIcon() {
    return (
        <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="m5 12 4 4L19 6" />
        </svg>
    );
}


function ErrorIcon() {
    return (
        <span className="cms-login-error-icon">
            !
        </span>
    );
}


/*
|--------------------------------------------------------------------------
| CMS LOGIN
|--------------------------------------------------------------------------
*/

export default function CmsLogin() {

    const [
        showPassword,
        setShowPassword,
    ] = useState(false);


    const [
        shakeCard,
        setShakeCard,
    ] = useState(false);


    const cardRef = useRef(null);

    const wrapperRef = useRef(null);


    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        email: '',
        password: '',
        remember: false,
    });


    /*
    |--------------------------------------------------------------------------
    | LOGIN
    |--------------------------------------------------------------------------
    */

    function submit(e) {

        e.preventDefault();

        setShakeCard(false);

        post('/cms/login', {
            preserveScroll: true,

            onError: () => {

                setShakeCard(false);

                requestAnimationFrame(() => {

                    requestAnimationFrame(() => {
                        setShakeCard(true);
                    });

                });

            },
        });
    }


    /*
    |--------------------------------------------------------------------------
    | REMOVE SHAKE CLASS
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!shakeCard) {
            return undefined;
        }


        const timer = setTimeout(
            () => {
                setShakeCard(false);
            },
            450
        );


        return () => {
            clearTimeout(timer);
        };

    }, [shakeCard]);


    /*
    |--------------------------------------------------------------------------
    | SUBTLE CARD PARALLAX
    |--------------------------------------------------------------------------
    */

    function handleMouseMove(e) {

        if (!wrapperRef.current) {
            return;
        }


        if (
            window.matchMedia(
                '(prefers-reduced-motion: reduce)'
            ).matches
        ) {
            return;
        }


        const rect =
            wrapperRef.current.getBoundingClientRect();


        const x =
            e.clientX - rect.left;


        const y =
            e.clientY - rect.top;


        const centerX =
            rect.width / 2;


        const centerY =
            rect.height / 2;


        const rotateY =
            ((x - centerX) / centerX) * 0.8;


        const rotateX =
            -((y - centerY) / centerY) * 0.8;


        if (cardRef.current) {

            cardRef.current.style.transform =
                `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        }
    }


    function handleMouseLeave() {

        if (cardRef.current) {

            cardRef.current.style.transform =
                'rotateX(0deg) rotateY(0deg)';

        }
    }


    const generalError =
        errors.email ||
        errors.password;


    return (
        <>

            <Head title="CMS Login · Biltrax" />


            <style>{`

                /*
                |--------------------------------------------------------------------------
                | RESET
                |--------------------------------------------------------------------------
                */

                .cms-auth-page,
                .cms-auth-page * {
                    box-sizing: border-box;
                }


                html,
                body,
                #app {
                    margin: 0;

                    min-height: 100%;
                }


                body {
                    margin: 0;
                }


                /*
                |--------------------------------------------------------------------------
                | PAGE
                |--------------------------------------------------------------------------
                */

                .cms-auth-page {
                    position: relative;

                    width: 100%;

                    min-height: 100vh;

                    padding: 32px 20px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    overflow: hidden;

                    background:
                        linear-gradient(
                            135deg,
                            #f8f9fb 0%,
                            #ffffff 48%,
                            #f7f8fa 100%
                        );

                    color: #111827;

                    font-family:
                        Inter,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;
                }


                /*
                |--------------------------------------------------------------------------
                | BACKGROUND GRID
                |--------------------------------------------------------------------------
                */

                .cms-auth-page::before {
                    content: "";

                    position: absolute;

                    inset: 0;

                    background-image:
                        linear-gradient(
                            rgba(17, 24, 39, .025) 1px,
                            transparent 1px
                        ),
                        linear-gradient(
                            90deg,
                            rgba(17, 24, 39, .025) 1px,
                            transparent 1px
                        );

                    background-size:
                        42px 42px;

                    -webkit-mask-image:
                        linear-gradient(
                            to bottom,
                            transparent,
                            black 20%,
                            black 80%,
                            transparent
                        );

                    mask-image:
                        linear-gradient(
                            to bottom,
                            transparent,
                            black 20%,
                            black 80%,
                            transparent
                        );

                    pointer-events: none;
                }


                /*
                |--------------------------------------------------------------------------
                | BACKGROUND GLOW
                |--------------------------------------------------------------------------
                */

                .cms-auth-glow {
                    position: absolute;

                    border-radius: 50%;

                    filter: blur(5px);

                    pointer-events: none;
                }


                .cms-auth-glow.navy {
                    width: 430px;
                    height: 430px;

                    left: -190px;
                    top: -180px;

                    background:
                        radial-gradient(
                            circle,
                            rgba(17, 24, 39, .09) 0%,
                            rgba(17, 24, 39, .03) 43%,
                            transparent 72%
                        );

                    animation:
                        cmsNavyGlowMove
                        12s ease-in-out infinite;
                }


                .cms-auth-glow.red {
                    width: 430px;
                    height: 430px;

                    right: -170px;
                    bottom: -180px;

                    background:
                        radial-gradient(
                            circle,
                            rgba(192, 18, 47, .12) 0%,
                            rgba(192, 18, 47, .045) 43%,
                            transparent 72%
                        );

                    animation:
                        cmsRedGlowMove
                        10s ease-in-out infinite;
                }


                /*
                |--------------------------------------------------------------------------
                | DECORATIVE RINGS
                |--------------------------------------------------------------------------
                */

                .cms-auth-ring {
                    position: absolute;

                    border-radius: 50%;

                    border:
                        1px solid
                        rgba(192, 18, 47, .06);

                    pointer-events: none;
                }


                .cms-auth-ring.one {
                    width: 180px;
                    height: 180px;

                    right: 9%;
                    top: 13%;

                    animation:
                        cmsRingFloat
                        9s ease-in-out infinite;
                }


                .cms-auth-ring.two {
                    width: 90px;
                    height: 90px;

                    left: 12%;
                    bottom: 15%;

                    border-color:
                        rgba(17, 24, 39, .055);

                    animation:
                        cmsRingFloat
                        7s ease-in-out
                        1s infinite reverse;
                }


                /*
                |--------------------------------------------------------------------------
                | WRAPPER
                |--------------------------------------------------------------------------
                */

                .cms-auth-wrapper {
                    position: relative;

                    z-index: 10;

                    width: 100%;

                    max-width: 440px;

                    perspective: 1200px;
                }


                /*
                |--------------------------------------------------------------------------
                | CARD
                |--------------------------------------------------------------------------
                */

                .cms-auth-card {
                    position: relative;

                    width: 100%;

                    padding:
                        38px 38px 32px;

                    overflow: hidden;

                    background:
                        rgba(255, 255, 255, .93);

                    border:
                        1px solid
                        rgba(224, 228, 234, .95);

                    border-radius: 20px;

                    box-shadow:
                        0 2px 5px
                        rgba(16, 24, 40, .025),
                        0 15px 45px
                        rgba(16, 24, 40, .07);

                    backdrop-filter:
                        blur(15px);

                    -webkit-backdrop-filter:
                        blur(15px);

                    transform-style:
                        preserve-3d;

                    animation:
                        cmsCardEntrance
                        .7s
                        cubic-bezier(.2, .8, .2, 1)
                        both;

                    transition:
                        transform .18s ease,
                        box-shadow .25s ease;
                }


                .cms-auth-card:hover {
                    box-shadow:
                        0 4px 8px
                        rgba(16, 24, 40, .03),
                        0 22px 55px
                        rgba(16, 24, 40, .09);
                }


                .cms-auth-card.shake {
                    animation:
                        cmsCardShake
                        .36s ease;
                }


                /*
                |--------------------------------------------------------------------------
                | TOP ACCENT
                |--------------------------------------------------------------------------
                */

                .cms-auth-card::before {
                    content: "";

                    position: absolute;

                    left: 50%;
                    top: 0;

                    width: 130px;
                    height: 3px;

                    transform:
                        translateX(-50%);

                    border-radius:
                        0 0 10px 10px;

                    background:
                        linear-gradient(
                            90deg,
                            transparent,
                            #c0122f,
                            transparent
                        );

                    animation:
                        cmsAccentEntrance
                        .8s ease .25s both;
                }


                /*
                |--------------------------------------------------------------------------
                | BRAND
                |--------------------------------------------------------------------------
                */

                .cms-auth-brand {
                    margin-bottom: 29px;

                    text-align: center;
                }


                .cms-auth-logo-wrapper {
                    position: relative;

                    width: 62px;
                    height: 62px;

                    margin:
                        0 auto 14px;

                    display: flex;

                    align-items: center;

                    justify-content: center;
                }


                .cms-auth-logo-wrapper::before {
                    content: "";

                    position: absolute;

                    inset: -7px;

                    border:
                        1px solid
                        rgba(192, 18, 47, .15);

                    border-radius: 18px;

                    opacity: 0;

                    animation:
                        cmsLogoHalo
                        2.4s ease-out
                        .65s infinite;
                }


                .cms-auth-logo {
                    position: relative;

                    z-index: 2;

                    width: 58px;
                    height: 58px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    border-radius: 15px;

                    background:
                        linear-gradient(
                            145deg,
                            #d31a3a 0%,
                            #b30e29 100%
                        );

                    color: #ffffff;

                    font-size: 25px;

                    font-weight: 800;

                    letter-spacing: -.04em;

                    box-shadow:
                        0 9px 24px
                        rgba(192, 18, 47, .25);

                    animation:
                        cmsLogoEntrance
                        .65s
                        cubic-bezier(
                            .34,
                            1.56,
                            .64,
                            1
                        )
                        .15s both;

                    transition:
                        transform .25s ease,
                        box-shadow .25s ease;
                }


                .cms-auth-logo:hover {
                    transform:
                        rotate(-5deg)
                        scale(1.06);

                    box-shadow:
                        0 12px 30px
                        rgba(192, 18, 47, .32);
                }


                .cms-auth-brand-name {
                    color: #111827;

                    font-size: 17px;

                    font-weight: 750;

                    letter-spacing: .02em;

                    animation:
                        cmsFadeUp
                        .45s ease
                        .35s both;
                }


                .cms-auth-brand-name span {
                    color: #c0122f;
                }


                /*
                |--------------------------------------------------------------------------
                | HEADING
                |--------------------------------------------------------------------------
                */

                .cms-auth-heading {
                    margin-bottom: 27px;

                    text-align: center;

                    animation:
                        cmsFadeUp
                        .45s ease
                        .43s both;
                }


                .cms-auth-heading h1 {
                    margin: 0;

                    color: #111827;

                    font-size: 25px;

                    line-height: 1.25;

                    font-weight: 750;

                    letter-spacing: -.035em;
                }


                .cms-auth-heading p {
                    margin:
                        7px 0 0;

                    color: #8a92a0;

                    font-size: 12px;

                    line-height: 1.6;
                }


                /*
                |--------------------------------------------------------------------------
                | ERROR BOX
                |--------------------------------------------------------------------------
                */

                .cms-auth-error-box {
                    margin-bottom: 16px;

                    padding:
                        10px 12px;

                    display: flex;

                    align-items: flex-start;

                    gap: 8px;

                    border:
                        1px solid #ffd6da;

                    border-radius: 9px;

                    background: #fff4f5;

                    color: #b42318;

                    font-size: 11px;

                    font-weight: 550;

                    line-height: 1.5;

                    animation:
                        cmsErrorEntrance
                        .25s ease both;
                }


                .cms-login-error-icon {
                    width: 18px;
                    height: 18px;

                    flex: 0 0 18px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    margin-top: 0;

                    border-radius: 50%;

                    background: #d92d20;

                    color: #ffffff;

                    font-size: 11px;

                    font-weight: 800;
                }


                /*
                |--------------------------------------------------------------------------
                | FIELD
                |--------------------------------------------------------------------------
                */

                .cms-auth-field {
                    margin-bottom: 18px;

                    opacity: 0;

                    transform:
                        translateY(10px);
                }


                .cms-auth-field.email {
                    animation:
                        cmsFieldEntrance
                        .45s ease
                        .52s forwards;
                }


                .cms-auth-field.password {
                    animation:
                        cmsFieldEntrance
                        .45s ease
                        .64s forwards;
                }


                .cms-auth-label {
                    display: block;

                    margin-bottom: 8px;

                    color: #344054;

                    font-size: 12px;

                    font-weight: 650;

                    transition:
                        color .2s ease;
                }


                .cms-auth-field:focus-within
                .cms-auth-label {
                    color: #c0122f;
                }


                /*
                |--------------------------------------------------------------------------
                | INPUT
                |--------------------------------------------------------------------------
                */

                .cms-auth-input-wrapper {
                    position: relative;
                }


                .cms-auth-input-icon {
                    position: absolute;

                    z-index: 2;

                    left: 15px;
                    top: 50%;

                    width: 19px;
                    height: 19px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    color: #a1a8b3;

                    transform:
                        translateY(-50%);

                    pointer-events: none;

                    transition:
                        color .2s ease,
                        transform .2s ease;
                }


                .cms-auth-input-wrapper:focus-within
                .cms-auth-input-icon {
                    color: #c0122f;

                    transform:
                        translateY(-50%)
                        translateX(2px)
                        scale(1.06);
                }


                .cms-auth-input {
                    width: 100%;

                    height: 51px;

                    padding:
                        0 47px;

                    border:
                        1px solid #dce1e7;

                    border-radius: 11px;

                    outline: none;

                    background: #ffffff;

                    color: #202631;

                    font-family: inherit;

                    font-size: 13px;

                    box-shadow:
                        0 1px 2px
                        rgba(16, 24, 40, .02);

                    transition:
                        border-color .2s ease,
                        box-shadow .2s ease,
                        transform .2s ease,
                        background .2s ease;
                }


                .cms-auth-input::placeholder {
                    color: #b2b8c1;
                }


                .cms-auth-input:hover:not(:disabled) {
                    border-color: #c7cdd5;
                }


                .cms-auth-input:focus {
                    border-color:
                        rgba(192, 18, 47, .65);

                    background: #ffffff;

                    box-shadow:
                        0 0 0 4px
                        rgba(192, 18, 47, .07),
                        0 3px 10px
                        rgba(16, 24, 40, .035);
                }


                .cms-auth-input.error {
                    border-color: #e15b68;

                    background: #fffafb;
                }


                .cms-auth-input.error:focus {
                    border-color: #d92d3f;

                    box-shadow:
                        0 0 0 4px
                        rgba(217, 45, 63, .07);
                }


                .cms-auth-input:disabled {
                    opacity: .75;

                    cursor: not-allowed;
                }


                /*
                |--------------------------------------------------------------------------
                | PASSWORD TOGGLE
                |--------------------------------------------------------------------------
                */

                .cms-auth-password-toggle {
                    position: absolute;

                    z-index: 3;

                    right: 9px;
                    top: 50%;

                    width: 34px;
                    height: 34px;

                    padding: 0;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    border: 0;

                    border-radius: 8px;

                    outline: none;

                    background: transparent;

                    color: #98a0ad;

                    cursor: pointer;

                    transform:
                        translateY(-50%);

                    transition:
                        background .18s ease,
                        color .18s ease,
                        transform .18s ease;
                }


                .cms-auth-password-toggle:hover:not(:disabled) {
                    color: #c0122f;

                    background: #fff0f3;

                    transform:
                        translateY(-50%)
                        scale(1.05);
                }


                .cms-auth-password-toggle:disabled {
                    cursor: not-allowed;

                    opacity: .65;
                }


                /*
                |--------------------------------------------------------------------------
                | INDIVIDUAL ERROR
                |--------------------------------------------------------------------------
                */

                .cms-auth-field-error {
                    margin-top: 7px;

                    display: flex;

                    align-items: center;

                    gap: 6px;

                    color: #b42318;

                    font-size: 10px;

                    font-weight: 550;

                    animation:
                        cmsErrorEntrance
                        .25s ease both;
                }


                .cms-auth-field-error::before {
                    content: "";

                    width: 5px;
                    height: 5px;

                    flex: 0 0 5px;

                    border-radius: 50%;

                    background: #d92d20;
                }


                /*
                |--------------------------------------------------------------------------
                | OPTIONS
                |--------------------------------------------------------------------------
                */

                .cms-auth-options {
                    margin:
                        2px 0 23px;

                    opacity: 0;

                    animation:
                        cmsFadeUp
                        .4s ease
                        .76s forwards;
                }


                .cms-auth-remember {
                    display: inline-flex;

                    align-items: center;

                    gap: 9px;

                    color: #667085;

                    font-size: 12px;

                    font-weight: 550;

                    cursor: pointer;

                    user-select: none;
                }


                .cms-auth-remember input {
                    position: absolute;

                    opacity: 0;

                    pointer-events: none;
                }


                .cms-auth-checkbox {
                    width: 18px;
                    height: 18px;

                    flex: 0 0 18px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    border:
                        1px solid #cdd3dc;

                    border-radius: 5px;

                    background: #ffffff;

                    color: transparent;

                    transition:
                        border-color .18s ease,
                        background .18s ease,
                        color .18s ease,
                        transform .18s ease,
                        box-shadow .18s ease;
                }


                .cms-auth-remember:hover
                .cms-auth-checkbox {
                    border-color:
                        rgba(192, 18, 47, .65);
                }


                .cms-auth-remember
                input:checked
                + .cms-auth-checkbox {
                    border-color: #c0122f;

                    background: #c0122f;

                    color: #ffffff;

                    transform:
                        scale(1.06);

                    box-shadow:
                        0 3px 9px
                        rgba(192, 18, 47, .18);
                }


                /*
                |--------------------------------------------------------------------------
                | LOGIN BUTTON WRAPPER
                |--------------------------------------------------------------------------
                */

                .cms-auth-button-wrapper {
                    opacity: 0;

                    animation:
                        cmsFadeUp
                        .45s ease
                        .86s forwards;
                }


                /*
                |--------------------------------------------------------------------------
                | LOGIN BUTTON
                |--------------------------------------------------------------------------
                */

                .cms-auth-button {
                    position: relative;

                    width: 100%;

                    height: 51px;

                    overflow: hidden;

                    padding:
                        0 18px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    gap: 9px;

                    border: 0;

                    border-radius: 11px;

                    outline: none;

                    background:
                        linear-gradient(
                            135deg,
                            #c0122f 0%,
                            #aa0e29 100%
                        );

                    color: #ffffff;

                    font-family: inherit;

                    font-size: 13px;

                    font-weight: 700;

                    letter-spacing: .01em;

                    cursor: pointer;

                    box-shadow:
                        0 8px 20px
                        rgba(192, 18, 47, .20);

                    transition:
                        transform .2s ease,
                        box-shadow .2s ease,
                        opacity .2s ease;
                }


                /*
                |--------------------------------------------------------------------------
                | BUTTON LIGHT SWEEP
                |--------------------------------------------------------------------------
                */

                .cms-auth-button::before {
                    content: "";

                    position: absolute;

                    top: 0;
                    bottom: 0;

                    left: -65%;

                    width: 40%;

                    background:
                        linear-gradient(
                            90deg,
                            transparent,
                            rgba(255, 255, 255, .20),
                            transparent
                        );

                    transform:
                        skewX(-20deg);

                    transition:
                        left .55s ease;
                }


                .cms-auth-button:hover:not(:disabled) {
                    transform:
                        translateY(-2px);

                    box-shadow:
                        0 12px 27px
                        rgba(192, 18, 47, .28);
                }


                .cms-auth-button:hover:not(:disabled)::before {
                    left: 125%;
                }


                .cms-auth-button:active:not(:disabled) {
                    transform:
                        translateY(0)
                        scale(.995);
                }


                .cms-auth-button:disabled {
                    opacity: .76;

                    cursor: not-allowed;
                }


                .cms-auth-button-arrow {
                    display: flex;

                    transition:
                        transform .2s ease;
                }


                .cms-auth-button:hover:not(:disabled)
                .cms-auth-button-arrow {
                    transform:
                        translateX(4px);
                }


                /*
                |--------------------------------------------------------------------------
                | SPINNER
                |--------------------------------------------------------------------------
                */

                .cms-auth-spinner {
                    width: 17px;
                    height: 17px;

                    flex: 0 0 17px;

                    border:
                        2px solid
                        rgba(255, 255, 255, .35);

                    border-top-color: #ffffff;

                    border-radius: 50%;

                    animation:
                        cmsSpin
                        .7s linear infinite;
                }


                /*
                |--------------------------------------------------------------------------
                | SECURE LOGIN
                |--------------------------------------------------------------------------
                */

                .cms-auth-secure {
                    margin-top: 20px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    gap: 6px;

                    color: #a0a7b2;

                    font-size: 10px;

                    opacity: 0;

                    animation:
                        cmsFadeUp
                        .4s ease
                        .98s forwards;
                }


                .cms-auth-secure svg {
                    color: #7d8592;
                }


                /*
                |--------------------------------------------------------------------------
                | ANIMATIONS
                |--------------------------------------------------------------------------
                */

                @keyframes cmsCardEntrance {

                    0% {
                        opacity: 0;

                        transform:
                            translateY(25px)
                            scale(.97);
                    }

                    100% {
                        opacity: 1;

                        transform:
                            translateY(0)
                            scale(1);
                    }
                }


                @keyframes cmsLogoEntrance {

                    0% {
                        opacity: 0;

                        transform:
                            scale(.55)
                            rotate(-10deg);
                    }

                    70% {
                        opacity: 1;

                        transform:
                            scale(1.08)
                            rotate(2deg);
                    }

                    100% {
                        opacity: 1;

                        transform:
                            scale(1)
                            rotate(0);
                    }
                }


                @keyframes cmsLogoHalo {

                    0% {
                        opacity: .45;

                        transform:
                            scale(.85);
                    }

                    70% {
                        opacity: 0;

                        transform:
                            scale(1.35);
                    }

                    100% {
                        opacity: 0;

                        transform:
                            scale(1.35);
                    }
                }


                @keyframes cmsFadeUp {

                    from {
                        opacity: 0;

                        transform:
                            translateY(8px);
                    }

                    to {
                        opacity: 1;

                        transform:
                            translateY(0);
                    }
                }


                @keyframes cmsFieldEntrance {

                    from {
                        opacity: 0;

                        transform:
                            translateY(10px);
                    }

                    to {
                        opacity: 1;

                        transform:
                            translateY(0);
                    }
                }


                @keyframes cmsAccentEntrance {

                    from {
                        opacity: 0;

                        width: 0;
                    }

                    to {
                        opacity: 1;

                        width: 130px;
                    }
                }


                @keyframes cmsRedGlowMove {

                    0%,
                    100% {
                        transform:
                            translate(0, 0)
                            scale(1);
                    }

                    50% {
                        transform:
                            translate(-35px, -25px)
                            scale(1.08);
                    }
                }


                @keyframes cmsNavyGlowMove {

                    0%,
                    100% {
                        transform:
                            translate(0, 0)
                            scale(1);
                    }

                    50% {
                        transform:
                            translate(30px, 25px)
                            scale(1.07);
                    }
                }


                @keyframes cmsRingFloat {

                    0%,
                    100% {
                        transform:
                            translateY(0)
                            rotate(0);
                    }

                    50% {
                        transform:
                            translateY(-18px)
                            rotate(8deg);
                    }
                }


                @keyframes cmsSpin {

                    to {
                        transform:
                            rotate(360deg);
                    }
                }


                @keyframes cmsErrorEntrance {

                    from {
                        opacity: 0;

                        transform:
                            translateY(-5px);
                    }

                    to {
                        opacity: 1;

                        transform:
                            translateY(0);
                    }
                }


                @keyframes cmsCardShake {

                    0%,
                    100% {
                        transform:
                            translateX(0);
                    }

                    20% {
                        transform:
                            translateX(-4px);
                    }

                    40% {
                        transform:
                            translateX(4px);
                    }

                    60% {
                        transform:
                            translateX(-3px);
                    }

                    80% {
                        transform:
                            translateX(2px);
                    }
                }


                /*
                |--------------------------------------------------------------------------
                | RESPONSIVE
                |--------------------------------------------------------------------------
                */

                @media (
                    max-width: 520px
                ) {

                    .cms-auth-page {
                        padding:
                            22px 15px;
                    }


                    .cms-auth-card {
                        padding:
                            31px 22px 27px;

                        border-radius: 17px;
                    }


                    .cms-auth-logo-wrapper {
                        width: 56px;
                        height: 56px;
                    }


                    .cms-auth-logo {
                        width: 52px;
                        height: 52px;

                        border-radius: 13px;

                        font-size: 22px;
                    }


                    .cms-auth-heading h1 {
                        font-size: 23px;
                    }


                    .cms-auth-input,
                    .cms-auth-button {
                        height: 49px;
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

                    .cms-auth-page *,
                    .cms-auth-page *::before,
                    .cms-auth-page *::after {
                        animation-duration:
                            .01ms !important;

                        animation-iteration-count:
                            1 !important;

                        transition-duration:
                            .01ms !important;
                    }
                }

            `}</style>


            <div className="cms-auth-page">


                {/*
                |--------------------------------------------------------------------------
                | BACKGROUND
                |--------------------------------------------------------------------------
                */}

                <div className="cms-auth-glow navy" />

                <div className="cms-auth-glow red" />

                <div className="cms-auth-ring one" />

                <div className="cms-auth-ring two" />


                {/*
                |--------------------------------------------------------------------------
                | LOGIN WRAPPER
                |--------------------------------------------------------------------------
                */}

                <div
                    ref={wrapperRef}
                    className="cms-auth-wrapper"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >


                    <div
                        ref={cardRef}
                        className={
                            `cms-auth-card ${
                                shakeCard
                                    ? 'shake'
                                    : ''
                            }`
                        }
                    >


                        {/*
                        |--------------------------------------------------------------------------
                        | BRAND
                        |--------------------------------------------------------------------------
                        */}

                        <div className="cms-auth-brand">

                            <div className="cms-auth-logo-wrapper">

                                <div className="cms-auth-logo">
                                    B
                                </div>

                            </div>


                            <div className="cms-auth-brand-name">
                                BILTRAX <span>CMS</span>
                            </div>

                        </div>


                        {/*
                        |--------------------------------------------------------------------------
                        | HEADING
                        |--------------------------------------------------------------------------
                        */}

                        <div className="cms-auth-heading">

                            <h1>
                                Welcome Back
                            </h1>


                            <p>
                                Sign in to continue to the Biltrax CMS.
                            </p>

                        </div>


                        {/*
                        |--------------------------------------------------------------------------
                        | GENERAL ERROR
                        |--------------------------------------------------------------------------
                        */}

                        {generalError && (

                            <div className="cms-auth-error-box">

                                <ErrorIcon />

                                <span>
                                    Unable to sign in. Please check your email and password.
                                </span>

                            </div>

                        )}


                        {/*
                        |--------------------------------------------------------------------------
                        | FORM
                        |--------------------------------------------------------------------------
                        */}

                        <form onSubmit={submit}>


                            {/*
                            |--------------------------------------------------------------------------
                            | EMAIL
                            |--------------------------------------------------------------------------
                            */}

                            <div className="cms-auth-field email">

                                <label
                                    className="cms-auth-label"
                                    htmlFor="cms-email"
                                >
                                    Email Address
                                </label>


                                <div className="cms-auth-input-wrapper">

                                    <div className="cms-auth-input-icon">
                                        <MailIcon />
                                    </div>


                                    <input
                                        id="cms-email"
                                        className={
                                            `cms-auth-input ${
                                                errors.email
                                                    ? 'error'
                                                    : ''
                                            }`
                                        }
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData(
                                                'email',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter your email address"
                                        autoComplete="email"
                                        autoFocus
                                        disabled={processing}
                                    />

                                </div>


                                {errors.email && (

                                    <div className="cms-auth-field-error">
                                        {errors.email}
                                    </div>

                                )}

                            </div>


                            {/*
                            |--------------------------------------------------------------------------
                            | PASSWORD
                            |--------------------------------------------------------------------------
                            */}

                            <div className="cms-auth-field password">

                                <label
                                    className="cms-auth-label"
                                    htmlFor="cms-password"
                                >
                                    Password
                                </label>


                                <div className="cms-auth-input-wrapper">

                                    <div className="cms-auth-input-icon">
                                        <LockIcon />
                                    </div>


                                    <input
                                        id="cms-password"
                                        className={
                                            `cms-auth-input ${
                                                errors.password
                                                    ? 'error'
                                                    : ''
                                            }`
                                        }
                                        type={
                                            showPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        value={data.password}
                                        onChange={(e) =>
                                            setData(
                                                'password',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        disabled={processing}
                                    />


                                    <button
                                        type="button"
                                        className="cms-auth-password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                (current) =>
                                                    !current
                                            )
                                        }
                                        aria-label={
                                            showPassword
                                                ? 'Hide password'
                                                : 'Show password'
                                        }
                                        title={
                                            showPassword
                                                ? 'Hide password'
                                                : 'Show password'
                                        }
                                        disabled={processing}
                                    >

                                        {showPassword
                                            ? <EyeOffIcon />
                                            : <EyeIcon />}

                                    </button>

                                </div>


                                {errors.password && (

                                    <div className="cms-auth-field-error">
                                        {errors.password}
                                    </div>

                                )}

                            </div>


                            {/*
                            |--------------------------------------------------------------------------
                            | REMEMBER ME
                            |--------------------------------------------------------------------------
                            */}

                            <div className="cms-auth-options">

                                <label className="cms-auth-remember">

                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                'remember',
                                                e.target.checked
                                            )
                                        }
                                        disabled={processing}
                                    />


                                    <span className="cms-auth-checkbox">
                                        <CheckIcon />
                                    </span>


                                    <span>
                                        Remember me
                                    </span>

                                </label>

                            </div>


                            {/*
                            |--------------------------------------------------------------------------
                            | LOGIN BUTTON
                            |--------------------------------------------------------------------------
                            */}

                            <div className="cms-auth-button-wrapper">

                                <button
                                    type="submit"
                                    className="cms-auth-button"
                                    disabled={processing}
                                >

                                    {processing ? (

                                        <>
                                            <span className="cms-auth-spinner" />

                                            <span>
                                                Signing in...
                                            </span>
                                        </>

                                    ) : (

                                        <>
                                            <span>
                                                Login to CMS
                                            </span>


                                            <span className="cms-auth-button-arrow">
                                                <ArrowIcon />
                                            </span>
                                        </>

                                    )}

                                </button>

                            </div>

                        </form>


                        {/*
                        |--------------------------------------------------------------------------
                        | SECURE LOGIN
                        |--------------------------------------------------------------------------
                        */}

                        <div className="cms-auth-secure">

                            <LockIcon />

                            <span>
                                Secure CMS Login
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </>
    );
}