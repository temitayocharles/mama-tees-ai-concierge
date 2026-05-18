#!/usr/bin/env bash
set -euo pipefail

cat <<'SUMMARY'
Required Render environment variables:

NODE_ENV=production
PORT=8080
LOG_DESTINATION=google_sheets
WEBHOOK_SECRET=<long-random-secret>
GOOGLE_SHEETS_SPREADSHEET_ID=1TYO9pj59qYfBeExiKLVYuvD9QB1jSFAhFb5rGBv4mB8
GOOGLE_SHEETS_TAB_NAME=Call Logs
GOOGLE_SERVICE_ACCOUNT_EMAIL=<service-account-email>
GOOGLE_PRIVATE_KEY=<private-key-with-escaped-newlines>
BUSINESS_TIMEZONE=Africa/Lagos
SUMMARY
