import React from 'react';

import {
    Head,
    Link,
    router,
    useForm,
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


function ProjectIcon() {
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
            aria-hidden="true"
        >
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
        </svg>
    );
}


/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

export default function Index({
    projects,
    filters = {},
}) {

    /*
    |--------------------------------------------------------------------------
    | SEARCH FORM
    |--------------------------------------------------------------------------
    */

    const {
        data,
        setData,
        get,
        processing,
    } = useForm({
        q: filters.q || '',
    });


    function search(e) {

        e.preventDefault();

        get('/cms/projects', {
            preserveState: true,
            preserveScroll: true,
        });
    }


    /*
    |--------------------------------------------------------------------------
    | DELETE PROJECT
    |--------------------------------------------------------------------------
    */

    function removeProject(id) {

        if (!confirm('Delete this project?')) {
            return;
        }

        router.delete(
            `/cms/projects/${id}`,
            {
                preserveScroll: true,
            }
        );
    }


    const rows = projects?.data || [];


    /*
    |--------------------------------------------------------------------------
    | STATUS CLASS
    |--------------------------------------------------------------------------
    */

    function getStatusClass(status) {

        const value =
            String(status || '')
                .toLowerCase()
                .trim();

        if (value === 'published') {
            return 'published';
        }

        if (value === 'draft') {
            return 'draft';
        }

        return 'default';
    }


    return (

        <CmsLayout title="Projects">

            <Head title="Projects · Biltrax CMS" />


            <style>{`

                /*
                |--------------------------------------------------------------------------
                | PAGE
                |--------------------------------------------------------------------------
                */

                .projects-page {
                    animation: projectsPageEnter .45s ease both;
                }


                /*
                |--------------------------------------------------------------------------
                | SEARCH CARD
                |--------------------------------------------------------------------------
                */

                .projects-search-card {
                    background: #ffffff;
                    border: 1px solid #e7e9ee;
                    border-radius: 16px;
                    padding: 20px;
                    margin-bottom: 18px;

                    box-shadow:
                        0 1px 2px rgba(16, 24, 40, .02),
                        0 8px 28px rgba(16, 24, 40, .035);
                }


                .projects-search {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    width: 100%;
                }


                .projects-search-input-wrap {
                    position: relative;
                    flex: 1;
                    max-width: 560px;
                }


                .projects-search-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    color: #8a91a0;

                    pointer-events: none;

                    transition:
                        color .2s ease;
                }


                .projects-search-input {
                    width: 100%;
                    height: 46px;

                    padding:
                        0 16px 0 46px;

                    border:
                        1px solid #dfe3e8;

                    border-radius: 10px;

                    background: #fafbfc;

                    color: #111827;

                    font-size: 14px;

                    outline: none;

                    box-sizing: border-box;

                    transition:
                        border-color .2s ease,
                        background .2s ease,
                        box-shadow .2s ease;
                }


                .projects-search-input::placeholder {
                    color: #9aa1ad;
                }


                .projects-search-input:hover {
                    border-color: #cbd1d9;
                    background: #ffffff;
                }


                .projects-search-input:focus {
                    background: #ffffff;

                    border-color: #c0122f;

                    box-shadow:
                        0 0 0 3px
                        rgba(192, 18, 47, .09);
                }


                .projects-search-input-wrap:focus-within
                .projects-search-icon {
                    color: #c0122f;
                }


                /*
                |--------------------------------------------------------------------------
                | SEARCH BUTTON
                |--------------------------------------------------------------------------
                */

                .projects-search-button {
                    height: 46px;

                    border: 0;

                    border-radius: 10px;

                    padding:
                        0 20px;

                    background: #111827;

                    color: #ffffff;

                    display: inline-flex;

                    align-items: center;

                    justify-content: center;

                    gap: 9px;

                    flex-shrink: 0;

                    font-size: 14px;

                    font-weight: 600;

                    cursor: pointer;

                    transition:
                        transform .18s ease,
                        background .18s ease,
                        box-shadow .18s ease;
                }


                .projects-search-button:hover {
                    background: #202b3c;

                    transform:
                        translateY(-1px);

                    box-shadow:
                        0 6px 16px
                        rgba(17, 24, 39, .16);
                }


                .projects-search-button:active {
                    transform:
                        translateY(0);

                    box-shadow: none;
                }


                .projects-search-button:disabled {
                    opacity: .65;

                    cursor: wait;
                }


                /*
                |--------------------------------------------------------------------------
                | ADD PROJECT BUTTON
                |--------------------------------------------------------------------------
                */

                .project-add-button {
                    height: 46px;

                    padding:
                        0 18px;

                    border-radius: 10px;

                    display: inline-flex;

                    align-items: center;

                    justify-content: center;

                    gap: 8px;

                    flex-shrink: 0;

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


                .project-add-button:hover {
                    background: #a90f29;

                    color: #ffffff !important;

                    transform:
                        translateY(-1px);

                    box-shadow:
                        0 7px 18px
                        rgba(192, 18, 47, .22);
                }


                .project-add-button:active {
                    transform:
                        translateY(0);
                }


                /*
                |--------------------------------------------------------------------------
                | TABLE CARD
                |--------------------------------------------------------------------------
                */

                .projects-table-card {
                    overflow: hidden;

                    background: #ffffff;

                    border:
                        1px solid #e7e9ee;

                    border-radius: 16px;

                    box-shadow:
                        0 1px 2px rgba(16, 24, 40, .02),
                        0 8px 28px rgba(16, 24, 40, .035);
                }


                .projects-table-header {
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


                .projects-table-title {
                    display: flex;

                    align-items: center;

                    gap: 12px;
                }


                .projects-table-title-icon {
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


                .projects-table-title-text {
                    font-size: 15px;

                    line-height: 1.2;

                    font-weight: 700;

                    color: #111827;
                }


                .projects-table-subtitle {
                    margin-top: 4px;

                    color: #8a91a0;

                    font-size: 12px;
                }


                .projects-count {
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

                .projects-table-wrap {
                    width: 100%;

                    overflow-x: auto;
                }


                .projects-table {
                    width: 100%;

                    border-collapse:
                        collapse;

                    border-spacing: 0;
                }


                .projects-table thead {
                    background: #fafbfc;
                }


                .projects-table th {
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


                .projects-table td {
                    padding:
                        17px 18px;

                    border-bottom:
                        1px solid #eef0f3;

                    color: #3c4350;

                    font-size: 14px;

                    vertical-align:
                        middle;
                }


                .projects-table tbody tr {
                    transition:
                        background .18s ease,
                        transform .18s ease;
                }


                .projects-table tbody tr:hover {
                    background: #fafbfc;
                }


                .projects-table tbody
                tr:last-child td {
                    border-bottom: 0;
                }


                /*
                |--------------------------------------------------------------------------
                | PROJECT NAME
                |--------------------------------------------------------------------------
                */

                .project-name-cell {
                    display: flex;

                    align-items: center;

                    gap: 12px;

                    min-width: 220px;
                }


                .project-avatar {
                    width: 36px;

                    height: 36px;

                    flex:
                        0 0 36px;

                    border-radius: 9px;

                    background: #f2f3f5;

                    color: #697180;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    font-size: 13px;

                    font-weight: 700;

                    text-transform:
                        uppercase;

                    transition:
                        background .18s ease,
                        color .18s ease,
                        transform .18s ease;
                }


                .projects-table tbody tr:hover
                .project-avatar {

                    background:
                        rgba(192, 18, 47, .09);

                    color: #c0122f;

                    transform:
                        scale(1.04);
                }


                .project-name {
                    color: #111827;

                    font-weight: 650;

                    line-height: 1.35;
                }


                .project-source-id {
                    margin-top: 3px;

                    color: #9aa1ad;

                    font-size: 11px;
                }


                /*
                |--------------------------------------------------------------------------
                | LOCATION
                |--------------------------------------------------------------------------
                */

                .project-location {
                    display:
                        inline-flex;

                    align-items: center;

                    gap: 6px;

                    color: #555e6d;
                }


                .project-location svg {
                    color: #9aa1ad;
                }


                /*
                |--------------------------------------------------------------------------
                | STATUS
                |--------------------------------------------------------------------------
                */

                .project-status {
                    display:
                        inline-flex;

                    align-items: center;

                    gap: 7px;

                    min-height: 27px;

                    padding:
                        4px 10px;

                    border-radius: 20px;

                    font-size: 12px;

                    font-weight: 600;

                    text-transform:
                        capitalize;

                    white-space: nowrap;
                }


                .project-status::before {
                    content: "";

                    width: 6px;

                    height: 6px;

                    border-radius: 50%;

                    background:
                        currentColor;
                }


                .project-status.published {
                    color: #147a4b;

                    background: #eaf8f0;
                }


                .project-status.draft {
                    color: #9a6510;

                    background: #fff6df;
                }


                .project-status.default {
                    color: #5c6472;

                    background: #f1f3f5;
                }


                /*
                |--------------------------------------------------------------------------
                | ACTION BUTTONS
                |--------------------------------------------------------------------------
                */

                .project-actions {
                    display: flex;

                    align-items: center;

                    gap: 8px;

                    white-space: nowrap;
                }


                .project-action-button {
                    height: 36px;

                    padding:
                        0 12px;

                    border-radius: 8px;

                    border:
                        1px solid transparent;

                    display:
                        inline-flex;

                    align-items: center;

                    justify-content:
                        center;

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


                .project-action-button.edit {
                    color: #344054;

                    background: #f2f4f7;

                    border-color: #eaecf0;
                }


                .project-action-button.edit:hover {
                    color: #111827;

                    background: #e8ebef;

                    border-color: #d8dde5;

                    transform:
                        translateY(-1px);
                }


                .project-action-button.delete {
                    color: #b42318;

                    background: #fff1f0;

                    border-color: #ffd9d5;
                }


                .project-action-button.delete:hover {
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

                .projects-empty {
                    padding:
                        64px 24px !important;

                    text-align: center;
                }


                .projects-empty-icon {
                    width: 52px;

                    height: 52px;

                    margin:
                        0 auto 14px;

                    border-radius: 14px;

                    display: flex;

                    align-items: center;

                    justify-content:
                        center;

                    background: #f4f5f7;

                    color: #8a91a0;
                }


                .projects-empty-title {
                    color: #202631;

                    font-size: 15px;

                    font-weight: 700;
                }


                .projects-empty-text {
                    margin-top: 5px;

                    color: #8a91a0;

                    font-size: 13px;
                }


                /*
                |--------------------------------------------------------------------------
                | ANIMATIONS
                |--------------------------------------------------------------------------
                */

                .projects-row {
                    animation:
                        projectRowEnter
                        .4s ease both;
                }


                @keyframes projectsPageEnter {

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


                @keyframes projectRowEnter {

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

                    .projects-search {
                        align-items:
                            stretch;

                        flex-direction:
                            column;
                    }


                    .projects-search-input-wrap {
                        max-width: none;
                    }


                    .projects-search-button,
                    .project-add-button {
                        width: 100%;
                    }


                    .projects-table-header {
                        padding: 17px;
                    }


                    .projects-table th,
                    .projects-table td {

                        padding-left: 14px;

                        padding-right: 14px;
                    }


                    .project-action-button span {
                        display: none;
                    }


                    .project-action-button {
                        width: 36px;

                        padding: 0;
                    }
                }

            `}</style>


            <div className="projects-page">


                {/*
                |--------------------------------------------------------------------------
                | SEARCH + ADD PROJECT
                |--------------------------------------------------------------------------
                */}

                <div className="projects-search-card">

                    <form
                        className="projects-search"
                        onSubmit={search}
                    >

                        <div className="projects-search-input-wrap">

                            <span className="projects-search-icon">
                                <SearchIcon />
                            </span>

                            <input
                                type="text"
                                className="projects-search-input"
                                value={data.q}
                                onChange={(e) =>
                                    setData(
                                        'q',
                                        e.target.value
                                    )
                                }
                                placeholder="Search by project name, sector, stage or location..."
                            />

                        </div>


                        <button
                            type="submit"
                            className="projects-search-button"
                            disabled={processing}
                        >

                            <SearchIcon />

                            <span>
                                {processing
                                    ? 'Searching...'
                                    : 'Search'}
                            </span>

                        </button>


                        <Link
                            href="/cms/projects/create"
                            className="project-add-button"
                        >

                            <PlusIcon />

                            <span>
                                Add Project
                            </span>

                        </Link>

                    </form>

                </div>


                {/*
                |--------------------------------------------------------------------------
                | PROJECT TABLE
                |--------------------------------------------------------------------------
                */}

                <div className="projects-table-card">


                    <div className="projects-table-header">

                        <div className="projects-table-title">

                            <div className="projects-table-title-icon">
                                <ProjectIcon />
                            </div>

                            <div>

                                <div className="projects-table-title-text">
                                    Project Directory
                                </div>

                                <div className="projects-table-subtitle">
                                    Manage website project listings
                                </div>

                            </div>

                        </div>


                        <div className="projects-count">

                            {rows.length}{' '}

                            {rows.length === 1
                                ? 'project'
                                : 'projects'}

                        </div>

                    </div>


                    <div className="projects-table-wrap">

                        <table className="projects-table">

                            <thead>

                                <tr>

                                    <th>
                                        Project
                                    </th>

                                    <th>
                                        Sector
                                    </th>

                                    <th>
                                        Stage
                                    </th>

                                    <th>
                                        Location
                                    </th>

                                    <th>
                                        Status
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
                                            colSpan="6"
                                            className="projects-empty"
                                        >

                                            <div className="projects-empty-icon">
                                                <ProjectIcon />
                                            </div>

                                            <div className="projects-empty-title">
                                                No projects found
                                            </div>

                                            <div className="projects-empty-text">

                                                {data.q
                                                    ? 'Try changing your search criteria.'
                                                    : 'Add your first project to get started.'}

                                            </div>

                                        </td>

                                    </tr>

                                ) : (

                                    rows.map(
                                        (
                                            project,
                                            index
                                        ) => (

                                            <tr
                                                key={project.id}
                                                className="projects-row"
                                                style={{
                                                    animationDelay:
                                                        `${Math.min(
                                                            index * 35,
                                                            280
                                                        )}ms`,
                                                }}
                                            >

                                                {/*
                                                | PROJECT
                                                */}

                                                <td>

                                                    <div className="project-name-cell">

                                                        <div className="project-avatar">

                                                            {String(
                                                                project.project_name ||
                                                                'P'
                                                            )
                                                                .trim()
                                                                .charAt(0)}

                                                        </div>


                                                        <div>

                                                            <div className="project-name">

                                                                {project.project_name ||
                                                                    'Untitled Project'}

                                                            </div>


                                                            {project.source_project_id && (

                                                                <div className="project-source-id">

                                                                    ID #{project.source_project_id}

                                                                </div>

                                                            )}

                                                        </div>

                                                    </div>

                                                </td>


                                                {/*
                                                | SECTOR
                                                */}

                                                <td>
                                                    {project.sector || '—'}
                                                </td>


                                                {/*
                                                | STAGE
                                                */}

                                                <td>
                                                    {project.project_stage || '—'}
                                                </td>


                                                {/*
                                                | LOCATION
                                                */}

                                                <td>

                                                    {project.location ? (

                                                        <span className="project-location">

                                                            <LocationIcon />

                                                            {project.location}

                                                        </span>

                                                    ) : (

                                                        '—'

                                                    )}

                                                </td>


                                                {/*
                                                | STATUS
                                                */}

                                                <td>

                                                    <span
                                                        className={
                                                            `project-status ${getStatusClass(
                                                                project.status
                                                            )}`
                                                        }
                                                    >

                                                        {project.status ||
                                                            'Unknown'}

                                                    </span>

                                                </td>


                                                {/*
                                                | ACTIONS
                                                */}

                                                <td>

                                                    <div className="project-actions">

                                                        <Link
                                                            href={
                                                                `/cms/projects/${project.id}/edit`
                                                            }
                                                            className="project-action-button edit"
                                                            title="Edit project"
                                                        >

                                                            <EditIcon />

                                                            <span>
                                                                Edit
                                                            </span>

                                                        </Link>


                                                        <button
                                                            type="button"
                                                            className="project-action-button delete"
                                                            title="Delete project"
                                                            onClick={() =>
                                                                removeProject(
                                                                    project.id
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
                    links={projects?.links || []}
                />


            </div>

        </CmsLayout>
    );
}