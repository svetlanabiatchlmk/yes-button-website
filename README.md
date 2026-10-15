# Minimal romantic Yes-button website

A small, responsive romantic page with a **Yes** button and an optional “Not right now” response. When someone clicks Yes, a serverless function sends you an email through Resend. Once deployed and configured, the email can arrive even while you are away from the website.

## Files
- `index.html`, `styles.css`, `script.js`: the website
- `config.js`: browser-side notification endpoint setting
- `netlify/functions/notify.mjs`: server-side email function (keeps the email API key secret)
- `netlify.toml`: Netlify deployment configuration

## Setup email notifications

You will need a Netlify account and a Resend account. The site is not connected to email until you complete these steps.

1. **Create a Resend account** at https://resend.com and create an API key.
2. **Verify a sender address/domain** in Resend. Use the sender address Resend authorizes as `EMAIL_FROM`. For testing, Resend may restrict sending to your own verified email address until you verify a domain.
3. **Deploy this folder to Netlify.** Easiest: put the files in a GitHub repository, then in Netlify choose **Add new site → Import an existing project** and connect the repository. Netlify detects `netlify.toml`.
4. In Netlify, open **Site configuration → Environment variables** and add:
   - `EMAIL_TO` = the email address where you want to receive the alert
   - `RESEND_API_KEY` = your Resend API key (keep it secret; never put it in `config.js`)
   - `EMAIL_FROM` = a sender address/domain verified in Resend, for example `Yes Button <notifications@your-verified-domain.com>`
   - `ALLOWED_ORIGIN` = your deployed website origin, e.g. `https://your-site-name.netlify.app` (recommended; no trailing slash)
5. Trigger a redeploy after setting the environment variables.
6. Open `config.js` and replace the empty `notifyEndpoint` with your function URL:
   `https://your-site-name.netlify.app/.netlify/functions/notify`
   Commit and redeploy the updated file.
7. Open the live website and test the **Yes** button. Check your inbox and spam folder.

## Important notes
- The site currently does **not** send email until you configure the endpoint and environment variables above.
- The email API key lives only in the serverless function environment, not in public website code.
- Anyone with the public link can click Yes. This is a notification of a button click, not proof of identity.
- The “Not right now” choice does not send an email.
- A public endpoint can be abused if shared widely. Keep the link private and consider adding rate limiting or CAPTCHA before publishing widely.
- The email notification depends on the hosting provider, Resend, and your email provider being available.
