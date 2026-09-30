import React from 'react';

import {
    Head,
    Link,
    router,
} from '@inertiajs/react';

import CmsLayout from '../../../Layouts/CmsLayout';
import Pagination from '../Pagination';


/*
|--------------------------------------------------------------------------
| ICONS
|--------------------------------------------------------------------------
*/

function PlusIcon() {
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
            <path d="M12 5v14" />
            <path d="M5 12h14" />
        </svg>
    );
}


function CareerIcon() {
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


function EditIcon() {
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
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
    );
}


function DeleteIcon() {
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
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v5" />
            <path d="M14 11v5" />
        </svg>
    );
}


function LocationIcon() {
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
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle
                cx="12"
                cy="10"
                r="2.5"
            />
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
| CAREERS INDEX
|--------------------------------------------------------------------------
*/

export default function Index({
    careers,
}) {

    const rows = careers?.data || [];


    /*
    |--------------------------------------------------------------------------
    | DELETE
    |--------------------------------------------------------------------------
    */

    function removeCareer(id) {

        if (!confirm('Delete this career opportunity?')) {
            return;
        }

        router.delete(
            `/cms/careers/${id}`,
            {
                preserveScroll: true,
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
            status || ''
        )
            .toLowerCase()
            .trim();

        if (value === 'published') {
            return 'published';
        }

        if (value === 'draft') {
            return 'draft';
        }

        if (value === 'closed') {
            return 'closed';
        }

        return 'default';
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

        const parts = String(value)
            .slice(0, 10)
            .split('-');

        if (parts.length !== 3) {
            return value;
        }

        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }


    return (

        <CmsLayout title="Careers">

            <Head title="Careers · Biltrax CMS" />


            <style>{`

                /*
                |--------------------------------------------------------------------------
                | PAGE
                |--------------------------------------------------------------------------
                */

                .careers-page {
                    animation:
                        careersPageEnter
                        .45s ease both;
                }


                /*
                |--------------------------------------------------------------------------
                | TOP ACTION
                |--------------------------------------------------------------------------
                */

                .careers-toolbar {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;

                    margin-bottom: 18px;
                }


                .career-add-button {
                    height: 46px;

                    padding: 0 18px;

                    border-radius: 10px;

                    display: inline-flex;
                    align-items: center;
                    justify-content: center;

                    gap: 8px;

                    background: #c0122f;

                    color: #ffffff !important;

                    text-decoration: none;

                    font-size: 14px;
                    font-weight: 600;

                    white-space: nowrap;

                    box-shadow:
                        0 4px 12px
                        rgba(192, 18, 47, .16);

                    transition:
                        transform .18s ease,
                        background .18s ease,
                        box-shadow .18s ease;
                }


                .career-add-button:hover {
                    background: #a90f29;

                    color: #ffffff !important;

                    transform:
                        translateY(-1px);

                    box-shadow:
                        0 7px 18px
                        rgba(192, 18, 47, .22);
                }


                .career-add-button:active {
                    transform: translateY(0);
                }


                /*
                |--------------------------------------------------------------------------
                | TABLE CARD
                |--------------------------------------------------------------------------
                */

                .careers-table-card {
                    overflow: hidden;

                    background: #ffffff;

                    border:
                        1px solid #e7e9ee;

                    border-radius: 16px;

                    box-shadow:
                        0 1px 2px
                        rgba(16, 24, 40, .02),

                        0 8px 28px
                        rgba(16, 24, 40, .035);
                }


                /*
                |--------------------------------------------------------------------------
                | CARD HEADER
                |--------------------------------------------------------------------------
                */

                .careers-table-header {
                    display: flex;

                    align-items: center;

                    justify-content:
                        space-between;

                    gap: 20px;

                    padding:
                        20px 24px;

                    border-bottom:
                        1px solid #eceef2;
                }


                .careers-table-title {
                    display: flex;

                    align-items: center;

                    gap: 12px;
                }


                .careers-table-title-icon {
                    width: 38px;
                    height: 38px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    border-radius: 10px;

                    color: #c0122f;

                    background:
                        rgba(192, 18, 47, .08);
                }


                .careers-table-title-text {
                    font-size: 15px;

                    line-height: 1.2;

                    font-weight: 700;

                    color: #111827;
                }


                .careers-table-subtitle {
                    margin-top: 4px;

                    color: #8a91a0;

                    font-size: 12px;
                }


                .careers-count {
                    padding:
                        6px 10px;

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

                .careers-table-wrap {
                    width: 100%;

                    overflow-x: auto;
                }


                .careers-table {
                    width: 100%;

                    border-collapse: collapse;

                    border-spacing: 0;
                }


                .careers-table thead {
                    background: #fafbfc;
                }


                .careers-table th {
                    padding:
                        13px 18px;

                    text-align: left;

                    border-bottom:
                        1px solid #eceef2;

                    color: #697180;

                    font-size: 11px;

                    font-weight: 700;

                    text-transform:
                        uppercase;

                    letter-spacing:
                        .06em;

                    white-space: nowrap;
                }


                .careers-table td {
                    padding:
                        17px 18px;

                    border-bottom:
                        1px solid #eef0f3;

                    color: #3c4350;

                    font-size: 14px;

                    vertical-align: middle;
                }


                .careers-table tbody tr {
                    transition:
                        background .18s ease;
                }


                .careers-table tbody tr:hover {
                    background: #fafbfc;
                }


                .careers-table tbody
                tr:last-child td {
                    border-bottom: 0;
                }


                /*
                |--------------------------------------------------------------------------
                | CAREER TITLE
                |--------------------------------------------------------------------------
                */

                .career-title-cell {
                    display: flex;

                    align-items: center;

                    gap: 12px;

                    min-width: 220px;
                }


                .career-avatar {
                    width: 36px;
                    height: 36px;

                    flex: 0 0 36px;

                    border-radius: 9px;

                    background: #f2f3f5;

                    color: #697180;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    font-size: 13px;

                    font-weight: 700;

                    text-transform: uppercase;

                    transition:
                        background .18s ease,
                        color .18s ease,
                        transform .18s ease;
                }


                .careers-table tbody tr:hover
                .career-avatar {

                    background:
                        rgba(192, 18, 47, .09);

                    color: #c0122f;

                    transform: scale(1.04);
                }


                .career-title {
                    color: #111827;

                    font-weight: 650;

                    line-height: 1.35;
                }


                .career-experience {
                    margin-top: 3px;

                    color: #9aa1ad;

                    font-size: 11px;
                }


                /*
                |--------------------------------------------------------------------------
                | LOCATION
                |--------------------------------------------------------------------------
                */

                .career-location {
                    display: inline-flex;

                    align-items: center;

                    gap: 6px;

                    color: #555e6d;

                    white-space: nowrap;
                }


                .career-location svg {
                    color: #9aa1ad;
                }


                /*
                |--------------------------------------------------------------------------
                | EMPLOYMENT TYPE
                |--------------------------------------------------------------------------
                */

                .career-type {
                    display: inline-flex;

                    align-items: center;

                    padding: 5px 9px;

                    border-radius: 7px;

                    background: #f3f4f6;

                    color: #505867;

                    font-size: 12px;

                    font-weight: 600;

                    white-space: nowrap;
                }


                /*
                |--------------------------------------------------------------------------
                | STATUS
                |--------------------------------------------------------------------------
                */

                .career-status {
                    display: inline-flex;

                    align-items: center;

                    gap: 7px;

                    min-height: 27px;

                    padding:
                        4px 10px;

                    border-radius: 20px;

                    font-size: 12px;

                    font-weight: 600;

                    text-transform: capitalize;

                    white-space: nowrap;
                }


                .career-status::before {
                    content: "";

                    width: 6px;
                    height: 6px;

                    border-radius: 50%;

                    background: currentColor;
                }


                .career-status.published {
                    color: #147a4b;

                    background: #eaf8f0;
                }


                .career-status.draft {
                    color: #9a6510;

                    background: #fff6df;
                }


                .career-status.closed {
                    color: #b42318;

                    background: #fff0ee;
                }


                .career-status.default {
                    color: #5c6472;

                    background: #f1f3f5;
                }


                /*
                |--------------------------------------------------------------------------
                | DATE
                |--------------------------------------------------------------------------
                */

                .career-date {
                    display: inline-flex;

                    align-items: center;

                    gap: 6px;

                    color: #555e6d;

                    white-space: nowrap;
                }


                .career-date svg {
                    color: #9aa1ad;
                }


                /*
                |--------------------------------------------------------------------------
                | ACTIONS
                |--------------------------------------------------------------------------
                */

                .career-actions {
                    display: flex;

                    align-items: center;

                    gap: 8px;

                    white-space: nowrap;
                }


                .career-action-button {
                    height: 36px;

                    padding:
                        0 12px;

                    border-radius: 8px;

                    border:
                        1px solid transparent;

                    display: inline-flex;

                    align-items: center;

                    justify-content: center;

                    gap: 7px;

                    text-decoration: none;

                    font-size: 13px;

                    font-weight: 600;

                    cursor: pointer;

                    transition:
                        background .18s ease,
                        border-color .18s ease,
                        color .18s ease,
                        transform .18s ease,
                        box-shadow .18s ease;
                }


                .career-action-button.edit {
                    color: #344054;

                    background: #f2f4f7;

                    border-color: #eaecf0;
                }


                .career-action-button.edit:hover {
                    color: #111827;

                    background: #e8ebef;

                    border-color: #d8dde5;

                    transform:
                        translateY(-1px);
                }


                .career-action-button.delete {
                    color: #b42318;

                    background: #fff1f0;

                    border-color: #ffd9d5;
                }


                .career-action-button.delete:hover {
                    color: #ffffff;

                    background: #c51d24;

                    border-color: #c51d24;

                    transform:
                        translateY(-1px);

                    box-shadow:
                        0 5px 12px
                        rgba(197, 29, 36, .16);
                }


                /*
                |--------------------------------------------------------------------------
                | EMPTY STATE
                |--------------------------------------------------------------------------
                */

                .careers-empty {
                    padding:
                        64px 24px !important;

                    text-align: center;
                }


                .careers-empty-icon {
                    width: 52px;
                    height: 52px;

                    margin:
                        0 auto 14px;

                    border-radius: 14px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    background: #f4f5f7;

                    color: #8a91a0;
                }


                .careers-empty-title {
                    color: #202631;

                    font-size: 15px;

                    font-weight: 700;
                }


                .careers-empty-text {
                    margin-top: 5px;

                    color: #8a91a0;

                    font-size: 13px;
                }


                /*
                |--------------------------------------------------------------------------
                | ANIMATIONS
                |--------------------------------------------------------------------------
                */

                .career-row {
                    animation:
                        careerRowEnter
                        .4s ease both;
                }


                @keyframes careersPageEnter {

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


                @keyframes careerRowEnter {

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

                    .careers-toolbar {
                        justify-content: stretch;
                    }


                    .career-add-button {
                        width: 100%;
                    }


                    .careers-table-header {
                        padding: 17px;
                    }


                    .careers-table th,
                    .careers-table td {

                        padding-left: 14px;

                        padding-right: 14px;
                    }


                    .career-action-button span {
                        display: none;
                    }


                    .career-action-button {
                        width: 36px;

                        padding: 0;
                    }
                }

            `}</style>


            <div className="careers-page">


                {/*
                |--------------------------------------------------------------------------
                | ADD OPPORTUNITY
                |--------------------------------------------------------------------------
                */}

                <div className="careers-toolbar">

                    <Link
                        href="/cms/careers/create"
                        className="career-add-button"
                    >

                        <PlusIcon />

                        <span>
                            Add Opportunity
                        </span>

                    </Link>

                </div>


                {/*
                |--------------------------------------------------------------------------
                | CAREER DIRECTORY
                |--------------------------------------------------------------------------
                */}

                <div className="careers-table-card">


                    <div className="careers-table-header">

                        <div className="careers-table-title">

                            <div className="careers-table-title-icon">
                                <CareerIcon />
                            </div>


                            <div>

                                <div className="careers-table-title-text">
                                    Career Opportunities
                                </div>

                                <div className="careers-table-subtitle">
                                    Manage website career listings
                                </div>

                            </div>

                        </div>


                        <div className="careers-count">

                            {rows.length}{' '}

                            {rows.length === 1
                                ? 'opportunity'
                                : 'opportunities'}

                        </div>

                    </div>


                    <div className="careers-table-wrap">

                        <table className="careers-table">

                            <thead>

                                <tr>

                                    <th>
                                        Job Title
                                    </th>

                                    <th>
                                        Department
                                    </th>

                                    <th>
                                        Location
                                    </th>

                                    <th>
                                        Type
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Closing Date
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {rows.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="careers-empty"
                                        >

                                            <div className="careers-empty-icon">
                                                <CareerIcon />
                                            </div>

                                            <div className="careers-empty-title">
                                                No career opportunities found
                                            </div>

                                            <div className="careers-empty-text">
                                                Add your first career opportunity to get started.
                                            </div>

                                        </td>

                                    </tr>

                                ) : (

                                    rows.map(
                                        (
                                            career,
                                            index
                                        ) => (

                                            <tr
                                                key={career.id}
                                                className="career-row"
                                                style={{
                                                    animationDelay:
                                                        `${Math.min(
                                                            index * 35,
                                                            280
                                                        )}ms`,
                                                }}
                                            >


                                                {/*
                                                |--------------------------------------------------------------------------
                                                | JOB TITLE
                                                |--------------------------------------------------------------------------
                                                */}

                                                <td>

                                                    <div className="career-title-cell">

                                                        <div className="career-avatar">

                                                            {String(
                                                                career.job_title ||
                                                                'C'
                                                            )
                                                                .trim()
                                                                .charAt(0)}

                                                        </div>


                                                        <div>

                                                            <div className="career-title">

                                                                {career.job_title ||
                                                                    'Untitled Opportunity'}

                                                            </div>


                                                            {career.experience && (

                                                                <div className="career-experience">

                                                                    {career.experience}
                                                                    {' experience'}

                                                                </div>

                                                            )}

                                                        </div>

                                                    </div>

                                                </td>


                                                {/*
                                                |--------------------------------------------------------------------------
                                                | DEPARTMENT
                                                |--------------------------------------------------------------------------
                                                */}

                                                <td>

                                                    {career.department ||
                                                        '—'}

                                                </td>


                                                {/*
                                                |--------------------------------------------------------------------------
                                                | LOCATION
                                                |--------------------------------------------------------------------------
                                                */}

                                                <td>

                                                    {career.location ? (

                                                        <span className="career-location">

                                                            <LocationIcon />

                                                            {career.location}

                                                        </span>

                                                    ) : (

                                                        '—'

                                                    )}

                                                </td>


                                                {/*
                                                |--------------------------------------------------------------------------
                                                | EMPLOYMENT TYPE
                                                |--------------------------------------------------------------------------
                                                */}

                                                <td>

                                                    {career.employment_type ? (

                                                        <span className="career-type">

                                                            {career.employment_type}

                                                        </span>

                                                    ) : (

                                                        '—'

                                                    )}

                                                </td>


                                                {/*
                                                |--------------------------------------------------------------------------
                                                | STATUS
                                                |--------------------------------------------------------------------------
                                                */}

                                                <td>

                                                    <span
                                                        className={
                                                            `career-status ${getStatusClass(
                                                                career.status
                                                            )}`
                                                        }
                                                    >

                                                        {career.status ||
                                                            'Unknown'}

                                                    </span>

                                                </td>


                                                {/*
                                                |--------------------------------------------------------------------------
                                                | CLOSING DATE
                                                |--------------------------------------------------------------------------
                                                */}

                                                <td>

                                                    {career.closing_date ? (

                                                        <span className="career-date">

                                                            <CalendarIcon />

                                                            {formatDate(
                                                                career.closing_date
                                                            )}

                                                        </span>

                                                    ) : (

                                                        '—'

                                                    )}

                                                </td>


                                                {/*
                                                |--------------------------------------------------------------------------
                                                | ACTIONS
                                                |--------------------------------------------------------------------------
                                                */}

                                                <td>

                                                    <div className="career-actions">

                                                        <Link
                                                            href={
                                                                `/cms/careers/${career.id}/edit`
                                                            }
                                                            className="career-action-button edit"
                                                            title="Edit career opportunity"
                                                        >

                                                            <EditIcon />

                                                            <span>
                                                                Edit
                                                            </span>

                                                        </Link>


                                                        <button
                                                            type="button"
                                                            className="career-action-button delete"
                                                            title="Delete career opportunity"
                                                            onClick={() =>
                                                                removeCareer(
                                                                    career.id
                                                                )
                                                            }
                                                        >

                                                            <DeleteIcon />

                                                            <span>
                                                                Delete
                                                            </span>

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>


                {/*
                |--------------------------------------------------------------------------
                | PAGINATION
                |--------------------------------------------------------------------------
                */}

                <Pagination
                    links={careers?.links || []}
                />


            </div>

        </CmsLayout>
    );
}