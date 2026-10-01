import React, {
    useEffect,
    useState,
} from 'react';

import {
    Head,
    Link,
    router,
} from '@inertiajs/react';

import axios from 'axios';

import CmsLayout from '../../../Layouts/CmsLayout';


/*
|--------------------------------------------------------------------------
| Icons
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
        >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
        </svg>
    );
}


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
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
        </svg>
    );
}


function ProjectIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
            />
            <path d="M8 8h8" />
            <path d="M8 12h8" />
            <path d="M8 16h5" />
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
        >
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
        </svg>
    );
}


function ArrowRightIcon() {
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
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
        </svg>
    );
}


function RefreshIcon() {
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
        >
            <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5" />
            <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5" />
        </svg>
    );
}


/*
|--------------------------------------------------------------------------
| Page
|--------------------------------------------------------------------------
*/

export default function Bx1Projects() {

    const [projects, setProjects] = useState([]);

    const [meta, setMeta] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 25,
        total: 0,
    });

    const [query, setQuery] = useState('');

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

    const [selectedId, setSelectedId] = useState(null);


    /*
    |--------------------------------------------------------------------------
    | Load Projects
    |--------------------------------------------------------------------------
    */

    async function loadProjects(
        page = 1,
        search = query
    ) {

        setLoading(true);
        setError('');

        try {

            const response = await axios.post(
                '/cms/bx1/projects/search',
                {
                    page,
                    per_page: 25,
                    q: search,
                }
            );

            if (!response.data?.success) {

                throw new Error(
                    response.data?.message ||
                    'Unable to load BX1 projects.'
                );
            }

            setProjects(
                response.data.data || []
            );

            setMeta({
                current_page:
                    response.data.meta?.current_page || page,

                last_page:
                    response.data.meta?.last_page || 1,

                per_page:
                    response.data.meta?.per_page || 25,

                total:
                    response.data.meta?.total || 0,
            });

        } catch (err) {

            console.error(err);

            setProjects([]);

            setError(
                err?.response?.data?.message ||
                err?.message ||
                'Unable to connect to BX1.'
            );

        } finally {

            setLoading(false);

        }
    }


    /*
    |--------------------------------------------------------------------------
    | Initial Load
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadProjects(1, '');

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    function submitSearch(e) {

        e.preventDefault();

        loadProjects(
            1,
            query.trim()
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Select Project
    |--------------------------------------------------------------------------
    */

function selectProject(project) {

    setSelectedId(project.id);

    /*
    |--------------------------------------------------------------------------
    | BX1 → CMS Mapping
    |--------------------------------------------------------------------------
    */

    const projectName =
        project.name ?? '';

    const sourceProjectId =
        project.id ?? '';

    const sector =
        project.sector ?? '';

    const projectStage =
        project.status ?? '';

    const state =
        project.state ?? '';

    const region =
        project.region ?? '';

    const city =
        project.city_name?.name ??
        project.city ??
        '';

    /*
    |--------------------------------------------------------------------------
    | Project Type
    |--------------------------------------------------------------------------
    |
    | BX1 full resource contains building_use.
    |
    | Example:
    | Commercial, Retail
    |
    */

    const projectType =
        project.building_use ??
        project.project_type?.name ??
        project.project_type ??
        '';


    /*
    |--------------------------------------------------------------------------
    | Location
    |--------------------------------------------------------------------------
    */

    const location = [
        city,
        state,
    ]
        .filter(Boolean)
        .join(', ');


    /*
    |--------------------------------------------------------------------------
    | Open Existing CMS Form
    |--------------------------------------------------------------------------
    */

    router.get(
        '/cms/projects/create',
        {
            source: 'bx1',

            source_project_id:
                sourceProjectId,

            project_name:
                projectName,

            sector:
                sector,

            project_type:
                projectType,

            project_stage:
                projectStage,

            city:
                city,

            state:
                state,

            region:
                region,

            location:
                location,
        },
        {
            preserveScroll: true,
        }
    );
}

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    function pageNumbers() {

        const current =
            Number(meta.current_page || 1);

        const last =
            Number(meta.last_page || 1);

        const start =
            Math.max(
                1,
                current - 2
            );

        const end =
            Math.min(
                last,
                current + 2
            );

        const pages = [];

        for (
            let page = start;
            page <= end;
            page++
        ) {
            pages.push(page);
        }

        return pages;
    }


    return (

        <CmsLayout
            title="Import Project"
            action={
                <Link
                    href="/cms/projects"
                    className="bx1-back-button"
                >
                    <ArrowLeftIcon />

                    <span>
                        Back to Projects
                    </span>
                </Link>
            }
        >

            <Head title="Import BX1 Project · Biltrax CMS" />


            <style>{`

                .bx1-page {
                    max-width: 1500px;
                    margin: 0 auto;
                    animation: bx1Enter .4s ease both;
                }


                /*
                |--------------------------------------------------------------------------
                | Back
                |--------------------------------------------------------------------------
                */

                .bx1-back-button {
                    height: 40px;
                    padding: 0 14px;

                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;

                    border: 1px solid #e1e5ea;
                    border-radius: 9px;

                    background: #ffffff;

                    color: #475467 !important;

                    text-decoration: none;

                    font-size: 13px;
                    font-weight: 600;

                    transition: .18s ease;
                }

                .bx1-back-button:hover {
                    color: #c0122f !important;
                    border-color: rgba(192,18,47,.25);
                    background: #fff8f9;
                    transform: translateY(-1px);
                }


                /*
                |--------------------------------------------------------------------------
                | Hero
                |--------------------------------------------------------------------------
                */

                .bx1-hero {
                    padding: 24px 26px;
                    margin-bottom: 18px;

                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;

                    border: 1px solid #e5e7eb;
                    border-radius: 16px;

                    background:
                        linear-gradient(
                            135deg,
                            #ffffff 0%,
                            #fffafb 100%
                        );

                    box-shadow:
                        0 1px 2px rgba(16,24,40,.02),
                        0 8px 28px rgba(16,24,40,.035);
                }

                .bx1-hero-left {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                .bx1-hero-icon {
                    width: 48px;
                    height: 48px;
                    flex: 0 0 48px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border-radius: 13px;

                    color: #c0122f;

                    background:
                        rgba(192,18,47,.08);
                }

                .bx1-hero-title {
                    color: #111827;
                    font-size: 18px;
                    line-height: 1.3;
                    font-weight: 700;
                }

                .bx1-hero-description {
                    margin-top: 4px;

                    color: #7c8594;

                    font-size: 12.5px;
                    line-height: 1.5;
                }

                .bx1-live-badge {
                    padding: 7px 11px;

                    display: inline-flex;
                    align-items: center;
                    gap: 7px;

                    border-radius: 20px;

                    background: #eaf8f0;

                    color: #147a4b;

                    font-size: 11px;
                    font-weight: 650;
                }

                .bx1-live-badge::before {
                    content: "";

                    width: 6px;
                    height: 6px;

                    border-radius: 50%;

                    background: currentColor;
                }


                /*
                |--------------------------------------------------------------------------
                | Search
                |--------------------------------------------------------------------------
                */

                .bx1-search-card {
                    padding: 20px;
                    margin-bottom: 18px;

                    border: 1px solid #e7e9ee;
                    border-radius: 16px;

                    background: #ffffff;

                    box-shadow:
                        0 1px 2px rgba(16,24,40,.02),
                        0 8px 28px rgba(16,24,40,.035);
                }

                .bx1-search-form {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .bx1-search-wrap {
                    position: relative;
                    flex: 1;
                }

                .bx1-search-icon {
                    position: absolute;

                    left: 15px;
                    top: 50%;

                    transform:
                        translateY(-50%);

                    display: flex;

                    color: #8a91a0;

                    pointer-events: none;
                }

                .bx1-search-input {
                    width: 100%;
                    height: 46px;

                    box-sizing: border-box;

                    padding:
                        0 16px 0 45px;

                    border:
                        1px solid #dfe3e8;

                    border-radius: 10px;

                    background: #fafbfc;

                    color: #111827;

                    font-family: inherit;
                    font-size: 13.5px;

                    outline: none;

                    transition: .18s ease;
                }

                .bx1-search-input:focus {
                    background: #ffffff;

                    border-color: #c0122f;

                    box-shadow:
                        0 0 0 3px
                        rgba(192,18,47,.08);
                }

                .bx1-search-button,
                .bx1-refresh-button {
                    height: 46px;

                    border: 0;
                    border-radius: 10px;

                    display: inline-flex;
                    align-items: center;
                    justify-content: center;

                    cursor: pointer;

                    font-family: inherit;
                    font-size: 13px;
                    font-weight: 600;
                }

                .bx1-search-button {
                    padding: 0 20px;

                    gap: 8px;

                    background: #111827;

                    color: #ffffff;
                }

                .bx1-search-button:hover {
                    background: #202b3c;
                }

                .bx1-refresh-button {
                    width: 46px;

                    border:
                        1px solid #e1e5ea;

                    background: #ffffff;

                    color: #596171;
                }

                .bx1-refresh-button:hover {
                    color: #c0122f;
                    background: #fff8f9;
                }

                .bx1-search-button:disabled,
                .bx1-refresh-button:disabled {
                    opacity: .55;
                    cursor: wait;
                }


                /*
                |--------------------------------------------------------------------------
                | Table
                |--------------------------------------------------------------------------
                */

                .bx1-table-card {
                    overflow: hidden;

                    border:
                        1px solid #e7e9ee;

                    border-radius: 16px;

                    background: #ffffff;

                    box-shadow:
                        0 1px 2px rgba(16,24,40,.02),
                        0 8px 28px rgba(16,24,40,.035);
                }

                .bx1-table-header {
                    padding: 19px 23px;

                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;

                    border-bottom:
                        1px solid #eceef2;
                }

                .bx1-table-header-left {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                }

                .bx1-table-header-icon {
                    width: 37px;
                    height: 37px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border-radius: 10px;

                    color: #c0122f;

                    background:
                        rgba(192,18,47,.08);
                }

                .bx1-table-title {
                    color: #111827;

                    font-size: 14px;
                    font-weight: 700;
                }

                .bx1-table-subtitle {
                    margin-top: 3px;

                    color: #8a91a0;

                    font-size: 11.5px;
                }

                .bx1-count {
                    padding: 6px 10px;

                    border-radius: 20px;

                    background: #f3f4f6;

                    color: #596171;

                    font-size: 11.5px;
                    font-weight: 600;
                }

                .bx1-table-wrap {
                    width: 100%;
                    overflow-x: auto;
                }

                .bx1-table {
                    width: 100%;

                    border-collapse: collapse;
                }

                .bx1-table thead {
                    background: #fafbfc;
                }

                .bx1-table th {
                    padding: 13px 18px;

                    text-align: left;

                    border-bottom:
                        1px solid #eceef2;

                    color: #697180;

                    font-size: 10.5px;
                    font-weight: 700;

                    text-transform: uppercase;

                    letter-spacing: .06em;

                    white-space: nowrap;
                }

                .bx1-table td {
                    padding: 16px 18px;

                    border-bottom:
                        1px solid #eef0f3;

                    color: #3c4350;

                    font-size: 13px;

                    vertical-align: middle;
                }

                .bx1-table tbody tr {
                    transition:
                        background .18s ease;
                }

                .bx1-table tbody tr:hover {
                    background: #fafbfc;
                }

                .bx1-project {
                    min-width: 260px;

                    display: flex;
                    align-items: center;
                    gap: 11px;
                }

                .bx1-project-avatar {
                    width: 38px;
                    height: 38px;

                    flex: 0 0 38px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border-radius: 10px;

                    background: #f2f3f5;

                    color: #697180;

                    font-size: 13px;
                    font-weight: 700;
                }

                .bx1-project-name {
                    max-width: 400px;

                    color: #111827;

                    font-weight: 650;
                    line-height: 1.4;
                }

                .bx1-project-id {
                    margin-top: 3px;

                    color: #9aa1ad;

                    font-size: 10.5px;
                }

                .bx1-location {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;

                    white-space: nowrap;
                }

                .bx1-location svg {
                    color: #9aa1ad;
                }

                .bx1-select-button {
                    height: 36px;

                    padding: 0 13px;

                    border: 0;
                    border-radius: 8px;

                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;

                    background: #c0122f;

                    color: #ffffff;

                    cursor: pointer;

                    font-family: inherit;
                    font-size: 12px;
                    font-weight: 650;

                    white-space: nowrap;

                    transition: .18s ease;
                }

                .bx1-select-button:hover {
                    background: #a90f29;

                    transform:
                        translateY(-1px);

                    box-shadow:
                        0 5px 12px
                        rgba(192,18,47,.18);
                }

                .bx1-select-button:disabled {
                    opacity: .6;
                    cursor: wait;
                }


                /*
                |--------------------------------------------------------------------------
                | States
                |--------------------------------------------------------------------------
                */

                .bx1-state {
                    padding: 60px 25px !important;

                    text-align: center;
                }

                .bx1-state-icon {
                    width: 52px;
                    height: 52px;

                    margin:
                        0 auto 13px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border-radius: 14px;

                    background: #f4f5f7;

                    color: #8a91a0;
                }

                .bx1-state-title {
                    color: #202631;

                    font-size: 14px;
                    font-weight: 700;
                }

                .bx1-state-text {
                    margin-top: 5px;

                    color: #8a91a0;

                    font-size: 12px;
                }

                .bx1-error {
                    color: #b42318;
                }


                /*
                |--------------------------------------------------------------------------
                | Pagination
                |--------------------------------------------------------------------------
                */

                .bx1-pagination {
                    padding: 16px 20px;

                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 15px;

                    border-top:
                        1px solid #eceef2;

                    background: #fafbfc;
                }

                .bx1-pagination-info {
                    color: #7c8594;

                    font-size: 11.5px;
                }

                .bx1-pagination-buttons {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .bx1-page-button {
                    min-width: 34px;
                    height: 34px;

                    padding: 0 9px;

                    border:
                        1px solid #e1e5ea;

                    border-radius: 8px;

                    background: #ffffff;

                    color: #596171;

                    cursor: pointer;

                    font-family: inherit;
                    font-size: 12px;
                    font-weight: 600;
                }

                .bx1-page-button:hover:not(:disabled) {
                    border-color:
                        rgba(192,18,47,.3);

                    color: #c0122f;
                }

                .bx1-page-button.active {
                    border-color: #c0122f;

                    background: #c0122f;

                    color: #ffffff;
                }

                .bx1-page-button:disabled {
                    opacity: .45;
                    cursor: default;
                }


                @keyframes bx1Enter {

                    from {
                        opacity: 0;

                        transform:
                            translateY(6px);
                    }

                    to {
                        opacity: 1;

                        transform:
                            translateY(0);
                    }
                }


                @media (max-width: 768px) {

                    .bx1-hero {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .bx1-search-form {
                        align-items: stretch;
                        flex-direction: column;
                    }

                    .bx1-search-button,
                    .bx1-refresh-button {
                        width: 100%;
                    }

                    .bx1-pagination {
                        align-items: stretch;
                        flex-direction: column;
                    }

                    .bx1-pagination-buttons {
                        overflow-x: auto;
                    }

                    .bx1-back-button span {
                        display: none;
                    }

                    .bx1-back-button {
                        width: 40px;
                        padding: 0;
                    }
                }

            `}</style>


            <div className="bx1-page">


                {/* HERO */}

                <div className="bx1-hero">

                    <div className="bx1-hero-left">

                        <div className="bx1-hero-icon">
                            <ProjectIcon />
                        </div>

                        <div>

                            <div className="bx1-hero-title">
                                Import Project from BX1
                            </div>

                            <div className="bx1-hero-description">
                                Search the BX1 project database and select a project to add to the Biltrax website.
                            </div>

                        </div>

                    </div>


                    <div className="bx1-live-badge">
                        BX1 Live Data
                    </div>

                </div>


                {/* SEARCH */}

                <div className="bx1-search-card">

                    <form
                        className="bx1-search-form"
                        onSubmit={submitSearch}
                    >

                        <div className="bx1-search-wrap">

                            <span className="bx1-search-icon">
                                <SearchIcon />
                            </span>

                            <input
                                type="text"
                                className="bx1-search-input"
                                value={query}
                                onChange={(e) =>
                                    setQuery(
                                        e.target.value
                                    )
                                }
                                placeholder="Search BX1 projects by name, city, state or sector..."
                            />

                        </div>


                        <button
                            type="submit"
                            className="bx1-search-button"
                            disabled={loading}
                        >

                            <SearchIcon />

                            {loading
                                ? 'Loading...'
                                : 'Search'}

                        </button>


                        <button
                            type="button"
                            className="bx1-refresh-button"
                            disabled={loading}
                            title="Refresh"
                            onClick={() =>
                                loadProjects(
                                    meta.current_page,
                                    query
                                )
                            }
                        >
                            <RefreshIcon />
                        </button>

                    </form>

                </div>


                {/* TABLE */}

                <div className="bx1-table-card">

                    <div className="bx1-table-header">

                        <div className="bx1-table-header-left">

                            <div className="bx1-table-header-icon">
                                <ProjectIcon />
                            </div>

                            <div>

                                <div className="bx1-table-title">
                                    BX1 Project Directory
                                </div>

                                <div className="bx1-table-subtitle">
                                    Select a project to import into CMS
                                </div>

                            </div>

                        </div>


                        <div className="bx1-count">
                            {meta.total
                                ? `${meta.total.toLocaleString()} projects`
                                : `${projects.length} projects`}
                        </div>

                    </div>


                    <div className="bx1-table-wrap">

                        <table className="bx1-table">

                            <thead>

                                <tr>
                                    <th>Project</th>
                                    <th>Sector</th>
                                    <th>Location</th>
                                    <th>Updated</th>
                                    <th>Action</th>
                                </tr>

                            </thead>


                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="bx1-state"
                                        >

                                            <div className="bx1-state-icon">
                                                <RefreshIcon />
                                            </div>

                                            <div className="bx1-state-title">
                                                Loading BX1 Projects
                                            </div>

                                            <div className="bx1-state-text">
                                                Retrieving project data from BX1...
                                            </div>

                                        </td>

                                    </tr>

                                ) : error ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="bx1-state"
                                        >

                                            <div className="bx1-state-icon">
                                                <ProjectIcon />
                                            </div>

                                            <div className="bx1-state-title bx1-error">
                                                Unable to Load Projects
                                            </div>

                                            <div className="bx1-state-text">
                                                {error}
                                            </div>

                                        </td>

                                    </tr>

                                ) : projects.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="bx1-state"
                                        >

                                            <div className="bx1-state-icon">
                                                <SearchIcon />
                                            </div>

                                            <div className="bx1-state-title">
                                                No Projects Found
                                            </div>

                                            <div className="bx1-state-text">
                                                Try changing your search criteria.
                                            </div>

                                        </td>

                                    </tr>

                                ) : (

                                    projects.map(
                                        (project) => {

                                            const city =
                                                project.city_name?.name ||
                                                project.city ||
                                                '';

                                            const location =
                                                [
                                                    city,
                                                    project.state,
                                                ]
                                                    .filter(Boolean)
                                                    .join(', ');

                                            return (

                                                <tr key={project.id}>

                                                    <td>

                                                        <div className="bx1-project">

                                                            <div className="bx1-project-avatar">
                                                                {String(
                                                                    project.name ||
                                                                    'P'
                                                                )
                                                                    .trim()
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </div>

                                                            <div>

                                                                <div className="bx1-project-name">
                                                                    {project.name ||
                                                                        'Untitled Project'}
                                                                </div>

                                                                <div className="bx1-project-id">
                                                                    BX1 ID #{project.id}
                                                                </div>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    <td>
                                                        {project.sector || '—'}
                                                    </td>


                                                    <td>

                                                        {location ? (

                                                            <span className="bx1-location">

                                                                <LocationIcon />

                                                                {location}

                                                            </span>

                                                        ) : (
                                                            '—'
                                                        )}

                                                    </td>


                                                    <td>
                                                        {project.updated_at
                                                            ? new Date(
                                                                project.updated_at
                                                            ).toLocaleDateString(
                                                                'en-IN'
                                                            )
                                                            : '—'}
                                                    </td>


                                                    <td>

                                                        <button
                                                            type="button"
                                                            className="bx1-select-button"
                                                            disabled={
                                                                selectedId ===
                                                                project.id
                                                            }
                                                            onClick={() =>
                                                                selectProject(
                                                                    project
                                                                )
                                                            }
                                                        >

                                                            {selectedId ===
                                                            project.id
                                                                ? 'Opening...'
                                                                : 'Select'}

                                                            <ArrowRightIcon />

                                                        </button>

                                                    </td>

                                                </tr>

                                            );
                                        }
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>


                    {!loading &&
                        !error &&
                        meta.last_page > 1 && (

                            <div className="bx1-pagination">

                                <div className="bx1-pagination-info">

                                    Page{' '}
                                    {meta.current_page}{' '}
                                    of{' '}
                                    {meta.last_page}

                                    {meta.total > 0 && (
                                        <>
                                            {' '}·{' '}
                                            {meta.total.toLocaleString()}{' '}
                                            total projects
                                        </>
                                    )}

                                </div>


                                <div className="bx1-pagination-buttons">

                                    <button
                                        type="button"
                                        className="bx1-page-button"
                                        disabled={
                                            meta.current_page <= 1 ||
                                            loading
                                        }
                                        onClick={() =>
                                            loadProjects(
                                                meta.current_page - 1
                                            )
                                        }
                                    >
                                        Previous
                                    </button>


                                    {pageNumbers().map(
                                        (page) => (

                                            <button
                                                key={page}
                                                type="button"
                                                className={
                                                    `bx1-page-button ${
                                                        page ===
                                                        meta.current_page
                                                            ? 'active'
                                                            : ''
                                                    }`
                                                }
                                                disabled={loading}
                                                onClick={() =>
                                                    loadProjects(
                                                        page
                                                    )
                                                }
                                            >
                                                {page}
                                            </button>

                                        )
                                    )}


                                    <button
                                        type="button"
                                        className="bx1-page-button"
                                        disabled={
                                            meta.current_page >=
                                            meta.last_page ||
                                            loading
                                        }
                                        onClick={() =>
                                            loadProjects(
                                                meta.current_page + 1
                                            )
                                        }
                                    >
                                        Next
                                    </button>

                                </div>

                            </div>

                        )}

                </div>


            </div>

        </CmsLayout>
    );
}