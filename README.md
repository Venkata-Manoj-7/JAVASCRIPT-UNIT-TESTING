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


## Board Actions: Card Creation & Filtering

Spec: e2e/launchpad-board-actions.spec.js

Test vs 	What it verifies
User can open the LaunchPad project board directly:
         Opening the project from the repository projects page lands on the board URL (/projects/71).

User can filter board cards by typing a keyword:
 	Typing a keyword into the board filter keeps the value in the box and shows matching cards.

User can create a new card on the board:
 	A new card/issue is created from the board and appears in the list.



Spec: e2e/launchpad-sidepanel-transitions.spec.js

Test   vs 	What it verifies
User can open a card to see its details and close it again	:
     Clicking a card heading opens the side panel (URL contains pane=issue and itemId=); pressing Escape closes it.

User can change a card status from its side panel:

    Opening the Status menu and choosing an option updates the status shown on the card.

How it works

openFirstCard() finds the first enabled card on the board and clicks its heading.
changeStatus(statusName) opens the Status dropdown and picks the matching option, whether GitHub renders it as an option, menuitemradio or menuitem.
closeSidePanel() presses Escape.
The target status (launchpad.targetStatus, default "In Progress") and the URL patterns (issuePaneUrlPattern, issueItemIdUrlPattern) live in testData.json.

