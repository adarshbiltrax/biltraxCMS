import React from 'react';

import {
    Head,
    Link,
    useForm,
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
        >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
        </svg>
    );
}


function SaveIcon() {
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
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
            <path d="M17 21v-8H7v8" />
            <path d="M7 3v5h8" />
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


function InfoIcon() {
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
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
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
            <rect
                x="4"
                y="2"
                width="16"
                height="20"
                rx="2"
            />
            <path d="M9 22v-4h6v4" />
            <path d="M8 6h.01" />
            <path d="M12 6h.01" />
            <path d="M16 6h.01" />
            <path d="M8 10h.01" />
            <path d="M12 10h.01" />
            <path d="M16 10h.01" />
        </svg>
    );
}


function LocationIcon() {
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
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
        </svg>
    );
}


function SettingsIcon() {
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
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-2.83 2.83-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21h-4v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06-2.83-2.83.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3v-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06L7.04 4.3l.06.06A1.65 1.65 0 0 0 8.92 4a1.65 1.65 0 0 0 1-1.51V2h4v.49a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06 2.83 2.83-.06.06A1.65 1.65 0 0 0 19.4 9c.12.61.66 1.05 1.28 1.05H21v4h-.32c-.62 0-1.16.44-1.28 1Z" />
        </svg>
    );
}


function StarIcon() {
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
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}


/*
|--------------------------------------------------------------------------
| FIELD COMPONENT
|--------------------------------------------------------------------------
*/

function Field({
    label,
    required = false,
    error = null,
    full = false,
    children,
}) {
    return (
        <div
            className={
                `project-form-field ${full ? 'full' : ''}`
            }
        >
            <label className="project-form-label">
                {label}

                {required && (
                    <span className="required-mark">
                        *
                    </span>
                )}
            </label>

            {children}

            {error && (
                <div className="project-form-error">
                    {error}
                </div>
            )}
        </div>
    );
}


/*
|--------------------------------------------------------------------------
| SECTION TITLE
|--------------------------------------------------------------------------
*/

function SectionTitle({
    icon,
    title,
    description,
}) {
    return (
        <div className="project-section-title">
            <div className="project-section-icon">
                {icon}
            </div>

            <div>
                <div className="project-section-name">
                    {title}
                </div>

                {description && (
                    <div className="project-section-description">
                        {description}
                    </div>
                )}
            </div>
        </div>
    );
}


/*
|--------------------------------------------------------------------------
| PROJECT FORM
|--------------------------------------------------------------------------
*/

export default function Form({
    project = null,
}) {
    /*
    |--------------------------------------------------------------------------
    | Detect API Import
    |--------------------------------------------------------------------------
    |
    | project._source = bx1 -> BX1 import
    | project._source = bx2 -> BX2 import
    | no _source + project.id -> existing CMS project
    |
    */

    const importSource =
        ['bx1', 'bx2'].includes(project?._source)
            ? project._source
            : null;

    const isApiImport =
        Boolean(importSource);

    /*
    |--------------------------------------------------------------------------
    | Existing CMS Project
    |--------------------------------------------------------------------------
    |
    | An API-imported project is NOT an edit even though project contains
    | pre-filled values.
    |
    */

    const isEdit =
        Boolean(project?.id) &&
        !isApiImport;

    const importSourceLabel =
        importSource
            ? importSource.toUpperCase()
            : '';


    /*
    |--------------------------------------------------------------------------
    | FORMAT DATE
    |--------------------------------------------------------------------------
    */

    const formatDateTime = (value) => {
        if (!value) {
            return '';
        }

        return String(value).slice(0, 16);
    };


    /*
    |--------------------------------------------------------------------------
    | FORM DATA
    |--------------------------------------------------------------------------
    */

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
    } = useForm({
        project_name:
            project?.project_name ?? '',

        source_project_id:
            project?.source_project_id ?? '',

        sector:
            project?.sector ?? '',

        project_type:
            project?.project_type ?? '',

        project_stage:
            project?.project_stage ?? '',

        city:
            project?.city ?? '',

        state:
            project?.state ?? '',

        region:
            project?.region ?? '',

        location:
            project?.location ?? '',

        summary:
            project?.summary ?? '',

        status:
            project?.status ?? 'draft',

        published_at:
            formatDateTime(
                project?.published_at
            ),

        sort_order:
            project?.sort_order ?? 0,

        is_featured:
            Boolean(
                project?.is_featured
            ),
    });


    /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */

    function submit(e) {
        e.preventDefault();

        /*
        |--------------------------------------------------------------------------
        | Existing CMS project -> UPDATE
        |--------------------------------------------------------------------------
        */

        if (isEdit) {
            put(
                `/cms/projects/${project.id}`,
                {
                    preserveScroll: true,
                }
            );

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | New Project / BX1 Import / BX2 Import -> CREATE
        |--------------------------------------------------------------------------
        */

        post(
            '/cms/projects',
            {
                preserveScroll: true,
            }
        );
    }


    return (
        <CmsLayout
            title=""
            action={
                <Link
                    href="/cms/projects"
                    className="project-back-button"
                >
                    <ArrowLeftIcon />

                    <span>
                        Back to Projects
                    </span>
                </Link>
            }
        >
            <Head
                title={
                    isEdit
                        ? 'Edit Project · Biltrax CMS'
                        : isApiImport
                            ? `Import ${importSourceLabel} Project · Biltrax CMS`
                            : 'Add Project · Biltrax CMS'
                }
            />


            <style>{`

                .project-form-page {
                    max-width: 1500px;
                    margin: 0 auto;
                    animation:
                        projectFormEnter .42s ease both;
                }

                .project-back-button {
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
                    transition:
                        color .18s ease,
                        border-color .18s ease,
                        background .18s ease,
                        transform .18s ease,
                        box-shadow .18s ease;
                }

                .project-back-button:hover {
                    color: #c0122f !important;
                    border-color: rgba(192,18,47,.25);
                    background: #fff8f9;
                    transform: translateY(-1px);
                    box-shadow:
                        0 4px 12px rgba(16,24,40,.06);
                }

                .project-form-card {
                    overflow: hidden;
                    background: #ffffff;
                    border: 1px solid #e4e7ec;
                    border-radius: 16px;
                    box-shadow:
                        0 1px 2px rgba(16,24,40,.02),
                        0 8px 30px rgba(16,24,40,.035);
                }

                .project-form-intro {
                    padding: 22px 26px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                    border-bottom: 1px solid #eceef2;
                    background:
                        linear-gradient(
                            135deg,
                            #ffffff 0%,
                            #fffafb 100%
                        );
                }

                .project-form-intro-left {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                .project-form-main-icon {
                    width: 46px;
                    height: 46px;
                    flex: 0 0 46px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    color: #c0122f;
                    background: rgba(192,18,47,.08);
                }

                .project-form-intro-title {
                    color: #111827;
                    font-size: 17px;
                    line-height: 1.3;
                    font-weight: 700;
                }

                .project-form-intro-description {
                    margin-top: 4px;
                    color: #7c8594;
                    font-size: 12.5px;
                    line-height: 1.5;
                }

                .project-form-mode {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    padding: 7px 11px;
                    border-radius: 20px;
                    background: #f3f4f6;
                    color: #596171;
                    font-size: 11px;
                    font-weight: 650;
                }

                .project-form-mode::before {
                    content: "";
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #c0122f;
                }

                .project-form-section {
                    padding: 25px 26px 28px;
                    border-bottom: 1px solid #eceef2;
                }

                .project-form-section:last-of-type {
                    border-bottom: 0;
                }

                .project-section-title {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    margin-bottom: 21px;
                }

                .project-section-icon {
                    width: 34px;
                    height: 34px;
                    flex: 0 0 34px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 9px;
                    color: #c0122f;
                    background: #fff0f3;
                }

                .project-section-name {
                    color: #171c26;
                    font-size: 14px;
                    font-weight: 700;
                }

                .project-section-description {
                    margin-top: 2px;
                    color: #9097a3;
                    font-size: 11.5px;
                }

                .project-form-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(2, minmax(0, 1fr));
                    column-gap: 22px;
                    row-gap: 19px;
                }

                .project-form-field {
                    min-width: 0;
                }

                .project-form-field.full {
                    grid-column: 1 / -1;
                }

                .project-form-label {
                    display: block;
                    margin: 0 0 7px;
                    color: #344054;
                    font-size: 12px;
                    line-height: 1.3;
                    font-weight: 650;
                }

                .required-mark {
                    margin-left: 3px;
                    color: #c0122f;
                }

                .project-form-control {
                    display: block;
                    width: 100%;
                    height: 43px;
                    box-sizing: border-box;
                    padding: 0 13px;
                    border: 1px solid #dfe3e8;
                    border-radius: 9px;
                    background: #ffffff;
                    color: #171c26;
                    font-family: inherit;
                    font-size: 13px;
                    outline: none;
                    transition:
                        border-color .18s ease,
                        box-shadow .18s ease,
                        background .18s ease;
                }

                .project-form-control:hover {
                    border-color: #cbd1d9;
                }

                .project-form-control:focus {
                    border-color: #c0122f;
                    background: #ffffff;
                    box-shadow:
                        0 0 0 3px rgba(192,18,47,.08);
                }

                .project-form-control::placeholder {
                    color: #a1a7b2;
                }

                textarea.project-form-control {
                    height: auto;
                    min-height: 115px;
                    padding-top: 11px;
                    padding-bottom: 11px;
                    line-height: 1.55;
                    resize: vertical;
                }

                select.project-form-control {
                    cursor: pointer;
                }

                .project-form-error {
                    margin-top: 6px;
                    color: #c0122f;
                    font-size: 11.5px;
                    font-weight: 500;
                }

                .project-featured-box {
                    min-height: 67px;
                    padding: 12px 14px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    box-sizing: border-box;
                    border: 1px solid #e2e5e9;
                    border-radius: 10px;
                    background: #fafbfc;
                }

                .project-featured-info {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                }

                .project-featured-icon {
                    width: 34px;
                    height: 34px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex: 0 0 34px;
                    border-radius: 9px;
                    color: #b7791f;
                    background: #fff6df;
                }

                .project-featured-title {
                    color: #344054;
                    font-size: 12px;
                    font-weight: 650;
                }

                .project-featured-description {
                    margin-top: 3px;
                    color: #8b93a0;
                    font-size: 10.5px;
                }

                .project-switch {
                    position: relative;
                    display: inline-block;
                    width: 42px;
                    height: 23px;
                    flex: 0 0 42px;
                    cursor: pointer;
                }

                .project-switch input {
                    width: 0;
                    height: 0;
                    opacity: 0;
                }

                .project-switch-slider {
                    position: absolute;
                    inset: 0;
                    border-radius: 20px;
                    background: #d8dde5;
                    transition: background .22s ease;
                }

                .project-switch-slider::before {
                    content: "";
                    position: absolute;
                    width: 17px;
                    height: 17px;
                    left: 3px;
                    top: 3px;
                    border-radius: 50%;
                    background: #ffffff;
                    box-shadow:
                        0 1px 4px rgba(16,24,40,.2);
                    transition:
                        transform .22s ease;
                }

                .project-switch input:checked +
                .project-switch-slider {
                    background: #c0122f;
                }

                .project-switch input:checked +
                .project-switch-slider::before {
                    transform: translateX(19px);
                }

                .project-info-box {
                    margin-top: 18px;
                    padding: 11px 13px;
                    display: flex;
                    align-items: flex-start;
                    gap: 9px;
                    border: 1px solid #e7e9ed;
                    border-radius: 9px;
                    background: #fafbfc;
                    color: #687182;
                    font-size: 11.5px;
                    line-height: 1.55;
                }

                .project-info-box svg {
                    flex: 0 0 auto;
                    margin-top: 1px;
                    color: #7b8492;
                }

                .project-form-footer {
                    padding: 18px 26px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                    background: #fafbfc;
                    border-top: 1px solid #eceef2;
                }

                .project-form-footer-note {
                    color: #8b93a0;
                    font-size: 11.5px;
                }

                .project-form-actions {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .project-cancel-button,
                .project-save-button {
                    height: 41px;
                    padding: 0 16px;
                    border-radius: 9px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-family: inherit;
                    font-size: 12.5px;
                    font-weight: 650;
                    text-decoration: none;
                    cursor: pointer;
                }

                .project-cancel-button {
                    border: 1px solid #dfe3e8;
                    background: #ffffff;
                    color: #475467 !important;
                }

                .project-save-button {
                    border: 1px solid #c0122f;
                    background: #c0122f;
                    color: #ffffff;
                    box-shadow:
                        0 4px 12px rgba(192,18,47,.17);
                }

                .project-save-button:hover:not(:disabled) {
                    border-color: #a90f29;
                    background: #a90f29;
                }

                .project-save-button:disabled {
                    opacity: .6;
                    cursor: wait;
                }

                @keyframes projectFormEnter {
                    from {
                        opacity: 0;
                        transform: translateY(8px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (max-width: 900px) {
                    .project-form-grid {
                        grid-template-columns: 1fr;
                    }

                    .project-form-field.full {
                        grid-column: auto;
                    }

                    .project-form-intro {
                        align-items: flex-start;
                        flex-direction: column;
                    }
                }

                @media (max-width: 600px) {
                    .project-form-section {
                        padding: 21px 17px 23px;
                    }

                    .project-form-intro {
                        padding: 19px 17px;
                    }

                    .project-form-footer {
                        padding: 16px 17px;
                        align-items: stretch;
                        flex-direction: column;
                    }

                    .project-form-actions {
                        width: 100%;
                    }

                    .project-cancel-button,
                    .project-save-button {
                        flex: 1;
                    }

                    .project-back-button span {
                        display: none;
                    }

                    .project-back-button {
                        width: 40px;
                        padding: 0;
                    }
                }

            `}</style>


            <div className="project-form-page">

                <form onSubmit={submit}>

                    <div className="project-form-card">

                        {/* HEADER */}

                        <div className="project-form-intro">

                            <div className="project-form-intro-left">

                                <div className="project-form-main-icon">
                                    <ProjectIcon />
                                </div>

                                <div>

                                    <div className="project-form-intro-title">

                                        {isEdit
                                            ? 'Update Project Details'
                                            : isApiImport
                                                ? `Import ${importSourceLabel} Project`
                                                : 'Create New Project'}

                                    </div>

                                    <div className="project-form-intro-description">

                                        {isEdit
                                            ? 'Update the project information displayed on the Biltrax website.'
                                            : isApiImport
                                                ? `Review the ${importSourceLabel} project information and configure how this project will appear on the Biltrax website.`
                                                : 'Add a new project to the Biltrax website project directory.'}

                                    </div>

                                </div>

                            </div>


                            <div className="project-form-mode">

                                {isEdit
                                    ? 'Editing Project'
                                    : isApiImport
                                        ? `${importSourceLabel} Import`
                                        : 'New Project'}

                            </div>

                        </div>


                        {/* PROJECT INFORMATION */}

                        <section className="project-form-section">

                            <SectionTitle
                                icon={<BuildingIcon />}
                                title="Project Information"
                                description="Basic project identification and classification"
                            />

                            <div className="project-form-grid">

                                <Field
                                    label="Project Name"
                                    required
                                    error={errors.project_name}
                                >
                                    <input
                                        type="text"
                                        className="project-form-control"
                                        value={data.project_name}
                                        onChange={(e) =>
                                            setData(
                                                'project_name',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter project name"
                                    />
                                </Field>


                                <Field
                                    label="Biltrax / Source Project ID"
                                    error={errors.source_project_id}
                                >
                                    <input
                                        type="number"
                                        className="project-form-control"
                                        value={data.source_project_id}
                                        onChange={(e) =>
                                            setData(
                                                'source_project_id',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter source project ID"
                                    />
                                </Field>


                                <Field
                                    label="Sector"
                                    error={errors.sector}
                                >
                                    <input
                                        type="text"
                                        className="project-form-control"
                                        value={data.sector}
                                        onChange={(e) =>
                                            setData(
                                                'sector',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter sector"
                                    />
                                </Field>


                                <Field
                                    label="Project Type"
                                    error={errors.project_type}
                                >
                                    <input
                                        type="text"
                                        className="project-form-control"
                                        value={data.project_type}
                                        onChange={(e) =>
                                            setData(
                                                'project_type',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter project type"
                                    />
                                </Field>


                                <Field
                                    label="Project Stage"
                                    error={errors.project_stage}
                                >
                                    <input
                                        type="text"
                                        className="project-form-control"
                                        value={data.project_stage}
                                        onChange={(e) =>
                                            setData(
                                                'project_stage',
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g. Under Construction"
                                    />
                                </Field>

                            </div>

                        </section>


                        {/* LOCATION */}

                        <section className="project-form-section">

                            <SectionTitle
                                icon={<LocationIcon />}
                                title="Location"
                                description="Project geographical information"
                            />

                            <div className="project-form-grid">

                                <Field
                                    label="City"
                                    error={errors.city}
                                >
                                    <input
                                        type="text"
                                        className="project-form-control"
                                        value={data.city}
                                        onChange={(e) =>
                                            setData(
                                                'city',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter city"
                                    />
                                </Field>


                                <Field
                                    label="State"
                                    error={errors.state}
                                >
                                    <input
                                        type="text"
                                        className="project-form-control"
                                        value={data.state}
                                        onChange={(e) =>
                                            setData(
                                                'state',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter state"
                                    />
                                </Field>


                                <Field
                                    label="Region"
                                    error={errors.region}
                                >
                                    <input
                                        type="text"
                                        className="project-form-control"
                                        value={data.region}
                                        onChange={(e) =>
                                            setData(
                                                'region',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter region"
                                    />
                                </Field>


                                <Field
                                    label="Location"
                                    error={errors.location}
                                >
                                    <input
                                        type="text"
                                        className="project-form-control"
                                        value={data.location}
                                        onChange={(e) =>
                                            setData(
                                                'location',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter display location"
                                    />
                                </Field>

                            </div>

                        </section>


                        {/* DESCRIPTION */}

                        <section className="project-form-section">

                            <SectionTitle
                                icon={<ProjectIcon />}
                                title="Project Description"
                                description="Content displayed with the project"
                            />

                            <div className="project-form-grid">

                                <Field
                                    label="Summary"
                                    error={errors.summary}
                                    full
                                >
                                    <textarea
                                        className="project-form-control"
                                        rows="5"
                                        value={data.summary}
                                        onChange={(e) =>
                                            setData(
                                                'summary',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter a short project summary..."
                                    />
                                </Field>

                            </div>

                        </section>


                        {/* PUBLISHING */}

                        <section className="project-form-section">

                            <SectionTitle
                                icon={<SettingsIcon />}
                                title="Publishing Settings"
                                description="Control project visibility and display order"
                            />

                            <div className="project-form-grid">

                                <Field
                                    label="Status"
                                    required
                                    error={errors.status}
                                >
                                    <select
                                        className="project-form-control"
                                        value={data.status}
                                        onChange={(e) =>
                                            setData(
                                                'status',
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="draft">
                                            Draft
                                        </option>

                                        <option value="published">
                                            Published
                                        </option>
                                    </select>
                                </Field>


                                <Field
                                    label="Published At"
                                    error={errors.published_at}
                                >
                                    <input
                                        type="datetime-local"
                                        className="project-form-control"
                                        value={data.published_at}
                                        onChange={(e) =>
                                            setData(
                                                'published_at',
                                                e.target.value
                                            )
                                        }
                                    />
                                </Field>


                                <Field
                                    label="Sort Order"
                                    error={errors.sort_order}
                                >
                                    <input
                                        type="number"
                                        min="0"
                                        className="project-form-control"
                                        value={data.sort_order}
                                        onChange={(e) =>
                                            setData(
                                                'sort_order',
                                                e.target.value
                                            )
                                        }
                                        placeholder="0"
                                    />
                                </Field>


                                <Field
                                    label="Featured"
                                    error={errors.is_featured}
                                >
                                    <div className="project-featured-box">

                                        <div className="project-featured-info">

                                            <div className="project-featured-icon">
                                                <StarIcon />
                                            </div>

                                            <div>
                                                <div className="project-featured-title">
                                                    Featured Project
                                                </div>

                                                <div className="project-featured-description">
                                                    Highlight this project on the website
                                                </div>
                                            </div>

                                        </div>


                                        <label className="project-switch">

                                            <input
                                                type="checkbox"
                                                checked={data.is_featured}
                                                onChange={(e) =>
                                                    setData(
                                                        'is_featured',
                                                        e.target.checked
                                                    )
                                                }
                                            />

                                            <span className="project-switch-slider" />

                                        </label>

                                    </div>

                                </Field>

                            </div>


                            <div className="project-info-box">

                                <InfoIcon />

                                <span>
                                    Only projects with status{' '}
                                    <strong>Published</strong>{' '}
                                    are available to the public website through the CMS API.
                                </span>

                            </div>

                        </section>


                        {/* FOOTER */}

                        <div className="project-form-footer">

                            <div className="project-form-footer-note">

                                {isEdit
                                    ? `Editing project #${project?.id}`
                                    : isApiImport
                                        ? `Importing ${importSourceLabel} project #${project?.source_project_id ?? ''}`
                                        : 'Create a new website project'}

                            </div>


                            <div className="project-form-actions">

                                <Link
                                    href="/cms/projects"
                                    className="project-cancel-button"
                                >
                                    Cancel
                                </Link>


                                <button
                                    type="submit"
                                    className="project-save-button"
                                    disabled={processing}
                                >
                                    <SaveIcon />

                                    <span>
                                        {processing
                                            ? 'Saving...'
                                            : isEdit
                                                ? 'Update Project'
                                                : isApiImport
                                                    ? 'Import & Save Project'
                                                    : 'Save Project'}
                                    </span>

                                </button>

                            </div>

                        </div>

                    </div>

                </form>

            </div>

        </CmsLayout>
    );
}