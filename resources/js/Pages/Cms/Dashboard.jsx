import React from 'react';

import {
    Head,
    Link,
} from '@inertiajs/react';

import CmsLayout from '../../Layouts/CmsLayout';


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


function getContactStatusClass(status) {

    const value = String(
        status || 'new'
    )
        .toLowerCase()
        .trim();

    if (value === 'new') {
        return 'new';
    }

    if (value === 'read') {
        return 'read';
    }

    if (value === 'contacted') {
        return 'contacted';
    }

    if (value === 'closed') {
        return 'closed';
    }

    return 'default';
}


function getEnquiryStatusClass(status) {

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


/*
|--------------------------------------------------------------------------
| ICONS
|--------------------------------------------------------------------------
*/

function ProjectIcon() {
    return (
        <svg
            width="24"
            height="24"
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

            <path d="M11 13h2" />
            <path d="M11 17h2" />
        </svg>
    );
}


function CareerIcon() {
    return (
        <svg
            width="24"
            height="24"
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


function ContactIcon() {
    return (
        <svg
            width="24"
            height="24"
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


function EnquiryIcon() {
    return (
        <svg
            width="24"
            height="24"
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
            <rect
                x="4"
                y="3"
                width="16"
                height="18"
                rx="2"
            />

            <path d="M8 7h2" />
            <path d="M14 7h2" />
            <path d="M8 11h2" />
            <path d="M14 11h2" />
            <path d="M8 15h2" />
            <path d="M14 15h2" />
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

            <circle
                cx="12"
                cy="12"
                r="3"
            />
        </svg>
    );
}


function ArrowIcon() {
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
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
        </svg>
    );
}


/*
|--------------------------------------------------------------------------
| STAT CARD
|--------------------------------------------------------------------------
*/

function StatCard({
    type,
    icon,
    title,
    value,
    description,
    href,
    delay = 0,
}) {

    return (
        <Link
            href={href}
            className={`dashboard-stat-card ${type}`}
            style={{
                animationDelay: `${delay}ms`,
            }}
        >

            <div className="dashboard-stat-top">

                <div className="dashboard-stat-icon">
                    {icon}
                </div>

                <div className="dashboard-stat-arrow">
                    <ArrowIcon />
                </div>

            </div>


            <div className="dashboard-stat-value">
                {value}
            </div>


            <div className="dashboard-stat-title">
                {title}
            </div>


            <div className="dashboard-stat-description">
                {description}
            </div>

        </Link>
    );
}


/*
|--------------------------------------------------------------------------
| EMPTY STATE
|--------------------------------------------------------------------------
*/

function EmptyState({
    type,
}) {

    const isContact =
        type === 'contact';

    return (
        <div className="dashboard-empty">

            <div
                className={
                    `dashboard-empty-icon ${type}`
                }
            >
                {isContact
                    ? <ContactIcon />
                    : <EnquiryIcon />}
            </div>


            <div className="dashboard-empty-title">

                {isContact
                    ? 'No contact enquiries'
                    : 'No enquiries'}

            </div>


            <div className="dashboard-empty-text">

                {isContact
                    ? 'New Contact Us submissions will appear here.'
                    : 'New enquiry submissions will appear here.'}

            </div>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| DASHBOARD
|--------------------------------------------------------------------------
*/

export default function Dashboard({
    publishedProjects = 0,
    publishedCareers = 0,
    newContacts = 0,
    newEnquiries = 0,
    recentContacts = [],
    recentEnquiries = [],
}) {

    return (
        <>

            <Head title="Dashboard · Biltrax CMS" />


            <CmsLayout title="Dashboard">


                <style>{`

                    /*
                    |--------------------------------------------------------------------------
                    | PAGE
                    |--------------------------------------------------------------------------
                    */

                    .dashboard-page {
                        animation:
                            dashboardPageEnter
                            .45s ease both;
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | WELCOME
                    |--------------------------------------------------------------------------
                    */

                    .dashboard-welcome {
                        position: relative;

                        overflow: hidden;

                        margin-bottom: 22px;

                        padding: 24px 26px;

                        display: flex;

                        align-items: center;

                        justify-content: space-between;

                        gap: 20px;

                        background:
                            linear-gradient(
                                135deg,
                                #ffffff 0%,
                                #fbfbfc 65%,
                                #fff6f8 100%
                            );

                        border:
                            1px solid #e7e9ee;

                        border-radius: 16px;

                        box-shadow:
                            0 8px 28px
                            rgba(16, 24, 40, .035);
                    }


                    .dashboard-welcome::after {
                        content: "";

                        position: absolute;

                        width: 180px;
                        height: 180px;

                        right: -70px;
                        top: -85px;

                        border-radius: 50%;

                        background:
                            rgba(192, 18, 47, .055);

                        animation:
                            dashboardFloat
                            6s ease-in-out infinite;
                    }


                    .dashboard-welcome-content {
                        position: relative;

                        z-index: 2;
                    }


                    .dashboard-welcome-title {
                        color: #111827;

                        font-size: 20px;

                        font-weight: 750;

                        letter-spacing: -.02em;
                    }


                    .dashboard-welcome-text {
                        margin-top: 6px;

                        color: #7a8291;

                        font-size: 13px;

                        line-height: 1.6;
                    }


                    .dashboard-welcome-badge {
                        position: relative;

                        z-index: 2;

                        padding: 8px 12px;

                        display: inline-flex;

                        align-items: center;

                        gap: 7px;

                        border-radius: 20px;

                        color: #087443;

                        background: #eaf8f0;

                        font-size: 12px;

                        font-weight: 650;

                        white-space: nowrap;
                    }


                    .dashboard-welcome-badge::before {
                        content: "";

                        width: 7px;
                        height: 7px;

                        border-radius: 50%;

                        background: #12a766;

                        box-shadow:
                            0 0 0 4px
                            rgba(18, 167, 102, .10);

                        animation:
                            dashboardPulse
                            2s ease-in-out infinite;
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | STATS GRID
                    |--------------------------------------------------------------------------
                    */

                    .dashboard-stats-grid {
                        display: grid;

                        grid-template-columns:
                            repeat(
                                4,
                                minmax(0, 1fr)
                            );

                        gap: 16px;

                        margin-bottom: 22px;
                    }


                    .dashboard-stat-card {
                        position: relative;

                        min-height: 190px;

                        overflow: hidden;

                        padding: 20px;

                        display: block;

                        background: #ffffff;

                        border:
                            1px solid #e7e9ee;

                        border-radius: 15px;

                        text-decoration: none !important;

                        box-shadow:
                            0 2px 4px
                            rgba(16, 24, 40, .015),
                            0 8px 24px
                            rgba(16, 24, 40, .025);

                        animation:
                            dashboardCardEnter
                            .48s ease both;

                        transition:
                            transform .22s ease,
                            box-shadow .22s ease,
                            border-color .22s ease;
                    }


                    .dashboard-stat-card::after {
                        content: "";

                        position: absolute;

                        width: 105px;
                        height: 105px;

                        right: -45px;
                        bottom: -48px;

                        border-radius: 50%;

                        opacity: .6;

                        transition:
                            transform .35s ease;
                    }


                    .dashboard-stat-card:hover {
                        transform:
                            translateY(-5px);

                        box-shadow:
                            0 14px 34px
                            rgba(16, 24, 40, .09);
                    }


                    .dashboard-stat-card:hover::after {
                        transform:
                            scale(1.35);
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | PROJECT
                    |--------------------------------------------------------------------------
                    */

                    .dashboard-stat-card.projects:hover {
                        border-color: #cbdcff;
                    }


                    .dashboard-stat-card.projects::after {
                        background: #edf3ff;
                    }


                    .dashboard-stat-card.projects
                    .dashboard-stat-icon {
                        color: #2563eb;

                        background: #eaf1ff;
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | CAREERS
                    |--------------------------------------------------------------------------
                    */

                    .dashboard-stat-card.careers:hover {
                        border-color: #ded0ff;
                    }


                    .dashboard-stat-card.careers::after {
                        background: #f2edff;
                    }


                    .dashboard-stat-card.careers
                    .dashboard-stat-icon {
                        color: #7c3aed;

                        background: #f1ebff;
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | CONTACTS
                    |--------------------------------------------------------------------------
                    */

                    .dashboard-stat-card.contacts:hover {
                        border-color: #bce9d1;
                    }


                    .dashboard-stat-card.contacts::after {
                        background: #e9f9f0;
                    }


                    .dashboard-stat-card.contacts
                    .dashboard-stat-icon {
                        color: #087443;

                        background: #e8f8ef;
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | ENQUIRIES
                    |--------------------------------------------------------------------------
                    */

                    .dashboard-stat-card.enquiries:hover {
                        border-color: #ffcbd5;
                    }


                    .dashboard-stat-card.enquiries::after {
                        background: #fff0f3;
                    }


                    .dashboard-stat-card.enquiries
                    .dashboard-stat-icon {
                        color: #c0122f;

                        background: #fff0f3;
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | STAT CONTENT
                    |--------------------------------------------------------------------------
                    */

                    .dashboard-stat-top {
                        display: flex;

                        align-items: center;

                        justify-content: space-between;

                        margin-bottom: 18px;
                    }


                    .dashboard-stat-icon {
                        width: 48px;
                        height: 48px;

                        display: flex;

                        align-items: center;

                        justify-content: center;

                        border-radius: 13px;

                        transition:
                            transform .25s ease;
                    }


                    .dashboard-stat-card:hover
                    .dashboard-stat-icon {
                        transform:
                            rotate(-5deg)
                            scale(1.08);
                    }


                    .dashboard-stat-arrow {
                        width: 31px;
                        height: 31px;

                        display: flex;

                        align-items: center;

                        justify-content: center;

                        border-radius: 50%;

                        color: #a0a7b2;

                        background: #f6f7f9;

                        transition:
                            transform .2s ease,
                            background .2s ease,
                            color .2s ease;
                    }


                    .dashboard-stat-card:hover
                    .dashboard-stat-arrow {
                        transform:
                            translateX(3px);

                        color: #ffffff;

                        background: #202938;
                    }


                    .dashboard-stat-value {
                        position: relative;

                        z-index: 2;

                        color: #111827;

                        font-size: 31px;

                        line-height: 1;

                        font-weight: 750;

                        letter-spacing: -.04em;
                    }


                    .dashboard-stat-title {
                        position: relative;

                        z-index: 2;

                        margin-top: 8px;

                        color: #344054;

                        font-size: 13px;

                        font-weight: 700;
                    }


                    .dashboard-stat-description {
                        position: relative;

                        z-index: 2;

                        margin-top: 5px;

                        color: #98a0ae;

                        font-size: 11px;

                        line-height: 1.45;
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | DASHBOARD CONTENT GRID
                    |--------------------------------------------------------------------------
                    */

                    .dashboard-content-grid {
                        display: grid;

                        grid-template-columns:
                            repeat(
                                2,
                                minmax(0, 1fr)
                            );

                        gap: 18px;
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | TABLE CARDS
                    |--------------------------------------------------------------------------
                    */

                    .dashboard-table-card {
                        overflow: hidden;

                        min-width: 0;

                        background: #ffffff;

                        border:
                            1px solid #e7e9ee;

                        border-radius: 16px;

                        box-shadow:
                            0 8px 28px
                            rgba(16, 24, 40, .035);

                        animation:
                            dashboardTableEnter
                            .5s ease both;

                        transition:
                            transform .22s ease,
                            box-shadow .22s ease;
                    }


                    .dashboard-table-card:hover {
                        transform:
                            translateY(-2px);

                        box-shadow:
                            0 12px 34px
                            rgba(16, 24, 40, .06);
                    }


                    .dashboard-table-card:nth-child(2) {
                        animation-delay: 80ms;
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | TABLE HEADER
                    |--------------------------------------------------------------------------
                    */

                    .dashboard-table-header {
                        padding: 18px 20px;

                        display: flex;

                        align-items: center;

                        justify-content: space-between;

                        gap: 14px;

                        border-bottom:
                            1px solid #eceef2;
                    }


                    .dashboard-table-heading {
                        display: flex;

                        align-items: center;

                        gap: 11px;
                    }


                    .dashboard-table-icon {
                        width: 38px;
                        height: 38px;

                        flex: 0 0 38px;

                        display: flex;

                        align-items: center;

                        justify-content: center;

                        border-radius: 10px;
                    }


                    .dashboard-table-icon svg {
                        width: 19px;
                        height: 19px;
                    }


                    .dashboard-table-icon.contact {
                        color: #087443;

                        background: #e8f8ef;
                    }


                    .dashboard-table-icon.enquiry {
                        color: #c0122f;

                        background: #fff0f3;
                    }


                    .dashboard-table-title {
                        color: #111827;

                        font-size: 14px;

                        font-weight: 700;
                    }


                    .dashboard-table-subtitle {
                        margin-top: 3px;

                        color: #98a0ae;

                        font-size: 11px;
                    }


                    .dashboard-view-all {
                        display: inline-flex;

                        align-items: center;

                        gap: 6px;

                        color: #667085 !important;

                        text-decoration: none;

                        font-size: 12px;

                        font-weight: 650;

                        white-space: nowrap;

                        transition:
                            color .18s ease,
                            transform .18s ease;
                    }


                    .dashboard-view-all:hover {
                        color: #c0122f !important;

                        transform:
                            translateX(2px);
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | TABLE
                    |--------------------------------------------------------------------------
                    */

                    .dashboard-table-wrap {
                        width: 100%;

                        overflow-x: auto;
                    }


                    .dashboard-table {
                        width: 100%;

                        border-collapse: collapse;

                        border-spacing: 0;
                    }


                    .dashboard-table thead {
                        background: #fafbfc;
                    }


                    .dashboard-table th {
                        padding: 11px 14px;

                        text-align: left;

                        border-bottom:
                            1px solid #eceef2;

                        color: #7b8492;

                        font-size: 10px;

                        font-weight: 700;

                        text-transform: uppercase;

                        letter-spacing: .06em;

                        white-space: nowrap;
                    }


                    .dashboard-table td {
                        padding: 14px;

                        border-bottom:
                            1px solid #eef0f3;

                        color: #475467;

                        font-size: 12px;

                        vertical-align: middle;
                    }


                    .dashboard-table tbody
                    tr:last-child td {
                        border-bottom: 0;
                    }


                    .dashboard-table-row {
                        transition:
                            background .18s ease;
                    }


                    .dashboard-table-row:hover {
                        background: #fafbfc;
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | PERSON
                    |--------------------------------------------------------------------------
                    */

                    .dashboard-person {
                        min-width: 130px;

                        display: flex;

                        align-items: center;

                        gap: 9px;
                    }


                    .dashboard-avatar {
                        width: 32px;
                        height: 32px;

                        flex: 0 0 32px;

                        display: flex;

                        align-items: center;

                        justify-content: center;

                        border-radius: 50%;

                        color: #c0122f;

                        background:
                            rgba(192, 18, 47, .08);

                        font-size: 11px;

                        font-weight: 700;

                        text-transform: uppercase;

                        transition:
                            transform .18s ease,
                            background .18s ease;
                    }


                    .dashboard-table-row:hover
                    .dashboard-avatar {
                        transform: scale(1.07);

                        background:
                            rgba(192, 18, 47, .13);
                    }


                    .dashboard-person-name {
                        color: #202631;

                        font-size: 12px;

                        font-weight: 650;
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | DATE / COMPANY
                    |--------------------------------------------------------------------------
                    */

                    .dashboard-date,
                    .dashboard-company {
                        display: inline-flex;

                        align-items: center;

                        gap: 6px;

                        white-space: nowrap;
                    }


                    .dashboard-date svg,
                    .dashboard-company svg {
                        flex-shrink: 0;

                        color: #a0a7b2;
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | STATUS
                    |--------------------------------------------------------------------------
                    */

                    .dashboard-status {
                        display: inline-flex;

                        align-items: center;

                        gap: 6px;

                        padding: 4px 8px;

                        border-radius: 20px;

                        font-size: 10px;

                        font-weight: 700;

                        text-transform: capitalize;

                        white-space: nowrap;
                    }


                    .dashboard-status::before {
                        content: "";

                        width: 5px;
                        height: 5px;

                        border-radius: 50%;

                        background: currentColor;
                    }


                    .dashboard-status.new {
                        color: #175cd3;

                        background: #eaf2ff;
                    }


                    .dashboard-status.read,
                    .dashboard-status.reviewed {
                        color: #6941c6;

                        background: #f1ebff;
                    }


                    .dashboard-status.contacted {
                        color: #087443;

                        background: #e8f8ef;
                    }


                    .dashboard-status.closed {
                        color: #667085;

                        background: #f2f4f7;
                    }


                    .dashboard-status.default {
                        color: #667085;

                        background: #f2f4f7;
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | VIEW BUTTON
                    |--------------------------------------------------------------------------
                    */

                    .dashboard-view-button {
                        width: 32px;
                        height: 32px;

                        display: inline-flex;

                        align-items: center;

                        justify-content: center;

                        border:
                            1px solid #e2e6ec;

                        border-radius: 8px;

                        color: #667085 !important;

                        background: #f7f8fa;

                        text-decoration: none;

                        transition:
                            transform .18s ease,
                            color .18s ease,
                            background .18s ease,
                            border-color .18s ease;
                    }


                    .dashboard-view-button:hover {
                        transform:
                            translateY(-1px);

                        color: #ffffff !important;

                        background: #c0122f;

                        border-color: #c0122f;
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | EMPTY
                    |--------------------------------------------------------------------------
                    */

                    .dashboard-empty-cell {
                        padding:
                            45px 20px !important;
                    }


                    .dashboard-empty {
                        text-align: center;
                    }


                    .dashboard-empty-icon {
                        width: 46px;
                        height: 46px;

                        margin:
                            0 auto 12px;

                        display: flex;

                        align-items: center;

                        justify-content: center;

                        border-radius: 12px;
                    }


                    .dashboard-empty-icon svg {
                        width: 21px;
                        height: 21px;
                    }


                    .dashboard-empty-icon.contact {
                        color: #087443;

                        background: #e8f8ef;
                    }


                    .dashboard-empty-icon.enquiry {
                        color: #c0122f;

                        background: #fff0f3;
                    }


                    .dashboard-empty-title {
                        color: #344054;

                        font-size: 13px;

                        font-weight: 700;
                    }


                    .dashboard-empty-text {
                        margin-top: 4px;

                        color: #98a0ae;

                        font-size: 11px;
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | ANIMATIONS
                    |--------------------------------------------------------------------------
                    */

                    @keyframes dashboardPageEnter {

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


                    @keyframes dashboardCardEnter {

                        from {
                            opacity: 0;

                            transform:
                                translateY(12px);
                        }

                        to {
                            opacity: 1;

                            transform:
                                translateY(0);
                        }
                    }


                    @keyframes dashboardTableEnter {

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


                    @keyframes dashboardPulse {

                        0%,
                        100% {
                            box-shadow:
                                0 0 0 4px
                                rgba(18, 167, 102, .10);
                        }

                        50% {
                            box-shadow:
                                0 0 0 7px
                                rgba(18, 167, 102, .04);
                        }
                    }


                    @keyframes dashboardFloat {

                        0%,
                        100% {
                            transform:
                                translateY(0);
                        }

                        50% {
                            transform:
                                translateY(8px);
                        }
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | RESPONSIVE
                    |--------------------------------------------------------------------------
                    */

                    @media (
                        max-width: 1200px
                    ) {

                        .dashboard-stats-grid {
                            grid-template-columns:
                                repeat(
                                    2,
                                    minmax(0, 1fr)
                                );
                        }
                    }


                    @media (
                        max-width: 1000px
                    ) {

                        .dashboard-content-grid {
                            grid-template-columns:
                                1fr;
                        }
                    }


                    @media (
                        max-width: 640px
                    ) {

                        .dashboard-welcome {
                            padding: 20px;

                            align-items:
                                flex-start;

                            flex-direction:
                                column;
                        }


                        .dashboard-welcome-title {
                            font-size: 18px;
                        }


                        .dashboard-stats-grid {
                            grid-template-columns:
                                1fr;

                            gap: 12px;
                        }


                        .dashboard-stat-card {
                            min-height: auto;

                            padding: 18px;
                        }


                        .dashboard-stat-value {
                            font-size: 28px;
                        }


                        .dashboard-table-header {
                            padding: 16px;
                        }


                        .dashboard-view-all span {
                            display: none;
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

                        .dashboard-page,
                        .dashboard-stat-card,
                        .dashboard-table-card,
                        .dashboard-welcome::after,
                        .dashboard-welcome-badge::before {
                            animation: none !important;
                        }


                        .dashboard-stat-card,
                        .dashboard-stat-icon,
                        .dashboard-stat-arrow,
                        .dashboard-table-card {
                            transition: none !important;
                        }
                    }

                `}</style>


                <div className="dashboard-page">


                    {/*
                    |--------------------------------------------------------------------------
                    | WELCOME
                    |--------------------------------------------------------------------------
                    */}

                    <div className="dashboard-welcome">

                        <div className="dashboard-welcome-content">

                            <div className="dashboard-welcome-title">
                                Biltrax CMS Overview
                            </div>

                            <div className="dashboard-welcome-text">
                                Manage website projects, careers, contact submissions and enquiries from one place.
                            </div>

                        </div>


                        <div className="dashboard-welcome-badge">
                            CMS Active
                        </div>

                    </div>


                    {/*
                    |--------------------------------------------------------------------------
                    | STAT CARDS
                    |--------------------------------------------------------------------------
                    */}

                    <div className="dashboard-stats-grid">

                        <StatCard
                            type="projects"
                            icon={<ProjectIcon />}
                            title="Published Projects"
                            value={publishedProjects}
                            description="Projects currently visible on the website"
                            href="/cms/projects"
                            delay={0}
                        />


                        <StatCard
                            type="careers"
                            icon={<CareerIcon />}
                            title="Published Careers"
                            value={publishedCareers}
                            description="Active career opportunities on the website"
                            href="/cms/careers"
                            delay={70}
                        />


                        <StatCard
                            type="contacts"
                            icon={<ContactIcon />}
                            title="New Contacts"
                            value={newContacts}
                            description="Unread Contact Us submissions"
                            href="/cms/contact-enquiries"
                            delay={140}
                        />


                        <StatCard
                            type="enquiries"
                            icon={<EnquiryIcon />}
                            title="New Enquiries"
                            value={newEnquiries}
                            description="New business and demo enquiries"
                            href="/cms/enquiries"
                            delay={210}
                        />

                    </div>


                    {/*
                    |--------------------------------------------------------------------------
                    | RECENT TABLES
                    |--------------------------------------------------------------------------
                    */}

                    <div className="dashboard-content-grid">


                        {/*
                        |--------------------------------------------------------------------------
                        | RECENT CONTACT ENQUIRIES
                        |--------------------------------------------------------------------------
                        */}

                        <div className="dashboard-table-card">

                            <div className="dashboard-table-header">

                                <div className="dashboard-table-heading">

                                    <div className="dashboard-table-icon contact">
                                        <ContactIcon />
                                    </div>


                                    <div>

                                        <div className="dashboard-table-title">
                                            Recent Contact Enquiries
                                        </div>

                                        <div className="dashboard-table-subtitle">
                                            Latest Contact Us submissions
                                        </div>

                                    </div>

                                </div>


                                <Link
                                    href="/cms/contact-enquiries"
                                    className="dashboard-view-all"
                                >
                                    <span>
                                        View all
                                    </span>

                                    <ArrowIcon />
                                </Link>

                            </div>


                            <div className="dashboard-table-wrap">

                                <table className="dashboard-table">

                                    <thead>

                                        <tr>
                                            <th>Date</th>
                                            <th>Name</th>
                                            <th>Company</th>
                                            <th>Status</th>
                                            <th></th>
                                        </tr>

                                    </thead>


                                    <tbody>

                                        {recentContacts.length === 0 ? (

                                            <tr>

                                                <td
                                                    colSpan="5"
                                                    className="dashboard-empty-cell"
                                                >
                                                    <EmptyState
                                                        type="contact"
                                                    />
                                                </td>

                                            </tr>

                                        ) : (

                                            recentContacts.map(
                                                (item) => (

                                                    <tr
                                                        key={item.id}
                                                        className="dashboard-table-row"
                                                    >

                                                        <td>

                                                            <span className="dashboard-date">

                                                                <CalendarIcon />

                                                                {formatDate(
                                                                    item.created_at
                                                                )}

                                                            </span>

                                                        </td>


                                                        <td>

                                                            <div className="dashboard-person">

                                                                <div className="dashboard-avatar">

                                                                    {String(
                                                                        item.name ||
                                                                        'C'
                                                                    )
                                                                        .trim()
                                                                        .charAt(0)}

                                                                </div>


                                                                <div className="dashboard-person-name">
                                                                    {item.name || '—'}
                                                                </div>

                                                            </div>

                                                        </td>


                                                        <td>

                                                            {item.company ? (

                                                                <span className="dashboard-company">

                                                                    <BuildingIcon />

                                                                    {item.company}

                                                                </span>

                                                            ) : (
                                                                '—'
                                                            )}

                                                        </td>


                                                        <td>

                                                            <span
                                                                className={
                                                                    `dashboard-status ${getContactStatusClass(
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
                                                                className="dashboard-view-button"
                                                                title="View contact enquiry"
                                                            >
                                                                <EyeIcon />
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


                        {/*
                        |--------------------------------------------------------------------------
                        | RECENT ENQUIRIES
                        |--------------------------------------------------------------------------
                        */}

                        <div className="dashboard-table-card">

                            <div className="dashboard-table-header">

                                <div className="dashboard-table-heading">

                                    <div className="dashboard-table-icon enquiry">
                                        <EnquiryIcon />
                                    </div>


                                    <div>

                                        <div className="dashboard-table-title">
                                            Recent Enquiries
                                        </div>

                                        <div className="dashboard-table-subtitle">
                                            Latest business and demo enquiries
                                        </div>

                                    </div>

                                </div>


                                <Link
                                    href="/cms/enquiries"
                                    className="dashboard-view-all"
                                >
                                    <span>
                                        View all
                                    </span>

                                    <ArrowIcon />
                                </Link>

                            </div>


                            <div className="dashboard-table-wrap">

                                <table className="dashboard-table">

                                    <thead>

                                        <tr>
                                            <th>Date</th>
                                            <th>Name</th>
                                            <th>Company</th>
                                            <th>Status</th>
                                            <th></th>
                                        </tr>

                                    </thead>


                                    <tbody>

                                        {recentEnquiries.length === 0 ? (

                                            <tr>

                                                <td
                                                    colSpan="5"
                                                    className="dashboard-empty-cell"
                                                >
                                                    <EmptyState
                                                        type="enquiry"
                                                    />
                                                </td>

                                            </tr>

                                        ) : (

                                            recentEnquiries.map(
                                                (item) => (

                                                    <tr
                                                        key={item.id}
                                                        className="dashboard-table-row"
                                                    >

                                                        <td>

                                                            <span className="dashboard-date">

                                                                <CalendarIcon />

                                                                {formatDate(
                                                                    item.created_at
                                                                )}

                                                            </span>

                                                        </td>


                                                        <td>

                                                            <div className="dashboard-person">

                                                                <div className="dashboard-avatar">

                                                                    {String(
                                                                        item.name ||
                                                                        'E'
                                                                    )
                                                                        .trim()
                                                                        .charAt(0)}

                                                                </div>


                                                                <div className="dashboard-person-name">
                                                                    {item.name || '—'}
                                                                </div>

                                                            </div>

                                                        </td>


                                                        <td>

                                                            {item.company ? (

                                                                <span className="dashboard-company">

                                                                    <BuildingIcon />

                                                                    {item.company}

                                                                </span>

                                                            ) : (
                                                                '—'
                                                            )}

                                                        </td>


                                                        <td>

                                                            <span
                                                                className={
                                                                    `dashboard-status ${getEnquiryStatusClass(
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
                                                                className="dashboard-view-button"
                                                                title="View enquiry"
                                                            >
                                                                <EyeIcon />
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

                    </div>

                </div>

            </CmsLayout>

        </>
    );
}