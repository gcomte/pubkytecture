# 🏗️ pubkytecture

**Visualize the invisible. Follow the traces of a distributed system.**

`pubkytecture` is a developer-focused learning tool designed to deconstruct and animate the inner workings of the [Pubky](https://pubky.app/) ecosystem. While most users only see the interface of a decentralized social app, `pubkytecture` provides a "glass-box" simulation of the entire Pubky lifecycle — from key generation over publishing content to global indexing.

powered by [`@synonymdev/pubky`](https://www.npmjs.com/package/@synonymdev/pubky)

---

## 🧐 What is this?

Distributed architectures are often hard to grasp because the data flow is non-linear. `pubkytecture` acts as a **visual tracer**. When you perform an action (like posting a picture), the tool halts at every architectural layer, showing you exactly what is happening under the hood:

1.  **Identity Layer:** Keypair generation and registration onto Mainline DHT.
2.  **Discovery Layer:** Mainline DHT lookups over PKDNS.
3.  **Storage Layer:** Publishing media to homeserver.
4.  **Indexing Layer:** Nexus crawling homeserver.
5.  **** Nexus crawling homeserver.

For each step pubkeytecture furthermore explains, why given architecture is beneficial, highlighting concepts like [Credible Exit](https://newsletter.squishy.computer/p/credible-exit).

---

## 🚀 Key Simulations

### 1. Identity Birth (Account Creation)
Witness how a user becomes a sovereign entity on the web.
*   **Key Gen:** Generating Ed25519 pairs.
*   **PKDNS:** Publishing the public key to the **Mainline DHT**, making your "handle" resolvable globally.

### 2. The Journey of a Post
Follow a single piece of content from a user's click to the global feed:
*   **Resolution:** The app performs a DHT lookup to find the user's current **Homeserver**.
*   **Transmission:** Data is signed and pushed to the Homeserver via Pubky Core.
*   **Indexing:** The **Nexus** (indexer) detects the new content on the homeserver and parses it.
*   **Retrieval:** The frontend queries the Nexus to display the post in a structured social feed.

---

## 🛠️ Tech Stack

- **Core Logic:** TypeScript
- **Pubky Protocol:** `@synonymdev/pubky` (v0.6.0-rc.7)
- **Visuals:** React + Framer Motion

---

## 🏗️ Architecture Overview

The simulation maps the following flow:

```mermaid
graph TD
    A[User/Pubkytecture] -->|1. Generate| B(Keypair)
    B -->|2. Publish| C((Mainline DHT))
    A -->|3. Post Content| D{Lookup DHT}
    D -->|4. Resolve| E[Homeserver]
    E -->|5. Store Data| E
    F[Nexus Indexer] -->|6. Crawl| E
    A -->|7. Query| F
    F -->|8. Return JSON| A
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- A basic understanding of Decentralized Identifiers (DIDs)

### Installation

```bash
# Clone the repository
git clone https://github.com/gcomte/pubkytecture.git

# Navigate to directory
cd pubkytecture

# Install dependencies
npm install
```

### Run the Simulator

```bash
npm run dev
```

---

## 📖 Educational Goals

This tool is designed to answer common developer questions:
- *How does the app know which server my data is on?* (Answer: DHT/PKDNS)
- *Is my data instantly searchable?* (Answer: Only after the Nexus indexes it)
- *What happens if I change my homeserver?* (Answer: Update the DHT record)

## 🤝 Contributing

We welcome contributions that add more "steps" to the visualization (e.g., following, re-pubkying, or binary data handling). 

1. Fork the repo.
2. Create your feature branch.
3. Submit a PR.

## 📄 License

MIT

---
*Created for the Pubky developer community.*
