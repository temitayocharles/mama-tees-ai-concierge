#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8080}"
WEBHOOK_SECRET="${WEBHOOK_SECRET:-replace-with-a-long-random-secret}"

post_case() {
  local label="$1"
  local file="$2"
  local code
  code=$(curl -sS -o /tmp/mama-tees-response.json -w "%{http_code}" \
    -H "Content-Type: application/json" \
    -H "X-Webhook-Secret: ${WEBHOOK_SECRET}" \
    -X POST "${BASE_URL}/api/call-logs" \
    --data-binary "@${file}")
  echo "${label}: HTTP ${code}"
  cat /tmp/mama-tees-response.json
  echo
  test "${code}" = "201"
}

post_case "Order log" "examples/order-log.json"
post_case "Reservation log" "examples/reservation-log.json"
post_case "Callback log" "examples/callback-log.json"
