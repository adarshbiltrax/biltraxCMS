import React, {
    useState,
} from 'react';

import {
    Head,
    Link,
    router,
    useForm,
} from '@inertiajs/react';

import CmsLayout from '../../../Layouts/CmsLayout';


/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function value(v) {

    if (
        v === null ||
        v === undefined ||
        v === ''
    ) {
        return '—';
    }

    return v;
}


function formatDate(value) {

    if (!value) {
        return '—';
    }

    return new Date(value).toLocaleString(
        'en-IN',
        {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }
    );
}


function getStatusClass(status) {

    const currentStatus = String(
        status || 'new'
    )
        .toLowerCase()
        .trim();

    if (currentStatus === 'new') {
        return 'new';
    }

    if (currentStatus === 'read') {
        return 'read';
    }

    if (currentStatus === 'contacted') {
        return 'contacted';
    }

    if (currentStatus === 'closed') {
        return 'closed';
    }

    return 'default';
}


/*
|--------------------------------------------------------------------------
| ICONS
|--------------------------------------------------------------------------
*/

function UserIcon() {
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
        >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
    );
}


function BuildingIcon() {
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
        >
            <rect x="4" y="3" width="16" height="18" rx="2" />
            <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" />
        </svg>
    );
}


function MailIcon() {
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
        >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
        </svg>
    );
}


function PhoneIcon() {
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
        >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
        </svg>
    );
}


function SubjectIcon() {
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
        >
            <path d="M4 6h16" />
            <path d="M4 12h12" />
            <path d="M4 18h8" />
        </svg>
    );
}


function MessageIcon() {
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
        >
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
        </svg>
    );
}


function CalendarIcon() {
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
        >
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 11h18" />
        </svg>
    );
}


function ArrowLeftIcon() {
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
        >
            <path d="m15 18-6-6 6-6" />
        </svg>
    );
}


function SaveIcon() {
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
        >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
            <path d="M17 21v-8H7v8" />
            <path d="M7 3v5h8" />
        </svg>
    );
}


function CheckIcon() {
    return (
        <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m5 12 4 4L19 6" />
        </svg>
    );
}


/*
|--------------------------------------------------------------------------
| DETAIL ITEM
|--------------------------------------------------------------------------
*/

function DetailItem({
    icon,
    label,
    children,
}) {

    return (
        <div className="contact-detail-item">

            <div className="contact-detail-icon">
                {icon}
            </div>

            <div>

                <div className="contact-detail-label">
                    {label}
                </div>

                <div className="contact-detail-value">
                    {children}
                </div>

            </div>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

export default function Show({
    item,
}) {

    const [
        showSuccessModal,
        setShowSuccessModal,
    ] = useState(false);


    const {
        data,
        setData,
        patch,
        processing,
        errors,
    } = useForm({
        status: item?.status || 'new',
    });


    function submit(e) {

        e.preventDefault();

        patch(
            `/cms/contact-enquiries/${item.id}`,
            {
                preserveScroll: true,

                onSuccess: () => {
                    setShowSuccessModal(true);
                },
            }
        );
    }


    function closeSuccessModal() {

        setShowSuccessModal(false);

        router.visit(
            '/cms/contact-enquiries',
            {
                method: 'get',
                preserveState: false,
                preserveScroll: false,
            }
        );
    }


    return (
        <CmsLayout
            title={`Contact Enquiry #${item.id}`}
        >

            <Head title="Contact Enquiry · Biltrax CMS" />

            <style>{`

                /*
                |--------------------------------------------------------------------------
                | PAGE
                |--------------------------------------------------------------------------
                */

                .contact-show-page {
                    animation:
                        contactShowEnter
                        .4s ease both;
                }


                /*
                |--------------------------------------------------------------------------
                | TOP
                |--------------------------------------------------------------------------
                */

                .contact-show-top {
                    display: flex;

                    align-items: center;

                    justify-content: space-between;

                    gap: 16px;

                    margin-bottom: 18px;
                }


                .contact-back-button {
                    height: 40px;

                    padding: 0 14px;

                    display: inline-flex;

                    align-items: center;

                    gap: 7px;

                    border:
                        1px solid #e1e5eb;

                    border-radius: 9px;

                    background: #ffffff;

                    color: #475467 !important;

                    text-decoration: none;

                    font-size: 13px;

                    font-weight: 600;

                    transition:
                        transform .18s ease,
                        background .18s ease,
                        color .18s ease;
                }


                .contact-back-button:hover {
                    transform:
                        translateX(-2px);

                    color: #c0122f !important;

                    background: #fff7f8;
                }


                .contact-reference {
                    color: #98a0ae;

                    font-size: 12px;

                    font-weight: 600;
                }


                /*
                |--------------------------------------------------------------------------
                | DETAIL CARD
                |--------------------------------------------------------------------------
                */

                .contact-show-card {
                    overflow: hidden;

                    margin-bottom: 18px;

                    background: #ffffff;

                    border:
                        1px solid #e7e9ee;

                    border-radius: 16px;

                    box-shadow:
                        0 8px 28px
                        rgba(16, 24, 40, .035);
                }


                .contact-show-header {
                    padding: 22px 24px;

                    display: flex;

                    align-items: center;

                    justify-content: space-between;

                    gap: 20px;

                    border-bottom:
                        1px solid #eceef2;
                }


                .contact-show-person {
                    display: flex;

                    align-items: center;

                    gap: 14px;
                }


                .contact-show-avatar {
                    width: 48px;
                    height: 48px;

                    flex: 0 0 48px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    border-radius: 50%;

                    color: #c0122f;

                    background:
                        rgba(192, 18, 47, .09);

                    font-size: 17px;

                    font-weight: 700;
                }


                .contact-show-name {
                    color: #111827;

                    font-size: 18px;

                    font-weight: 700;
                }


                .contact-show-meta {
                    margin-top: 4px;

                    display: flex;

                    align-items: center;

                    gap: 6px;

                    color: #8a91a0;

                    font-size: 12px;
                }


                /*
                |--------------------------------------------------------------------------
                | CURRENT STATUS
                |--------------------------------------------------------------------------
                */

                .contact-show-status {
                    display: inline-flex;

                    align-items: center;

                    gap: 7px;

                    padding: 6px 11px;

                    border-radius: 20px;

                    font-size: 12px;

                    font-weight: 650;

                    text-transform: capitalize;
                }


                .contact-show-status::before {
                    content: "";

                    width: 6px;
                    height: 6px;

                    border-radius: 50%;

                    background: currentColor;
                }


                .contact-show-status.new {
                    color: #175cd3;

                    background: #eaf2ff;
                }


                .contact-show-status.read {
                    color: #6941c6;

                    background: #f1ebff;
                }


                .contact-show-status.contacted {
                    color: #087443;

                    background: #e8f8ef;
                }


                .contact-show-status.closed {
                    color: #667085;

                    background: #f2f4f7;
                }


                .contact-show-status.default {
                    color: #667085;

                    background: #f2f4f7;
                }


                /*
                |--------------------------------------------------------------------------
                | DETAILS
                |--------------------------------------------------------------------------
                */

                .contact-details-grid {
                    display: grid;

                    grid-template-columns:
                        repeat(2, minmax(0, 1fr));
                }


                .contact-detail-item {
                    min-height: 95px;

                    padding: 20px 24px;

                    display: flex;

                    align-items: flex-start;

                    gap: 13px;

                    border-bottom:
                        1px solid #eef0f3;

                    transition:
                        background .18s ease;
                }


                .contact-detail-item:nth-child(odd) {
                    border-right:
                        1px solid #eef0f3;
                }


                .contact-detail-item:hover {
                    background: #fafbfc;
                }


                .contact-detail-icon {
                    width: 36px;
                    height: 36px;

                    flex: 0 0 36px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    border-radius: 9px;

                    color: #c0122f;

                    background:
                        rgba(192, 18, 47, .07);
                }


                .contact-detail-label {
                    margin-bottom: 6px;

                    color: #8a91a0;

                    font-size: 10px;

                    font-weight: 700;

                    text-transform: uppercase;

                    letter-spacing: .08em;
                }


                .contact-detail-value {
                    color: #303846;

                    font-size: 14px;

                    line-height: 1.5;

                    word-break: break-word;
                }


                .contact-detail-value a {
                    color: #344054;

                    text-decoration: none;
                }


                .contact-detail-value a:hover {
                    color: #c0122f;
                }


                /*
                |--------------------------------------------------------------------------
                | MESSAGE
                |--------------------------------------------------------------------------
                */

                .contact-message-section {
                    padding: 22px 24px;
                }


                .contact-message-heading {
                    display: flex;

                    align-items: center;

                    gap: 9px;

                    margin-bottom: 12px;

                    color: #202631;

                    font-size: 14px;

                    font-weight: 700;
                }


                .contact-message-heading svg {
                    color: #c0122f;
                }


                .contact-message {
                    min-height: 90px;

                    padding: 17px 18px;

                    border:
                        1px solid #e7e9ee;

                    border-radius: 11px;

                    background: #fafbfc;

                    color: #4a5362;

                    font-size: 14px;

                    line-height: 1.7;

                    white-space: pre-line;
                }


                /*
                |--------------------------------------------------------------------------
                | STATUS CARD
                |--------------------------------------------------------------------------
                */

                .contact-status-card {
                    padding: 22px 24px;

                    background: #ffffff;

                    border:
                        1px solid #e7e9ee;

                    border-radius: 16px;

                    box-shadow:
                        0 8px 28px
                        rgba(16, 24, 40, .035);
                }


                .contact-status-title {
                    color: #111827;

                    font-size: 15px;

                    font-weight: 700;
                }


                .contact-status-description {
                    margin-top: 4px;

                    color: #8a91a0;

                    font-size: 12px;
                }


                .contact-status-form {
                    margin-top: 18px;

                    display: flex;

                    align-items: flex-end;

                    gap: 12px;

                    flex-wrap: wrap;
                }


                .contact-status-field {
                    width: 280px;

                    max-width: 100%;
                }


                .contact-status-field label {
                    display: block;

                    margin-bottom: 7px;

                    color: #344054;

                    font-size: 12px;

                    font-weight: 650;
                }


                /*
                |--------------------------------------------------------------------------
                | DROPDOWN
                |--------------------------------------------------------------------------
                */

                .contact-select-wrap {
                    position: relative;
                }


                .contact-status-select {
                    width: 100%;

                    height: 44px;

                    padding:
                        0 42px 0 14px;

                    appearance: none;

                    -webkit-appearance: none;

                    border:
                        1px solid #d9dee7;

                    border-radius: 9px;

                    outline: none;

                    background: #ffffff;

                    color: #344054;

                    font-size: 13px;

                    font-weight: 600;

                    cursor: pointer;

                    transition:
                        border-color .18s ease,
                        box-shadow .18s ease;
                }


                .contact-status-select:hover {
                    border-color: #c5cbd4;
                }


                .contact-status-select:focus {
                    border-color:
                        rgba(192, 18, 47, .55);

                    box-shadow:
                        0 0 0 3px
                        rgba(192, 18, 47, .08);
                }


                .contact-select-arrow {
                    position: absolute;

                    right: 14px;

                    top: 50%;

                    width: 7px;
                    height: 7px;

                    border-right:
                        2px solid #667085;

                    border-bottom:
                        2px solid #667085;

                    transform:
                        translateY(-70%)
                        rotate(45deg);

                    pointer-events: none;
                }


                .contact-error {
                    margin-top: 6px;

                    color: #b42318;

                    font-size: 12px;
                }


                /*
                |--------------------------------------------------------------------------
                | ACTIONS
                |--------------------------------------------------------------------------
                */

                .contact-status-actions {
                    display: flex;

                    align-items: center;

                    gap: 9px;
                }


                .contact-update-button {
                    height: 44px;

                    padding: 0 16px;

                    border: 0;

                    border-radius: 9px;

                    display: inline-flex;

                    align-items: center;

                    justify-content: center;

                    gap: 8px;

                    background: #c0122f;

                    color: #ffffff;

                    font-size: 13px;

                    font-weight: 650;

                    cursor: pointer;

                    box-shadow:
                        0 5px 14px
                        rgba(192, 18, 47, .16);

                    transition:
                        transform .18s ease,
                        background .18s ease,
                        box-shadow .18s ease;
                }


                .contact-update-button:hover:not(:disabled) {
                    background: #a90f29;

                    transform:
                        translateY(-1px);

                    box-shadow:
                        0 7px 17px
                        rgba(192, 18, 47, .22);
                }


                .contact-update-button:disabled {
                    opacity: .6;

                    cursor: not-allowed;
                }


                .contact-back-secondary {
                    height: 44px;

                    padding: 0 16px;

                    display: inline-flex;

                    align-items: center;

                    justify-content: center;

                    border:
                        1px solid #e0e4ea;

                    border-radius: 9px;

                    background: #f5f6f8;

                    color: #475467 !important;

                    text-decoration: none;

                    font-size: 13px;

                    font-weight: 600;

                    transition:
                        background .18s ease,
                        transform .18s ease;
                }


                .contact-back-secondary:hover {
                    background: #eceff3;

                    transform:
                        translateY(-1px);
                }


                /*
                |--------------------------------------------------------------------------
                | SUCCESS MODAL
                |--------------------------------------------------------------------------
                */

                .contact-modal-overlay {
                    position: fixed;

                    inset: 0;

                    z-index: 99999;

                    padding: 20px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    background:
                        rgba(15, 23, 42, .48);

                    backdrop-filter: blur(4px);

                    -webkit-backdrop-filter:
                        blur(4px);

                    animation:
                        contactOverlayIn
                        .2s ease both;
                }


                .contact-success-modal {
                    width: 100%;

                    max-width: 410px;

                    padding: 32px;

                    text-align: center;

                    background: #ffffff;

                    border-radius: 18px;

                    box-shadow:
                        0 24px 70px
                        rgba(15, 23, 42, .22);

                    animation:
                        contactModalIn
                        .28s cubic-bezier(
                            .2,
                            .8,
                            .2,
                            1
                        ) both;
                }


                .contact-success-icon {
                    width: 70px;
                    height: 70px;

                    margin:
                        0 auto 19px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    border-radius: 50%;

                    color: #087443;

                    background: #e8f8ef;

                    box-shadow:
                        0 0 0 8px
                        rgba(8, 116, 67, .06);

                    animation:
                        contactCheckIn
                        .4s ease .08s both;
                }


                .contact-success-title {
                    color: #111827;

                    font-size: 20px;

                    font-weight: 750;
                }


                .contact-success-message {
                    margin-top: 8px;

                    color: #667085;

                    font-size: 13px;

                    line-height: 1.6;
                }


                .contact-success-status {
                    margin-top: 16px;

                    padding: 10px 13px;

                    display: inline-flex;

                    align-items: center;

                    gap: 7px;

                    border-radius: 9px;

                    color: #087443;

                    background: #ecf9f2;

                    font-size: 12px;

                    font-weight: 650;

                    text-transform: capitalize;
                }


                .contact-success-status::before {
                    content: "";

                    width: 6px;
                    height: 6px;

                    border-radius: 50%;

                    background: currentColor;
                }


                .contact-success-ok {
                    width: 100%;

                    height: 44px;

                    margin-top: 23px;

                    border: 0;

                    border-radius: 9px;

                    background: #c0122f;

                    color: #ffffff;

                    font-size: 13px;

                    font-weight: 700;

                    cursor: pointer;

                    box-shadow:
                        0 6px 17px
                        rgba(192, 18, 47, .18);

                    transition:
                        transform .18s ease,
                        background .18s ease;
                }


                .contact-success-ok:hover {
                    background: #a90f29;

                    transform:
                        translateY(-1px);
                }


                /*
                |--------------------------------------------------------------------------
                | ANIMATIONS
                |--------------------------------------------------------------------------
                */

                @keyframes contactShowEnter {

                    from {
                        opacity: 0;

                        transform:
                            translateY(7px);
                    }

                    to {
                        opacity: 1;

                        transform:
                            translateY(0);
                    }
                }


                @keyframes contactOverlayIn {

                    from {
                        opacity: 0;
                    }

                    to {
                        opacity: 1;
                    }
                }


                @keyframes contactModalIn {

                    from {
                        opacity: 0;

                        transform:
                            translateY(12px)
                            scale(.97);
                    }

                    to {
                        opacity: 1;

                        transform:
                            translateY(0)
                            scale(1);
                    }
                }


                @keyframes contactCheckIn {

                    from {
                        opacity: 0;

                        transform:
                            scale(.65);
                    }

                    to {
                        opacity: 1;

                        transform:
                            scale(1);
                    }
                }


                /*
                |--------------------------------------------------------------------------
                | RESPONSIVE
                |--------------------------------------------------------------------------
                */

                @media (max-width: 768px) {

                    .contact-show-header {
                        align-items:
                            flex-start;

                        flex-direction:
                            column;
                    }


                    .contact-details-grid {
                        grid-template-columns:
                            1fr;
                    }


                    .contact-detail-item:nth-child(odd) {
                        border-right: 0;
                    }


                    .contact-status-form {
                        align-items: stretch;

                        flex-direction:
                            column;
                    }


                    .contact-status-field {
                        width: 100%;
                    }


                    .contact-status-actions {
                        width: 100%;
                    }


                    .contact-update-button,
                    .contact-back-secondary {
                        flex: 1;
                    }


                    .contact-success-modal {
                        padding: 28px 22px;
                    }
                }

            `}</style>


            <div className="contact-show-page">

                {/*
                |--------------------------------------------------------------------------
                | TOP
                |--------------------------------------------------------------------------
                */}

                <div className="contact-show-top">

                    <Link
                        href="/cms/contact-enquiries"
                        className="contact-back-button"
                    >
                        <ArrowLeftIcon />

                        Back to Contact Enquiries
                    </Link>


                    <div className="contact-reference">
                        Contact Enquiry #{item.id}
                    </div>

                </div>


                {/*
                |--------------------------------------------------------------------------
                | DETAILS
                |--------------------------------------------------------------------------
                */}

                <div className="contact-show-card">

                    <div className="contact-show-header">

                        <div className="contact-show-person">

                            <div className="contact-show-avatar">

                                {String(
                                    item.name || 'C'
                                )
                                    .trim()
                                    .charAt(0)}

                            </div>


                            <div>

                                <div className="contact-show-name">
                                    {value(item.name)}
                                </div>


                                <div className="contact-show-meta">

                                    <CalendarIcon />

                                    Received{' '}

                                    {formatDate(
                                        item.created_at
                                    )}

                                </div>

                            </div>

                        </div>


                        <span
                            className={
                                `contact-show-status ${getStatusClass(
                                    item.status
                                )}`
                            }
                        >
                            {item.status || 'new'}
                        </span>

                    </div>


                    <div className="contact-details-grid">

                        <DetailItem
                            icon={<BuildingIcon />}
                            label="Company"
                        >
                            {value(item.company)}
                        </DetailItem>


                        <DetailItem
                            icon={<UserIcon />}
                            label="Name"
                        >
                            {value(item.name)}
                        </DetailItem>


                        <DetailItem
                            icon={<MailIcon />}
                            label="Email"
                        >

                            {item.email ? (

                                <a
                                    href={`mailto:${item.email}`}
                                >
                                    {item.email}
                                </a>

                            ) : (
                                '—'
                            )}

                        </DetailItem>


                        <DetailItem
                            icon={<PhoneIcon />}
                            label="Phone"
                        >

                            {item.phone ? (

                                <a
                                    href={`tel:${item.phone}`}
                                >
                                    {item.phone}
                                </a>

                            ) : (
                                '—'
                            )}

                        </DetailItem>


                        <DetailItem
                            icon={<SubjectIcon />}
                            label="Subject"
                        >
                            {value(item.subject)}
                        </DetailItem>

                    </div>


                    <div className="contact-message-section">

                        <div className="contact-message-heading">

                            <MessageIcon />

                            Message

                        </div>


                        <div className="contact-message">
                            {value(item.message)}
                        </div>

                    </div>

                </div>


                {/*
                |--------------------------------------------------------------------------
                | STATUS
                |--------------------------------------------------------------------------
                */}

                <div className="contact-status-card">

                    <div className="contact-status-title">
                        Contact Enquiry Status
                    </div>


                    <div className="contact-status-description">
                        Update the progress of this contact enquiry.
                    </div>


                    <form
                        onSubmit={submit}
                        className="contact-status-form"
                    >

                        <div className="contact-status-field">

                            <label>
                                Current Status
                            </label>


                            <div className="contact-select-wrap">

                                <select
                                    className="contact-status-select"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData(
                                            'status',
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="new">
                                        🔵 New
                                    </option>

                                    <option value="read">
                                        🟣 Read
                                    </option>

                                    <option value="contacted">
                                        🟢 Contacted
                                    </option>

                                    <option value="closed">
                                        ⚫ Closed
                                    </option>

                                </select>


                                <span className="contact-select-arrow" />

                            </div>


                            {errors.status && (

                                <div className="contact-error">
                                    {errors.status}
                                </div>

                            )}

                        </div>


                        <div className="contact-status-actions">

                            <button
                                type="submit"
                                className="contact-update-button"
                                disabled={processing}
                            >

                                <SaveIcon />

                                {processing
                                    ? 'Updating...'
                                    : 'Update Status'}

                            </button>


                            <Link
                                href="/cms/contact-enquiries"
                                className="contact-back-secondary"
                            >
                                Back
                            </Link>

                        </div>

                    </form>

                </div>

            </div>


            {/*
            |--------------------------------------------------------------------------
            | SUCCESS MODAL
            |--------------------------------------------------------------------------
            */}

            {showSuccessModal && (

                <div
                    className="contact-modal-overlay"
                    role="dialog"
                    aria-modal="true"
                >

                    <div className="contact-success-modal">

                        <div className="contact-success-icon">
                            <CheckIcon />
                        </div>


                        <div className="contact-success-title">
                            Status Updated
                        </div>


                        <div className="contact-success-message">
                            The contact enquiry status has been updated successfully.
                        </div>


                        <div className="contact-success-status">
                            {data.status}
                        </div>


                        <button
                            type="button"
                            className="contact-success-ok"
                            onClick={closeSuccessModal}
                            autoFocus
                        >
                            OK
                        </button>

                    </div>

                </div>

            )}

        </CmsLayout>
    );
}