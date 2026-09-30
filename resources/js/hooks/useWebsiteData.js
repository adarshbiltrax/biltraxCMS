import {
    useCallback,
    useEffect,
    useState,
} from 'react';


export function useProjects() {

    const [projects, setProjects] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);


    const loadProjects =
        useCallback(async () => {

            setLoading(true);
            setError(null);

            try {

                const response =
                    await fetch(
                        '/api/projects',
                        {
                            method: 'GET',

                            headers: {
                                Accept:
                                    'application/json',
                            },

                            credentials:
                                'same-origin',

                            cache:
                                'no-store',
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        `Projects API returned ${response.status}`
                    );
                }


                const json =
                    await response.json();


                const rows =
                    Array.isArray(json)
                        ? json
                        : (
                            Array.isArray(
                                json.data
                            )
                                ? json.data
                                : []
                        );


                setProjects(rows);

            } catch (err) {

                console.error(
                    'Unable to load projects:',
                    err
                );

                setProjects([]);

                setError(
                    err.message
                );

            } finally {

                setLoading(false);

            }

        }, []);


    useEffect(() => {

        loadProjects();

    }, [loadProjects]);


    return {
        projects,
        loading,
        error,
        reload: loadProjects,
    };
}


export function useCareers() {

    const [careers, setCareers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);


    const loadCareers =
        useCallback(async () => {

            setLoading(true);
            setError(null);

            try {

                const response =
                    await fetch(
                        '/api/careers',
                        {
                            method: 'GET',

                            headers: {
                                Accept:
                                    'application/json',
                            },

                            credentials:
                                'same-origin',

                            cache:
                                'no-store',
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        `Careers API returned ${response.status}`
                    );
                }


                const json =
                    await response.json();


                const rows =
                    Array.isArray(json)
                        ? json
                        : (
                            Array.isArray(
                                json.data
                            )
                                ? json.data
                                : []
                        );


                setCareers(rows);

            } catch (err) {

                console.error(
                    'Unable to load careers:',
                    err
                );

                setCareers([]);

                setError(
                    err.message
                );

            } finally {

                setLoading(false);

            }

        }, []);


    useEffect(() => {

        loadCareers();

    }, [loadCareers]);


    return {
        careers,
        loading,
        error,
        reload: loadCareers,
    };
}