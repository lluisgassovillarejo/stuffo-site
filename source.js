// Preserve only known campaign labels, without cookies or storing visitor data.
const params = new URLSearchParams(location.search);
const source = params.get('utm_source');
if (['pinterest','youtube','organic_search'].includes(source)) {
 document.querySelectorAll('a[data-play]').forEach(a => { const u=new URL(a.href); u.searchParams.set('utm_source',source); a.href=u; });
 document.querySelectorAll('a[href]').forEach(a => {const u=new URL(a.href);if(u.origin===location.origin&&u.pathname.endsWith('.html')){u.searchParams.set('utm_source',source);a.href=u;}});
}
