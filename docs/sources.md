# Indian Startup Legal Sources & PDF Parsing Guide

This guide details all corporate agreements, regulatory compliance filings, and financial records necessary to train, parse, or evaluate a RAG (Retrieval-Augmented Generation) model tuned to Indian startup legal context.

---

## 📄 1. Core Transactional Agreements

These are agreements executed between founders, investors, and core employees. They establish ownership, IP rights, and liquidation conditions.

| Document Name | Common Extension | Purpose & High-Risk Clauses to Flag |
| :--- | :--- | :--- |
| **Term Sheet** | `.pdf` | The preliminary non-binding agreement. Key areas to parse include: valuations, liquidation preference multiplier, board seat rights, exclusivity periods. |
| **Shareholders' Agreement (SHA)** | `.pdf` | Binding contract outlining shareholder relationship. Audit targets: right of first refusal (ROFR), right of first offer (ROFO), tag-along/drag-along rights, and veto matters. |
| **Share Subscription Agreement (SSA)** | `.pdf` | Governs the subscription of new shares, representation and warranties, and conditions precedent. |
| **Share Purchase Agreement (SPA)** | `.pdf` | Executed when existing shares are transferred from founders/investors to new buyers. |
| **Mutual Non-Disclosure Agreement (NDA)** | `.pdf` | Audit targets: Definition of confidential information, carve-outs for prior IP, and post-termination restrictions. |
| **Employment Agreement (Founders/KMPs)** | `.pdf` | Key audit targets: Non-compete scope, intellectual property assignment, and non-solicitation parameters. |

---

## 🏛️ 2. Ministry of Corporate Affairs (MCA) Filings

Under the Companies Act 2013, Indian startups must file specific forms with the Registrar of Companies (RoC). These forms are critical because they represent the statutory truth, which may sometimes contradict what is written in internal term sheets.

| MCA Form Name | Statutory Purpose | Why It is Needed in RAG |
| :--- | :--- | :--- |
| **Form MGT-7** | Annual Return | Contains details of shareholding structure, transfers, directors, and governance history. Useful for cap-table cross-verification. |
| **Form AOC-4** | Financial Statements | Houses audited balance sheets, profit & loss statements, and auditor reports. |
| **Form PAS-3** | Return of Share Allotment | Filed whenever a startup issues new equity shares (e.g. after a funding round). Validates share subscription matches the SSA. |
| **Form SH-7** | Alteration of Share Capital | Filed when increasing authorized capital or altering share classes. |
| **Form DIR-12** | Appointment/Resignation of Directors | Validates Board of Directors structure against board seat rights listed in the SHA. |
| **Form CHG-1** | Creation/Modification of Charge | Details secured loans or debt charges created on company assets. Critical for liability auditing. |

---

## 📈 3. Capitalization and Valuation Files

*   **Cap Table (Capitalization Table)**: Usually stored as a `.xlsx` or `.pdf` file showing fully diluted equity ownership, options pool allocations (ESOP), and historical share issues.
*   **Valuation Report**: Certificates issued by a Registered Valuer (IBBI) or Merchant Banker under the Income Tax Act (Rule 11UA) or FEMA guidelines. These certify the Fair Market Value (FMV) of shares.

---

## 🌐 4. FEMA and RBI Regulatory Filings

For startups receiving foreign direct investments (FDI):
*   **Form FC-GPR**: Filed with the RBI when issuing shares to foreign investors.
*   **Form FC-TRS**: Filed when transferring shares between foreign residents and Indian residents.

---

## 🛠️ Extraction & Parsing Strategies

Many Indian legal documents are scanned PDFs containing physical signatures, seals, stamp paper watermarks, and multi-column tables.

### A. PyMuPDF (`fitz`) — Lexical & Clean Text
*   **Best For**: Digital-native PDFs (NDAs, draft SHAs, clean employment letters).
*   **Advantage**: Fast, requires no API tokens, and returns clean paragraphs with minimal formatting noise.

### B. LlamaParse — Complex and Tabular PDFs
*   **Best For**: Scanned agreements, cap tables (complex rows and columns), and MCA filing tables.
*   **Advantage**: Automatically converts tables into markdown format (e.g., `| Column | Column |`), allowing semantic embeddings to retain row-column relationships that naive text extractors scramble.
