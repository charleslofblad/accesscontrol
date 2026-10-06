# The Mandate Model

### From Behörighetsresan@SJ to a Unified Identity Governance Framework

**Whitepaper · Version 0.4 · 2026**

> **Identity can persist. Authority can change.
> The Mandate Model is the language between them.**

**Charles Löfblad · Markus Smed**

---

## Overview

The Mandate Model did not begin as an academic theory.

It began with a practical enterprise question that emerged during real access-governance work at **SJ**:

> **Who owns the lifecycle of Identification and Authorization?**

What started as an attempt to unify physical keys, access cards and digital permissions revealed a broader governance problem.

The technology existed.

**The missing piece was a shared conceptual language across HR, IT, Security, Facilities and business ownership.**

That observation became **Behörighetsresan@SJ** — a process-first description of how authorization follows people through onboarding, role changes, temporary assignments, project work and offboarding.

As the work matured, a second insight emerged:

> **The real object being transferred is not permission. It is authority.**

The Mandate Model proposes that trusted identities do not receive access directly. Organizations govern authority through a **Mandate** connecting:

**Identity · Organization · Role · Mandate · Policy · Permission · Access · Action · Audit · Revocation**

The model is not intended to replace Microsoft Entra, RBAC, Zero Trust or Identity Governance platforms.

It provides a **governance vocabulary above existing IAM technologies** and helps explain how physical and digital authorization belong to the same organizational process.

---

# The Core Idea

The Mandate Model treats **Mandate** as the central conceptual object of authorization.

A Mandate describes not only **what** an actor may do, but:

* **why** the authority exists
* **who** granted it
* **on whose behalf** the actor is acting
* **what purpose** it serves
* **within what scope** it applies
* **under what context** it is valid
* **which policies** constrain it
* **how long** it remains valid
* **whether it may be delegated**
* **what evidence** must be retained
* **when it must be revoked**

This distinction becomes increasingly important as organizations introduce **AI agents**.

The governance question is no longer only:

> **Who are you?**

It increasingly becomes:

> **Who are you acting for, under whose authority, for what purpose, and within what mandate?**

---

# From Behörighetsresan@SJ to The Mandate Model

The model emerged through a practical journey.

### 1. Behörighetsresan@SJ

The first insight was that access should be understood as a **continuous organizational journey**:

```text
Join
  ↓
Organization
  ↓
Role
  ↓
Mandate
  ↓
Access
  ↓
Role / Responsibility Change
  ↓
Revocation
  ↓
Leave
```

The same organizational journey can produce different technical outcomes:

* Digital identities
* Application permissions
* Physical access cards
* Keys
* Vehicles and equipment
* Privileged access
* Machine identities
* AI-agent capabilities

### 2. The deeper question

The process revealed that the organization was not simply assigning technical access.

It was making decisions about:

> **Who should have authority to act, under which circumstances, for what purpose, and for how long.**

That became the foundation of **The Mandate Model**.

---

# The Core Information Model

At its centre is the relationship between **identity and authority**.

```text
Identity Authority
        ↓
     Identity
        ↓
   Organization
        ↓
       Role
        ↓
     Mandate
        ↓
Policy · Context · Delegation
        ↓
    Permission
        ↓
      Access
        ↓
      Action
        ↓
      Audit
        ↓
    Revocation
```

The model can also be viewed as a governance relationship around the Mandate:

```text
                    IDENTITY AUTHORITY
                            │
                            ▼
                        IDENTITY
                            │
                            ▼
                     ORGANIZATION
                            │
                            ▼
                          ROLE
                            │
                            ▼
                        MANDATE
               ┌────────────┼────────────┐
               │            │            │
            POLICY       CONTEXT     DELEGATION
               │            │            │
               └────────────┼────────────┘
                            ▼
                       PERMISSION
                            │
                            ▼
                          ACCESS
                            │
                            ▼
                          ACTION
                            │
                            ▼
                          AUDIT
                            │
                            ▼
                       REVOCATION
```

---

# The Conceptual Building Blocks

The model deliberately uses a small number of primitives so that it can survive changes in technology.

## Organizational Context

| Primitive              | Meaning                                      |
| ---------------------- | -------------------------------------------- |
| **Identity Authority** | Establishes trust and the source of identity |
| **Identity**           | Represents the actor                         |
| **Organization**       | Provides organizational context              |
| **Role**               | Describes responsibility or function         |

## Authority

| Primitive      | Meaning                                                 |
| -------------- | ------------------------------------------------------- |
| **Mandate**    | Represents governed authority to act                    |
| **Policy**     | Defines rules, constraints and conditions               |
| **Permission** | Expresses the concrete capability that may be performed |

## Enforcement

| Primitive              | Meaning                                                                        |
| ---------------------- | ------------------------------------------------------------------------------ |
| **Access**             | Represents the resulting ability to enter, use, read, write, operate or invoke |
| **Enforcement System** | Implements the authorization decision through physical or digital technology   |

## Evidence & Lifecycle

| Primitive      | Meaning                                   |
| -------------- | ----------------------------------------- |
| **Action**     | Represents what the actor actually did    |
| **Audit**      | Provides evidence of authority and action |
| **Revocation** | Ends or invalidates authority             |

The model deliberately does not create a new fundamental primitive for every technology.

> **An AI agent is an Identity.**
> **A delegation is a relationship between Mandates.**
> **Context is a dimension of a Mandate.**
> **A tool is an enforcement mechanism.**
> **A trajectory is evidence of activity.**
> **Everything else becomes composition.**

---

# Mandate as the Central Information Object

A Mandate is:

> **Governed authority to act within a defined purpose, scope and context.**

A Mandate can contain or reference:

```text
Actor
Principal
Issuer
Purpose
Role
Scope
Actions
Context
Policy
Validity
Parent Mandate
Delegation
Revocation Condition
```

This allows the model to answer questions that a permission alone cannot:

* Why does this permission exist?
* Who granted it?
* On whose behalf is the actor acting?
* What is the purpose?
* Where does the authority apply?
* When does it expire?
* Which policies constrain it?
* Can it be delegated?
* What evidence must be retained?
* What event terminates the authority?

This is the conceptual gap the Mandate Model is designed to address.

---

# Role ≠ Mandate ≠ Permission ≠ Access

One of the central distinctions in the model is:

```text
Role
  ↓
describes responsibility

Mandate
  ↓
establishes governed authority

Permission
  ↓
expresses an allowed capability

Access
  ↓
implements the capability

Action
  ↓
represents what actually happened

Audit
  ↓
provides evidence
```

A **Role** is therefore not the same thing as a **Mandate**.

A **Permission** is not the same thing as **Authority**.

An **Access Card** is not the authority.

An **Entra Group** is not the authority.

An **API Permission** is not the authority.

They are technical expressions or enforcement mechanisms derived from an underlying governance decision.

> **The authority exists at the organizational level.
> Technology implements it.**

---

# Governance Before Technology

Modern IAM environments often involve many different owners:

* HR owns employment events
* IT owns digital identity
* Security defines policies
* Facilities manages physical access
* Business owners define responsibilities
* Application owners manage permissions
* IAM platforms enforce identity and authorization

Everyone owns part of the process.

But:

> **No single system necessarily owns the meaning of the authorization decision.**

The Mandate Model addresses this conceptual gap.

It asks:

> **What is the governed authority connecting these decisions?**

The answer is:

## The Mandate

The Mandate Model is therefore a **governance layer**, not another IAM platform.

---

# Process Before Technology

The model builds on a simple principle:

```text
Process
   ↓
Governance
   ↓
Mandate
   ↓
Authorization Decision
   ↓
Technical Enforcement
   ↓
Evidence
```

This creates a useful distinction:

> **Process describes the journey.**
> **The model describes the authority.**
> **Systems enforce the decision.**
> **Evidence proves what happened.**

---

# Anti-Fragmentation

One of the recurring challenges in Identity and Access Governance is project fragmentation.

A typical pattern is:

```text
Local Problem
     ↓
Local Project
     ↓
Local Solution
     ↓
New Dependency
     ↓
Increasing Fragmentation
```

Projects naturally need scope, budget, ownership and delivery dates.

But **identity and authority do not follow project boundaries**.

A person may simultaneously have:

* an identity
* an organizational affiliation
* a role
* a mandate
* policies
* digital permissions
* physical access

These relationships extend across HR, IT, Security, Facilities and business systems.

The Mandate Model therefore does **not** propose one enormous transformation project.

Instead:

> **Projects implement change.
> The Mandate Model provides the common logic that connects the change.**

Projects can remain small.

Implementations can remain incremental.

Systems can evolve independently.

The model survives the projects.

---

# Relationship to Existing IAM

The Mandate Model does not replace existing IAM capabilities.

It provides a conceptual interpretation of how they relate.

| Existing capability     | Mandate Model interpretation                          |
| ----------------------- | ----------------------------------------------------- |
| Microsoft Entra         | Identity Authority / Identity                         |
| RBAC                    | Role and Permission composition                       |
| ABAC                    | Policy and contextual authority                       |
| Zero Trust              | Policy-driven authorization and continuous evaluation |
| PIM                     | Time-bound or elevated Mandates                       |
| Identity Governance     | Mandate lifecycle                                     |
| Access Reviews          | Mandate validation                                    |
| Audit / SIEM            | Evidence of authorization and action                  |
| Physical Access Systems | Access enforcement                                    |
| API Authorization       | Permission and Access enforcement                     |
| AI Agent Identity       | Identity representing a non-human actor               |
| Delegated Agent Access  | Mandate-to-Mandate delegation                         |

These are **conceptual mappings**, not claims that the technologies are equivalent.

The Mandate Model sits above the implementation patterns.

It asks:

> **What organizational decision is this technology enforcing?**

---

# Physical and Digital Access

A physical key, access card, application permission and privileged role may be implemented by completely different systems.

Conceptually, however, they can represent the same organizational event:

> **Authority being granted, governed, exercised and eventually withdrawn.**

```text
Organizational Decision
          ↓
       Mandate
          ↓
 ┌────────┼─────────┐
 ↓        ↓         ↓
Digital  Physical   AI
Access   Access     Access
```

A card is not the authority.

A key is not the authority.

An Entra group is not the authority.

An application permission is not the authority.

They are different technical expressions of governed authority.

---

# The AI Workforce

Agentic AI introduces a new class of organizational actor.

AI agents can:

* read data
* call tools
* write files
* execute code
* communicate
* plan tasks
* delegate work
* operate across multiple systems
* perform multi-step operations with limited human supervision

This introduces a new governance question:

> **Who—or what—is acting, on whose behalf, under whose authority?**

The Mandate Model does not require AI agents to become a separate authorization domain.

An AI agent can be represented as:

```text
Identity
   ↓
Organization
   ↓
Role
   ↓
Mandate
   ↓
Policy
   ↓
Permission
   ↓
Access
   ↓
Action
   ↓
Audit
```

The identity may persist.

The authority can change.

---

# Human and AI Actors

The same conceptual model can govern:

```text
Human
  ↓
Mandate

Application
  ↓
Mandate

Service
  ↓
Mandate

AI Agent
  ↓
Mandate
```

What changes is not the fundamental authorization model.

What changes is:

* delegation
* speed
* autonomy
* scale
* execution patterns
* number of actors
* number of downstream actions

This makes explicit, scoped and revocable authority increasingly important.

---

# Delegation and Agent Chains

A human may authorize an agent.

An agent may invoke another agent.

An agent may invoke a service.

A service may access a resource.

This creates a potential delegation chain:

```text
Human
  ↓
Mandate
  ↓
Agent Identity
  ↓
Delegated Mandate
  ↓
Sub-Agent / Service
  ↓
Permission
  ↓
Tool / Resource
  ↓
Action
  ↓
Audit
```

The key governance principle is:

> **Authority must not silently expand as it moves through the chain.**

Therefore:

```text
Parent Mandate
      ↓
Delegated Mandate
      ↓
Constrained Authority
```

A delegated Mandate may preserve or reduce authority, but must not silently expand it.

Conceptually:

```text
Delegated Scope ≤ Parent Scope
```

This allows the model to represent:

```text
Human → Agent
Agent → Sub-Agent
Agent → Service
Organization → Supplier
Supplier → Agent
Agent → Tool
```

using the same conceptual framework.

---

# Contextual Authority

Authority rarely exists in isolation.

A person may be authorized to enter a building:

* during working hours
* for a specific project
* while employed
* within a particular location

An AI agent may be authorized to call a tool:

* for a particular business process
* against a particular resource
* during a limited period
* under human supervision
* subject to a risk policy

The Mandate Model therefore treats **Context as a dimension of authority**.

Context can include:

* Time
* Location
* Purpose
* Resource
* Task
* Risk
* Environment
* Organization
* Project
* Device
* Human supervision
* Policy conditions

This allows the model to express:

> **This actor may do X**

as:

> **This actor may do X, for this purpose, against this resource, within this context, during this period, under these constraints.**

---

# Auditability

As agents become capable of performing actions at machine speed, audit becomes more than a technical log.

The organization needs to know:

* What identity acted?
* Was it human, application or agent?
* On whose behalf did it act?
* Which Mandate authorized the action?
* Who issued that Mandate?
* Was the authority delegated?
* Which parent Mandate did it derive from?
* Which policy applied?
* Which permission allowed the operation?
* Which tool or resource was invoked?
* What context applied?
* What happened?
* When did the authority expire or get revoked?

The resulting chain is:

```text
Mandate
   ↓
Permission
   ↓
Access
   ↓
Action
   ↓
Evidence
```

The goal is not only to establish **what happened**.

It is to establish:

> **Why was it allowed to happen?**

A trajectory can provide evidence of what an agent processed and did.

But:

> **A trajectory is not a Mandate.**

Audit records the exercise of authority.

The Mandate establishes the authority.

---

# Instruction Is Not Authority

This distinction becomes particularly important in agentic systems.

```text
Instruction ≠ Authority

Capability ≠ Mandate

Execution ≠ Authorization

History ≠ Governance
```

An instruction tells an agent what someone is asking it to do.

A Mandate establishes whether the actor is authorized to do it.

A Permission expresses the technical capability.

Access enforces it.

Action is what actually happens.

Audit establishes what happened and under which authority.

---

# Agentic Architecture

Modern agent architectures may contain:

* persistent identity
* trajectory / event history
* inbox
* activation mechanism
* orchestration
* control plane
* tools
* APIs
* permissions
* resources
* audit

These components answer different questions.

| Component     | Question                                  |
| ------------- | ----------------------------------------- |
| Identity      | Who is acting?                            |
| Inbox         | What work has arrived?                    |
| Activation    | When should the agent run?                |
| Control Plane | How do agents coordinate?                 |
| Trajectory    | What happened?                            |
| Permission    | What technical operation is possible?     |
| Tool          | What capability is available?             |
| Mandate       | **Why is the actor authorized to do it?** |

The Mandate Model therefore provides an **authority layer** connecting the execution environment.

```text
Human / Organization
        ↓
      Mandate
        ↓
   Agent Identity
        ↓
 Delegated Mandate
        ↓
Agent Control / Execution
        ↓
    Permission
        ↓
 Tool / Resource Access
        ↓
      Action
        ↓
   Audit Evidence
```

The governance chain and the execution chain are related, but they are not identical.

---

# Why the Model Is Designed for Change

Technology changes faster than governance concepts.

Directory platforms change.

Physical access platforms change.

Identity providers change.

AI models change.

Agent protocols change.

Organizational structures change.

The underlying questions remain:

* Who is acting?
* For whom?
* Under whose authority?
* For what purpose?
* Within what scope?
* Under which constraints?
* For how long?
* Can the authority be delegated?
* What happened?
* When does the authority end?

The Mandate Model is intentionally small because it is designed to survive these changes.

> **The objective is not to predict the technology.
> The objective is to provide a stable conceptual language for governing it.**

---

# The Core Insight

Authorization behaves more like **organizational governance** than software configuration.

Inside individual systems these things may appear unrelated:

* A physical key
* An access badge
* A Microsoft Entra group
* A temporary project assignment
* A privileged administrator role
* An AI-agent tool permission

Conceptually, they can represent the same organizational event:

> **Authority being granted, governed, exercised and eventually withdrawn.**

Behörighetsresan describes how people — and potentially non-human actors — move through an organization.

The Mandate Model describes **what moves during that journey**:

# Governed Authority

This is the conceptual shift.

The model does not claim that a key and an API permission are technically the same thing.

They are not.

It claims that the **organizational decision behind them can be described using the same governance language**.

---

# The Mandate Model in One Sentence

> **The Mandate Model is a human-centered governance framework for describing how authority is established, delegated, constrained, enforced, exercised, audited and revoked across people, systems and AI agents.**

---

# Design Principles

The model is built around a few principles:

### 1. Process before technology

Understand the organizational journey before selecting the technical implementation.

### 2. Governance before enforcement

Understand why authority exists before deciding how technology will enforce it.

### 3. Identity is not authority

An identity establishes who or what is acting.

A Mandate establishes why that actor may act.

### 4. Permission is not authority

A permission expresses a capability.

A Mandate explains why the capability exists.

### 5. Physical and digital access belong to the same governance problem

The implementation differs.

The organizational decision can be the same.

### 6. Delegation must preserve boundaries

Authority may be delegated, but downstream authority must not silently expand.

### 7. Audit must explain why

Audit should establish not only what happened, but under which authority it happened.

### 8. The model must survive the projects

Projects and technologies change.

The governance model should remain coherent.

---

# From Projects to a Shared Model

The Mandate Model is not a proposal for one giant IAM transformation.

It is a **shared model that many projects can use**.

```text
                 THE MANDATE MODEL
                         │
        ┌────────────────┼────────────────┐
        │                │                │
       HR               IT            Security
        │                │                │
        ├──────────── Governance ─────────┤
        │                │                │
    Facilities       Applications       AI
        │                │                │
        └───────────── Access ────────────┘
```

Each domain can retain its own systems.

The common model provides the conceptual connection.

> **The goal is not one giant project.
> The goal is one shared model that survives many projects.**

---

# Current Scope

Version **0.4** develops the model around several themes:

* Identity Authority
* Identity and organizational context
* Role versus Mandate
* Mandate as the central information object
* Policy and contextual authority
* Physical and digital access
* Delegation
* Mandate chains
* Human and non-human identities
* AI-agent authorization
* Auditability
* Revocation
* Agentic execution environments
* Governance versus enforcement
* Anti-fragmentation across projects

The model is intentionally technology-independent.

---

# Status

**Whitepaper version:** `0.4`
**Year:** `2026`
**Status:** Conceptual framework / evolving model

The Mandate Model is currently being developed as a conceptual governance framework and explored through real enterprise access-governance scenarios.

The original practical context is **SJ**, but the model is intended to be applicable beyond a single organization or industry.

---

# Origin

The Mandate Model evolved from:

**Behörighetsresan@SJ**

a process-first approach to Identity and Access Governance developed through practical work with:

* Physical access
* Keys
* Access cards
* Digital identities
* Organizational roles
* Authorization
* Lifecycle management
* HR / IT / Security / Facilities collaboration

The practical experience suggested that these should not be treated as completely separate authorization problems.

They are different expressions of a broader governance question:

> **Who has authority to do what, why, under which conditions, and for how long?**

---

# References & Further Reading

The whitepaper builds on current work in identity, authorization, identity governance and AI-agent security.

* **NIST** — *New Concept Paper on Identity and Authority of Software Agents*, February 5, 2026.
* **NIST** — *Accelerating the Adoption of Software and Artificial Intelligence Agent Identity and Authorization*, 2026.
* **NIST** — *AI Agent Standards Initiative*, February 17, 2026.
* **Microsoft Learn** — Least privilege for AI agents.
* **Microsoft Learn** — Authorization in Microsoft Entra Agent ID.
* **Microsoft Learn** — Microsoft Entra ID Governance.
* **Microsoft Learn** — Microsoft Entra security and identity controls for AI agents.
* **Lovable** — *Inside Chats: How Lovable's Agents Work Together*, September 24, 2026.

---

# The Final Principle

The Mandate Model began with a practical question about Identity and Authorization.

It evolved into a broader observation:

> **Identity can persist. Authority can change.**

A person can remain the same person while changing jobs, projects, responsibilities and access.

An AI agent can remain the same identity while receiving different mandates for different tasks.

A system can remain technically unchanged while the authority granted to it changes.

Therefore:

```text
Identity ≠ Authority

Identity can persist.
Authority can change.

Technology changes faster than governance concepts.

The Mandate Model is the language between them.
```

---

## The Mandate Model

**A Human-Centered Framework for Identity & Access Governance**

**Charles Löfblad · Markus Smed**

**Whitepaper v0.4 · 2026**
