# Task 1: End-to-End Playwright Authentication & Setup

## Overview
This branch establishes the baseline Playwright test automation framework, session persistence mechanism, Page Object Model (POM) service abstraction, and Git repository hygiene for GitHub authentication flows.

It resolves session regeneration overhead by storing authenticated browser cookies/storage states (`.auth/user.json`) and validates login form rendering, invalid login error handling, and valid credential flows.

---

## Architecture & File Structure

```text
javascript-testing-starter/
├── .env.example                # Template for required environment variables (committed)
├── .gitignore                  # Git hygiene excluding secrets and build outputs
├── package.json                # Project dependencies and test scripts
├── playwright.config.js        # Global Playwright configuration & project setup
├── README.md                   # Branch documentation and run instructions
└── e2e/
    ├── fixtures/
    │   └── testData.json       # Test boundary inputs, negative payloads, and static URLs
    ├── auth-service.js         # Page Object Model encapsulating GitHub sign-in locators
    ├── auth.flow.spec.js       # E2E test specs using Playwright native test runner
    └── auth.setup.js           # Authentication setup script handling 2FA & session capture

#  GitHub Launchpad E2E Automation Suite

An automated end-to-end testing suite built with [Playwright](https://playwright.dev/) and JavaScript, verifying the GitHub Launchpad dashboard, repository filtering, board card interactions, and DOM edge cases using the Page Object Model (POM) architecture.

---

## Architecture & Design Patterns

* **Page Object Model (POM):** UI selectors and user actions are encapsulated inside `e2e/launchpad-service.js` to ensure decoupling between test logic and DOM implementation.
* **Resilient Locators:** Locators use `:visible` pseudo-classes and `.or()` fallbacks to handle responsive DOM differences (desktop vs. mobile/responsive drawer layouts) without flaky timeouts.
* **Session State Persistence:** Tests reuse pre-authenticated state saved in `playwright/.auth/user.json` via Playwright's `storageState`, eliminating repetitive UI logins during test execution.
* **Decoupled Test Data:** All URLs, regex patterns, positive query strings, and negative empty-state assertions are externalized in `e2e/fixtures/testData.json`.
* **DRY Test Lifecycle:** Standardized `test.beforeEach` hooks handle service instantiation, dashboard navigation, and page readiness.

---

## Project Structure

```text
.
├── .env.example
├── e2e/
│   ├── fixtures/
│   │   └── testData.json                 # Externalized test strings & route regexes
│   ├── launchpad-board-actions.spec.js   # Board card search & DOM filtering specs
│   ├── launchpad-flow.spec.js            # Main dashboard navigation & filter specs
│   └── launchpad-service.js              # Page Object Model class (LaunchpadService)
├── playwright/
│   └── .auth/
│       └── user.json                     # Session storage state (Git-ignored)
├── package.json
├── playwright.config.js
└── README.md