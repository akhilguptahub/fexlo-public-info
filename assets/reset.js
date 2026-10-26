// Lets a person choose a new password after a Supabase reset link. The one-time token from the link's address fragment is kept
// only in memory for this page, removed from the address bar immediately, used for one request to the account service, and never
// logged or stored.
(() => {
  const cfg = window.FEXLO_SITE || {};
  const p = new URLSearchParams(location.hash.slice(1));
  let token = p.get('access_token');
  const linkError = p.get('error_description') || p.get('error');
  try { history.replaceState(null, '', location.pathname); } catch { /* ignore */ }
  const $ = (id) => document.getElementById(id);
  const status = $('rs-status');
  const form = $('rs-form');
  const configured = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(cfg.supabaseUrl || '') && (cfg.publishableKey || '').length > 20;
  const fail = (msg) => { status.textContent = msg; status.setAttribute('role', 'alert'); };
  if (!configured) { form.hidden = true; return fail('This page is not configured yet (the site owner has not set the account service address).'); }
  if (linkError || !token) { form.hidden = true; return fail('This reset link is missing, expired or already used. Open Fexlo → Sign in → Forgot password to get a new one.'); }
  const rules = (pw) => (pw.length >= 10 ? '' : 'Use at least 10 characters. ') + (/[a-z]/.test(pw) && /[A-Z]/.test(pw) && /\d/.test(pw) ? '' : 'Include a lowercase letter, an uppercase letter and a digit. ') + (pw.length <= 72 ? '' : 'Use at most 72 characters.');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pw = $('rs-pass').value;
    const again = $('rs-pass2').value;
    $('rs-err').textContent = '';
    const problem = rules(pw).trim() || (pw !== again ? 'The two passwords do not match.' : '');
    if (problem) { $('rs-err').textContent = problem; return; }
    const btn = $('rs-submit');
    btn.disabled = true;
    try {
      const r = await fetch(`${cfg.supabaseUrl}/auth/v1/user`, { method: 'PUT', credentials: 'omit', headers: { 'content-type': 'application/json', apikey: cfg.publishableKey, authorization: `Bearer ${token}` }, body: JSON.stringify({ password: pw }) });
      if (r.ok) { token = null; form.hidden = true; status.textContent = 'Your password was changed. Return to the Fexlo extension and sign in with it.'; return; }
      const body = await r.json().catch(() => ({}));
      $('rs-err').textContent = r.status === 422 ? (body.msg || 'That password is not accepted (it may be the same as the old one or too weak).') : r.status === 429 ? 'Too many attempts. Wait a minute and try again.' : 'The password could not be changed. The link may have expired: request a new one from Fexlo.';
    } catch {
      $('rs-err').textContent = 'The account service could not be reached. Check your connection and try again.';
    } finally { btn.disabled = false; }
  });
})();
