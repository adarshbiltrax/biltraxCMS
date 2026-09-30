import React from 'react';

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

function ArrowLeftIcon() {
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
            <path d="m15 18-6-6 6-6" />
        </svg>
    );
}


function ExternalLinkIcon() {
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
            <path d="M15 3h6v6" />
            <path d="m10 14 11-11" />
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        </svg>
    );
}


function MailIcon() {
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


function PhoneIcon() {
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
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
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
            month: 'long',
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
            className={`opportunity-show-status opportunity-show-status-${status || 'unknown'}`}
        >
            <span className="opportunity-show-status-dot" />

            {statusLabel(status)}
        </span>
    );
}


function DetailItem({
    label,
    children,
}) {
    return (
        <div className="opportunity-detail-item">

            <div className="opportunity-detail-label">
                {label}
            </div>

            <div className="opportunity-detail-value">
                {children}
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
    function updateStatus(event) {
        const value =
            event.target.value;

        router.patch(
            `/cms/opportunity-enquiries/${item.id}`,
            {
                status: value,
            },
            {
                preserveScroll: true,
            }
        );
    }


    const fullName =
        getFullName(item);

    const position =
        getPosition(item);


    return (
        <>
            <Head
                title={`${fullName} - Opportunity Enquiry`}
            />

            <CmsLayout title="Opportunity Enquiry">
                <style>{`
                    .opportunity-show-page {
                        width: 100%;
                        max-width: 1150px;
                        min-width: 0;
                    }

                    .opportunity-show-page * {
                        box-sizing: border-box;
                    }

                    .opportunity-show-back {
                        width: fit-content;
                        margin-bottom: 18px;
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        color: #667085;
                        font-size: 11px;
                        font-weight: 600;
                        text-decoration: none;
                        transition:
                            color .2s ease,
                            transform .2s ease;
                    }

                    .opportunity-show-back:hover {
                        color: #c0122f;
                        transform:
                            translateX(-2px);
                    }

                    .opportunity-show-header {
                        margin-bottom: 20px;
                        padding: 22px 24px;
                        display: flex;
                        align-items: flex-start;
                        justify-content: space-between;
                        gap: 25px;
                        border:
                            1px solid #e5e7eb;
                        border-radius: 12px;
                        background: #ffffff;
                        box-shadow:
                            0 1px 2px
                            rgba(16,24,40,.025);
                    }

                    .opportunity-show-profile {
                        min-width: 0;
                        display: flex;
                        align-items: center;
                        gap: 15px;
                    }

                    .opportunity-show-avatar {
                        width: 48px;
                        height: 48px;
                        flex:
                            0 0 48px;
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
                        font-size: 16px;
                        font-weight: 800;
                        text-transform: uppercase;
                        box-shadow:
                            0 8px 20px
                            rgba(192,18,47,.16);
                    }

                    .opportunity-show-profile-copy {
                        min-width: 0;
                    }

                    .opportunity-show-name {
                        margin: 0;
                        color: #101828;
                        font-size: 21px;
                        line-height: 1.3;
                        font-weight: 750;
                        letter-spacing: -.025em;
                    }

                    .opportunity-show-position {
                        margin-top: 4px;
                        color: #667085;
                        font-size: 11px;
                        line-height: 1.5;
                    }

                    .opportunity-show-meta {
                        margin-top: 8px;
                        display: flex;
                        align-items: center;
                        flex-wrap: wrap;
                        gap: 9px;
                    }

                    .opportunity-show-status {
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

                    .opportunity-show-status-dot {
                        width: 5px;
                        height: 5px;
                        border-radius: 50%;
                        background: currentColor;
                    }

                    .opportunity-show-status-new {
                        background: #fff1f3;
                        color: #c01048;
                    }

                    .opportunity-show-status-reviewed {
                        background: #eff8ff;
                        color: #175cd3;
                    }

                    .opportunity-show-status-contacted {
                        background: #ecfdf3;
                        color: #027a48;
                    }

                    .opportunity-show-status-closed {
                        background: #f2f4f7;
                        color: #475467;
                    }

                    .opportunity-show-status-unknown {
                        background: #f2f4f7;
                        color: #667085;
                    }

                    .opportunity-show-date {
                        color: #98a2b3;
                        font-size: 9px;
                    }

                    .opportunity-status-control {
                        flex:
                            0 0 210px;
                    }

                    .opportunity-status-control label {
                        margin-bottom: 6px;
                        display: block;
                        color: #667085;
                        font-size: 9px;
                        font-weight: 700;
                        letter-spacing: .05em;
                        text-transform: uppercase;
                    }

                    .opportunity-status-select {
                        width: 100%;
                        height: 39px;
                        padding:
                            0 34px
                            0 11px;
                        border:
                            1px solid #dfe3e8;
                        border-radius: 8px;
                        outline: none;
                        background: #ffffff;
                        color: #344054;
                        font-family: inherit;
                        font-size: 11px;
                        font-weight: 600;
                        cursor: pointer;
                    }

                    .opportunity-status-select:focus {
                        border-color: #d4586d;
                        box-shadow:
                            0 0 0 3px
                            rgba(192,18,47,.08);
                    }

                    .opportunity-show-grid {
                        display: grid;
                        grid-template-columns:
                            minmax(0, 1.6fr)
                            minmax(260px, .75fr);
                        gap: 20px;
                        align-items: start;
                    }

                    .opportunity-card {
                        overflow: hidden;
                        border:
                            1px solid #e5e7eb;
                        border-radius: 12px;
                        background: #ffffff;
                        box-shadow:
                            0 1px 2px
                            rgba(16,24,40,.025);
                    }

                    .opportunity-card + .opportunity-card {
                        margin-top: 20px;
                    }

                    .opportunity-card-header {
                        padding:
                            15px 18px;
                        border-bottom:
                            1px solid #eaecf0;
                        background: #fcfcfd;
                    }

                    .opportunity-card-title {
                        margin: 0;
                        color: #344054;
                        font-size: 12px;
                        font-weight: 700;
                    }

                    .opportunity-card-subtitle {
                        margin-top: 3px;
                        color: #98a2b3;
                        font-size: 9px;
                    }

                    .opportunity-detail-grid {
                        display: grid;
                        grid-template-columns:
                            repeat(2, minmax(0, 1fr));
                    }

                    .opportunity-detail-item {
                        min-width: 0;
                        padding: 16px 18px;
                        border-bottom:
                            1px solid #f0f1f3;
                    }

                    .opportunity-detail-item:nth-child(odd) {
                        border-right:
                            1px solid #f0f1f3;
                    }

                    .opportunity-detail-label {
                        margin-bottom: 5px;
                        color: #98a2b3;
                        font-size: 9px;
                        line-height: 1.3;
                        font-weight: 700;
                        letter-spacing: .045em;
                        text-transform: uppercase;
                    }

                    .opportunity-detail-value {
                        overflow-wrap: anywhere;
                        color: #344054;
                        font-size: 11px;
                        line-height: 1.55;
                        font-weight: 600;
                    }

                    .opportunity-detail-link {
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        color: #b2102b;
                        text-decoration: none;
                    }

                    .opportunity-detail-link:hover {
                        text-decoration: underline;
                    }

                    .opportunity-message {
                        padding: 18px;
                        color: #475467;
                        font-size: 11px;
                        line-height: 1.8;
                        white-space: pre-wrap;
                        overflow-wrap: anywhere;
                    }

                    .opportunity-message-empty {
                        color: #98a2b3;
                        font-style: italic;
                    }

                    .opportunity-side-body {
                        padding: 16px;
                    }

                    .opportunity-contact-link {
                        width: 100%;
                        min-height: 42px;
                        margin-bottom: 9px;
                        padding: 0 12px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        border:
                            1px solid #e5e7eb;
                        border-radius: 8px;
                        background: #ffffff;
                        color: #475467;
                        font-size: 10px;
                        font-weight: 600;
                        text-decoration: none;
                        overflow-wrap: anywhere;
                        transition:
                            border-color .2s ease,
                            color .2s ease,
                            background .2s ease;
                    }

                    .opportunity-contact-link:last-child {
                        margin-bottom: 0;
                    }

                    .opportunity-contact-link:hover {
                        border-color: #efb6c0;
                        background: #fff8f9;
                        color: #c0122f;
                    }

                    .opportunity-contact-icon {
                        flex-shrink: 0;
                        display: flex;
                    }

                    .opportunity-cv-button {
                        width: 100%;
                        min-height: 42px;
                        padding: 0 14px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        border-radius: 8px;
                        background: #c0122f;
                        color: #ffffff;
                        font-size: 10px;
                        font-weight: 700;
                        text-decoration: none;
                        transition:
                            background .2s ease,
                            transform .2s ease;
                    }

                    .opportunity-cv-button:hover {
                        background: #a80f29;
                        transform:
                            translateY(-1px);
                    }

                    .opportunity-confirmation {
                        display: flex;
                        align-items: flex-start;
                        gap: 9px;
                    }

                    .opportunity-confirmation-indicator {
                        width: 18px;
                        height: 18px;
                        flex:
                            0 0 18px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        font-size: 10px;
                        font-weight: 800;
                    }

                    .opportunity-confirmation-indicator.yes {
                        background: #ecfdf3;
                        color: #027a48;
                    }

                    .opportunity-confirmation-indicator.no {
                        background: #fef3f2;
                        color: #b42318;
                    }

                    .opportunity-confirmation-copy {
                        color: #667085;
                        font-size: 10px;
                        line-height: 1.6;
                    }

                    .opportunity-record-meta {
                        display: grid;
                        gap: 12px;
                    }

                    .opportunity-record-row {
                        display: flex;
                        align-items: flex-start;
                        justify-content: space-between;
                        gap: 12px;
                    }

                    .opportunity-record-label {
                        color: #98a2b3;
                        font-size: 9px;
                        font-weight: 600;
                    }

                    .opportunity-record-value {
                        color: #475467;
                        font-size: 9px;
                        font-weight: 650;
                        text-align: right;
                    }

                    @media (
                        max-width: 900px
                    ) {
                        .opportunity-show-grid {
                            grid-template-columns:
                                1fr;
                        }
                    }

                    @media (
                        max-width: 640px
                    ) {
                        .opportunity-show-header {
                            flex-direction:
                                column;
                        }

                        .opportunity-status-control {
                            width: 100%;
                            flex: none;
                        }

                        .opportunity-detail-grid {
                            grid-template-columns:
                                1fr;
                        }

                        .opportunity-detail-item:nth-child(odd) {
                            border-right: 0;
                        }
                    }
                `}</style>


                <div className="opportunity-show-page">

                    <Link
                        href="/cms/opportunity-enquiries"
                        className="opportunity-show-back"
                    >
                        <ArrowLeftIcon />

                        Back to Opportunity Enquiries
                    </Link>


                    <div className="opportunity-show-header">

                        <div className="opportunity-show-profile">

                            <div className="opportunity-show-avatar">
                                {item?.first_name?.charAt(0) ||
                                    item?.last_name?.charAt(0) ||
                                    'A'
                                }
                            </div>


                            <div className="opportunity-show-profile-copy">

                                <h1 className="opportunity-show-name">
                                    {fullName}
                                </h1>

                                <div className="opportunity-show-position">
                                    {position}
                                </div>


                                <div className="opportunity-show-meta">

                                    <StatusBadge
                                        status={item?.status}
                                    />

                                    <span className="opportunity-show-date">
                                        Submitted{' '}
                                        {formatDate(
                                            item?.created_at
                                        )}
                                    </span>

                                </div>

                            </div>

                        </div>


                        <div className="opportunity-status-control">

                            <label htmlFor="opportunity-status">
                                Application Status
                            </label>

                            <select
                                id="opportunity-status"
                                className="opportunity-status-select"
                                value={item?.status || 'reviewed'}
                                onChange={updateStatus}
                            >
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

                        </div>

                    </div>


                    <div className="opportunity-show-grid">

                        <main>

                            <div className="opportunity-card">

                                <div className="opportunity-card-header">

                                    <h2 className="opportunity-card-title">
                                        Applicant Information
                                    </h2>

                                    <div className="opportunity-card-subtitle">
                                        Personal and professional details submitted by the applicant.
                                    </div>

                                </div>


                                <div className="opportunity-detail-grid">

                                    <DetailItem label="First Name">
                                        {item?.first_name || '—'}
                                    </DetailItem>


                                    <DetailItem label="Last Name">
                                        {item?.last_name || '—'}
                                    </DetailItem>


                                    <DetailItem label="Email Address">
                                        {item?.email ? (
                                            <a
                                                href={`mailto:${item.email}`}
                                                className="opportunity-detail-link"
                                            >
                                                {item.email}
                                            </a>
                                        ) : (
                                            '—'
                                        )}
                                    </DetailItem>


                                    <DetailItem label="Mobile Number">
                                        {item?.mobile_number ? (
                                            <a
                                                href={`tel:${item.mobile_number}`}
                                                className="opportunity-detail-link"
                                            >
                                                {item.mobile_number}
                                            </a>
                                        ) : (
                                            '—'
                                        )}
                                    </DetailItem>


                                    <DetailItem label="Position Applied For">
                                        {position}
                                    </DetailItem>


                                    <DetailItem label="Career Reference">
                                        {item?.career?.job_title ||
                                            (
                                                item?.career_id
                                                    ? `Career #${item.career_id}`
                                                    : '—'
                                            )
                                        }
                                    </DetailItem>


                                    <DetailItem label="Qualification">
                                        {item?.qualification || '—'}
                                    </DetailItem>


                                    <DetailItem label="Experience">
                                        {item?.experience_years !== null &&
                                        item?.experience_years !== undefined
                                            ? `${parseFloat(item.experience_years)} Years`
                                            : '—'
                                        }
                                    </DetailItem>

                                </div>

                            </div>


                            <div className="opportunity-card">

                                <div className="opportunity-card-header">

                                    <h2 className="opportunity-card-title">
                                        Applicant Message
                                    </h2>

                                    <div className="opportunity-card-subtitle">
                                        Message provided with the application.
                                    </div>

                                </div>


                                <div
                                    className={`opportunity-message ${
                                        !item?.message
                                            ? 'opportunity-message-empty'
                                            : ''
                                    }`}
                                >
                                    {item?.message ||
                                        'No message was provided by the applicant.'
                                    }
                                </div>

                            </div>

                        </main>


                        <aside>

                            <div className="opportunity-card">

                                <div className="opportunity-card-header">

                                    <h2 className="opportunity-card-title">
                                        Quick Contact
                                    </h2>

                                </div>


                                <div className="opportunity-side-body">

                                    {item?.email && (
                                        <a
                                            href={`mailto:${item.email}`}
                                            className="opportunity-contact-link"
                                        >
                                            <span className="opportunity-contact-icon">
                                                <MailIcon />
                                            </span>

                                            {item.email}
                                        </a>
                                    )}


                                    {item?.mobile_number && (
                                        <a
                                            href={`tel:${item.mobile_number}`}
                                            className="opportunity-contact-link"
                                        >
                                            <span className="opportunity-contact-icon">
                                                <PhoneIcon />
                                            </span>

                                            {item.mobile_number}
                                        </a>
                                    )}

                                </div>

                            </div>


                            <div className="opportunity-card">

                                <div className="opportunity-card-header">

                                    <h2 className="opportunity-card-title">
                                        Curriculum Vitae
                                    </h2>

                                </div>


                                <div className="opportunity-side-body">

                                    {item?.cv_link ? (
                                        <a
                                            href={item.cv_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="opportunity-cv-button"
                                        >
                                            Open CV

                                            <ExternalLinkIcon />
                                        </a>
                                    ) : (
                                        <div className="opportunity-message-empty">
                                            No CV link available.
                                        </div>
                                    )}

                                </div>

                            </div>


                            <div className="opportunity-card">

                                <div className="opportunity-card-header">

                                    <h2 className="opportunity-card-title">
                                        Location Confirmation
                                    </h2>

                                </div>


                                <div className="opportunity-side-body">

                                    <div className="opportunity-confirmation">

                                        <div
                                            className={`opportunity-confirmation-indicator ${
                                                item?.location_confirmed
                                                    ? 'yes'
                                                    : 'no'
                                            }`}
                                        >
                                            {item?.location_confirmed
                                                ? '✓'
                                                : '×'
                                            }
                                        </div>


                                        <div className="opportunity-confirmation-copy">

                                            {item?.location_confirmed
                                                ? 'Applicant confirmed the required Mumbai / Navi Mumbai / Thane–Kalyan location criteria.'
                                                : 'Applicant has not confirmed the required location criteria.'
                                            }

                                        </div>

                                    </div>

                                </div>

                            </div>


                            <div className="opportunity-card">

                                <div className="opportunity-card-header">

                                    <h2 className="opportunity-card-title">
                                        Record Information
                                    </h2>

                                </div>


                                <div className="opportunity-side-body">

                                    <div className="opportunity-record-meta">

                                        <div className="opportunity-record-row">

                                            <span className="opportunity-record-label">
                                                Application ID
                                            </span>

                                            <span className="opportunity-record-value">
                                                #{item?.id}
                                            </span>

                                        </div>


                                        <div className="opportunity-record-row">

                                            <span className="opportunity-record-label">
                                                Submitted
                                            </span>

                                            <span className="opportunity-record-value">
                                                {formatDate(
                                                    item?.created_at
                                                )}
                                            </span>

                                        </div>


                                        <div className="opportunity-record-row">

                                            <span className="opportunity-record-label">
                                                Last Updated
                                            </span>

                                            <span className="opportunity-record-value">
                                                {formatDate(
                                                    item?.updated_at
                                                )}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </aside>

                    </div>

                </div>

            </CmsLayout>
        </>
    );
}