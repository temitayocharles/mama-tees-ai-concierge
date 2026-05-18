# Capstone Brief Requirements and Audit Matrix

This document is the repository source of truth for the TS Academy capstone brief: **AI-Powered Business Concierge for Mama Tee's Kitchen**.

It exists so another developer, reviewer, or future ChatGPT session can continue the project without relying on prior chat context.

## 1. Project title

```text
AI-Powered Business Concierge for Mama Tee's Kitchen
```

## 2. Client and business problem

Client: Mrs. Teniola Adeyemi, owner of Mama Tee's Kitchen, a fast-casual Nigerian restaurant in Abuja.

Problem:

- The restaurant loses customers because calls are missed during busy hours.
- Customers call to ask about menu, prices, closing time, delivery, orders, and reservations.
- When the line is busy or unanswered, some customers do not come back.

Required outcome:

- A working voice assistant that handles calls automatically.
- The assistant must answer accurately and avoid confusing customers.
- The solution does not need to be visually fancy; it must work reliably.

## 3. Required solution capabilities

The solution must cover four areas:

| Area | Requirement |
|---|---|
| Voice assistant | Answer live calls and respond audibly in the demo. |
| Knowledge base | Answer from approved restaurant facts, menu, pricing, delivery rules, reservation rules, and FAQs. |
| Data capture | Collect structured order, reservation, callback, complaint, catering, or inquiry details. |
| Visible log | Route captured data to a visible place such as Google Sheets or a dashboard. |

## 4. Restaurant profile

```text
Name: Mama Tee's Kitchen
Type: Fast-casual Nigerian restaurant
Location: 14 Adetokunbo Ademola Crescent, Wuse 2, Abuja, FCT
Phone: 0812 345 6789
Instagram: @mamateeskitchen
Food policy: Home-style Nigerian meals made fresh daily; no frozen ingredients.
```

## 5. Opening hours

| Day | Hours |
|---|---|
| Monday to Friday | 8:00am to 9:00pm |
| Saturday | 9:00am to 10:00pm |
| Sunday | 11:00am to 7:00pm |
| Public holidays | Open unless announced otherwise on Instagram |

## 6. Menu and prices

### Rice dishes

| Item | Price |
|---|---:|
| Jollof Rice, small | ₦1,500 |
| Jollof Rice, large | ₦2,500 |
| Fried Rice, small | ₦1,500 |
| Fried Rice, large | ₦2,500 |
| White Rice and Stew | ₦1,500 |
| Coconut Rice | ₦2,000 |

### Swallow and soup

| Item | Price |
|---|---:|
| Eba and Egusi Soup | ₦2,000 |
| Eba and Ogbono Soup | ₦2,000 |
| Eba and Bitterleaf Soup | ₦2,000 |
| Pounded Yam and Egusi Soup | ₦2,500 |
| Pounded Yam and Ogbono Soup | ₦2,500 |
| Amala and Ewedu with Gbegiri | ₦2,000 |
| Wheat and Oha Soup | ₦2,500 |

### Proteins

| Item | Price |
|---|---:|
| Chicken, 1 piece | ₦1,000 |
| Turkey, 1 piece | ₦1,500 |
| Beef, 4 pieces | ₦1,000 |
| Fish, 1 piece | ₦1,200 |
| Goat Meat, 4 pieces | ₦1,500 |
| Ponmo, 3 pieces | ₦500 |
| Shaki | ₦800 |

### Small chops and snacks

| Item | Price |
|---|---:|
| Puff Puff, 10 pieces | ₦800 |
| Moi Moi, 1 wrap | ₦600 |
| Akara, 5 pieces | ₦500 |
| Peppered Gizzard, 5 pieces | ₦1,500 |
| Peppered Chicken Wings, 4 pieces | ₦2,000 |
| Peppered Fish | ₦1,500 |

### Takeaway soups, per litre

| Item | Price |
|---|---:|
| Egusi Soup | ₦3,500 |
| Ogbono Soup | ₦3,500 |
| Bitterleaf Soup | ₦3,500 |
| Oha Soup | ₦4,000 |
| Ewedu and Gbegiri | ₦3,000 |

### Drinks

| Item | Price |
|---|---:|
| Coke, Fanta, Sprite, 50cl | ₦400 |
| Malt | ₦500 |
| Bottled Water, 50cl | ₦200 |
| Zobo, 500ml | ₦600 |
| Kunu, 500ml | ₦600 |
| Chapman | ₦800 |

## 7. Specials

| Special | Rule |
|---|---|
| Friday Catfish Pepper Soup with Agidi | ₦3,500 per portion. Available Fridays from 12pm until finished. No advance orders. First come, first served. |
| Sunday Family Meal Deal | 2 large Jollof Rice, 2 chicken pieces, 1 moi moi, and 2 drinks for ₦7,000. |

## 8. Delivery rules

| Rule | Requirement |
|---|---|
| Delivery days | Monday to Saturday only |
| Delivery hours | 10:00am to 7:00pm |
| Sunday delivery | Not available |
| Minimum delivery order | ₦3,000 |
| Delivery time | 30 to 60 minutes depending on traffic |
| Ordering channel | Phone or WhatsApp |
| Third-party apps | Not used |
| Payment | Must be made before dispatch |

Delivery areas and fees:

| Area group | Fee |
|---|---:|
| Wuse 2, Maitama, Asokoro, Central Area | ₦500 |
| Garki, Utako, Jabi, Wuse 1 | ₦800 |
| Gwarinpa, Lugbe, Kubwa, Karu, Nyanya | ₦1,200 |

## 9. Payment rules

| Method | Rule |
|---|---|
| Cash | Accepted |
| Bank transfer | Accepted |
| Bank | GTBank |
| Account name | Mama Tee's Kitchen |
| Account number | 0123456789 |
| Delivery orders | Payment before dispatch |
| Walk-in customers | Payment at counter before food is served |

## 10. Reservation rules

| Rule | Requirement |
|---|---|
| Minimum group size | 5 or more |
| Advance notice | At least 24 hours |
| Deposit | ₦5,000 |
| Deposit handling | Goes toward the total bill |
| Fewer than 5 guests | Walk-in only |

## 11. Frequently asked questions

| Question area | Approved answer |
|---|---|
| Customization | Customers may request extra pepper, no pepper, no onions, or extra sauce. Customization is not guaranteed during very busy hours. |
| Catering | Catering is available for office meetings, parties, and small weddings. Catering orders must be placed at least 5 days in advance. Customers should call or WhatsApp to discuss menu and pricing. |
| Kids menu | There is no separate kids menu, but smaller rice portions can be served for children. |
| Halal | All meat is halal. |
| Seating | Indoor seating is available for up to 40 people. |
| Pickup | Customers can call or WhatsApp to order ahead for pickup. |
| Complaints | Customers should speak to staff or ask for the manager on duty. The assistant should log complaints for follow-up if needed. |

## 12. Order data capture requirements

For orders, the assistant must collect:

- Customer name.
- Phone number.
- Order details.
- Pickup or delivery preference.
- Delivery address if delivery.
- Delivery area if delivery.
- Confirmation summary before ending the call.

Implementation mapping:

| Requirement | Repository implementation |
|---|---|
| Collect order details | `prompts/voice-agent-system-prompt.md` and `src/types.ts` |
| Validate delivery rules | `src/domain/businessRules.ts` |
| Log structured data | `src/routes/callLogs.ts` and `src/services/googleSheets.ts` |
| Visible log | Google Sheet `1TYO9pj59qYfBeExiKLVYuvD9QB1jSFAhFb5rGBv4mB8` |

## 13. Reservation data capture requirements

For reservations, the assistant must collect:

- Customer name.
- Phone number.
- Number of guests.
- Date.
- Time.
- Special notes, if any.
- Confirmation summary before ending the call.

Implementation mapping:

| Requirement | Repository implementation |
|---|---|
| Minimum 5 guests | `src/domain/businessRules.ts` |
| At least 24 hours in advance | `src/domain/businessRules.ts` |
| Deposit statement | `prompts/voice-agent-system-prompt.md` |
| Structured logging | `src/routes/callLogs.ts` |

## 14. Fallback and callback requirements

If the assistant cannot handle a request:

1. It must tell the customer that someone will call them back.
2. It must collect and log the callback request.

Required callback fields:

- Customer name.
- Phone number.
- Callback reason.

Implementation mapping:

| Requirement | Repository implementation |
|---|---|
| Fallback wording | `prompts/voice-agent-system-prompt.md` |
| Callback schema | `src/types.ts` |
| Callback example | `examples/callback-log.json` |
| Logging endpoint | `POST /api/call-logs` |

## 15. Submission requirements

The group must submit:

- A Loom video link.
- Screenshots of the build.
- Both must be submitted together.

The Loom video must show:

- A live call to the agent.
- The assistant responding correctly and audibly.
- The assistant being tested.
- The captured information appearing in the visible log.

A submission without a Loom link is incomplete.

## 16. Acceptance tests for demo readiness

Run these before recording:

| Test | Expected result |
|---|---|
| Ask opening hours | Assistant gives weekday, Saturday, and Sunday hours correctly. |
| Ask price of large Jollof Rice, chicken, and Malt | Assistant answers ₦2,500 + ₦1,000 + ₦500 = ₦4,000. |
| Place delivery order to Wuse 2 | Assistant collects name, phone, order, address, delivery area, applies ₦500 fee, confirms payment before dispatch, and logs the row. |
| Ask for Sunday delivery | Assistant says Sunday delivery is unavailable and offers pickup/walk-in. |
| Request reservation for 4 guests | Assistant says reservations require 5 or more guests and does not create a reservation. |
| Request valid reservation for 6 guests | Assistant collects name, phone, date, time, notes, mentions ₦5,000 deposit, confirms, and logs. |
| Ask unknown question | Assistant logs a callback request instead of inventing an answer. |

## 17. Current selected implementation stack

The selected stack is:

```text
Retell AI phone agent
→ ElevenLabs custom voice
→ Node.js backend API
→ Google Sheets visible log
→ n8n optional fallback or extension
→ Composio optional connector enhancement
```

Vapi is not required by the capstone brief and is only an alternative voice platform.

## 18. Audit checklist for any future project handoff

Before considering the project complete, verify:

- The repo contains this requirements document.
- The deployed backend responds on `/healthz`.
- `POST /api/call-logs` requires `X-Webhook-Secret`.
- Google Sheet is writable from the backend or n8n workflow.
- Retell or selected voice platform uses the current prompt.
- ElevenLabs custom voice is connected or an approved fallback voice is selected.
- At least one order, one reservation, and one callback test row appear in Google Sheets.
- Loom video shows live voice behavior and visible log update.
- Screenshots show the build, not only the final result.
