# 💻 IT Asset Lifecycle Manager

A SAP-based application for managing IT assets throughout their complete lifecycle, from procurement to retirement.

## 🎯 Project Overview

The IT Asset Lifecycle Manager provides a centralized and secure system for tracking hardware assets, managing ownership and assignments, recording maintenance activities, maintaining historical records, and supporting controlled asset retirement and archiving.

## ✨ Key Features

- 📦 **Asset Lifecycle Tracking** – Track assets from procurement through assignment, maintenance, and retirement.
- 🔄 **Ownership Management** – Maintain a traceable history of asset ownership and assignment transitions.
- 🛠️ **Maintenance Tracking** – Record maintenance activities and operational updates.
- 🗄️ **Historical Archiving** – Preserve important lifecycle and retirement records and prevent accidental deletion.
- 🔐 **Role-Based Access Control (RBAC)** – Control access based on user roles and provide different dashboard permissions for Admin, Manager, and Employee users.
- 📊 **Role-Based Dashboards** – Dedicated dashboards for managing and viewing asset-related information according to the user's role.

## 👥 User Roles

- 👑 **Admin** – Full access to assets, departments, vendors, assignments, maintenance, reports, and administrative activities.
- 🧑‍💼 **Manager** – Access to operational activities, asset assignments, maintenance records, and reports.
- 👤 **Employee** – View assigned assets and related information.

## 🛠️ Technology Stack

- SAP CAP (Cloud Application Programming Model)
- SAP Fiori
- SAP HANA Cloud
- SAP BTP
- XSUAA
- Node.js
- OData V4
- Git & GitHub

## 🔐 Security

The application implements **Role-Based Access Control (RBAC)** using SAP BTP authentication and authorization services. Users are identified by their assigned roles, and dashboard access is controlled accordingly.

## 🚀 Deployment

The application is **deployed on SAP Business Technology Platform (SAP BTP)** and can be accessed through the deployed application environment.

## 📁 Project Structure

| Folder/File | Purpose |
|---|---|
| `app/` | SAP Fiori/UI applications |
| `db/` | CDS data models and database definitions |
| `srv/` | CAP services, business logic, and service definitions |
| `mta.yaml` | Multi-Target Application deployment configuration |
| `xs-security.json` | Security and role configuration |

## 📌 Project Objective

The project aims to improve IT asset visibility, reduce manual tracking, maintain reliable ownership history, support compliance, and provide secure role-based access to asset lifecycle operations.
