// Shows a plain message after a Supabase email link. The link carries tokens in the address fragment; this page does not use,
// store or send them, and removes them from the address bar at once. It says "verified" only when the link actually carries an
// access token for a signup or email-change confirmation with no error; anything else gets neutral wording. Sign in inside the extension.
(() => {
  const p = new URLSearchParams(location.hash.slice(1) || location.search.slice(1));
  const q = new URLSearchParams(location.search);
  const get = (k) => p.get(k) || q.get(k) || '';
  const type = get('type');
  const error = get('error_description') || get('error');
  const confirmed = Boolean(get('access_token'));
  try { history.replaceState(null, '', location.pathname); } catch { /* ignore */ }
  const title = document.getElementById('cb-title');
  const text = document.getElementById('cb-text');
  if (error) {
    title.textContent = 'This link did not work';
    text.textContent = 'It may have expired or been used already. Open Fexlo, go to Sign in and choose “Send the email again” (or “Forgot password”) to get a new link.';
  } else if (type === 'recovery') {
    title.textContent = 'Choose a new password';
    text.textContent = 'Please use the password reset page from your email link.';
  } else if (confirmed && type === 'signup') {
    title.textContent = 'Email verified';
    text.textContent = 'Thank you. Your email address is verified. Return to the Fexlo extension and sign in.';
  } else if (confirmed && type === 'email_change') {
    title.textContent = 'Email address confirmed';
    text.textContent = 'Your new email address is confirmed. Return to Fexlo and sign in with it.';
  } else {
    title.textContent = 'Return to Fexlo';
    text.textContent = 'If you opened this from an email link, return to Fexlo and sign in. If the link did not work, request a new one from Fexlo.';
  }
})();
