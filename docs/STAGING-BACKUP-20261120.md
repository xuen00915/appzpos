# Staging backup — 20 November 2026

This branch is a recovery snapshot of the local workspace, including staging forms, measurement safeguards, CSS, images, tests, design references and deployment notes. It is not a production migration or a merge into main. Production hosting and DNS were not changed by this backup.

## Downloadable recovery files

Release: https://github.com/xuen00915/appzpos/releases/tag/staging-backup-20261120

- `staging-deployment-history.tar.gz`: complete local deployment-history directory, including deployment packages, rollback entries, source snapshots, QA scripts and evidence.
- `tested-staging-source.tar.gz`: UI source used for the tested API-domain staging build, including assets; generated output and dependencies excluded.
- `deployment-files.json`: per-file SHA-256 hashes and sizes for deployment history.
- `SHA256SUMS`: hashes of the attached archives and manifests. Verify with `shasum -a 256 -c SHA256SUMS` after downloading all assets.
- `scan.json`: credential-pattern scan summary. Pattern scanning is not a guarantee against every possible sensitive value.

## Source distinctions

This branch starts at local commit `6a1e1cf` and captures all outstanding local project work. It includes a draft Singapore landing page that was excluded from the tested deployment. The tested-source archive records that deployed build's source separately. Newer main-branch work remains in GitHub history; do not replace main with this snapshot without reconciling differences. API-domain PR #29 is separate and was still open when this backup was prepared.

## Current staging and restoration

Latest recorded staging entry is `/_forms-review-20261113/site.html`, referencing `main.29755e39b3f92626.js`. API-domain rollback entry is `/_forms-review-20261113/site.pre-api-domain-20261120.html`; previous hashed assets are retained. See `AGENTS.md` and the archived `20261120-api-domain` directory for package and verification details. Earlier dated directories contain the preceding rollback packages.

Before any remote restoration, recheck DNS and verify Vodien IP `101.100.228.105`, cPanel user `appzgate`, absolute root `/home2/appzgate/public_html/appzpos.com`, and staging hostname `website.appzpos.com`. Stop if routing has changed or the target is ambiguous. Restore only the intended namespaced entry/assets; preserve the root fallback and staging-only routing. A rollback can restore the saved entry as the namespaced `site.html` while retaining its referenced assets. Do not blindly extract the whole history into the web root.

The backend remains shared with production. Mock APIs and block analytics during verification; no real test enquiries. Hostname-specific routing and measurement must be reconciled before any future production migration. These archives are project/staging deployment recovery files, not a full cPanel account, production server, database, mailbox or DNS backup. They do not contain hosting credentials.

Dependencies, caches, Git internals and transient preview-server session state are excluded. Reinstall dependencies using the archived package lock. The tested-source archive supplies the build source; deployment history preserves the actual incremental packages and their HTML overrides. Keep both for recovery.
