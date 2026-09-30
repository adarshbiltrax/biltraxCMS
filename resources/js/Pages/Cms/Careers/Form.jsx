import React from 'react';

import {
    Head,
    Link,
    useForm,
} from '@inertiajs/react';

import CmsLayout from '../../../Layouts/CmsLayout';

export default function Form({
    career = null,
}) {

    const isEdit = Boolean(career);

    function formatDate(value) {

        if (!value) {
            return '';
        }

        return String(value).slice(
            0,
            10
        );
    }


    function formatDateTime(value) {

        if (!value) {
            return '';
        }

        return String(value).slice(
            0,
            16
        );
    }


    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
    } = useForm({

        job_title:
            career?.job_title ?? '',

        department:
            career?.department ?? '',

        location:
            career?.location ?? '',

        employment_type:
            career?.employment_type ?? '',

        experience:
            career?.experience ?? '',

        short_description:
            career?.short_description ?? '',

        job_description:
            career?.job_description ?? '',

        responsibilities:
            career?.responsibilities ?? '',

        requirements:
            career?.requirements ?? '',

        application_email:
            career?.application_email ?? '',

        application_url:
            career?.application_url ?? '',

        status:
            career?.status ?? 'draft',

        closing_date:
            formatDate(
                career?.closing_date
            ),

        published_at:
            formatDateTime(
                career?.published_at
            ),

        sort_order:
            career?.sort_order ?? 0,
    });


    function submit(e) {

        e.preventDefault();

        if (isEdit) {

            put(
                `/cms/careers/${career.id}`,
                {
                    preserveScroll: true,
                }
            );

        } else {

            post(
                '/cms/careers',
                {
                    preserveScroll: true,
                }
            );

        }
    }


    return (

        <CmsLayout
            title={
                isEdit
                    ? 'Edit Career'
                    : 'Add Career'
            }
        >

            <Head
                title={
                    isEdit
                        ? 'Edit Career · Biltrax CMS'
                        : 'Add Career · Biltrax CMS'
                }
            />


            <div className="cms-card">

                <form
                    onSubmit={submit}
                    className="cms-form"
                >

                    <div className="cms-form-grid">


                        <div className="cms-field full">

                            <label>
                                Job Title *
                            </label>

                            <input
                                type="text"
                                value={data.job_title}
                                onChange={(e) =>
                                    setData(
                                        'job_title',
                                        e.target.value
                                    )
                                }
                            />

                            {errors.job_title && (

                                <div className="cms-error">
                                    {errors.job_title}
                                </div>

                            )}

                        </div>


                        <div className="cms-field">

                            <label>
                                Department
                            </label>

                            <input
                                type="text"
                                value={data.department}
                                onChange={(e) =>
                                    setData(
                                        'department',
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="cms-field">

                            <label>
                                Location
                            </label>

                            <input
                                type="text"
                                value={data.location}
                                onChange={(e) =>
                                    setData(
                                        'location',
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="cms-field">

                            <label>
                                Employment Type
                            </label>

                            <input
                                type="text"
                                value={
                                    data.employment_type
                                }
                                onChange={(e) =>
                                    setData(
                                        'employment_type',
                                        e.target.value
                                    )
                                }
                                placeholder="Full-time"
                            />

                        </div>


                        <div className="cms-field">

                            <label>
                                Experience
                            </label>

                            <input
                                type="text"
                                value={data.experience}
                                onChange={(e) =>
                                    setData(
                                        'experience',
                                        e.target.value
                                    )
                                }
                                placeholder="2-4 years"
                            />

                        </div>


                        <div className="cms-field full">

                            <label>
                                Short Description
                            </label>

                            <textarea
                                rows="4"
                                value={
                                    data.short_description
                                }
                                onChange={(e) =>
                                    setData(
                                        'short_description',
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="cms-field full">

                            <label>
                                Job Description
                            </label>

                            <textarea
                                rows="6"
                                value={
                                    data.job_description
                                }
                                onChange={(e) =>
                                    setData(
                                        'job_description',
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="cms-field full">

                            <label>
                                Responsibilities
                            </label>

                            <textarea
                                rows="6"
                                value={
                                    data.responsibilities
                                }
                                onChange={(e) =>
                                    setData(
                                        'responsibilities',
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="cms-field full">

                            <label>
                                Requirements
                            </label>

                            <textarea
                                rows="6"
                                value={
                                    data.requirements
                                }
                                onChange={(e) =>
                                    setData(
                                        'requirements',
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="cms-field">

                            <label>
                                Application Email
                            </label>

                            <input
                                type="email"
                                value={
                                    data.application_email
                                }
                                onChange={(e) =>
                                    setData(
                                        'application_email',
                                        e.target.value
                                    )
                                }
                            />

                            {errors.application_email && (
                                <div className="cms-error">
                                    {errors.application_email}
                                </div>
                            )}

                        </div>


                        <div className="cms-field">

                            <label>
                                Application URL
                            </label>

                            <input
                                type="url"
                                value={
                                    data.application_url
                                }
                                onChange={(e) =>
                                    setData(
                                        'application_url',
                                        e.target.value
                                    )
                                }
                            />

                            {errors.application_url && (
                                <div className="cms-error">
                                    {errors.application_url}
                                </div>
                            )}

                        </div>


                        <div className="cms-field">

                            <label>
                                Status *
                            </label>

                            <select
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

                                <option value="closed">
                                    Closed
                                </option>

                            </select>

                            {errors.status && (

                                <div className="cms-error">
                                    {errors.status}
                                </div>

                            )}

                        </div>


                        <div className="cms-field">

                            <label>
                                Closing Date
                            </label>

                            <input
                                type="date"
                                value={
                                    data.closing_date
                                }
                                onChange={(e) =>
                                    setData(
                                        'closing_date',
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="cms-field">

                            <label>
                                Published At
                            </label>

                            <input
                                type="datetime-local"
                                value={
                                    data.published_at
                                }
                                onChange={(e) =>
                                    setData(
                                        'published_at',
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="cms-field">

                            <label>
                                Sort Order
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={
                                    data.sort_order
                                }
                                onChange={(e) =>
                                    setData(
                                        'sort_order',
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                    </div>


                    <div className="cms-actions">

                        <button
                            type="submit"
                            className="cms-btn"
                            disabled={processing}
                        >
                            {processing
                                ? 'Saving...'
                                : 'Save Career'
                            }
                        </button>


                        <Link
                            href="/cms/careers"
                            className="cms-btn secondary"
                        >
                            Cancel
                        </Link>

                    </div>

                </form>

            </div>

        </CmsLayout>
    );
}