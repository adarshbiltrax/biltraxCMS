// export async function refreshCsrfToken() {
//     const response = await fetch('/csrf-token', {
//         method: 'GET',
//         credentials: 'include',
//         headers: {
//             Accept: 'application/json',
//         },
//         cache: 'no-store',
//     });

//     if (!response.ok) {
//         throw new Error('Unable to refresh CSRF token');
//     }

//     const data = await response.json();

//     if (!data.token) {
//         throw new Error('CSRF token not received');
//     }

//     const meta = document.querySelector('meta[name="csrf-token"]');

//     if (meta) {
//         meta.setAttribute('content', data.token);
//     }

//     return data.token;
// }

async  function refreshCsrfToken() {
    const response = await fetch('/csrf-token', {
        method: 'GET',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
        },
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error('Unable to refresh CSRF token');
    }

    const data = await response.json();

    if (!data.token) {
        throw new Error('CSRF token not received');
    }

    const meta = document.querySelector('meta[name="csrf-token"]');

    if (meta) {
        meta.setAttribute('content', data.token);
    }

    return data.token;
}