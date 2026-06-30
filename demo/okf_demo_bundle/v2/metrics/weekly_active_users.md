---
type: Metric
title: Weekly Active Users
description: Distinct active users in a trailing window.
resource: https://example.com/metrics/weekly_active_users
tags: [growth, kpi]
timestamp: '2026-06-01T00:00:00+00:00'
fact:
  subject: Weekly Active Users
  predicate: DEFINED_AS
  object: trailing 28-day distinct users
  statement: Weekly Active Users is defined as trailing 28-day distinct users.
---

# Definition

Weekly Active Users (WAU) is the count of distinct users with at least one session
in the **trailing 28 days**. Redefined in June 2026 to align with the monthly cohort.
