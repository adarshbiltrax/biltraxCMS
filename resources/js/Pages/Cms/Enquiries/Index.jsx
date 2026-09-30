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

function EnquiryIcon() {
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
            <path d="M8 9h8" />
            <path d="M8 13h5" />
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
        >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
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
        >
            <rect
                x="3"
                y="5"
                width="18"
                height="16"
                rx="2"
            />

            <path d="M16 3v4" />
            <path d="M8 3v4" />
            <path d="M3 11h18" />
        </svg>
    );
}


/*
|--------------------------------------------------------------------------
| DATE
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


/*
|--------------------------------------------------------------------------
| STATUS
|--------------------------------------------------------------------------
*/

function getStatusClass(status) {

    const value = String(
        status || 'new'
    )
        .toLowerCase()
        .trim();

    if (value === 'new') {
        return 'new';
    }

    if (value === 'reviewed') {
        return 'reviewed';
    }

    if (value === 'contacted') {
        return 'contacted';
    }

    if (value === 'closed') {
        return 'closed';
    }

    return 'default';
}


export default function Index({
    items,
}) {

    const rows = items?.data || [];

    return (

        <CmsLayout title="Enquiries">

            <Head title="Enquiries · Biltrax CMS" />


            <style>{`

                /*
                |--------------------------------------------------------------------------
                | PAGE
                |--------------------------------------------------------------------------
                */

                .enquiries-page {
                    animation:
                        enquiryPageEnter
                        .4s ease both;
                }


                /*
                |--------------------------------------------------------------------------
                | DIRECTORY CARD
                |--------------------------------------------------------------------------
                */

                .enquiry-directory {
                    overflow: hidden;

                    background: #ffffff;

                    border:
                        1px solid #e7e9ee;

                    border-radius: 16px;

                    box-shadow:
                        0 1px 2px rgba(16, 24, 40, .02),
                        0 8px 28px rgba(16, 24, 40, .035);
                }


                .enquiry-directory-header {
                    min-height: 76px;

                    padding: 18px 24px;

                    display: flex;

                    align-items: center;

                    justify-content: space-between;

                    gap: 20px;

                    border-bottom:
                        1px solid #eceef2;
                }


                .enquiry-directory-heading {
                    display: flex;

                    align-items: center;

                    gap: 12px;
                }


                .enquiry-directory-icon {
                    width: 40px;
                    height: 40px;

                    flex: 0 0 40px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    border-radius: 11px;

                    color: #c8102e;

                    background:
                        rgba(200, 16, 46, .09);
                }


                .enquiry-directory-title {
                    color: #111827;

                    font-size: 15px;

                    font-weight: 700;
                }


                .enquiry-directory-subtitle {
                    margin-top: 3px;

                    color: #8a91a0;

                    font-size: 12px;
                }


                .enquiry-count {
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

                .enquiry-table-wrap {
                    width: 100%;

                    overflow-x: auto;
                }


                .enquiry-table {
                    width: 100%;

                    border-collapse: collapse;
                }


                .enquiry-table thead {
                    background: #fafbfc;
                }


                .enquiry-table th {
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


                .enquiry-table td {
                    padding: 16px 18px;

                    border-bottom:
                        1px solid #eef0f3;

                    color: #3c4350;

                    font-size: 13px;

                    vertical-align: middle;
                }


                .enquiry-row {
                    animation:
                        enquiryRowEnter
                        .4s ease both;

                    transition:
                        background .18s ease;
                }


                .enquiry-row:hover {
                    background: #fafbfc;
                }


                .enquiry-table tbody
                tr:last-child td {
                    border-bottom: 0;
                }


                /*
                |--------------------------------------------------------------------------
                | DATE
                |--------------------------------------------------------------------------
                */

                .enquiry-date {
                    min-width: 145px;

                    display: inline-flex;

                    align-items: center;

                    gap: 7px;

                    color: #606978;
                }


                .enquiry-date svg {
                    color: #98a0ae;
                }


                /*
                |--------------------------------------------------------------------------
                | PERSON
                |--------------------------------------------------------------------------
                */

                .enquiry-person {
                    display: flex;

                    align-items: center;

                    gap: 11px;

                    min-width: 160px;
                }


                .enquiry-avatar {
                    width: 36px;
                    height: 36px;

                    flex: 0 0 36px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    border-radius: 50%;

                    background:
                        rgba(200, 16, 46, .08);

                    color: #c8102e;

                    font-size: 13px;

                    font-weight: 700;

                    text-transform: uppercase;

                    transition:
                        transform .18s ease,
                        background .18s ease;
                }


                .enquiry-row:hover
                .enquiry-avatar {

                    transform: scale(1.05);

                    background:
                        rgba(200, 16, 46, .13);
                }


                .enquiry-name {
                    color: #111827;

                    font-weight: 650;
                }


                /*
                |--------------------------------------------------------------------------
                | COMPANY / EMAIL
                |--------------------------------------------------------------------------
                */

                .enquiry-icon-value {
                    display: inline-flex;

                    align-items: center;

                    gap: 7px;

                    color: #555e6d;
                }


                .enquiry-icon-value svg {
                    color: #98a0ae;

                    flex-shrink: 0;
                }


                .enquiry-email {
                    color: #475467;

                    text-decoration: none;

                    transition: color .18s ease;
                }


                .enquiry-email:hover {
                    color: #c8102e;
                }


                /*
                |--------------------------------------------------------------------------
                | TYPE
                |--------------------------------------------------------------------------
                */

                .enquiry-type {
                    display: inline-flex;

                    padding: 5px 9px;

                    border-radius: 7px;

                    background: #f2f4f7;

                    color: #4d5665;

                    font-size: 12px;

                    font-weight: 600;

                    white-space: nowrap;
                }


                /*
                |--------------------------------------------------------------------------
                | STATUS
                |--------------------------------------------------------------------------
                */

                .enquiry-status {
                    display: inline-flex;

                    align-items: center;

                    gap: 7px;

                    padding: 5px 10px;

                    border-radius: 20px;

                    font-size: 12px;

                    font-weight: 650;

                    text-transform: capitalize;

                    white-space: nowrap;
                }


                .enquiry-status::before {
                    content: "";

                    width: 6px;
                    height: 6px;

                    border-radius: 50%;

                    background: currentColor;
                }


                .enquiry-status.new {
                    color: #175cd3;

                    background: #eaf2ff;
                }


                .enquiry-status.reviewed {
                    color: #6941c6;

                    background: #f1ebff;
                }


                .enquiry-status.contacted {
                    color: #087443;

                    background: #e8f8ef;
                }


                .enquiry-status.closed {
                    color: #667085;

                    background: #f2f4f7;
                }


                .enquiry-status.default {
                    color: #667085;

                    background: #f2f4f7;
                }


                /*
                |--------------------------------------------------------------------------
                | VIEW BUTTON
                |--------------------------------------------------------------------------
                */

                .enquiry-view-button {
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


                .enquiry-view-button:hover {
                    transform:
                        translateY(-1px);

                    color: #ffffff !important;

                    background: #c8102e;

                    border-color: #c8102e;

                    box-shadow:
                        0 5px 14px
                        rgba(200, 16, 46, .18);
                }


                /*
                |--------------------------------------------------------------------------
                | EMPTY
                |--------------------------------------------------------------------------
                */

                .enquiry-empty {
                    padding:
                        64px 24px !important;

                    text-align: center;
                }


                .enquiry-empty-icon {
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


                .enquiry-empty-title {
                    color: #202631;

                    font-size: 15px;

                    font-weight: 700;
                }


                .enquiry-empty-text {
                    margin-top: 5px;

                    color: #8a91a0;

                    font-size: 13px;
                }


                /*
                |--------------------------------------------------------------------------
                | ANIMATION
                |--------------------------------------------------------------------------
                */

                @keyframes enquiryPageEnter {

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


                @keyframes enquiryRowEnter {

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
                | RESPONSIVE
                |--------------------------------------------------------------------------
                */

                @media (max-width: 768px) {

                    .enquiry-directory-header {
                        padding: 17px;
                    }


                    .enquiry-table th,
                    .enquiry-table td {

                        padding-left: 14px;

                        padding-right: 14px;
                    }
                }

            `}</style>


            <div className="enquiries-page">

                <div className="enquiry-directory">


                    {/*
                    |--------------------------------------------------------------------------
                    | HEADER
                    |--------------------------------------------------------------------------
                    */}

                    <div className="enquiry-directory-header">

                        <div className="enquiry-directory-heading">

                            <div className="enquiry-directory-icon">
                                <EnquiryIcon />
                            </div>

                            <div>

                                <div className="enquiry-directory-title">
                                    Enquiry Directory
                                </div>

                                <div className="enquiry-directory-subtitle">
                                    Review and manage website enquiries
                                </div>

                            </div>

                        </div>


                        <div className="enquiry-count">

                            {items?.total ?? rows.length}{' '}

                            {(items?.total ?? rows.length) === 1
                                ? 'enquiry'
                                : 'enquiries'}

                        </div>

                    </div>


                    {/*
                    |--------------------------------------------------------------------------
                    | TABLE
                    |--------------------------------------------------------------------------
                    */}

                    <div className="enquiry-table-wrap">

                        <table className="enquiry-table">

                            <thead>

                                <tr>
                                    <th>Date</th>
                                    <th>Name</th>
                                    <th>Company</th>
                                    <th>Type</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>

                            </thead>


                            <tbody>

                                {rows.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="enquiry-empty"
                                        >

                                            <div className="enquiry-empty-icon">
                                                <EnquiryIcon />
                                            </div>

                                            <div className="enquiry-empty-title">
                                                No enquiries found
                                            </div>

                                            <div className="enquiry-empty-text">
                                                New website enquiries will appear here.
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
                                                className="enquiry-row"
                                                style={{
                                                    animationDelay:
                                                        `${Math.min(
                                                            index * 35,
                                                            280
                                                        )}ms`,
                                                }}
                                            >

                                                <td>

                                                    <span className="enquiry-date">

                                                        <CalendarIcon />

                                                        {formatDate(
                                                            item.created_at
                                                        )}

                                                    </span>

                                                </td>


                                                <td>

                                                    <div className="enquiry-person">

                                                        <div className="enquiry-avatar">

                                                            {String(
                                                                item.name ||
                                                                'E'
                                                            )
                                                                .trim()
                                                                .charAt(0)}

                                                        </div>

                                                        <div className="enquiry-name">
                                                            {item.name || '—'}
                                                        </div>

                                                    </div>

                                                </td>


                                                <td>

                                                    {item.company ? (

                                                        <span className="enquiry-icon-value">

                                                            <BuildingIcon />

                                                            {item.company}

                                                        </span>

                                                    ) : (
                                                        '—'
                                                    )}

                                                </td>


                                                <td>

                                                    {item.enquiry_type ? (

                                                        <span className="enquiry-type">
                                                            {item.enquiry_type}
                                                        </span>

                                                    ) : (
                                                        '—'
                                                    )}

                                                </td>


                                                <td>

                                                    {item.email ? (

                                                        <span className="enquiry-icon-value">

                                                            <MailIcon />

                                                            <a
                                                                href={`mailto:${item.email}`}
                                                                className="enquiry-email"
                                                            >
                                                                {item.email}
                                                            </a>

                                                        </span>

                                                    ) : (
                                                        '—'
                                                    )}

                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            `enquiry-status ${getStatusClass(
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
                                                            `/cms/enquiries/${item.id}`
                                                        }
                                                        className="enquiry-view-button"
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