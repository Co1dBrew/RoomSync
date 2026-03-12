# RoomSync – Design Document

## 1. Project Description

RoomSync is a web application designed for people living together to **coordinate household chores** and **track shared expenses**. Many roommates rely on informal systems (texts, sticky notes, spreadsheets) that are error-prone and lead to frustration. RoomSync provides a centralised, easy-to-use platform where everyone can see what needs to be done and who owes what.

### Core Features

- **Chore Board** – Create chores with titles, descriptions, due dates, and priority levels. Assign them to roommates and track completion status (pending → in-progress → completed).
- **Expense Tracker** – Record shared expenses, indicate who paid, specify how costs are split, and categorise spending (groceries, utilities, rent, etc.).
- **Dashboard** – An at-a-glance overview showing total/pending chores, expense totals, and recent activity.

---

## 2. User Personas

### Persona 1: Alex – The Organiser

- **Age:** 22, college senior
- **Living Situation:** Shares a 3-bedroom apartment with two roommates
- **Pain Points:** Constantly has to remind roommates about chores; feels like the "house manager"
- **Goals:** Wants a fair, transparent chore rotation system so no one can claim ignorance
- **Tech Comfort:** High – uses apps for everything

### Persona 2: Jasmine – The Budget-Conscious Roommate

- **Age:** 25, early-career professional
- **Living Situation:** Lives with one roommate in a city apartment
- **Pain Points:** Never sure who paid for what last; awkward money conversations at month's end
- **Goals:** Wants a clear expense log that shows who owes whom and for what
- **Tech Comfort:** Moderate – uses web apps but prefers simplicity

### Persona 3: Marcus – The Busy Student

- **Age:** 20, college sophomore
- **Living Situation:** Dorm-style housing with three suitemates
- **Pain Points:** Forgets chores because of a packed schedule; hates being nagged
- **Goals:** Wants quick visibility into what he needs to do today without reading through a long chat thread
- **Tech Comfort:** High – mobile-first but fine with web apps

---

## 3. User Stories

### Chore Management

1. **As Alex**, I want to **create a chore and assign it to a specific roommate** so that responsibilities are clearly divided.
2. **As Marcus**, I want to **see a list of chores assigned to me** so that I know what I need to do without being reminded verbally.
3. **As Alex**, I want to **mark a chore as completed** so that everyone can see it's done.
4. **As Jasmine**, I want to **edit a chore's details** (e.g. change the due date) in case plans change.
5. **As Marcus**, I want to **delete a chore** that is no longer relevant (e.g. moved-out roommate's task).

### Expense Tracking

6. **As Jasmine**, I want to **log a shared expense** (e.g. grocery run) so that we have an accurate record.
7. **As Alex**, I want to **see a table of all expenses** sorted by date so that I can review the household spending.
8. **As Jasmine**, I want to **edit an expense** if I made a mistake entering the amount.
9. **As Marcus**, I want to **delete an expense** that was logged in error.
10. **As Jasmine**, I want to **see a total spending summary on the dashboard** so I can quickly check how much we've spent.

### Dashboard

11. **As Alex**, I want to **see at-a-glance counts** of total and pending chores so I know the household workload.
12. **As Marcus**, I want to **view recent chores and expenses** on the dashboard without navigating to separate pages.

---

## 4. Design Mockups

### 4.1 Dashboard

```
┌──────────────────────────────────────────────────────────┐
│  🏠 RoomSync         [Dashboard] [Chores] [Expenses]     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ 📋       │ │ ⏳       │ │ 💰       │ │ 🧾       │    │
│  │ Total    │ │ Pending  │ │ Total    │ │ Expense  │    │
│  │ Chores   │ │ Chores   │ │ Expenses │ │ Count    │    │
│  │   124    │ │    37    │ │ $4,521   │ │   89     │    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
│                                                          │
│  Recent Chores                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Vacuum living room                      Alice      │  │
│  │ Clean bathroom                          Bob        │  │
│  │ Take out trash                          Charlie    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  Recent Expenses                                         │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Weekly groceries                       $82.50      │  │
│  │ Electric bill                         $120.00      │  │
│  │ Internet bill                          $65.00      │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### 4.2 Chore List

```
┌──────────────────────────────────────────────────────────┐
│  🏠 RoomSync         [Dashboard] [Chores*] [Expenses]    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Chores                               [+ New Chore]      │
│                                                          │
│  ┌─────────────────┐  ┌─────────────────┐                │
│  │ Vacuum living   │  │ Clean bathroom  │                │
│  │ room            │  │                 │                │
│  │ ⚡ pending  med │  │ ✅ completed hi │                │
│  │ → Alice         │  │ → Bob           │                │
│  │ Due: 2026-03-15 │  │ Due: 2026-03-12 │                │
│  │ [Edit] [Delete] │  │ [Edit] [Delete] │                │
│  └─────────────────┘  └─────────────────┘                │
└──────────────────────────────────────────────────────────┘
```

### 4.3 Chore / Expense Form

```
┌──────────────────────────────────────────────────────────┐
│              New Chore / Edit Chore                       │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Title        [___________________________]         │  │
│  │ Description  [___________________________]         │  │
│  │ Assigned To  [________]  Due Date [__________]     │  │
│  │ Status       [pending ▾]  Priority [medium ▾]      │  │
│  │                                                    │  │
│  │           [  Create  ]   [  Cancel  ]              │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### 4.4 Expense Table

```
┌──────────────────────────────────────────────────────────┐
│  🏠 RoomSync         [Dashboard] [Chores] [Expenses*]    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Expenses                           [+ New Expense]      │
│                                                          │
│  ┌──────────────┬────────┬────────┬─────────┬─────────┐  │
│  │ Description  │ Amount │ Paid   │ Category│ Date    │  │
│  ├──────────────┼────────┼────────┼─────────┼─────────┤  │
│  │ Groceries    │ $82.50 │ Alice  │ grocery │ 03/10   │  │
│  │ Electric     │$120.00 │ Bob    │ utility │ 03/01   │  │
│  │ Netflix      │ $15.99 │Charlie │ entert  │ 03/05   │  │
│  └──────────────┴────────┴────────┴─────────┴─────────┘  │
└──────────────────────────────────────────────────────────┘
```
