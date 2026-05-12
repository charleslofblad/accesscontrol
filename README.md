# AccessControl

AccessControl is a digital tool designed to support and streamline the process/lifecycle of **identity and access management**, and serves as an initial step toward cloud-based development of access control systems.

## Machine Learning & Image Processing

AccessControl leverages modern machine learning techniques to automate and enhance the processing of employee images for ID cards.

By integrating **face-api.js** and **TensorFlow.js**, the system can:

* Automatically detect faces in uploaded images
* Crop and adjust images to fit ID card layouts
* Analyze facial features using pre-trained models
* Estimate attributes such as **age** and **gender**

These models are trained in advance and allow the application to perform tasks that were traditionally handled manually by humans — such as selecting, cropping, and adjusting ID photos.

This automation improves:

* Consistency in ID card image quality
* Efficiency in the card creation process
* Reduction of manual workload
* Standardization across all generated ID cards

In essence, the system replaces a previously manual, human-driven image editing process with an intelligent, automated workflow powered by machine learning.


Today, work related to access cards and permissions is often handled manually — relying on email, physical documents such as Excel sheets, and multiple separate internal and external systems. This leads to increased risk of errors, low traceability, and inefficient processes.

AccessControl addresses these challenges by:

* Digitizing and standardizing workflows related to the lifecycle of "identity and access management"
* Creating a traceable and consistent handling of identities, permissions, and access cards
* Reducing the risk of incorrect or outdated access remaining active
* Simplifying collaboration between internal functions and external stakeholders (e.g., property owners and vendors)
* Supporting compliance with security procedures in high-security environments

The system is designed to function as a framework where every step — from issuance to termination of access — is documented and executed according to defined processes.

**Vision:** All workflows should have a dedicated tool for management.

---

## Minimum Viable Product (MVP)

In product development and startups, an MVP is a version of a product with just enough features to meet the basic needs of early users and to collect feedback for further development.

Instead of building a fully featured product from the start, the focus is on quickly launching a version with core functionality to validate the idea and learn from user feedback.

---

## MVP Features

### Index

The main menu includes the following modules:

### Access Cards

* Create access cards
* View created access cards
* Filter and search by personal data or card number

### Card Editor

* Graphical editor for ID cards
* Edit text, logos, etc.
* Layout data is saved linked to the organization (subject to change)

### Employee Spreadsheet

* Handsontable with inline editing (Excel-like experience)
* Full CRUD directly against the backend

### Employee Spreadsheet (Paginated)

* Efficient data handling with server-side search and pagination for < 5000 employees
* API:

  ```
  GET /api/anstallda/paginerad-sok?search=...&skip=...&limit=...
  ```

---

# Access Card Component (Angular)

An Angular component for managing and rendering employee ID cards.

Features include:

* Search and manage employees via REST API
* Dynamic ID card rendering using `Fabric.js`
* Automatic face detection and cropping using `face-api.js` and `TensorFlow.js`
  (Displays both original image and cropped face image)
* Integration with layouts stored in the database
* Full CRUD functionality for employees

---

## Technologies

| Technology              | Usage                                |
| ----------------------- | ------------------------------------ |
| Angular                 | Frontend framework                   |
| face-api.js             | Face detection & age/gender analysis |
| TensorFlow.js           | Machine learning backend in browser  |
| Fabric.js               | Canvas-based ID card rendering       |
| REST API (Node/Express) | Backend for employees and layouts    |
| MongoDB                 | Database for employees and layouts   |

---

## Dependencies

### Installed packages/modules:

```
"@handsontable/angular": "^15.2.0",
"@tensorflow/tfjs": "^3.18.0",
"@tensorflow/tfjs-core": "^4.22.0",
"bootstrap": "^5.3.4",
"canvas": "^3.1.0",
"fabric": "^6.6.1",
"face-api.js": "^0.22.2",
"handsontable": "^15.2.0",
```

**Note:**

* face-api.js works best with TensorFlow.js v3.18.0
* Latest face-api.js (v0.22.2) generally works with TFJS 3.x

If face-api does not work, try:

```bash
npm uninstall @tensorflow/tfjs face-api.js
npm install @tensorflow/tfjs@3.18.0 face-api.js@latest
npm install face-api.js@0.22.0
```

---

## Technical Architecture

### Frontend

* Angular 17
* Handsontable for data tables
* Fabric.js for ID card design
* JWT authentication (not yet implemented)

### Backend

* Node.js + Express
* MongoDB
* REST API for employees, cards, and layouts
* JWT authentication

### Deployment

* Can be deployed in cloud environments (e.g., Azure)
* GitHub Actions for CI/CD (easy to integrate)

---

## Local Installation & Setup

### Clone the repository

```bash
git clone https://github.enterprise.com/xxxxxxxxx
cd accesscontrol
```

### Configure MongoDB in `.env`

```
MONGO_URI=mongodb://localhost:27017/anstallda_db
PORT=8000
```

### Import data into MongoDB

### Start the server

```bash
cd C:\node_dev\accesscontrol
node server.js
```

Server runs at:

```
http://localhost:8000
```

### Start Angular app

```bash
cd C:\node_dev\accesscontrol\app_public
ng serve --open
```

---

# AccessControl API for Employees and Layouts

## Overview

This API is a REST-based backend built with Express.js and Mongoose. It manages two main resources:

* **Employees** – CRUD + advanced search/pagination
* **Layouts** – CRUD for graphical templates (e.g., ID cards)

---

## Tech Stack

* Node.js + Express
* MongoDB (via Mongoose)
* JSON data format

Server runs by default on:

```
http://localhost:8000
```

---

## API Endpoints

### Employees (`/api/anstallda`)

#### Create employee

`POST /api/anstallda`

#### Get all

`GET /api/anstallda`

#### Get by ID

`GET /api/anstallda/:id`

#### Get by personal number (partial match)

`GET /api/anstallda/personnummer/:personnummer`

#### Search (all relevant fields)

`GET /api/anstallda/sok/:term`

#### Paginated search

`GET /api/anstallda/paginerad-sok?search=term&skip=0&limit=50`

#### Paginated (no search)

`GET /api/anstallda/paginerat?skip=0&limit=100`

#### Update employee

`PUT /api/anstallda/:id`
(Includes updating nested `Tjanstekort` object)

#### Delete employee

*(Not implemented yet)*

---

### Layouts (`/api/anstallda/layouts`)

#### Create layout

`POST /api/anstallda/layouts`

```json
{
  "name": "Standard Template",
  "data": { "canvas": { "background": "#fff", "elements": [] } }
}
```

#### Get all

`GET /api/anstallda/layouts`

#### Get by ID

`GET /api/anstallda/layouts/:id`

#### Get by name

`GET /api/anstallda/layouts/by-name/:name`

#### Update layout

`PUT /api/anstallda/layouts/:id`

#### Delete layout

`DELETE /api/anstallda/layouts/:id`

---

## Data Models

### Employee (example)

```json
{
  "_id": "...",
  "Anstallda_ID": 536,
  "Efternamn": "Charles",
  "Fornamn": "Andersson",
  "Personnummer": "19701111-0000",
  "Roll": "Property Technician",
  "Chef": "Manager Name",
  "Layout": "SJ",
  "Foretag": "",
  "Reff_Pnr": "19790508-0680",
  "Tjanstekort": {
    "Tjanstekort_ID": 536,
    "Datum": 45547
  }
}
```

---

### Layout (example)

Fabric.js-based layout definition stored as JSON.

---

## Testing the API

You can test using:

* Postman
* curl
* Swagger (if integrated)

Example:

```bash
curl http://localhost:8000/api/anstallda/sok/Andersson
```

---

## Authentication

> No authentication implemented in this version.

---

## Notes

* The API supports **partial search** using regex — use short search terms for performance
* **Pagination is essential** for large datasets (>5000 employees)
* All error messages are JSON formatted
* **ObjectId validation** is used to prevent MongoDB errors

---

## Links

[https://doc.nexusgroup.com/pub/set-up-integration-with-rco-r-card-m5-admin-api](https://doc.nexusgroup.com/pub/set-up-integration-with-rco-r-card-m5-admin-api)

---
