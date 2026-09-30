import {Link} from '@inertiajs/react';
export default function Pagination({links=[]}){if(!links||links.length<=3)return null;return <div className="cms-pagination">{links.map((l,i)=>l.url?<Link key={i} href={l.url} preserveScroll className={l.active?'active':''} dangerouslySetInnerHTML={{__html:l.label}}/>:<span key={i} className="disabled" dangerouslySetInnerHTML={{__html:l.label}}/>)}</div>}
