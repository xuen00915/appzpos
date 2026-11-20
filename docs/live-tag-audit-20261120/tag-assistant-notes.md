# Tag Assistant observations — 20 November 2026

Read the user-opened Connected session for https://www.appzpos.com/ without clicking live contact links or submitting forms.

Detected GTM-N7VKTGG, AW-791515048, G-681EVHYGDY and G-JW8VE6FEP3. APPZPOS GA4 G-681EVHYGDY showed Page View under Hits Sent. Appzgate G-JW8VE6FEP3 showed no hits sent. Ads output showed homepage conversion, Page View and Remarketing entries.

The account cannot inspect internal GTM container tags in Tag Assistant (access-denied message). Independently fetched the publicly delivered GTM resource: version 26. Isolated Playwright checks use the current live GTM/gtag scripts, intercept collection requests before transmission, block backend APIs and prevent contact-link navigation. No form-submission tests performed in this audit.

Ads requests are observed at both /pagead/conversion/791515048/ and /ccm/conversion/791515048/ for a single conversion command. Count logical commands and destinations, not raw transport requests, when assessing duplicate browser triggers. Backend Google Ads processing/reporting was not independently verified.

An initial unpinned browser run encountered a transient connection timeout after homepage. The completed audit pins both live hostnames to their independently verified current DNS destination 101.100.228.105 while preserving hostname and normal TLS validation. This avoids stale DNS during the recent cutover.
