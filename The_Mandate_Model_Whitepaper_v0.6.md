<img width="1055" height="1491" alt="Omslag – The Mandate Model_02" src="https://github.com/user-attachments/assets/1647202f-4290-47f3-b1d5-0ca7857abeaf" />

# THE MANDATE MODEL
## From Access Management to Authority Governance

**A conceptual information model for governing authority across people, systems and AI agents.**

**Whitepaper v0.6 · November 2026**

**Charles Löfblad | Markus Smed**

> Identity can persist.  
> Authority can change.  
> The Mandate Model is the language between them.

---

## From Behörighetsresan@SJ to Authority Governance

**BEHÖRIGHETSRESAN@SJ → THE MANDATE MODEL → AUTHORITY GOVERNANCE**

The Mandate Model emerged from a practical organizational challenge: how to govern access and authority consistently across people, departments, systems and operational environments.

What began as Behörighetsresan@SJ — an initiative to establish one coherent business process for managing access throughout the relationship between an individual and an organization — evolved into a broader architectural concept.

The deeper question became:

**How can an organization govern the authority behind access, rather than managing permissions as isolated technical objects?**

The Mandate Model addresses this question through a conceptual information model centered on the Mandate: a representation of governed authority, its origin, purpose, scope, conditions, delegation and lifecycle.

Together, Behörighetsresan and The Mandate Model establish the conceptual foundation for an **Authority Governance Layer**.
<img width="2092" height="1218" alt="Behörighetsresan@SJ_02" src="https://github.com/user-attachments/assets/169c87d7-7481-40e5-8a4d-72a4b0fa172a" />

---

## 1. The problem was never just access

Organizations depend on people having the right conditions to perform their work.

An employee joins an organization. A consultant starts a temporary assignment. Someone changes roles, moves to another department, begins working at a new location or leaves the organization.

Each event creates consequences across multiple domains:

- HR and organizational relationships
- Digital identities and user accounts
- Business applications and operational systems
- Physical access cards and access zones
- Keys, vehicles and equipment
- External assignments and temporary access
- Services, workloads and AI agents

These activities are often managed through separate departments, processes and technical systems.

Each system may function correctly within its own domain. The difficulty lies in connecting their decisions, responsibilities and lifecycles.

The result is organizational fragmentation.

> **The problem is not necessarily that individual systems are inadequate. The problem is that the organization lacks a common process and information structure connecting them.**

## 2. Behörighetsresan@SJ — One process instead of many

Behörighetsresan was developed from a practical need to improve how access and authorization are managed within SJ.

Its central idea is straightforward:

**Rather than allowing HR, IT, Security and Facilities to initiate and manage disconnected processes around the same organizational event, establish one coherent business process that coordinates their responsibilities, decisions and activities.**

The process begins with the relationship between the individual and the organization.

Who is the person? What organizational affiliation do they have? Which role or assignment are they performing? What work must they be able to carry out? Where will they perform it? What requirements apply?

From this context, the organization determines what authority is needed.

A single organizational event can initiate the necessary activities across multiple domains, while the process maintains an overview of what has been requested, approved, assigned, verified and eventually withdrawn.

### The shared lifecycle

```text
REQUEST
   ↓
APPROVAL & VERIFICATION
   ↓
ASSIGNMENT
   ↓
MONITORING & TRACKING
   ↓
REVOCATION
```

This lifecycle is not simply an administrative sequence. It maintains continuity between organizational intent, decisions and technical execution.

### One process does not mean one department

HR remains responsible for employment information. The business remains responsible for operational needs and roles. Security contributes security requirements. Facilities owns relevant physical access structures. IT provides identity and technical services.

The innovation is that these responsibilities are coordinated through a shared process rather than being managed as independent workflows.

**Behörighetsresan is more than an improved access workflow. It represents an attempt to organize access governance around the organization's actual business processes.**

## 3. The deeper insight: Access is the consequence of authority

A person may have an identity in Microsoft Entra ID, access to several business applications, an access card in ASSA ARX, access to specific depots, keys to designated facilities and permission to use vehicles or operational equipment.

These are different technical representations.

But why should the organization grant them?

The answer cannot simply be that someone created an account, assigned a group or registered a card.

There must be an underlying organizational reason.

Someone has a role. The organization has assigned responsibilities. A particular assignment requires certain capabilities. An authorized party has approved the scope of what the person may do.

**The technical permissions are consequences of that decision.**

> Identity tells us who or what an actor is. Authority explains what that actor has been entrusted to do, why, and within which boundaries.

Identity and authority are related, but they are not the same thing.

An identity can remain valid while the authority associated with it changes.

This applies equally to human employees, external workers, services, workloads and AI agents.

## 4. The Mandate Model — A common language for authority

At the center of the model is the concept of the **Mandate**.

A Mandate represents governed authority granted to an actor for a defined purpose, within a defined scope and under defined conditions.

It connects the origin of authority to the actor receiving it and provides the context needed to understand what that actor is entitled to do.

A Mandate is not simply another name for a permission.

A permission describes an allowed operation within a technical or policy context.

A Mandate describes the governed authority that justifies and constrains such permissions.

### The seven fundamental dimensions of a Mandate

| Dimension | Governance question |
|---|---|
| Origin | Where does the authority come from? |
| Subject | Who or what receives the authority? |
| Purpose | Why is the authority granted? |
| Scope | Which resources and actions are included? |
| Conditions | Under which circumstances is it valid? |
| Delegation | Can the authority be delegated, and under what constraints? |
| Lifecycle | When does it begin, change, expire or end? |
| Evidence | How can the organization demonstrate what happened? |

These dimensions create a shared governance vocabulary across organizational and technical boundaries.

## 5. Authority Governance — The missing architectural connection

Traditional IAM architectures are organized around identity providers, directories, provisioning systems, policy engines and enforcement points.

These components perform essential functions.

However, the organizational context behind their decisions is often distributed across different systems and processes.

The Mandate Model introduces the concept of an **Authority Governance Layer** between organizational intent and technical access realization.

Its purpose is not to replace existing technologies. It establishes a common governance structure that allows them to participate in the same authority lifecycle.

### Three connected architectural levels

```text
┌───────────────────────────────────────────────┐
│                                               │
│       BUSINESS & ORGANIZATIONAL               │
│              GOVERNANCE                       │
│                                               │
│       Behörighetsresan                        │
│       Process, responsibilities and decisions│
│                                               │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│                                               │
│           AUTHORITY GOVERNANCE                │
│                                               │
│            The Mandate Model                  │
│                                               │
│       Origin · Purpose · Scope · Conditions   │
│       Delegation · Lifecycle · Evidence       │
│                                               │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│                                               │
│       TECHNICAL AUTHORIZATION                 │
│           & ENFORCEMENT                       │
│                                               │
│       Identity Providers · IGA · Policies     │
│       Applications · Infrastructure           │
│       Physical Access Systems                 │
│                                               │
└───────────────────────────────────────────────┘
```

The relationship can be expressed as:

```text
Business Intent
      ↓
Governed Authority
      ↓
Authorization Decision
      ↓
Technical Enforcement
      ↓
Verified Outcome
```

Each level has a distinct responsibility.

The organization determines what is required. The governance layer describes and controls the authority. Authorization mechanisms evaluate whether an action is permitted. Enforcement systems implement the result. The organization can then verify whether the intended result actually occurred.

## 6. Governing physical and digital access together

One of the important characteristics of Behörighetsresan is that it does not treat digital and physical access as unrelated organizational concerns.

A person may need access to:

- Applications and information systems
- Operational systems
- Buildings and depots
- Restricted areas and facilities
- Vehicles and equipment
- Physical keys and other assets

These domains have different technical requirements and should retain their specialized enforcement mechanisms.

The common element is not the technical permission.

**It is the authority and organizational purpose behind it.**

One governed authority can have multiple technical realizations, and each realization must remain traceable to its governing source.

When an assignment ends, the organization can evaluate all associated authority and initiate the relevant revocation and reconciliation activities.

## 7. Delegation — Authority must not grow as it moves

Delegation becomes increasingly important in complex organizations.

A manager may authorize a team leader to coordinate work. A department may delegate specific responsibilities to an external service provider. A system may act on behalf of a human user.

AI agents introduce another dimension.

An agent may receive an assignment, use tools and services, and delegate parts of its work to other agents.

Without explicit governance, it becomes difficult to understand where authority originated and whether subsequent actions remain within the original boundaries.

The Mandate Model treats delegation as a governed relationship rather than simply the technical transfer of credentials.

### The delegation invariant

```text
DELEGATED SCOPE ≤ PARENT SCOPE
```

A delegated actor must not acquire more authority than the actor or source from which the authority originates.

Delegation may further restrict authority, but it must not silently expand it.

## 8. AI agents and the future of authority governance

AI agents introduce new challenges to existing identity and access architectures.

Unlike traditional applications, agents can interpret instructions, plan actions, interact with external services and delegate tasks dynamically.

Their identity alone cannot explain whether a particular action is justified.

An agent may have a valid identity and authenticated credentials while attempting to perform an action outside the purpose or scope of its assignment.

This demonstrates why identity and authority must remain distinct.

### Mission is not Mandate

An important distinction is the difference between an agent's mission and its Mandate.

A mission describes what the agent is intended to accomplish.

A Mandate describes the authority it has actually been granted.

For example:

"Review the maintenance records and prepare a report identifying overdue inspections."

This instruction does not automatically establish the agent's authority to access every maintenance system or modify operational records.

The organization must determine:

- Who initiated the task?
- What authority supports it?
- Which data and resources may the agent access?
- Which actions are permitted?
- Which actions require additional approval?
- How long does the authority remain valid?
- Can the agent delegate?
- How can execution be audited?

> Mission describes intent. Mandate governs authority. Authorization evaluates action. Enforcement controls execution.

### Authority across agent chains

A conceptual delegation chain may look like this:

```text
HUMAN OR ORGANIZATION
          │
          ▼
    PARENT MANDATE
          │
          ▼
       AI AGENT
          │
          ▼
CONSTRAINED DELEGATED MANDATE
          │
          ▼
  SUB-AGENT / SERVICE / TOOL
          │
          ▼
  RESOURCE / ACTION / AUDIT
```

Every step must preserve the origin and boundaries of authority.

The same principle applies whether the actor is human, digital or autonomous.

### Continuous reassessment

Agent authority cannot always be treated as a static decision made at the beginning of a task.

The operational context may change. The human who initiated the task may lose authority. The assignment may expire. A security signal may indicate elevated risk. A delegated service may become compromised.

These events may require the organization to reassess the affected authority.

A valid Mandate does not guarantee that every requested action must be permitted. Authorization remains dependent on applicable policy, context and enforcement requirements.

## 9. Lifecycle, revocation and accountability

Granting authority is only one part of governance.

An organization must also know when that authority is no longer justified.

A person may leave the organization. A contractor's assignment may end. A role may change. A project may close. A service may be retired. An AI agent may complete its task or lose its sponsor.

The Mandate Model treats revocation as a fundamental part of the authority lifecycle.

### Revocation is not the same as technical removal

A Mandate may be revoked while technical access remains temporarily active.

A token may still be valid. A session may remain open. A cached authorization decision may persist. A physical access card may still be active in a door controller.

The governance system must therefore distinguish between the decision to revoke and the verified completion of technical revocation.

```text
MANDATE REVOKED
      ↓
IDENTIFY TECHNICAL REALIZATIONS
      ↓
INITIATE REVOCATION
      ↓
RECONCILE CONNECTED SYSTEMS
      ↓
VERIFY COMPLETION
      ↓
RECORD EVIDENCE
```

### Entitlement provenance

Every technical entitlement should ideally be explainable through its origin.

```text
TECHNICAL ENTITLEMENT
          ↓
AUTHORIZATION DECISION
          ↓
MANDATE
          ↓
APPROVAL & BUSINESS JUSTIFICATION
          ↓
AUTHORITY SOURCE
```

This is entitlement provenance.

It provides a way to answer not only who has access, but why the access exists and which organizational decision supports it.

## 10. The information model and its conceptual boundaries

The Mandate Model is intended to provide a stable conceptual foundation across different technical environments.

It should not be defined by the data structures of a particular IAM platform, access-control product or authorization engine.

The model depends on preserving important conceptual distinctions:

| Conceptual distinction | Why it matters |
|---|---|
| Identity ≠ Authority | Knowing who an actor is does not establish what it may do. |
| Role ≠ Mandate | A role may inform authority but does not automatically grant it. |
| Mission ≠ Mandate | Intended work does not establish permission to perform every action. |
| Mandate ≠ Permission | Governed authority is not the same as a technical authorization rule. |
| Authorization ≠ Enforcement | A decision to permit an action does not prove access was implemented. |
| Revocation ≠ Reconciliation | Withdrawing authority does not guarantee that every technical realization has been removed. |
| Sponsor ≠ Authority Source | Responsibility for an agent does not automatically confer the right to grant every authority. |

### Core conceptual domains

The information model can be understood through eight related domains:

1. **Identity and Subject** — Human or non-human actors and their identities.
2. **Organization and Responsibility** — Organizational relationships, roles, assignments and responsibilities.
3. **Authority and Mandate** — Origin, purpose, scope, conditions and lifecycle of governed authority.
4. **Delegation** — Constrained and traceable transfer of authority.
5. **Policy and Authorization** — Evaluation of authority in relation to actions, resources and context.
6. **Entitlement and Realization** — Translation of approved authority into technical permissions, credentials and physical or digital access.
7. **Audit and Evidence** — Traceability of decisions, changes, delegations and execution outcomes.
8. **Revocation and Reconciliation** — Withdrawal of authority and alignment of downstream systems.

These domains provide a conceptual structure. They do not prescribe one mandatory database schema or implementation technology.

The detailed **Core Information Model** defines the entities, relationships, constraints and invariants needed to make the concepts precise.

## 11. Relationship to existing standards and technologies

The Mandate Model is not intended to replace established identity, authorization or security standards.

It is designed to complement them.

Relevant technologies and initiatives include:

| Technology / Initiative | Relevant area |
|---|---|
| Microsoft Entra ID | Identity and authentication |
| Microsoft Entra ID Governance | Identity lifecycle and access governance |
| Microsoft Entra Agent ID | Identity capabilities for AI agents |
| NIST | Identity, authorization, agent security and accountability |
| OpenID AuthZEN | Communication between authorization decision and enforcement components |
| OpenFGA | Fine-grained relationship-based authorization |
| OAuth / OpenID Connect | Delegated access and identity federation |
| WIMSE / SPIFFE | Workload identity and credentials |
| ASSA ARX / RCO | Physical access enforcement |

The Mandate Model does not attempt to duplicate these capabilities.

Its purpose is to provide a common authority-governance context that connects organizational decisions to their respective mechanisms.

### Buy the core, build the broker

Organizations should use established identity providers, authorization engines and enforcement systems where appropriate.

The governance challenge is to connect these components to a common model of authority, responsibility and lifecycle.

**BUY THE CORE, BUILD THE BROKER.**

## 12. Implementation perspective — From concept to operational capability

A conceptual model becomes valuable when it can guide real organizational and technical decisions.

The Mandate Model is intended to support incremental implementation.

It does not require an organization to replace its existing IAM, physical access or business systems.

Behörighetsresan@SJ provides a practical starting point.

### 1. Establish the business process first

Establish ownership and lifecycle responsibility.

Understand who owns employment and identity-related information, who defines roles and operational requirements, who owns physical access structures, who approves different categories of authority, who performs technical realization and who verifies that access has been withdrawn.

This is a governance question before it becomes a technical question.

### 2. Establish the common information model

Establish the relationships between identity, organization, role, Mandate, authorization and technical entitlement.

Existing systems should be mapped to these concepts rather than forcing the conceptual model to adopt the internal structures of each product.

For example:

- Microsoft Entra may provide identity information and support digital identity realization.
- ASSA ARX may implement physical access.
- The Mandate Model describes the organizational authority that justifies the resulting access.

### 3. Build the governance integration

A practical governance service can connect the business process and information model to existing technical systems.

It may coordinate:

- Mandate creation and lifecycle changes
- Approval and verification
- Delegation
- Authorization requests
- Entitlement provisioning
- Reconciliation
- Revocation
- Audit evidence

The service should not independently invent authority or bypass relevant business approval processes.

It should translate governed decisions into coordinated technical actions and maintain visibility of their outcomes.

### 4. Use an incremental reference implementation

**AccessControl** represents a practical implementation environment for exploring these concepts.

Its role is to test how identity information, organizational context, mandates and access realizations can be connected.

It is not the definition of the Mandate Model itself.

The conceptual model should remain independent of the implementation so that it can be applied to different platforms and organizational environments.

## 13. Design principles and invariants

The Mandate Model should be governed by principles that remain valid regardless of implementation technology.

1. Identity does not imply authority.
2. Authority must have an identifiable origin.
3. Authority must have a purpose.
4. Authority must have a defined scope.
5. Roles inform authority but do not replace it.
6. Delegation must preserve the original boundaries.
7. Mission does not create authority.
8. Authority and authorization decisions remain distinct.
9. Technical realization must be traceable.
10. Authority has a lifecycle.
11. Revocation must trigger reconciliation.
12. Decisions and execution must be auditable.
13. The model must support different types of subjects.
14. Governance must remain independent of enforcement.
15. Organizational ownership must be explicit.

These principles provide a foundation for the more detailed invariants of the Core Information Model.

## 14. The larger opportunity — A different way to think about access

The significance of Behörighetsresan and The Mandate Model extends beyond access administration.

They challenge an assumption that has shaped much of traditional identity and access management: that access is primarily a technical object to be created, assigned and removed.

Instead, access can be understood as the result of governed authority.

That shift changes the starting point.

The organization no longer begins by asking which accounts, groups, cards or permissions someone needs.

It begins by asking:

- What is the person or other actor authorized to do?
- Why does that authority exist?
- Who has granted it?
- What does it include?
- Under which conditions is it valid?
- How should it evolve throughout its lifecycle?

From there, the necessary technical permissions can be derived, implemented and monitored.

The same conceptual problem exists in many environments:

- Railway organizations coordinating employees, contractors, depots, vehicles and operational systems.
- Healthcare organizations coordinating professional responsibilities, clinical systems and facilities.
- Manufacturing companies governing production systems, industrial environments and external maintenance providers.
- Digital enterprises governing employees, workloads, integrations and AI agents.

The operational details differ.

The underlying questions are remarkably similar.

## 15. Conclusion — From a journey to a model of authority

What began as an effort to understand and improve how people receive access within an organization evolved into something broader.

**Behörighetsresan identified the need for one coherent business process.**

**The Mandate Model identified the need for one coherent information model of authority.**

Together, they establish the conceptual foundation for an Authority Governance Layer that connects organizational decisions to technical execution.

The importance of this approach is not that it introduces another identity system, another authorization engine or another access management platform.

Its significance lies in changing the way organizations structure the problem.

Instead of managing separate permissions across separate systems, the organization can govern the authority that gives rise to those permissions.

Instead of treating onboarding, role changes, temporary assignments and offboarding as unrelated administrative activities, they can be managed through one coherent lifecycle.

Instead of treating digital access, physical access and AI-agent permissions as unrelated technical concerns, their underlying authority can be described within a common governance model.

The systems remain specialized. The responsibilities remain distributed. But the governance context becomes shared.

> **Who or what has the authority to act, on whose behalf, for what purpose, within which boundaries, and under whose responsibility?**

That is the question that connects Behörighetsresan to The Mandate Model.

And it is the foundation for moving from Access Management to Authority Governance.

---

## The relationship in one view

| Concept | Its role |
|---|---|
| **Behörighetsresan** | The process. |
| **The Mandate Model** | The information model. |
| **Authority Governance** | The architectural concept that connects them. |

Together, they offer a way to move from fragmented access administration towards coherent governance of authority throughout the lifecycle of people, organizations, systems and AI agents.

---

## Repository

This repository contains the conceptual work behind The Mandate Model and its development towards a unified approach to Authority Governance.

**Whitepaper:** The Mandate Model v0.6  
**Authors:** Charles Löfblad | Markus Smed  
**Date:** November 2026

---

*Identity can persist. Authority can change. The Mandate Model is the language between them.*
