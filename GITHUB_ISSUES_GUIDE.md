# GITHUB_ISSUES_GUIDE.md

Purpose: keep project execution organized through GitHub Issues, with consistent updates from AI dev agents.

Use this guide at the start of every new AI chat.

---

## Operating principles
- Work is issue-driven: no meaningful code task should happen without a related issue.
- Keep issue state current in real time, not only at the end.
- Prefer small, clear issues over large vague ones.
- Every issue must explain **why**, **what**, and **done criteria**.
- Every PR/commit must be traceable to at least one issue.

---

## Required behavior for AI dev agents

When an AI agent starts a task, it must do the following in order:

1. **Check existing issues first**
   - Search open issues for the feature/bug/topic.
   - Reuse an existing issue when scope matches.
   - Create a new issue only when no good match exists.

2. **Create issue (if missing) before major implementation**
   - Clear title with prefix:
     - `feat: ...`
     - `fix: ...`
     - `chore: ...`
     - `docs: ...`
     - `refactor: ...`
   - Include:
     - Context/problem
     - Goal/outcome
     - Scope (in/out)
     - Acceptance criteria checklist
     - Risks/notes (if relevant)
   - Assign milestone if one exists.

3. **Move issue to In Progress**
   - Add/update labels (example: `frontend`, `bug`, `priority:high`).
   - Post a short “starting now” comment with planned approach.

4. **Update issue during work**
   - Comment when:
     - scope changes
     - blocker appears
     - important technical decision is made
   - Keep updates concise and objective.

5. **Link code changes to issue**
   - Reference issue number in commit and/or PR body.
   - Preferred close keywords in PR or commit:
     - `Closes #<id>`
     - `Fixes #<id>`
   - If not completed, use:
     - `Refs #<id>`

6. **Close issue only when done criteria are met**
   - Confirm acceptance checklist is complete.
   - Add final comment with:
     - what was delivered
     - test/validation summary
     - follow-up items (if any)

---

## Standard issue template (copy/paste)

```md
## Summary
<What problem are we solving and why now?>

## Goal
<What should be true when this is done?>

## Scope
- In scope:
  - ...
- Out of scope:
  - ...

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Notes / Risks
- ...
```

---

## Standard progress comment template

```md
Status: In Progress

Plan:
1. ...
2. ...
3. ...

Notes:
- ...
```

---

## Standard completion comment template

```md
Implemented:
- ...
- ...

Validation:
- ...

Follow-ups:
- ...
```

---

## Milestone discipline
- Every issue should belong to a milestone whenever possible.
- Milestones should represent outcomes, not technical layers.
- Keep milestone names short and time-bounded (example: `M1 - Landing + Navigation`).
- If a task grows beyond scope, split it into a new issue and move extra scope there.

---

## Label discipline (recommended baseline)
- Type: `feature`, `bug`, `chore`, `docs`, `refactor`
- Area: `frontend`, `backend`, `infra`, `ui-ux`
- Priority: `priority:high`, `priority:medium`, `priority:low`
- Status: `blocked`, `needs-info`

Keep labels limited and consistent.

---

## PR and issue linking rules
- PR description must include:
  - summary bullets
  - test plan checklist
  - issue links (`Closes #...` or `Refs #...`)
- Do not open a PR without linking issue(s), except for emergency hotfixes.

---

## End-of-session checklist (agent must perform)
- [ ] Created or reused the right issue
- [ ] Updated issue status/comments with current progress
- [ ] Linked commits/PR to issue
- [ ] Checked acceptance criteria and updated checklist
- [ ] Closed issue if complete, or left clear next steps if not

---

## Quick command examples (gh CLI)

```bash
# Find related open issues
gh issue list --state open --search "navbar mobile"

# Create new issue
gh issue create --title "feat: improve mobile navbar accessibility" --body "<template content>"

# Comment progress
gh issue comment 123 --body "Status: In Progress. Implementing keyboard support and focus trap."

# Close when done
gh issue close 123 --comment "Completed and verified in local testing. Closes with PR #45."
```

---

## Non-negotiables
- No silent scope changes.
- No “done” claims without validation notes.
- No merged PR without linked issue.
- No stale issues: update status before ending a work session.

