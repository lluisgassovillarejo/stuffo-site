/* Shared organic promotion instrumentation. Analytics starts only after opt-in.
 * Configure using data-app, data-content, data-page-type and data-feedback on
 * this script element. Never send form values, precise location or URL queries.
 */
(function () {
  'use strict';
  var tag = document.currentScript;
  if (!tag || !/^(wend|repack|stuffo|speedometer)$/.test(tag.dataset.app || '')) return;
  var app = tag.dataset.app;
  var measurement = 'G-BM9YLMXLXG';
  var key = 'organic-promotion-consent-v1';
  var enabled = false;
  var initialized = false;
  var pageSent = false;
  var testMode = new URLSearchParams(location.search).get('promotion_test') === '1';
  var safeId = function (value) { return /^[a-z0-9_-]{1,80}$/i.test(value || '') ? value : 'other'; };
  var path = location.pathname;
  var content = safeId(tag.dataset.content || path.replace(/^\/|\/$/g, '').replace(/[\/.]/g, '_') || 'home');
  var type = safeId(tag.dataset.pageType || (content === 'home' || /index_html$/.test(content) ? 'home' : 'guide'));
  var page = location.origin + path;
  var referrer = '';
  try { referrer = new URL(document.referrer).origin + '/'; } catch (_) {}
  var campaign = {};
  var query = new URLSearchParams(location.search);
  var sources = ['pinterest','youtube','reddit','linkedin','google','bing','chatgpt','claude','perplexity','newsletter','website','organic_search'];
  var source = query.get('utm_source');
  if (sources.indexOf(source) !== -1) {
    campaign.campaign_source = source;
    var medium = query.get('utm_medium');
    if (['organic','community','social','referral','email'].indexOf(medium) !== -1) campaign.campaign_medium = medium;
    if (query.get('utm_campaign') === 'organic_pilot_v1') campaign.campaign_name = 'organic_pilot_v1';
  }
  function readConsent() { try { return localStorage.getItem(key); } catch (_) { return null; } }
  function storeConsent(value) { try { localStorage.setItem(key, value); } catch (_) {} }
  function base() { return Object.assign({app_id:app,content_id:content,page_type:type,page_location:page,page_referrer:referrer}, campaign); }
  function event(name, extra) {
    if (!enabled || testMode) return;
    window.gtag('event', name, Object.assign(base(), extra || {}));
  }
  function enable() {
    enabled = true;
    window['ga-disable-' + measurement] = false;
    if (testMode) return;
    if (!initialized) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      window.gtag('consent', 'default', {analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
      window.gtag('js', new Date());
      window.gtag('config', measurement, Object.assign(base(), {send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_domain:location.hostname,cookie_flags:'SameSite=Lax;Secure'}));
      var script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurement;
      document.head.appendChild(script);
      initialized = true;
    }
    window.gtag('consent', 'update', {analytics_storage:'granted'});
    if (!pageSent) { event('page_view'); pageSent = true; }
  }
  function disable() {
    enabled = false;
    window['ga-disable-' + measurement] = true;
    if (initialized) window.gtag('consent', 'update', {analytics_storage:'denied'});
    document.cookie.split(';').forEach(function (entry) {
      var name = entry.trim().split('=')[0];
      if (!/^_ga(?:_|$)/.test(name)) return;
      ['', ';Domain=' + location.hostname, ';Domain=.' + location.hostname].forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; Path=/; Secure; SameSite=Lax' + domain;
      });
    });
  }
  var panel = document.createElement('section');
  panel.className = 'promotion-consent';
  panel.setAttribute('aria-label', 'Website analytics choices');
  panel.innerHTML = '<p>Help improve this website? Optional Google Analytics measures page visits and clicks to Google Play. It does not read your app data or feedback.</p><div><button type="button" data-consent="accept">Allow analytics</button><button type="button" data-consent="reject">No thanks</button><a href="' + (tag.dataset.privacy || '/website-privacy') + '">Website privacy</a></div>';
  var footer = document.createElement('aside');
  footer.className = 'promotion-links';
  var settings = document.createElement('button');
  settings.type = 'button';
  settings.textContent = 'Website analytics choices';
  settings.addEventListener('click', function () { panel.hidden = false; panel.querySelector('button').focus(); });
  footer.appendChild(settings);
  if (tag.dataset.feedback) {
    var feedback = document.createElement('a');
    feedback.href = tag.dataset.feedback;
    feedback.textContent = 'Send feedback';
    feedback.dataset.feedback = 'true';
    footer.appendChild(feedback);
  }
  var state = document.createElement('span');
  state.setAttribute('role', 'status');
  footer.appendChild(state);
  if (testMode) state.textContent = 'Verification mode: analytics disabled.';
  panel.addEventListener('click', function (e) {
    var button = e.target.closest('[data-consent]');
    if (!button) return;
    var accepted = button.dataset.consent === 'accept';
    storeConsent(accepted ? 'accepted' : 'rejected');
    if (accepted) enable(); else disable();
    panel.hidden = true;
    if (!testMode) state.textContent = accepted ? 'Website analytics allowed.' : 'Website analytics off.';
  });
  document.body.appendChild(panel);
  document.body.appendChild(footer);
  var stored = readConsent();
  if (stored === 'accepted') { panel.hidden = true; enable(); }
  else if (stored === 'rejected') { panel.hidden = true; disable(); }
  window.addEventListener('storage', function (e) {
    if (e.key === key && e.newValue !== 'accepted') { disable(); panel.hidden = true; }
  });
  function tagLinks() {
    document.querySelectorAll('a[href]').forEach(function (a) {
      var url;
      try { url = new URL(a.href, location.href); } catch (_) { return; }
      if (url.hostname !== 'play.google.com' || url.pathname !== '/store/apps/details') return;
      url.searchParams.set('utm_source', 'website');
      url.searchParams.set('utm_medium', 'organic');
      url.searchParams.set('utm_campaign', 'organic_pilot_v1_' + app + '_' + content);
      a.href = url.toString();
    });
  }
  tagLinks();
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a) return;
    var url;
    try { url = new URL(a.href, location.href); } catch (_) { return; }
    var placement = safeId(a.dataset.placement || (a.closest('footer,aside') ? 'footer' : 'body'));
    if (url.hostname === 'play.google.com' && url.pathname === '/store/apps/details') event('play_click', {placement:placement});
    else if (a.dataset.feedback || a.href === tag.dataset.feedback || /\/feedback\/?$/.test(url.pathname)) event('feedback_open', {placement:placement});
    else if (a.hasAttribute('download')) event('resource_use', {resource_id:safeId(a.dataset.resource || content),action:'download_click'});
  });
  // Copy widgets dispatch this only after the clipboard write succeeds.
  document.addEventListener('promotion:resource-used', function (e) {
    var detail = e.detail || {};
    var action = ['copy','calculate','print'].indexOf(detail.action) !== -1 ? detail.action : 'copy';
    event('resource_use', {resource_id:safeId(detail.resourceId),action:action});
  });
}());
