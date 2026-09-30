import React, {
    useState,
} from 'react';


export default function OpportunityApplicationForm({
    careers = [],
    selectedCareer = null,
    onClose,
}) {

    const [data, setData] =
        useState({

            career_id:
                selectedCareer?.id || '',

            position_applied_for:
                selectedCareer?.job_title ||
                selectedCareer?.title ||
                '',

            first_name: '',
            last_name: '',
            email: '',
            mobile_number: '',
            cv_link: '',
            qualification: '',
            experience_years: '',
            message: '',
            location_confirmed: false,
        });


    const [errors, setErrors] =
        useState({});


    const [
        processing,
        setProcessing,
    ] = useState(false);


    const [
        submitted,
        setSubmitted,
    ] = useState(false);


    function change(
        field,
        value
    ) {

        setData(
            (current) => ({
                ...current,

                [field]:
                    value,
            })
        );


        setErrors(
            (current) => ({
                ...current,

                [field]:
                    undefined,
            })
        );
    }


    function changeCareer(value) {

        const career =
            careers.find(
                (item) =>
                    String(item.id) ===
                    String(value)
            );


        setData(
            (current) => ({
                ...current,

                career_id:
                    value,

                position_applied_for:
                    career?.job_title ||
                    career?.title ||
                    '',
            })
        );
    }


    async function submit(e) {

        e.preventDefault();

        setProcessing(true);

        setErrors({});


        try {

            const response =
                await fetch(
                    '/api/opportunity-enquiry',
                    {
                        method:
                            'POST',

                        headers: {
                            Accept:
                                'application/json',

                            'Content-Type':
                                'application/json',
                        },

                        body:
                            JSON.stringify(
                                data
                            ),
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                if (
                    response.status ===
                        422 &&
                    result.errors
                ) {

                    setErrors(
                        result.errors
                    );

                    return;
                }


                throw new Error(
                    result.message ||
                    'Unable to submit application.'
                );
            }


            setSubmitted(true);

        } catch (error) {

            setErrors({
                general: [
                    error.message,
                ],
            });

        } finally {

            setProcessing(false);
        }
    }


    if (submitted) {

        return (
            <div className="career-apply-success">

                <h2>
                    Application Submitted
                </h2>

                <p>
                    Thank you. Your application has been received by Biltrax.
                </p>

                <button
                    type="button"
                    onClick={onClose}
                >
                    Back to Opportunities
                </button>

            </div>
        );
    }


    return (
        <section className="career-application">

            <style>{`

                .career-application {
                    min-height: 100vh;
                    padding: 40px 5vw;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    background:
                        linear-gradient(
                            135deg,
                            #70404d,
                            #824754 45%,
                            #603847
                        );
                }


                .career-application-card {
                    width: min(
                        900px,
                        100%
                    );

                    padding:
                        50px 65px;

                    background:
                        rgba(
                            255,
                            255,
                            255,
                            .92
                        );
                }


                .career-application h1 {
                    margin:
                        0 0 28px;

                    color:
                        #c8102e;

                    font-family:
                        Manrope,
                        sans-serif;

                    font-size:
                        31px;

                    font-weight:
                        500;
                }


                .career-form {
                    display: grid;

                    grid-template-columns:
                        1fr 1fr;

                    gap:
                        16px 40px;
                }


                .career-field label {
                    display: block;

                    margin-bottom:
                        6px;

                    font-size:
                        12px;
                }


                .career-field input,
                .career-field select,
                .career-field textarea {

                    box-sizing:
                        border-box;

                    width:
                        100%;

                    border:
                        1px solid
                        #41454d;

                    background:
                        #fff;

                    outline:
                        none;

                    font:
                        inherit;
                }


                .career-field input,
                .career-field select {

                    height:
                        42px;

                    padding:
                        0 10px;
                }


                .career-field textarea {

                    min-height:
                        100px;

                    padding:
                        10px;

                    resize:
                        vertical;
                }


                .career-field.full,
                .career-confirm,
                .career-submit {

                    grid-column:
                        1 / -1;
                }


                .career-error {
                    margin-top:
                        4px;

                    color:
                        #b42318;

                    font-size:
                        11px;
                }


                .career-confirm label {

                    display:
                        flex;

                    align-items:
                        flex-start;

                    gap:
                        8px;

                    font-size:
                        11px;
                }


                .career-submit button {

                    min-width:
                        130px;

                    height:
                        44px;

                    border:
                        0;

                    background:
                        #c8102e;

                    color:
                        #fff;

                    font-weight:
                        800;

                    cursor:
                        pointer;
                }


                @media (
                    max-width:
                    600px
                ) {

                    .career-application {
                        padding:
                            0;
                    }


                    .career-application-card {

                        padding:
                            30px 18px;
                    }


                    .career-form {

                        grid-template-columns:
                            1fr;

                        gap:
                            14px;
                    }


                    .career-field.full,
                    .career-confirm,
                    .career-submit {

                        grid-column:
                            auto;
                    }


                    .career-submit button {

                        width:
                            100%;
                    }

                }

            `}</style>


            <div className="career-application-card">

                <h1>
                    Apply Now for Exciting Opportunities
                </h1>


                {errors.general && (

                    <div className="career-error">
                        {errors.general[0]}
                    </div>

                )}


                <form
                    className="career-form"
                    onSubmit={submit}
                >

                    <Field
                        label="First Name *"
                        error={
                            errors.first_name
                        }
                    >

                        <input
                            value={
                                data.first_name
                            }
                            onChange={(e) =>
                                change(
                                    'first_name',
                                    e.target.value
                                )
                            }
                        />

                    </Field>


                    <Field
                        label="Last Name *"
                        error={
                            errors.last_name
                        }
                    >

                        <input
                            value={
                                data.last_name
                            }
                            onChange={(e) =>
                                change(
                                    'last_name',
                                    e.target.value
                                )
                            }
                        />

                    </Field>


                    <Field
                        label="Email Address *"
                        error={
                            errors.email
                        }
                    >

                        <input
                            type="email"
                            value={
                                data.email
                            }
                            onChange={(e) =>
                                change(
                                    'email',
                                    e.target.value
                                )
                            }
                        />

                    </Field>


                    <Field
                        label="Mobile Number *"
                        error={
                            errors.mobile_number
                        }
                    >

                        <input
                            type="tel"
                            value={
                                data.mobile_number
                            }
                            onChange={(e) =>
                                change(
                                    'mobile_number',
                                    e.target.value
                                )
                            }
                        />

                    </Field>


                    <Field
                        label="Position Applying For"
                        error={
                            errors.career_id
                        }
                    >

                        <select
                            value={
                                data.career_id
                            }
                            onChange={(e) =>
                                changeCareer(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                Choose an option
                            </option>


                            {careers.map(
                                (career) => (

                                    <option
                                        key={
                                            career.id
                                        }
                                        value={
                                            career.id
                                        }
                                    >
                                        {
                                            career.job_title ||
                                            career.title
                                        }
                                    </option>

                                )
                            )}

                        </select>

                    </Field>


                    <Field
                        label="Link to CV *"
                        error={
                            errors.cv_link
                        }
                    >

                        <input
                            type="url"
                            value={
                                data.cv_link
                            }
                            onChange={(e) =>
                                change(
                                    'cv_link',
                                    e.target.value
                                )
                            }
                        />

                    </Field>


                    <Field
                        label="Qualification *"
                        error={
                            errors.qualification
                        }
                    >

                        <input
                            value={
                                data.qualification
                            }
                            onChange={(e) =>
                                change(
                                    'qualification',
                                    e.target.value
                                )
                            }
                        />

                    </Field>


                    <Field
                        label="Experience (in Years) *"
                        error={
                            errors.experience_years
                        }
                    >

                        <input
                            type="number"
                            min="0"
                            max="60"
                            step="0.1"
                            value={
                                data.experience_years
                            }
                            onChange={(e) =>
                                change(
                                    'experience_years',
                                    e.target.value
                                )
                            }
                        />

                    </Field>


                    <Field
                        label="Message"
                        error={
                            errors.message
                        }
                        full
                    >

                        <textarea
                            value={
                                data.message
                            }
                            onChange={(e) =>
                                change(
                                    'message',
                                    e.target.value
                                )
                            }
                        />

                    </Field>


                    <div className="career-confirm">

                        <label>

                            <input
                                type="checkbox"
                                checked={
                                    data.location_confirmed
                                }
                                onChange={(e) =>
                                    change(
                                        'location_confirmed',
                                        e.target.checked
                                    )
                                }
                            />

                            <span>
                                I confirm that I currently reside in Mumbai (Kurla to Chembur) or Navi Mumbai / Thane to Kalyan only.
                            </span>

                        </label>


                        {errors.location_confirmed && (

                            <div className="career-error">
                                {
                                    errors
                                        .location_confirmed[0]
                                }
                            </div>

                        )}

                    </div>


                    <div className="career-submit">

                        <button
                            type="submit"
                            disabled={
                                processing
                            }
                        >

                            {processing
                                ? 'SUBMITTING...'
                                : 'SUBMIT'
                            }

                        </button>

                    </div>

                </form>

            </div>

        </section>
    );
}


function Field({
    label,
    error,
    full = false,
    children,
}) {

    return (
        <div
            className={
                full
                    ? 'career-field full'
                    : 'career-field'
            }
        >

            <label>
                {label}
            </label>

            {children}

            {error && (

                <div className="career-error">
                    {error[0]}
                </div>

            )}

        </div>
    );
}