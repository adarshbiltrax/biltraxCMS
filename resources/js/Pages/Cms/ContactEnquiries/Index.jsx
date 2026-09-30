import React from 'react';

import {
    Head,
    Link,
} from '@inertiajs/react';

import CmsLayout from '../../../Layouts/CmsLayout';
import Pagination from '../Pagination';


/*
|--------------------------------------------------------------------------
| ICONS
|--------------------------------------------------------------------------
*/

function ContactIcon() {
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
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
        </svg>
    );
}


function EyeIcon() {
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
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}


function CalendarIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4" />
            <path d="M8 3v4" />
            <path d="M3 11h18" />
        </svg>
    );
}


function BuildingIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect x="4" y="3" width="16" height="18" rx="2" />
            <path d="M8 7h2" />
            <path d="M14 7h2" />
            <path d="M8 11h2" />
            <path d="M14 11h2" />
            <path d="M8 15h2" />
            <path d="M14 15h2" />
        </svg>
    );
}


function MailIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
        </svg>
    );
}


function PhoneIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
        </svg>
    );
}


/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

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
| PAGE
|--------------------------------------------------------------------------
*/

export default function Index({
    items,
}) {

    const rows = items?.data || [];
    const total = items?.total ?? rows.length;

    return (
        <CmsLayout title="Contact Enquiries">

            <Head title="Contact Enquiries · Biltrax CMS" />

            <style>{`

                .contact-enquiries-page {
                    animation:
                        contactPageEnter
                        .45s ease both;
                }


                /*
                |--------------------------------------------------------------------------
                | CARD
                |--------------------------------------------------------------------------
                */

                .contact-directory {
                    overflow: hidden;

                    background: #ffffff;

                    border: 1px solid #e7e9ee;

                    border-radius: 16px;

                    box-shadow:
                        0 1px 2px rgba(16, 24, 40, .02),
                        0 8px 28px rgba(16, 24, 40, .035);
                }


                /*
                |--------------------------------------------------------------------------
                | HEADER
                |--------------------------------------------------------------------------
                */

                .contact-directory-header {
                    display: flex;

                    align-items: center;

                    justify-content: space-between;

                    gap: 20px;

                    padding: 20px 24px;

                    border-bottom:
                        1px solid #eceef2;
                }


                .contact-directory-heading {
                    display: flex;

                    align-items: center;

                    gap: 12px;
                }


                .contact-directory-icon {
                    width: 40px;
                    height: 40px;

                    flex: 0 0 40px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    border-radius: 11px;

                    color: #c0122f;

                    background:
                        rgba(192, 18, 47, .08);

                    transition:
                        transform .2s ease,
                        background .2s ease;
                }


                .contact-directory:hover
                .contact-directory-icon {
                    transform: rotate(-3deg) scale(1.04);

                    background:
                        rgba(192, 18, 47, .12);
                }


                .contact-directory-title {
                    color: #111827;

                    font-size: 15px;

                    font-weight: 700;
                }


                .contact-directory-subtitle {
                    margin-top: 4px;

                    color: #8a91a0;

                    font-size: 12px;
                }


                .contact-count {
                    padding: 6px 11px;

                    border-radius: 20px;

                    background: #f3f4f6;

                    color: #596171;

                    font-size: 12px;

                    font-weight: 600;
                }


                /*
                |--------------------------------------------------------------------------
                | TABLE
                |--------------------------------------------------------------------------
                */

                .contact-table-wrap {
                    width: 100%;

                    overflow-x: auto;
                }


                .contact-table {
                    width: 100%;

                    border-collapse: collapse;

                    border-spacing: 0;
                }


                .contact-table thead {
                    background: #fafbfc;
                }


                .contact-table th {
                    padding: 13px 18px;

                    text-align: left;

                    border-bottom:
                        1px solid #eceef2;

                    color: #697180;

                    font-size: 11px;

                    font-weight: 700;

                    text-transform: uppercase;

                    letter-spacing: .06em;

                    white-space: nowrap;
                }


                .contact-table td {
                    padding: 17px 18px;

                    border-bottom:
                        1px solid #eef0f3;

                    color: #3c4350;

                    font-size: 13px;

                    vertical-align: middle;
                }


                .contact-row {
                    animation:
                        contactRowEnter
                        .4s ease both;

                    transition:
                        background .18s ease;
                }


                .contact-row:hover {
                    background: #fafbfc;
                }


                .contact-table tbody
                tr:last-child td {
                    border-bottom: 0;
                }


                /*
                |--------------------------------------------------------------------------
                | DATE
                |--------------------------------------------------------------------------
                */

                .contact-date {
                    min-width: 145px;

                    display: inline-flex;

                    align-items: center;

                    gap: 7px;

                    color: #606978;
                }


                .contact-date svg {
                    color: #98a0ae;
                }


                /*
                |--------------------------------------------------------------------------
                | PERSON
                |--------------------------------------------------------------------------
                */

                .contact-person {
                    min-width: 155px;

                    display: flex;

                    align-items: center;

                    gap: 11px;
                }


                .contact-avatar {
                    width: 36px;
                    height: 36px;

                    flex: 0 0 36px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    border-radius: 50%;

                    color: #c0122f;

                    background:
                        rgba(192, 18, 47, .08);

                    font-size: 13px;

                    font-weight: 700;

                    text-transform: uppercase;

                    transition:
                        transform .18s ease,
                        background .18s ease;
                }


                .contact-row:hover
                .contact-avatar {
                    transform: scale(1.06);

                    background:
                        rgba(192, 18, 47, .13);
                }


                .contact-name {
                    color: #111827;

                    font-weight: 650;
                }


                /*
                |--------------------------------------------------------------------------
                | ICON VALUES
                |--------------------------------------------------------------------------
                */

                .contact-icon-value {
                    display: inline-flex;

                    align-items: center;

                    gap: 7px;

                    color: #555e6d;
                }


                .contact-icon-value svg {
                    flex-shrink: 0;

                    color: #98a0ae;
                }


                .contact-email,
                .contact-phone {
                    color: #475467;

                    text-decoration: none;

                    transition:
                        color .18s ease;
                }


                .contact-email:hover,
                .contact-phone:hover {
                    color: #c0122f;
                }


                /*
                |--------------------------------------------------------------------------
                | STATUS
                |--------------------------------------------------------------------------
                */

                .contact-status {
                    display: inline-flex;

                    align-items: center;

                    gap: 7px;

                    min-height: 27px;

                    padding: 4px 10px;

                    border-radius: 20px;

                    font-size: 12px;

                    font-weight: 650;

                    text-transform: capitalize;

                    white-space: nowrap;
                }


                .contact-status::before {
                    content: "";

                    width: 6px;
                    height: 6px;

                    border-radius: 50%;

                    background: currentColor;
                }


                .contact-status.new {
                    color: #175cd3;

                    background: #eaf2ff;
                }


                .contact-status.read {
                    color: #6941c6;

                    background: #f1ebff;
                }


                .contact-status.contacted {
                    color: #087443;

                    background: #e8f8ef;
                }


                .contact-status.closed {
                    color: #667085;

                    background: #f2f4f7;
                }


                .contact-status.default {
                    color: #667085;

                    background: #f2f4f7;
                }


                /*
                |--------------------------------------------------------------------------
                | VIEW
                |--------------------------------------------------------------------------
                */

                .contact-view-button {
                    height: 36px;

                    padding: 0 13px;

                    display: inline-flex;

                    align-items: center;

                    justify-content: center;

                    gap: 7px;

                    border:
                        1px solid #e2e6ec;

                    border-radius: 8px;

                    background: #f5f6f8;

                    color: #344054 !important;

                    text-decoration: none;

                    font-size: 13px;

                    font-weight: 600;

                    transition:
                        transform .18s ease,
                        background .18s ease,
                        color .18s ease,
                        border-color .18s ease,
                        box-shadow .18s ease;
                }


                .contact-view-button:hover {
                    transform:
                        translateY(-1px);

                    color: #ffffff !important;

                    background: #c0122f;

                    border-color: #c0122f;

                    box-shadow:
                        0 5px 14px
                        rgba(192, 18, 47, .18);
                }


                /*
                |--------------------------------------------------------------------------
                | EMPTY
                |--------------------------------------------------------------------------
                */

                .contact-empty {
                    padding:
                        64px 24px !important;

                    text-align: center;
                }


                .contact-empty-icon {
                    width: 54px;
                    height: 54px;

                    margin:
                        0 auto 14px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    border-radius: 14px;

                    color: #98a0ae;

                    background: #f4f5f7;
                }


                .contact-empty-title {
                    color: #202631;

                    font-size: 15px;

                    font-weight: 700;
                }


                .contact-empty-text {
                    margin-top: 5px;

                    color: #8a91a0;

                    font-size: 13px;
                }


                /*
                |--------------------------------------------------------------------------
                | ANIMATION
                |--------------------------------------------------------------------------
                */

                @keyframes contactPageEnter {

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


                @keyframes contactRowEnter {

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
                | MOBILE
                |--------------------------------------------------------------------------
                */

                @media (max-width: 768px) {

                    .contact-directory-header {
                        padding: 17px;
                    }


                    .contact-table th,
                    .contact-table td {
                        padding-left: 14px;

                        padding-right: 14px;
                    }
                }

            `}</style>


            <div className="contact-enquiries-page">

                <div className="contact-directory">

                    <div className="contact-directory-header">

                        <div className="contact-directory-heading">

                            <div className="contact-directory-icon">
                                <ContactIcon />
                            </div>

                            <div>

                                <div className="contact-directory-title">
                                    Contact Enquiries
                                </div>

                                <div className="contact-directory-subtitle">
                                    Review and manage Contact Us submissions
                                </div>

                            </div>

                        </div>


                        <div className="contact-count">

                            {total}{' '}

                            {total === 1
                                ? 'enquiry'
                                : 'enquiries'}

                        </div>

                    </div>


                    <div className="contact-table-wrap">

                        <table className="contact-table">

                            <thead>

                                <tr>
                                    <th>Date</th>
                                    <th>Name</th>
                                    <th>Company</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>

                            </thead>


                            <tbody>

                                {rows.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="contact-empty"
                                        >

                                            <div className="contact-empty-icon">
                                                <ContactIcon />
                                            </div>

                                            <div className="contact-empty-title">
                                                No contact enquiries found
                                            </div>

                                            <div className="contact-empty-text">
                                                Contact Us submissions will appear here.
                                            </div>

                                        </td>

                                    </tr>

                                ) : (

                                    rows.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <tr
                                                key={item.id}
                                                className="contact-row"
                                                style={{
                                                    animationDelay:
                                                        `${Math.min(
                                                            index * 35,
                                                            280
                                                        )}ms`,
                                                }}
                                            >

                                                <td>

                                                    <span className="contact-date">

                                                        <CalendarIcon />

                                                        {formatDate(
                                                            item.created_at
                                                        )}

                                                    </span>

                                                </td>


                                                <td>

                                                    <div className="contact-person">

                                                        <div className="contact-avatar">

                                                            {String(
                                                                item.name ||
                                                                'C'
                                                            )
                                                                .trim()
                                                                .charAt(0)}

                                                        </div>

                                                        <div className="contact-name">
                                                            {item.name || '—'}
                                                        </div>

                                                    </div>

                                                </td>


                                                <td>

                                                    {item.company ? (

                                                        <span className="contact-icon-value">

                                                            <BuildingIcon />

                                                            {item.company}

                                                        </span>

                                                    ) : (
                                                        '—'
                                                    )}

                                                </td>


                                                <td>

                                                    {item.email ? (

                                                        <span className="contact-icon-value">

                                                            <MailIcon />

                                                            <a
                                                                href={`mailto:${item.email}`}
                                                                className="contact-email"
                                                            >
                                                                {item.email}
                                                            </a>

                                                        </span>

                                                    ) : (
                                                        '—'
                                                    )}

                                                </td>


                                                <td>

                                                    {item.phone ? (

                                                        <span className="contact-icon-value">

                                                            <PhoneIcon />

                                                            <a
                                                                href={`tel:${item.phone}`}
                                                                className="contact-phone"
                                                            >
                                                                {item.phone}
                                                            </a>

                                                        </span>

                                                    ) : (
                                                        '—'
                                                    )}

                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            `contact-status ${getStatusClass(
                                                                item.status
                                                            )}`
                                                        }
                                                    >
                                                        {item.status || 'new'}
                                                    </span>

                                                </td>


                                                <td>

                                                    <Link
                                                        href={
                                                            `/cms/contact-enquiries/${item.id}`
                                                        }
                                                        className="contact-view-button"
                                                    >

                                                        <EyeIcon />

                                                        View

                                                    </Link>

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>


                <Pagination
                    links={items?.links || []}
                />

            </div>

        </CmsLayout>
    );
}