// Shows a plain message after a Supabase email link (verification / address change). The link carries tokens in the address
// fragment; this page does not use, store or send them, and removes them from the address bar at once. Sign in inside the extension.
(() => {
  const p = new URLSearchParams(location.hash.slice(1) || location.search.slice(1));
  const q = new URLSearchParams(location.search);
  const type = p.get('type') || q.get('type') || '';
  const error = p.get('error_description') || q.get('error_description') || p.get('error') || q.get('error') || '';
  try { history.replaceState(null, '', location.pathname); } catch { /* ignore */ }
  const title = document.getElementById('cb-title');
  const text = document.getElementById('cb-text');
  if (error) {
    title.textContent = 'This link did not work';
    text.textContent = 'It may have expired or been used already. Open Fexlo, go to Sign in and choose “Send the email again” (or “Forgot password”) to get a new link.';
  } else if (type === 'recovery') {
    title.textContent = 'Choose a new password';
    text.textContent = 'Please use the password reset page from your email link.';
  } else if (type === 'email_change') {
    title.textContent = 'Email address confirmed';
    text.textContent = 'Your new email address is confirmed. Return to Fexlo and sign in with it.';
  } else {
    title.textContent = 'Email verified';
    text.textContent = 'Thank you. Your email address is verified. Return to the Fexlo extension and sign in.';
  }
})();
