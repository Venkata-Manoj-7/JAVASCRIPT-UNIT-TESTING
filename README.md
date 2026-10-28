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