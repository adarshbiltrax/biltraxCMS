import React, {
    useEffect,
    useState,
} from 'react';

import {
    Head,
    Link,
    router,
} from '@inertiajs/react';

import CmsLayout from '../../../Layouts/CmsLayout';


/*
|--------------------------------------------------------------------------
| ICONS
|--------------------------------------------------------------------------
*/

function SearchIcon() {
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
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
        </svg>
    );
}


function EyeIcon() {
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
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}


function BriefcaseIcon() {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
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


function FilterIcon() {
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
            <path d="M4 5h16" />
            <path d="M7 12h10" />
            <path d="M10 19h4" />
        </svg>
    );
}


/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function getFullName(item) {
    return [
        item?.first_name,
        item?.last_name,
    ]
        .filter(Boolean)
        .join(' ')
        .trim() || '—';
}


function getPosition(item) {
    return (
        item?.position_applied_for ||
        item?.career?.job_title ||
        '—'
    );
}


function formatDate(value) {
    if (!value) {
        return '—';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(
        'en-IN',
        {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }
    ).format(date);
}


function statusLabel(status) {
    const labels = {
        new: 'New',
        reviewed: 'Reviewed',
        contacted: 'Contacted',
        closed: 'Closed',
    };

    return labels[status] || status || '—';
}


function StatusBadge({
    status,
}) {
    return (
        <span
            className={`opportunity-status opportunity-status-${status || 'unknown'}`}
        >
            <span className="opportunity-status-dot" />

            {statusLabel(status)}
        </span>
    );
}


/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

export default function Index({
    items,
    filters = {},
}) {
    const [search, setSearch] =
        useState(filters?.q || '');

    const [status, setStatus] =
        useState(filters?.status || '');


    /*
    |--------------------------------------------------------------------------
    | KEEP LOCAL VALUES IN SYNC WITH INERTIA PROPS
    |--------------------------------------------------------------------------
    */

    useEffect(
        () => {
            setSearch(
                filters?.q || ''
            );

            setStatus(
                filters?.status || ''
            );
        },
        [
            filters?.q,
            filters?.status,
        ]
    );


    /*
    |--------------------------------------------------------------------------
    | SEARCH
    |--------------------------------------------------------------------------
    */

    function submitFilters(event) {
        event.preventDefault();

        const params = {};

        const trimmedSearch =
            search.trim();

        if (trimmedSearch) {
            params.q =
                trimmedSearch;
        }

        if (status) {
            params.status =
                status;
        }

        router.get(
            '/cms/opportunity-enquiries',
            params,
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    }


    function resetFilters() {
        setSearch('');
        setStatus('');

        router.get(
            '/cms/opportunity-enquiries',
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    }


    const rows =
        items?.data || [];

    const hasFilters =
        Boolean(
            filters?.q ||
            filters?.status
        );


    return (
        <>
            <Head title="Opportunity Enquiries" />

            <CmsLayout title="Opportunity Enquiries">
                <style>{`
                    .opportunity-page {
                        width: 100%;
                        min-width: 0;
                    }

                    .opportunity-page * {
                        box-sizing: border-box;
                    }

                    .opportunity-heading {
                        margin-bottom: 22px;
                        display: flex;
                        align-items: flex-end;
                        justify-content: space-between;
                        gap: 20px;
                    }

                    .opportunity-heading-copy {
                        min-width: 0;
                    }

                    .opportunity-eyebrow {
                        margin-bottom: 5px;
                        color: #c0122f;
                        font-size: 10px;
                        font-weight: 750;
                        letter-spacing: .1em;
                        text-transform: uppercase;
                    }

                    .opportunity-title {
                        margin: 0;
                        color: #101828;
                        font-size: 25px;
                        line-height: 1.25;
                        font-weight: 750;
                        letter-spacing: -.035em;
                    }

                    .opportunity-description {
                        margin: 7px 0 0;
                        color: #667085;
                        font-size: 12px;
                        line-height: 1.6;
                    }

                    .opportunity-total {
                        flex-shrink: 0;
                        padding: 8px 12px;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        background: #ffffff;
                        color: #667085;
                        font-size: 11px;
                        font-weight: 600;
                    }

                    .opportunity-total strong {
                        margin-right: 4px;
                        color: #101828;
                        font-size: 13px;
                    }

                    .opportunity-filter-card {
                        margin-bottom: 18px;
                        padding: 16px;
                        border: 1px solid #e5e7eb;
                        border-radius: 12px;
                        background: #ffffff;
                        box-shadow:
                            0 1px 2px
                            rgba(16,24,40,.025);
                    }

                    .opportunity-filter-form {
                        display: grid;
                        grid-template-columns:
                            minmax(220px, 1fr)
                            190px
                            auto;
                        gap: 12px;
                        align-items: center;
                    }

                    .opportunity-search {
                        position: relative;
                    }

                    .opportunity-search-icon {
                        position: absolute;
                        left: 13px;
                        top: 50%;
                        display: flex;
                        color: #98a2b3;
                        pointer-events: none;
                        transform: translateY(-50%);
                    }

                    .opportunity-input,
                    .opportunity-select {
                        width: 100%;
                        height: 40px;
                        border:
                            1px solid #dfe3e8;
                        border-radius: 8px;
                        outline: none;
                        background: #ffffff;
                        color: #344054;
                        font-family: inherit;
                        font-size: 11px;
                        transition:
                            border-color .2s ease,
                            box-shadow .2s ease;
                    }

                    .opportunity-input {
                        padding:
                            0 12px
                            0 40px;
                    }

                    .opportunity-select {
                        padding:
                            0 34px
                            0 12px;
                    }

                    .opportunity-input:focus,
                    .opportunity-select:focus {
                        border-color: #d4586d;
                        box-shadow:
                            0 0 0 3px
                            rgba(192,18,47,.08);
                    }

                    .opportunity-filter-actions {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }

                    .opportunity-button {
                        height: 40px;
                        padding: 0 15px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        gap: 7px;
                        border: 0;
                        border-radius: 8px;
                        outline: none;
                        font-family: inherit;
                        font-size: 11px;
                        font-weight: 650;
                        cursor: pointer;
                        text-decoration: none;
                        white-space: nowrap;
                        transition:
                            transform .2s ease,
                            background .2s ease,
                            border-color .2s ease;
                    }

                    .opportunity-button:hover {
                        transform:
                            translateY(-1px);
                    }

                    .opportunity-button-primary {
                        background: #c0122f;
                        color: #ffffff;
                    }

                    .opportunity-button-primary:hover {
                        background: #a80f29;
                    }

                    .opportunity-button-secondary {
                        border:
                            1px solid #e1e5eb;
                        background: #ffffff;
                        color: #475467;
                    }

                    .opportunity-button-secondary:hover {
                        background: #f9fafb;
                    }

                    .opportunity-table-card {
                        overflow: hidden;
                        border:
                            1px solid #e5e7eb;
                        border-radius: 12px;
                        background: #ffffff;
                        box-shadow:
                            0 1px 2px
                            rgba(16,24,40,.025);
                    }

                    .opportunity-table-wrapper {
                        width: 100%;
                        overflow-x: auto;
                    }

                    .opportunity-table {
                        width: 100%;
                        min-width: 980px;
                        border-collapse: collapse;
                    }

                    .opportunity-table th {
                        padding:
                            11px 16px;
                        border-bottom:
                            1px solid #eaecf0;
                        background: #f9fafb;
                        color: #667085;
                        font-size: 9px;
                        line-height: 1.3;
                        font-weight: 750;
                        letter-spacing: .055em;
                        text-align: left;
                        text-transform: uppercase;
                        white-space: nowrap;
                    }

                    .opportunity-table td {
                        padding:
                            14px 16px;
                        border-bottom:
                            1px solid #f0f1f3;
                        color: #475467;
                        font-size: 11px;
                        line-height: 1.5;
                        vertical-align: middle;
                    }

                    .opportunity-table tbody tr {
                        transition:
                            background .18s ease;
                    }

                    .opportunity-table tbody tr:hover {
                        background: #fcfcfd;
                    }

                    .opportunity-table tbody tr:last-child td {
                        border-bottom: 0;
                    }

                    .opportunity-applicant {
                        min-width: 180px;
                    }

                    .opportunity-applicant-name {
                        color: #101828;
                        font-size: 12px;
                        font-weight: 700;
                    }

                    .opportunity-applicant-email {
                        margin-top: 2px;
                        color: #98a2b3;
                        font-size: 10px;
                    }

                    .opportunity-position {
                        max-width: 230px;
                        color: #344054;
                        font-weight: 600;
                    }

                    .opportunity-status {
                        width: fit-content;
                        padding: 5px 8px;
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        border-radius: 999px;
                        font-size: 9px;
                        font-weight: 700;
                        white-space: nowrap;
                    }

                    .opportunity-status-dot {
                        width: 5px;
                        height: 5px;
                        border-radius: 50%;
                        background: currentColor;
                    }

                    .opportunity-status-new {
                        background: #fff1f3;
                        color: #c01048;
                    }

                    .opportunity-status-reviewed {
                        background: #eff8ff;
                        color: #175cd3;
                    }

                    .opportunity-status-contacted {
                        background: #ecfdf3;
                        color: #027a48;
                    }

                    .opportunity-status-closed {
                        background: #f2f4f7;
                        color: #475467;
                    }

                    .opportunity-status-unknown {
                        background: #f2f4f7;
                        color: #667085;
                    }

                    .opportunity-view {
                        width: 34px;
                        height: 34px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        border:
                            1px solid #e1e5eb;
                        border-radius: 8px;
                        background: #ffffff;
                        color: #667085;
                        text-decoration: none;
                        transition:
                            color .2s ease,
                            border-color .2s ease,
                            background .2s ease,
                            transform .2s ease;
                    }

                    .opportunity-view:hover {
                        border-color: #efb6c0;
                        background: #fff7f8;
                        color: #c0122f;
                        transform:
                            translateY(-1px);
                    }

                    .opportunity-empty {
                        padding:
                            65px 20px;
                        text-align: center;
                    }

                    .opportunity-empty-icon {
                        width: 48px;
                        height: 48px;
                        margin:
                            0 auto 13px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 12px;
                        background: #fff1f3;
                        color: #c0122f;
                    }

                    .opportunity-empty-title {
                        margin-bottom: 5px;
                        color: #344054;
                        font-size: 13px;
                        font-weight: 700;
                    }

                    .opportunity-empty-text {
                        color: #98a2b3;
                        font-size: 11px;
                    }

                    .opportunity-pagination {
                        padding:
                            14px 16px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 15px;
                        border-top:
                            1px solid #eaecf0;
                    }

                    .opportunity-pagination-info {
                        color: #98a2b3;
                        font-size: 10px;
                    }

                    .opportunity-pagination-links {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: flex-end;
                        gap: 5px;
                    }

                    .opportunity-page-link {
                        min-width: 31px;
                        height: 31px;
                        padding: 0 9px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        border:
                            1px solid #e1e5eb;
                        border-radius: 7px;
                        background: #ffffff;
                        color: #667085;
                        font-size: 10px;
                        font-weight: 600;
                        text-decoration: none;
                        transition:
                            background .2s ease,
                            color .2s ease,
                            border-color .2s ease;
                    }

                    .opportunity-page-link:hover {
                        border-color: #efb6c0;
                        color: #c0122f;
                    }

                    .opportunity-page-link.active {
                        border-color: #c0122f;
                        background: #c0122f;
                        color: #ffffff;
                    }

                    .opportunity-page-link.disabled {
                        opacity: .4;
                        pointer-events: none;
                    }

                    @media (
                        max-width: 900px
                    ) {
                        .opportunity-filter-form {
                            grid-template-columns:
                                1fr 180px;
                        }

                        .opportunity-filter-actions {
                            grid-column:
                                1 / -1;
                        }
                    }

                    @media (
                        max-width: 640px
                    ) {
                        .opportunity-heading {
                            align-items:
                                flex-start;
                            flex-direction:
                                column;
                        }

                        .opportunity-filter-form {
                            grid-template-columns:
                                1fr;
                        }

                        .opportunity-filter-actions {
                            grid-column:
                                auto;
                        }

                        .opportunity-filter-actions
                        .opportunity-button {
                            flex: 1;
                        }

                        .opportunity-pagination {
                            align-items:
                                flex-start;
                            flex-direction:
                                column;
                        }

                        .opportunity-pagination-links {
                            justify-content:
                                flex-start;
                        }
                    }
                `}</style>


                <div className="opportunity-page">

                    <div className="opportunity-heading">

                        <div className="opportunity-heading-copy">

                            <div className="opportunity-eyebrow">
                                Careers
                            </div>

                            <h1 className="opportunity-title">
                                Opportunity Enquiries
                            </h1>

                            <p className="opportunity-description">
                                Review and manage applications submitted through the Biltrax opportunities page.
                            </p>

                        </div>


                        <div className="opportunity-total">
                            <strong>
                                {items?.total ?? 0}
                            </strong>

                            Applications
                        </div>

                    </div>


                    <div className="opportunity-filter-card">

                        <form
                            className="opportunity-filter-form"
                            onSubmit={submitFilters}
                        >

                            <div className="opportunity-search">

                                <span className="opportunity-search-icon">
                                    <SearchIcon />
                                </span>

                                <input
                                    type="search"
                                    className="opportunity-input"
                                    placeholder="Search name, email, mobile or position..."
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>


                            <select
                                className="opportunity-select"
                                value={status}
                                onChange={(event) =>
                                    setStatus(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="">
                                    All Statuses
                                </option>

                                <option value="new">
                                    New
                                </option>

                                <option value="reviewed">
                                    Reviewed
                                </option>

                                <option value="contacted">
                                    Contacted
                                </option>

                                <option value="closed">
                                    Closed
                                </option>
                            </select>


                            <div className="opportunity-filter-actions">

                                <button
                                    type="submit"
                                    className="opportunity-button opportunity-button-primary"
                                >
                                    <FilterIcon />

                                    Filter
                                </button>


                                {hasFilters && (
                                    <button
                                        type="button"
                                        className="opportunity-button opportunity-button-secondary"
                                        onClick={resetFilters}
                                    >
                                        Reset
                                    </button>
                                )}

                            </div>

                        </form>

                    </div>


                    <div className="opportunity-table-card">

                        {rows.length > 0 ? (
                            <>
                                <div className="opportunity-table-wrapper">

                                    <table className="opportunity-table">

                                        <thead>
                                            <tr>
                                                <th>
                                                    Applicant
                                                </th>

                                                <th>
                                                    Position
                                                </th>

                                                <th>
                                                    Mobile
                                                </th>

                                                <th>
                                                    Experience
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                                <th>
                                                    Submitted
                                                </th>

                                                <th>
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>


                                        <tbody>

                                            {rows.map(
                                                (item) => (
                                                    <tr key={item.id}>

                                                        <td>
                                                            <div className="opportunity-applicant">

                                                                <div className="opportunity-applicant-name">
                                                                    {getFullName(item)}
                                                                </div>

                                                                <div className="opportunity-applicant-email">
                                                                    {item.email || '—'}
                                                                </div>

                                                            </div>
                                                        </td>


                                                        <td>
                                                            <div className="opportunity-position">
                                                                {getPosition(item)}
                                                            </div>
                                                        </td>


                                                        <td>
                                                            {item.mobile_number || '—'}
                                                        </td>


                                                        <td>
                                                            {item.experience_years !== null &&
                                                            item.experience_years !== undefined
                                                                ? `${parseFloat(item.experience_years)} Years`
                                                                : '—'
                                                            }
                                                        </td>


                                                        <td>
                                                            <StatusBadge
                                                                status={item.status}
                                                            />
                                                        </td>


                                                        <td>
                                                            {formatDate(
                                                                item.created_at
                                                            )}
                                                        </td>


                                                        <td>
                                                            <Link
                                                                href={`/cms/opportunity-enquiries/${item.id}`}
                                                                className="opportunity-view"
                                                                title="View application"
                                                                aria-label={`View application from ${getFullName(item)}`}
                                                            >
                                                                <EyeIcon />
                                                            </Link>
                                                        </td>

                                                    </tr>
                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>


                                {items?.links?.length > 0 && (
                                    <div className="opportunity-pagination">

                                        <div className="opportunity-pagination-info">
                                            Showing{' '}
                                            {items.from ?? 0}
                                            {' - '}
                                            {items.to ?? 0}
                                            {' of '}
                                            {items.total ?? 0}
                                            {' applications'}
                                        </div>


                                        <div className="opportunity-pagination-links">

                                            {items.links.map(
                                                (
                                                    link,
                                                    index
                                                ) => (
                                                    link.url ? (
                                                        <Link
                                                            key={index}
                                                            href={link.url}
                                                            preserveScroll
                                                            preserveState
                                                            className={`opportunity-page-link ${
                                                                link.active
                                                                    ? 'active'
                                                                    : ''
                                                            }`}
                                                            dangerouslySetInnerHTML={{
                                                                __html:
                                                                    link.label,
                                                            }}
                                                        />
                                                    ) : (
                                                        <span
                                                            key={index}
                                                            className="opportunity-page-link disabled"
                                                            dangerouslySetInnerHTML={{
                                                                __html:
                                                                    link.label,
                                                            }}
                                                        />
                                                    )
                                                )
                                            )}

                                        </div>

                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="opportunity-empty">

                                <div className="opportunity-empty-icon">
                                    <BriefcaseIcon />
                                </div>

                                <div className="opportunity-empty-title">
                                    No applications found
                                </div>

                                <div className="opportunity-empty-text">
                                    {hasFilters
                                        ? 'No applications match the selected filters.'
                                        : 'Applications submitted from the website will appear here.'
                                    }
                                </div>

                            </div>
                        )}

                    </div>

                </div>

            </CmsLayout>
        </>
    );
}