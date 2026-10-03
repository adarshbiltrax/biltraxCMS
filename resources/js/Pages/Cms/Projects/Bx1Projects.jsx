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
| Day Options
|--------------------------------------------------------------------------
*/

const DAY_OPTIONS = [
    7,
    15,
    30,
    45,
    60,
    90,
    120,
];


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
        >
            <circle
                cx="11"
                cy="11"
                r="8"
            />

            <path d="m21 21-4.35-4.35" />
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
        >
            <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5" />

            <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5" />
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
        >
            <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
            />

            <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
    );
}


/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

export default function Bx1Projects({
    defaultSource = 'bx1',
    defaultDays = 120,
    dayOptions = DAY_OPTIONS,
}) {

    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

    const [
        projects,
        setProjects,
    ] = useState([]);


    const [
        meta,
        setMeta,
    ] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 50,
        total: 0,
    });


    const [
        query,
        setQuery,
    ] = useState('');


    const [
        source,
        setSource,
    ] = useState(
        defaultSource
    );


    const [
        days,
        setDays,
    ] = useState(
        defaultDays
    );


    const [
        dateRange,
        setDateRange,
    ] = useState(null);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState('');


    const [
        selectedId,
        setSelectedId,
    ] = useState(null);


    /*
    |--------------------------------------------------------------------------
    | Load Projects
    |--------------------------------------------------------------------------
    */

    async function loadProjects(
        page = 1,
        search = query,
        selectedSource = source,
        selectedDays = days
    ) {

        setLoading(true);

        setError('');


        try {

            const response =
                await axios.post(
                    '/cms/bx1/projects/search',
                    {
                        page,

                        per_page: 50,

                        q: search,

                        source:
                            selectedSource,

                        days:
                            selectedDays,
                    }
                );


            if (
                !response.data?.success
            ) {

                throw new Error(
                    response.data?.message
                    ||
                    'Unable to load projects.'
                );
            }


            setProjects(
                response.data.data
                ||
                []
            );


            setMeta({

                current_page:
                    response.data.meta?.current_page
                    ||
                    page,

                last_page:
                    response.data.meta?.last_page
                    ||
                    1,

                per_page:
                    response.data.meta?.per_page
                    ||
                    50,

                total:
                    response.data.meta?.total
                    ||
                    0,
            });


            setDateRange(
                response.data.date_range
                ||
                null
            );

        } catch (err) {

            console.error(err);


            setProjects([]);


            setError(
                err?.response?.data?.message
                ||
                err?.message
                ||
                `Unable to connect to ${selectedSource.toUpperCase()}.`
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

    useEffect(
        () => {

            loadProjects(
                1,
                '',
                defaultSource,
                defaultDays
            );

        },
        []
    );


    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    function submitSearch(e) {

        e.preventDefault();


        loadProjects(
            1,
            query.trim(),
            source,
            days
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Change BX Source
    |--------------------------------------------------------------------------
    */

    function changeSource(next) {

        setSource(next);

        setQuery('');

        setSelectedId(null);


        loadProjects(
            1,
            '',
            next,
            days
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Change Date Range
    |--------------------------------------------------------------------------
    */

    function changeDays(next) {

        setDays(next);

        setSelectedId(null);


        loadProjects(
            1,
            query.trim(),
            source,
            next
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Select Project
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | OLD FLOW:
    |
    | router.get('/cms/projects/create', {
    |     source,
    |     source_project_id,
    |     project_name,
    |     ...
    | });
    |
    | That created:
    |
    | /cms/projects/create?source=bx1&project_name=...
    |
    |
    | NEW FLOW:
    |
    | POST /cms/projects/import
    |
    | Laravel stores the selected project temporarily in session and redirects
    | to:
    |
    | /cms/projects/create
    |
    | Therefore no project information appears in the browser URL.
    |
    */

    function selectProject(project) {

        /*
        |--------------------------------------------------------------------------
        | Project ID
        |--------------------------------------------------------------------------
        */

        const sourceProjectId =
            project?.id
            ??
            project?.project_id
            ??
            '';


        setSelectedId(
            sourceProjectId
        );


        /*
        |--------------------------------------------------------------------------
        | Project Name
        |--------------------------------------------------------------------------
        */

        const projectName =
            project?.name
            ??
            project?.project_name
            ??
            '';


        /*
        |--------------------------------------------------------------------------
        | Sector
        |--------------------------------------------------------------------------
        */

        const sector =
            project?.sector
            ??
            '';


        /*
        |--------------------------------------------------------------------------
        | Project Stage
        |--------------------------------------------------------------------------
        |
        | BX1 public API returns latest_status.
        |
        | Fallbacks are retained for BX2.
        |
        */

        const projectStage =
            project?.latest_status
            ??
            project?.status
            ??
            project?.project_status
            ??
            '';


        /*
        |--------------------------------------------------------------------------
        | State
        |--------------------------------------------------------------------------
        */

        const state =
            project?.state
            ??
            '';


        /*
        |--------------------------------------------------------------------------
        | Region
        |--------------------------------------------------------------------------
        */

        const region =
            project?.region
            ??
            '';


        /*
        |--------------------------------------------------------------------------
        | City
        |--------------------------------------------------------------------------
        */

        const city =
            project?.city
            ??
            project?.city_name?.name
            ??
            '';


        /*
        |--------------------------------------------------------------------------
        | Project Type
        |--------------------------------------------------------------------------
        */

        const projectType =
            project?.building_use
            ??
            project?.project_type?.name
            ??
            project?.project_type
            ??
            '';


        /*
        |--------------------------------------------------------------------------
        | Location
        |--------------------------------------------------------------------------
        */

        const location =
            [
                city,
                state,
            ]
                .filter(Boolean)
                .join(', ');


        /*
        |--------------------------------------------------------------------------
        | POST Import
        |--------------------------------------------------------------------------
        */

   router.post(
    '/cms/projects/import',

    {
        source:
            source,

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

        preserveState: true,


        /*
        |--------------------------------------------------------------------------
        | Import Validation Error
        |--------------------------------------------------------------------------
        */

        onError: (errors) => {

            console.error(
                'Project import error:',
                errors
            );


            /*
            |--------------------------------------------------------------------------
            | Reset Select Button
            |--------------------------------------------------------------------------
            */

            setSelectedId(
                null
            );


            /*
            |--------------------------------------------------------------------------
            | Duplicate Project
            |--------------------------------------------------------------------------
            */

            if (
                errors?.source_project_id
            ) {

                setError(
                    errors.source_project_id
                );

                return;
            }


            /*
            |--------------------------------------------------------------------------
            | Other Validation Error
            |--------------------------------------------------------------------------
            */

            const firstError =
                Object.values(
                    errors || {}
                )[0];


            if (firstError) {

                setError(
                    String(firstError)
                );

                return;
            }


            setError(
                'Unable to open the selected project.'
            );
        },
    }
);
    }


    /*
    |--------------------------------------------------------------------------
    | Pagination Numbers
    |--------------------------------------------------------------------------
    */

    function pageNumbers() {

        const current =
            Number(
                meta.current_page
                ||
                1
            );


        const last =
            Number(
                meta.last_page
                ||
                1
            );


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
            let p = start;
            p <= end;
            p++
        ) {

            pages.push(p);
        }


        return pages;
    }


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (

        <CmsLayout
            title="Import Project"

            action={
                <Link
                    href="/cms/projects"
                    className="bx-back"
                >
                    <ArrowLeftIcon />

                    Back to Projects
                </Link>
            }
        >

            <Head
                title="Import Biltrax Project · Biltrax CMS"
            />


            <style>{`

                .bx-page {
                    max-width: 1500px;
                    margin: 0 auto;
                }

                .bx-back {
                    height: 40px;
                    padding: 0 14px;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    border: 1px solid #e1e5ea;
                    border-radius: 9px;
                    background: #fff;
                    color: #475467 !important;
                    text-decoration: none;
                    font-size: 13px;
                    font-weight: 600;
                }

                .bx-card {
                    background: #fff;
                    border: 1px solid #e7e9ee;
                    border-radius: 16px;
                    box-shadow:
                        0 8px 28px rgba(16,24,40,.035);
                    margin-bottom: 18px;
                }

                .bx-controls {
                    padding: 20px;
                }

                .bx-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 4px;
                }

                .bx-sub {
                    font-size: 13px;
                    color: #667085;
                    margin-bottom: 18px;
                }

                .bx-source-row,
                .bx-days {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    align-items: center;
                }

                .bx-source-row {
                    margin-bottom: 14px;
                }

                .bx-source,
                .bx-day {
                    border: 1px solid #dfe3e8;
                    background: #fff;
                    color: #475467;
                    border-radius: 9px;
                    height: 38px;
                    padding: 0 16px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .bx-source.active,
                .bx-day.active {
                    background: #c0122f;
                    color: #fff;
                    border-color: #c0122f;
                }

                .bx-source {
                    min-width: 86px;
                }

                .bx-label {
                    font-size: 12px;
                    font-weight: 700;
                    color: #344054;
                    margin-right: 4px;
                }

                .bx-search {
                    display: flex;
                    gap: 10px;
                    margin-top: 16px;
                }

                .bx-search-wrap {
                    position: relative;
                    flex: 1;
                }

                .bx-search-wrap svg {
                    position: absolute;
                    left: 14px;
                    top: 14px;
                    color: #98a2b3;
                }

                .bx-search input {
                    width: 100%;
                    height: 46px;
                    border: 1px solid #dfe3e8;
                    border-radius: 10px;
                    padding: 0 14px 0 44px;
                    box-sizing: border-box;
                }

                .bx-search button {
                    height: 46px;
                    border: 0;
                    border-radius: 10px;
                    padding: 0 18px;
                    background: #111827;
                    color: #fff;
                    font-weight: 600;
                    cursor: pointer;
                }

                .bx-refresh {
                    width: 46px !important;
                    padding: 0 !important;
                    display: grid;
                    place-items: center;
                }

                .bx-range {
                    margin-top: 12px;
                    font-size: 12px;
                    color: #667085;
                }

                .bx-table-head {
                    padding: 18px 20px;
                    border-bottom: 1px solid #eaecf0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .bx-table-title {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 700;
                    color: #101828;
                }

                .bx-count {
                    font-size: 12px;
                    color: #667085;
                }

                .bx-table-wrap {
                    overflow: auto;
                }

                .bx-table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 1000px;
                }

                .bx-table th {
                    background: #f9fafb;
                    text-align: left;
                    padding: 12px 16px;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: .04em;
                    color: #667085;
                    border-bottom: 1px solid #eaecf0;
                }

                .bx-table td {
                    padding: 14px 16px;
                    border-bottom: 1px solid #f0f1f3;
                    font-size: 13px;
                    color: #344054;
                }

                .bx-name {
                    font-weight: 650;
                    color: #101828;
                }

                .bx-id {
                    font-size: 11px;
                    color: #98a2b3;
                    margin-top: 3px;
                }

                .bx-select {
                    border: 1px solid #f0c4cc;
                    background: #fff7f8;
                    color: #b4233d;
                    border-radius: 8px;
                    padding: 8px 13px;
                    font-weight: 650;
                    cursor: pointer;
                }

                .bx-select:disabled {
                    opacity: .6;
                }

                .bx-empty,
                .bx-error {
                    padding: 40px;
                    text-align: center;
                    color: #667085;
                }

                .bx-error {
                    color: #b42318;
                }

                .bx-pagination {
                    padding: 16px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                }

                .bx-pages {
                    display: flex;
                    gap: 6px;
                }

                .bx-page-btn {
                    min-width: 36px;
                    height: 36px;
                    border: 1px solid #e1e5ea;
                    background: #fff;
                    border-radius: 8px;
                    cursor: pointer;
                }

                .bx-page-btn.active {
                    background: #111827;
                    color: #fff;
                    border-color: #111827;
                }

                .bx-page-btn:disabled {
                    opacity: .45;
                    cursor: not-allowed;
                }

                @media (max-width: 760px) {

                    .bx-search {
                        flex-wrap: wrap;
                    }

                    .bx-search-wrap {
                        flex-basis: 100%;
                    }

                    .bx-pagination {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                }

            `}</style>


            <div className="bx-page">


                {/* CONTROLS */}

                <div className="bx-card bx-controls">

                    <div className="bx-title">
                        Biltrax Project Import
                    </div>


                    <div className="bx-sub">
                        Choose BX1 or BX2, select the updated-project period, then import a project into CMS.
                    </div>


                    {/* SOURCE */}

                    <div className="bx-source-row">

                        <span className="bx-label">
                            SOURCE
                        </span>


                        {[
                            'bx1',
                            'bx2',
                        ].map(
                            (item) => (

                                <button
                                    key={item}
                                    type="button"
                                    className={
                                        `bx-source ${
                                            source === item
                                                ? 'active'
                                                : ''
                                        }`
                                    }
                                    onClick={
                                        () =>
                                            changeSource(
                                                item
                                            )
                                    }
                                    disabled={
                                        loading
                                    }
                                >
                                    {item.toUpperCase()}
                                </button>

                            )
                        )}

                    </div>


                    {/* DAYS */}

                    <div className="bx-days">

                        <span className="bx-label">
                            UPDATED IN LAST
                        </span>


                        {dayOptions.map(
                            (item) => (

                                <button
                                    key={item}
                                    type="button"
                                    className={
                                        `bx-day ${
                                            days === item
                                                ? 'active'
                                                : ''
                                        }`
                                    }
                                    onClick={
                                        () =>
                                            changeDays(
                                                item
                                            )
                                    }
                                    disabled={
                                        loading
                                    }
                                >
                                    {item}D
                                </button>

                            )
                        )}

                    </div>


                    {/* SEARCH */}

                    <form
                        className="bx-search"
                        onSubmit={submitSearch}
                    >

                        <div className="bx-search-wrap">

                            <SearchIcon />


                            <input
                                value={query}
                                onChange={
                                    (e) =>
                                        setQuery(
                                            e.target.value
                                        )
                                }
                                placeholder={
                                    `Search ${source.toUpperCase()} projects by name, city, state or sector...`
                                }
                            />

                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                        >
                            Search
                        </button>


                        <button
                            type="button"
                            className="bx-refresh"
                            title="Refresh"
                            disabled={loading}
                            onClick={
                                () =>
                                    loadProjects(
                                        meta.current_page,
                                        query.trim(),
                                        source,
                                        days
                                    )
                            }
                        >
                            <RefreshIcon />
                        </button>

                    </form>


                    {/* DATE RANGE */}

                    {dateRange && (

                        <div className="bx-range">

                            API filter:
                            {' '}
                            project_updated_date_range
                            {' '}
                            {dateRange.start_date}
                            {' '}
                            to
                            {' '}
                            {dateRange.end_date}

                        </div>

                    )}

                </div>


                {/* PROJECT TABLE */}

                <div className="bx-card">

                    <div className="bx-table-head">

                        <div className="bx-table-title">

                            <ProjectIcon />

                            {source.toUpperCase()}
                            {' '}
                            Project Directory

                        </div>


                        <div className="bx-count">

                            {Number(
                                meta.total
                                ||
                                0
                            ).toLocaleString(
                                'en-IN'
                            )}

                            {' '}
                            projects · 50 per page

                        </div>

                    </div>


                    {error ? (

                        <div className="bx-error">
                            {error}
                        </div>

                    ) : loading ? (

                        <div className="bx-empty">

                            Loading
                            {' '}
                            {source.toUpperCase()}
                            {' '}
                            projects...

                        </div>

                    ) : projects.length === 0 ? (

                        <div className="bx-empty">
                            No projects found for the selected period.
                        </div>

                    ) : (

                        <div className="bx-table-wrap">

                            <table className="bx-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Project
                                        </th>

                                        <th>
                                            Sector
                                        </th>

                                        <th>
                                            Project Stage
                                        </th>

                                        <th>
                                            City
                                        </th>

                                        <th>
                                            State
                                        </th>

                                        <th>
                                            Region
                                        </th>

                                        <th>
                                            Updated
                                        </th>

                                        <th>
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {projects.map(
                                        (project) => {

                                            const projectId =
                                                project?.id
                                                ??
                                                project?.project_id;


                                            return (

                                                <tr
                                                    key={
                                                        `${source}-${projectId}`
                                                    }
                                                >

                                                    <td>

                                                        <div className="bx-name">

                                                            {project?.name
                                                                ??
                                                                project?.project_name
                                                                ??
                                                                'Untitled Project'}

                                                        </div>


                                                        <div className="bx-id">

                                                            {source.toUpperCase()}
                                                            {' '}
                                                            ID #
                                                            {projectId
                                                                ??
                                                                '—'}

                                                        </div>

                                                    </td>


                                                    <td>

                                                        {project?.sector
                                                            ??
                                                            '—'}

                                                    </td>


                                                    <td>

                                                        {project?.latest_status
                                                            ??
                                                            project?.status
                                                            ??
                                                            project?.project_status
                                                            ??
                                                            '—'}

                                                    </td>


                                                    <td>

                                                        {project?.city
                                                            ??
                                                            project?.city_name?.name
                                                            ??
                                                            '—'}

                                                    </td>


                                                    <td>

                                                        {project?.state
                                                            ??
                                                            '—'}

                                                    </td>


                                                    <td>

                                                        {project?.region
                                                            ??
                                                            '—'}

                                                    </td>


                                                    <td>

                                                        {project?.updated_at
                                                            ??
                                                            project?.modified_at
                                                            ??
                                                            '—'}

                                                    </td>


                                                    <td>

                                                        <button
                                                            className="bx-select"
                                                            type="button"
                                                            disabled={
                                                                selectedId
                                                                ===
                                                                projectId
                                                            }
                                                            onClick={
                                                                () =>
                                                                    selectProject(
                                                                        project
                                                                    )
                                                            }
                                                        >

                                                            {selectedId
                                                                ===
                                                                projectId
                                                                ? 'Opening...'
                                                                : 'Select'}

                                                        </button>

                                                    </td>

                                                </tr>

                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}


                    {/* PAGINATION */}

                    <div className="bx-pagination">

                        <div className="bx-count">

                            Page
                            {' '}
                            {meta.current_page}
                            {' '}
                            of
                            {' '}
                            {meta.last_page}

                        </div>


                        <div className="bx-pages">

                            <button
                                className="bx-page-btn"
                                disabled={
                                    loading
                                    ||
                                    meta.current_page <= 1
                                }
                                onClick={
                                    () =>
                                        loadProjects(
                                            meta.current_page - 1,
                                            query.trim(),
                                            source,
                                            days
                                        )
                                }
                            >
                                ‹
                            </button>


                            {pageNumbers().map(
                                (p) => (

                                    <button
                                        key={p}
                                        className={
                                            `bx-page-btn ${
                                                p
                                                ===
                                                Number(
                                                    meta.current_page
                                                )
                                                    ? 'active'
                                                    : ''
                                            }`
                                        }
                                        disabled={
                                            loading
                                        }
                                        onClick={
                                            () =>
                                                loadProjects(
                                                    p,
                                                    query.trim(),
                                                    source,
                                                    days
                                                )
                                        }
                                    >
                                        {p}
                                    </button>

                                )
                            )}


                            <button
                                className="bx-page-btn"
                                disabled={
                                    loading
                                    ||
                                    meta.current_page
                                    >=
                                    meta.last_page
                                }
                                onClick={
                                    () =>
                                        loadProjects(
                                            meta.current_page + 1,
                                            query.trim(),
                                            source,
                                            days
                                        )
                                }
                            >
                                ›
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </CmsLayout>
    );
}