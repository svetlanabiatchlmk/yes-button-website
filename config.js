/*
  Setup:
  1) Deploy the site to Netlify.
  2) In Netlify, add a serverless function named "notify" using the netlify/functions/notify.mjs file.
  3) Set the environment variables described in README.md.
  4) Replace the empty endpoint below with your deployed function URL, e.g.
     https://YOUR-SITE.netlify.app/.netlify/functions/notify
*/
window.SITE_CONFIG = {
  notifyEndpoint: https://shimmering-kitten-5619ce.netlify.app/
};
