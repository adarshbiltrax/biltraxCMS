import React, {
    useEffect,
    useState,
} from 'react';


export default function OpportunityApplicationForm({
    careers = [],
    selectedCareer = null,
    onClose,
}) {

    const createInitialData = () => ({
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


    const [data, setData] =
        useState(createInitialData);

    const [errors, setErrors] =
        useState({});

    const [processing, setProcessing] =
        useState(false);

    const [submitted, setSubmitted] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | RESET FORM WHEN SELECTED CAREER CHANGES
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        setData({
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

        setErrors({});
        setSubmitted(false);

    }, [selectedCareer]);


    /*
    |--------------------------------------------------------------------------
    | LOCK BODY SCROLL WHILE MODAL IS OPEN
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            'hidden';


        return () => {

            document.body.style.overflow =
                previousOverflow;

        };

    }, []);


    /*
    |--------------------------------------------------------------------------
    | ESCAPE KEY CLOSE
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        function handleKeyDown(event) {

            if (
                event.key === 'Escape' &&
                !processing
            ) {

                onClose?.();

            }

        }


        document.addEventListener(
            'keydown',
            handleKeyDown
        );


        return () => {

            document.removeEventListener(
                'keydown',
                handleKeyDown
            );

        };

    }, [
        onClose,
        processing,
    ]);


    /*
    |--------------------------------------------------------------------------
    | CHANGE FIELD
    |--------------------------------------------------------------------------
    */

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


    /*
    |--------------------------------------------------------------------------
    | CHANGE CAREER
    |--------------------------------------------------------------------------
    */

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


        setErrors(
            (current) => ({
                ...current,

                career_id:
                    undefined,

                position_applied_for:
                    undefined,
            })
        );

    }


    /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */

    async function submit(event) {

        event.preventDefault();

        if (processing) {
            return;
        }


        setProcessing(true);
        setErrors({});


        try {

            const response =
                await fetch(
                    '/api/opportunity-enquiry',
                    {
                        method: 'POST',

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


            let result = {};

            try {

                result =
                    await response.json();

            } catch {

                result = {};

            }


            if (!response.ok) {

                if (
                    response.status === 422 &&
                    result.errors
                ) {

                    setErrors(
                        result.errors
                    );

                    return;

                }


                throw new Error(
                    result.message ||
                    'Unable to submit application. Please try again.'
                );

            }


            setSubmitted(true);


        } catch (error) {

            setErrors({
                general: [
                    error.message ||
                    'Unable to submit application. Please try again.',
                ],
            });


        } finally {

            setProcessing(false);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | BACKDROP CLOSE
    |--------------------------------------------------------------------------
    */

    function handleBackdropClick(event) {

        if (
            event.target ===
                event.currentTarget &&
            !processing
        ) {

            onClose?.();

        }

    }


    /*
    |--------------------------------------------------------------------------
    | SUCCESS
    |--------------------------------------------------------------------------
    */

    if (submitted) {

        return (
            <div
                className="opportunity-modal-overlay"
                onMouseDown={
                    handleBackdropClick
                }
            >

                <style>{styles}</style>


                <div
                    className="opportunity-success-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="application-success-title"
                >

                    <button
                        type="button"
                        className="opportunity-modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>


                    <div className="opportunity-success-icon">
                        ✓
                    </div>


                    <h2
                        id="application-success-title"
                        className="opportunity-success-title"
                    >
                        Application Submitted
                    </h2>


                    <p className="opportunity-success-text">
                        Thank you for applying to Biltrax.
                        Your application has been received
                        successfully.
                    </p>


                    {data.position_applied_for && (

                        <div className="opportunity-success-position">

                            <span>
                                Position
                            </span>

                            <strong>
                                {
                                    data.position_applied_for
                                }
                            </strong>

                        </div>

                    )}


                    <button
                        type="button"
                        className="opportunity-success-button"
                        onClick={onClose}
                    >
                        Close
                    </button>

                </div>

            </div>
        );

    }


    /*
    |--------------------------------------------------------------------------
    | APPLICATION FORM
    |--------------------------------------------------------------------------
    */

    return (
        <div
            className="opportunity-modal-overlay"
            onMouseDown={
                handleBackdropClick
            }
        >

            <style>{styles}</style>


            <div
                className="opportunity-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="opportunity-application-title"
            >

                {/* HEADER */}

                <div className="opportunity-modal-header">

                    <div>

                        <div className="opportunity-modal-eyebrow">
                            Careers · Opportunities
                        </div>


                        <h2
                            id="opportunity-application-title"
                            className="opportunity-modal-title"
                        >
                            Apply Now
                        </h2>


                        <p className="opportunity-modal-description">
                            Complete the form below and
                            submit your application to
                            Biltrax.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="opportunity-modal-close"
                        onClick={onClose}
                        disabled={processing}
                        aria-label="Close application form"
                    >
                        ×
                    </button>

                </div>


                {/* FORM */}

                <div className="opportunity-modal-body">

                    {errors.general && (

                        <div className="opportunity-general-error">

                            {
                                errors.general[0]
                            }

                        </div>

                    )}


                    <form
                        className="opportunity-form"
                        onSubmit={submit}
                    >

                        {/* FIRST NAME */}

                        <Field
                            label="First Name"
                            required
                            error={
                                errors.first_name
                            }
                        >

                            <input
                                type="text"
                                value={
                                    data.first_name
                                }
                                onChange={(event) =>
                                    change(
                                        'first_name',
                                        event.target.value
                                    )
                                }
                                placeholder="Enter first name"
                                autoComplete="given-name"
                            />

                        </Field>


                        {/* LAST NAME */}

                        <Field
                            label="Last Name"
                            required
                            error={
                                errors.last_name
                            }
                        >

                            <input
                                type="text"
                                value={
                                    data.last_name
                                }
                                onChange={(event) =>
                                    change(
                                        'last_name',
                                        event.target.value
                                    )
                                }
                                placeholder="Enter last name"
                                autoComplete="family-name"
                            />

                        </Field>


                        {/* EMAIL */}

                        <Field
                            label="Email Address"
                            required
                            error={
                                errors.email
                            }
                        >

                            <input
                                type="email"
                                value={
                                    data.email
                                }
                                onChange={(event) =>
                                    change(
                                        'email',
                                        event.target.value
                                    )
                                }
                                placeholder="name@example.com"
                                autoComplete="email"
                            />

                        </Field>


                        {/* MOBILE */}

                        <Field
                            label="Mobile Number"
                            required
                            error={
                                errors.mobile_number
                            }
                        >

                            <input
                                type="tel"
                                value={
                                    data.mobile_number
                                }
                                onChange={(event) =>
                                    change(
                                        'mobile_number',
                                        event.target.value
                                    )
                                }
                                placeholder="+91 98765 43210"
                                autoComplete="tel"
                            />

                        </Field>


                        {/* POSITION */}

                        <Field
                            label="Position Applying For"
                            error={
                                errors.career_id ||
                                errors.position_applied_for
                            }
                            full
                        >

                            <select
                                value={
                                    data.career_id
                                }
                                onChange={(event) =>
                                    changeCareer(
                                        event.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Choose a position
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


                        {/* CV */}

                        <Field
                            label="Link to CV"
                            required
                            error={
                                errors.cv_link
                            }
                        >

                            <input
                                type="url"
                                value={
                                    data.cv_link
                                }
                                onChange={(event) =>
                                    change(
                                        'cv_link',
                                        event.target.value
                                    )
                                }
                                placeholder="https://drive.google.com/..."
                            />

                        </Field>


                        {/* QUALIFICATION */}

                        <Field
                            label="Qualification"
                            required
                            error={
                                errors.qualification
                            }
                        >

                            <input
                                type="text"
                                value={
                                    data.qualification
                                }
                                onChange={(event) =>
                                    change(
                                        'qualification',
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. B.E. Civil Engineering"
                            />

                        </Field>


                        {/* EXPERIENCE */}

                        <Field
                            label="Experience (Years)"
                            required
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
                                onChange={(event) =>
                                    change(
                                        'experience_years',
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. 3"
                            />

                        </Field>


                        {/* EMPTY GRID CELL */}

                        <div className="opportunity-form-spacer" />


                        {/* MESSAGE */}

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
                                onChange={(event) =>
                                    change(
                                        'message',
                                        event.target.value
                                    )
                                }
                                placeholder="Tell us briefly about your experience and why you would like to join Biltrax..."
                                maxLength={5000}
                            />

                        </Field>


                        {/* LOCATION */}

                        <div className="opportunity-confirmation">

                            <label>

                                <input
                                    type="checkbox"
                                    checked={
                                        data.location_confirmed
                                    }
                                    onChange={(event) =>
                                        change(
                                            'location_confirmed',
                                            event.target.checked
                                        )
                                    }
                                />


                                <span>

                                    I confirm that I am
                                    comfortable working from
                                    the Mumbai / Navi Mumbai /
                                    Thane–Kalyan region.

                                    <strong>
                                        *
                                    </strong>

                                </span>

                            </label>


                            {errors.location_confirmed && (

                                <div className="opportunity-field-error">
                                    {
                                        errors
                                            .location_confirmed[0]
                                    }
                                </div>

                            )}

                        </div>


                        {/* ACTIONS */}

                        <div className="opportunity-form-actions">

                            <button
                                type="button"
                                className="opportunity-cancel-button"
                                onClick={onClose}
                                disabled={processing}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="opportunity-submit-button"
                                disabled={processing}
                            >

                                {processing
                                    ? 'Submitting...'
                                    : 'Submit Application'
                                }

                                {!processing && (
                                    <span>
                                        →
                                    </span>
                                )}

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| FIELD
|--------------------------------------------------------------------------
*/

function Field({
    label,
    required = false,
    error,
    full = false,
    children,
}) {

    return (
        <div
            className={
                full
                    ? 'opportunity-field opportunity-field-full'
                    : 'opportunity-field'
            }
        >

            <label>

                {label}

                {required && (
                    <span className="opportunity-required">
                        *
                    </span>
                )}

            </label>


            {children}


            {error && (

                <div className="opportunity-field-error">
                    {error[0]}
                </div>

            )}

        </div>
    );

}


/*
|--------------------------------------------------------------------------
| STYLES
|--------------------------------------------------------------------------
*/

const styles = `

    .opportunity-modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 99999;

        padding: 30px 20px;

        display: flex;
        align-items: center;
        justify-content: center;

        overflow-y: auto;

        background:
            rgba(
                13,
                15,
                18,
                .72
            );

        backdrop-filter:
            blur(5px);

        animation:
            opportunityFadeIn
            .18s ease;
    }


    .opportunity-modal {
        width: min(
            850px,
            100%
        );

        max-height:
            calc(
                100vh - 60px
            );

        overflow-y: auto;

        border-radius: 18px;

        background: #ffffff;

        box-shadow:
            0 30px 90px
            rgba(
                0,
                0,
                0,
                .30
            );

        animation:
            opportunityModalIn
            .25s ease;
    }


    .opportunity-modal-header {
        position: sticky;
        top: 0;
        z-index: 5;

        padding:
            28px 32px 24px;

        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;

        border-bottom:
            1px solid #e6e7eb;

        background:
            rgba(
                255,
                255,
                255,
                .97
            );
    }


    .opportunity-modal-eyebrow {
        margin-bottom: 8px;

        color: #c0122f;

        font-family:
            "IBM Plex Mono",
            monospace;

        font-size: 10px;
        font-weight: 600;

        letter-spacing: .17em;

        text-transform:
            uppercase;
    }


    .opportunity-modal-title {
        margin: 0;

        color: #111318;

        font-family:
            Manrope,
            sans-serif;

        font-size: 28px;
        line-height: 1.2;
        font-weight: 750;

        letter-spacing:
            -.025em;
    }


    .opportunity-modal-description {
        margin:
            7px 0 0;

        color: #7a8090;

        font-size: 13px;
        line-height: 1.55;
    }


    .opportunity-modal-close {
        width: 38px;
        height: 38px;

        flex: 0 0 38px;

        padding: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        border:
            1px solid #e1e4e8;

        border-radius: 50%;

        background: #ffffff;

        color: #667085;

        font-family:
            Arial,
            sans-serif;

        font-size: 25px;
        font-weight: 300;

        line-height: 1;

        cursor: pointer;

        transition:
            background .18s ease,
            border-color .18s ease,
            color .18s ease,
            transform .18s ease;
    }


    .opportunity-modal-close:hover {
        border-color: #c0122f;

        background: #fff4f6;

        color: #c0122f;

        transform:
            rotate(4deg);
    }


    .opportunity-modal-close:disabled {
        opacity: .45;
        cursor: not-allowed;
    }


    .opportunity-modal-body {
        padding:
            28px 32px 32px;
    }


    .opportunity-form {
        display: grid;

        grid-template-columns:
            repeat(
                2,
                minmax(
                    0,
                    1fr
                )
            );

        gap:
            20px 24px;
    }


    .opportunity-field {
        min-width: 0;
    }


    .opportunity-field-full {
        grid-column:
            1 / -1;
    }


    .opportunity-field > label {
        margin-bottom: 7px;

        display: block;

        color: #343a46;

        font-size: 12px;
        font-weight: 650;
    }


    .opportunity-required {
        margin-left: 3px;

        color: #c0122f;
    }


    .opportunity-field input,
    .opportunity-field select,
    .opportunity-field textarea {
        box-sizing:
            border-box;

        width: 100%;

        border:
            1px solid #d6dae0;

        border-radius: 8px;

        outline: none;

        background: #ffffff;

        color: #22262d;

        font-family:
            inherit;

        font-size: 13px;

        transition:
            border-color .18s ease,
            box-shadow .18s ease;
    }


    .opportunity-field input,
    .opportunity-field select {
        height: 44px;

        padding:
            0 12px;
    }


    .opportunity-field textarea {
        min-height: 105px;

        padding:
            12px;

        line-height: 1.6;

        resize: vertical;
    }


    .opportunity-field input::placeholder,
    .opportunity-field textarea::placeholder {
        color: #a3a8b2;
    }


    .opportunity-field input:focus,
    .opportunity-field select:focus,
    .opportunity-field textarea:focus {
        border-color:
            #c0122f;

        box-shadow:
            0 0 0 3px
            rgba(
                192,
                18,
                47,
                .08
            );
    }


    .opportunity-field-error {
        margin-top: 5px;

        color: #b42318;

        font-size: 10px;
        line-height: 1.4;
    }


    .opportunity-general-error {
        margin-bottom: 20px;

        padding:
            11px 13px;

        border:
            1px solid #fecdca;

        border-radius: 8px;

        background: #fef3f2;

        color: #b42318;

        font-size: 11px;
        line-height: 1.5;
    }


    .opportunity-confirmation {
        grid-column:
            1 / -1;

        padding:
            14px 16px;

        border:
            1px solid #e6e7eb;

        border-radius: 9px;

        background: #fafafb;
    }


    .opportunity-confirmation label {
        display: flex;
        align-items: flex-start;
        gap: 10px;

        color: #475467;

        font-size: 11px;
        line-height: 1.6;

        cursor: pointer;
    }


    .opportunity-confirmation input {
        width: 15px;
        height: 15px;

        flex:
            0 0 15px;

        margin-top: 1px;

        accent-color:
            #c0122f;
    }


    .opportunity-confirmation strong {
        margin-left: 2px;

        color: #c0122f;
    }


    .opportunity-form-actions {
        grid-column:
            1 / -1;

        padding-top: 3px;

        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
    }


    .opportunity-cancel-button,
    .opportunity-submit-button {
        min-height: 43px;

        padding:
            0 19px;

        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        border-radius: 999px;

        font-family:
            inherit;

        font-size: 12px;
        font-weight: 700;

        cursor: pointer;

        transition:
            background .18s ease,
            border-color .18s ease,
            color .18s ease,
            transform .18s ease;
    }


    .opportunity-cancel-button {
        border:
            1px solid #d6dae0;

        background: #ffffff;

        color: #475467;
    }


    .opportunity-cancel-button:hover {
        border-color: #aeb4bd;

        background: #f8f9fa;
    }


    .opportunity-submit-button {
        min-width: 170px;

        border:
            1px solid #c0122f;

        background: #c0122f;

        color: #ffffff;
    }


    .opportunity-submit-button:hover:not(:disabled) {
        border-color: #9f0e27;

        background: #9f0e27;

        transform:
            translateY(-1px);
    }


    .opportunity-submit-button:disabled,
    .opportunity-cancel-button:disabled {
        opacity: .6;

        cursor: not-allowed;
    }


    /*
    |--------------------------------------------------------------------------
    | SUCCESS
    |--------------------------------------------------------------------------
    */

    .opportunity-success-modal {
        position: relative;

        width: min(
            450px,
            100%
        );

        padding:
            48px 38px 38px;

        border-radius: 18px;

        background: #ffffff;

        text-align: center;

        box-shadow:
            0 30px 90px
            rgba(
                0,
                0,
                0,
                .30
            );

        animation:
            opportunityModalIn
            .25s ease;
    }


    .opportunity-success-modal
    .opportunity-modal-close {
        position: absolute;

        top: 16px;
        right: 16px;
    }


    .opportunity-success-icon {
        width: 58px;
        height: 58px;

        margin:
            0 auto 20px;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 50%;

        background: #ecfdf3;

        color: #027a48;

        font-size: 27px;
        font-weight: 800;
    }


    .opportunity-success-title {
        margin: 0;

        color: #111318;

        font-size: 24px;
        font-weight: 750;
    }


    .opportunity-success-text {
        max-width: 340px;

        margin:
            12px auto 0;

        color: #667085;

        font-size: 13px;
        line-height: 1.65;
    }


    .opportunity-success-position {
        margin-top: 20px;

        padding:
            12px 15px;

        border:
            1px solid #e6e7eb;

        border-radius: 9px;

        background: #fafafb;

        text-align: left;
    }


    .opportunity-success-position span {
        display: block;

        color: #98a2b3;

        font-size: 9px;
        font-weight: 700;

        letter-spacing: .08em;

        text-transform:
            uppercase;
    }


    .opportunity-success-position strong {
        margin-top: 4px;

        display: block;

        color: #344054;

        font-size: 12px;
    }


    .opportunity-success-button {
        min-width: 130px;
        height: 43px;

        margin-top: 24px;
        padding:
            0 20px;

        border: 0;

        border-radius: 999px;

        background: #c0122f;

        color: #ffffff;

        font-family:
            inherit;

        font-size: 12px;
        font-weight: 700;

        cursor: pointer;
    }


    .opportunity-success-button:hover {
        background: #9f0e27;
    }


    /*
    |--------------------------------------------------------------------------
    | ANIMATION
    |--------------------------------------------------------------------------
    */

    @keyframes opportunityFadeIn {

        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }

    }


    @keyframes opportunityModalIn {

        from {
            opacity: 0;

            transform:
                translateY(14px)
                scale(.985);
        }

        to {
            opacity: 1;

            transform:
                translateY(0)
                scale(1);
        }

    }


    /*
    |--------------------------------------------------------------------------
    | RESPONSIVE
    |--------------------------------------------------------------------------
    */

    @media (
        max-width: 700px
    ) {

        .opportunity-modal-overlay {
            padding:
                15px 10px;
        }


        .opportunity-modal {
            max-height:
                calc(
                    100vh - 30px
                );

            border-radius: 13px;
        }


        .opportunity-modal-header {
            padding:
                22px 18px 18px;
        }


        .opportunity-modal-title {
            font-size: 24px;
        }


        .opportunity-modal-body {
            padding:
                20px 18px 24px;
        }


        .opportunity-form {
            grid-template-columns:
                1fr;

            gap: 16px;
        }


        .opportunity-field-full,
        .opportunity-confirmation,
        .opportunity-form-actions {
            grid-column: auto;
        }


        .opportunity-form-spacer {
            display: none;
        }


        .opportunity-form-actions {
            flex-direction:
                column-reverse;
        }


        .opportunity-cancel-button,
        .opportunity-submit-button {
            width: 100%;
        }

    }

`;