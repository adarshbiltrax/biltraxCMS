import React from 'react';

import {
    Link,
} from '@inertiajs/react';

export default function Pagination({
    links = [],
}) {

    if (!Array.isArray(links) || links.length <= 3) {
        return null;
    }

    return (
        <div className="cms-pagination">

            {links.map((link, index) => {

                if (!link.url) {

                    return (
                        <span
                            key={index}
                            className="disabled"
                            dangerouslySetInnerHTML={{
                                __html: link.label,
                            }}
                        />
                    );

                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
                        className={
                            link.active
                                ? 'active'
                                : ''
                        }
                        dangerouslySetInnerHTML={{
                            __html: link.label,
                        }}
                    />
                );

            })}

        </div>
    );
}