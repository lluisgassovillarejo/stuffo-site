# Organic promotion infrastructure

This website participates in the shared Wend, Repack, Stuffo and Speedometer
organic pilot. App behavior and app analytics remain unchanged.

`promotion.js` loads GA4 `G-BM9YLMXLXG` only after explicit website analytics
consent. The shared property is `559819633` and the web stream is `16167942108`.
Advertising signals and enhanced measurement are disabled. Each event carries
`app_id`, `content_id` and `page_type`; Play clicks also carry button placement.
URLs sent to analytics exclude query strings and fragments. Known campaign
sources are allowlisted. Feedback, budget input values and contact details are
not sent to GA4. The calculator emits only a successful-use action.

The shared form is linked from every page. Responses are private; optional
contact details are used only when a respondent requests contact. The question
about the app is mandatory and editable. No sign-in is required to respond.

The comparison set is the homepage, `first-three-envelopes.html`,
`budget-by-paycheck.html`, `sinking-funds.html` and `about.html`. Existing guides,
the worksheet, calculator and app demonstration remain available.

Use `?promotion_test=1` for visual checks without sending analytics, even after
opting in. Owner setup tests are excluded from the comparison period.

The common measurement clock remains off until all four websites are verified
live. The launch register, weekly discovery and intent data, and feedback triage
are in the private workbook:

https://docs.google.com/spreadsheets/d/1TrINq6CTtn6LJ6psD01FJPdCzYVhdfxmYgk5iNPYHCE/edit
