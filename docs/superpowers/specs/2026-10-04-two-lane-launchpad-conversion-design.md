# Two-Lane Launchpad Conversion Design

Date approved: 2026-10-04

## Objective

Polish the existing global Remote Mom's Launchpad before increasing Facebook and Instagram content output. The Launchpad will serve two audiences equally: mothers seeking suitable remote work and mothers already working remotely who want a more sustainable work-family setup.

The work must improve conversion readiness without creating separate products, separate landing pages, new social profiles, email automation, payments, or new RemoteMoms mobile-app features.

## Audience Lanes

### Lane 1: Find Remote Work

This lane serves mothers who are:

- Looking for their first remote role
- Returning after a career break
- Changing career direction
- Exploring work that may fit family responsibilities

The Launchpad helps them assess role fit, identify transferable skills, evaluate schedule compatibility, verify opportunities, and create a focused application routine. It does not promise employment, income, flexibility, or safety.

### Lane 2: Manage Remote Life

This lane serves mothers who already work remotely or in a hybrid arrangement and want better routines, boundaries, daily planning, and work-family balance.

The Launchpad helps them assess whether their current setup fits family responsibilities and identify practical improvements. The RemoteMoms mobile beta may appear as an optional secondary step for mothers who want help managing their daily mental load.

## Account Strategy

Use Vanessa's existing Facebook and Instagram accounts during the initial validation cycle. Content should be clearly categorized by audience lane, but dedicated RemoteMom business profiles must not be created until engagement and conversion evidence supports that additional operational work.

## Funnel Architecture

Use one global English-language funnel:

1. A Facebook or Instagram post introduces one audience-specific problem.
2. The post sends the visitor to the existing `/launchpad/` page with UTM parameters.
3. The page explains the shared Launchpad promise and lets the visitor recognize their current stage.
4. The visitor submits name, email, biggest challenge, and current stage.
5. The existing lead endpoint confirms collection before redirecting the visitor.
6. The visitor reaches `/launchpad/download/` and downloads the single global Starter Kit.
7. The download page presents a relevant next step, including an optional RemoteMoms beta invitation without competing with the Starter Kit.

The two products must remain distinct:

- Remote Mom's Launchpad supports remote-career direction and sustainable remote-work practices.
- RemoteMoms is the local-first mobile app for managing the daily mental load of work and family responsibilities.

## Landing Page Structure

### Hero

The hero must communicate one promise that covers career direction and sustainable remote work. It must identify both aspiring and current remote-working mothers, provide one primary `Get the Free Starter Kit` call to action, and omit mobile-app promotion.

### Current-Stage Recognition

The page must display four recognizable stages:

- Looking for my first remote role
- Returning after a career break
- Already working remotely
- Exploring what would work for my family

These stages are positioning choices within one funnel, not separate offers or landing pages.

### Benefits

The page must explain that the Starter Kit helps a reader:

- Identify realistic role options
- Translate existing experience into useful skills
- Check whether a work arrangement fits family responsibilities
- Evaluate opportunities more safely
- Improve work-from-home boundaries and routines
- Create a focused seven-day action plan

### Contents Preview

The page should describe the actual worksheets and may show two or three representative page previews. Preview assets must remain readable on mobile and must not imply results that have not been demonstrated.

### Trust And Expectations

The page must state that the resource is educational, makes no employment or income guarantee, and cannot guarantee that an opportunity is legitimate or safe. Readers should verify opportunities and consult relevant official authorities or consumer-protection resources in their country.

The page must explain how submitted contact information is used. It must not promise automated email delivery or unsubscribe functionality until email automation exists.

### Signup Form

Keep the existing name, email, and biggest-challenge fields. Add a required current-stage field with these stable values:

- `looking-for-remote-work`
- `returning-after-career-break`
- `already-working-remotely`
- `exploring-both`

Continue capturing `utm_source`, `utm_medium`, and `utm_campaign` as bounded hidden attribution values.

### Download Page

The download page must provide immediate access to the Starter Kit, recommend a clear first exercise, link to Vanessa's existing Facebook and Instagram accounts, and present the RemoteMoms Android beta as an optional secondary action. The beta invitation must not replace or obscure the download action.

## Starter Kit Structure

Maintain one global Starter Kit and balance it with three clearly marked paths:

### Career Path

- Role-fit assessment
- Transferable-skills translation
- Schedule compatibility
- Opportunity verification
- Focused application routine

### Remote-Life Path

- Current work-arrangement fit
- Work and family boundaries
- Daily planning
- Family interruptions and transition points
- Sustainable routines

### Shared Seven-Day Action Plan

Readers choose the exercises relevant to their current stage. They are not expected to complete every worksheet. Existing global safety language remains, and the historical Philippines research materials remain unchanged as regional evidence.

## Data Flow And Compatibility

The existing architecture remains:

- Static `/launchpad/` and `/launchpad/download/` pages
- `/api/launchpad-lead` Vercel endpoint
- Google Apps Script webhook routing
- `Launchpad Leads` Google Sheet destination
- Local browser backup on collection failure
- UTM attribution

Add `currentStage` to the lead payload and a `Current Stage` column to new Google Sheet records. The endpoint must validate new form submissions against the four stable values. The Apps Script must continue accepting historical lead payloads that lack `currentStage`, writing an empty stage value for them so existing submissions remain compatible.

Do not collect precise location, child details, employer details, health or medicine information, or other sensitive family content.

## Failure Behavior

- Missing or invalid required values produce clear inline form feedback.
- Unknown current-stage values are rejected by the endpoint.
- A failed endpoint or webhook request preserves the local browser backup.
- The visitor is redirected only after confirmed server-side collection.
- Download access and historical leads remain usable.
- Failure messages must be calm and must not claim that an unconfirmed lead was saved remotely.

## Content Relationship

After conversion readiness is verified, Facebook and Instagram content will use two equal lanes:

- Career posts direct readers to the Starter Kit.
- Work-family balance posts may direct readers to the Starter Kit or, when specifically relevant, the RemoteMoms beta.
- Research posts ask for a comment, vote, save, or answer rather than combining multiple calls to action.

Each post has one primary call to action. Performance must be reviewed separately by platform and audience lane.

## Measurement

Track only privacy-safe funnel and content information:

- Submission date
- Platform and UTM campaign source
- Current-stage segment
- Biggest-challenge selection
- Starter Kit signup
- Voluntary app-beta interest where available
- Post reach, saves, shares, comments, profile visits, link clicks, and signups

Initial 30-day learning thresholds are:

- At least 10 qualified Starter Kit signups
- Responses from both audience lanes
- At least 30 percent form completion among visitors who reach the form, when the platform data needed to calculate this is available
- One repeated stage or challenge signal strong enough to guide the next content cycle
- At least three voluntary expressions of app-beta interest or repeated work-family pain
- No unresolved form, download, attribution, or collection failure

These are learning thresholds, not proof of product-market fit.

## Verification Requirements

Implementation verification must cover:

- Mobile and desktop layouts
- Keyboard operation and accessible form labeling
- All four current-stage values
- Rejection of unknown current-stage values
- Backward compatibility with older payloads
- Google Sheet header and row routing
- Facebook and Instagram UTM preservation
- Confirmed submission redirect and PDF download
- Local backup behavior during submission failure
- Complete PDF rendering, readable text, and accurate links
- Focused tests, full available tests, type checking, and the available production build

## Documentation Impact

Update the existing documents rather than creating competing project sources:

- `docs/Validation_Collection_Setup.md` for the payload and sheet schema
- `docs/RemoteMom_Project_Checklist.md` for change history and status
- `docs/RemoteMom_Product_Brief_Roadmap.md` if the current strategic recommendation or Phase 4 status changes

## Out Of Scope

- Separate landing pages for each audience lane
- New Facebook or Instagram business profiles
- Remote job listings or career coaching services
- Email sequences or newsletter automation
- Payments, subscriptions, or premium gating
- Firebase Auth, Firestore, cloud backup, or partner sharing
- New RemoteMoms mobile-app features
- Collection of sensitive family, child, employer, or medicine data

## Decision Rule

The Launchpad polish is complete when both audience lanes can recognize themselves, submit a measurable stage selection, receive the balanced Starter Kit, and reach an accurate next step through one reliable global funnel.
