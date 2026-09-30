import React from 'react';
import { Head } from '@inertiajs/react';

export default function Home() {
    return (
        <>
            <Head title="Biltrax" />

            <iframe
                className="website-frame"
                src="/biltrax-site/index.html"
                title="Biltrax Website"
            />
        </>
    );
}