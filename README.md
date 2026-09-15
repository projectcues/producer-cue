# 🎬 Producer Cue

> **Autonomous AI Design & Development Engine (Model Context Protocol Server)**  
> Developed by **Project Cues, Inc.** ([projectcues.com](https://projectcues.com))

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Node](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![MCP](https://img.shields.io/badge/MCP-Protocol_Compliant-purple.svg)](https://modelcontextprotocol.io/)

**Producer Cue** is an enterprise-grade AI design and development engine exposed as a **Model Context Protocol (MCP)** server. It allows AI coding assistants (Cursor, Claude Desktop, Antigravity, ChatGPT) to design, synthesize, heal, and export production-ready, accessible web applications and design systems in real time with **zero build overhead**.

---

## ⚡ Key Capabilities

* **0ms Build Overhead**: Generates declarative reactive ASTs mounted directly into the DOM via signal reactivity without heavy Webpack/Vite bundlers.
* **Compact Semantic DSL**: Reduces context window token consumption by **42%–75%**, eliminating hallucinations and syntax errors.
* **Self-Healing Design Engine**: Mathematically shifts foreground color luminance to achieve guaranteed **WCAG AA (≥ 4.5:1)** contrast and auto-remediates missing ARIA labels.
* **Universal Framework Codegen**: 1-click export to **React + Tailwind (TSX)**, **Svelte 5 (Runes)**, **Vue 3 (`<script setup>`)**, or standalone **Custom Web Elements (`<nc-*>`)**.
* **Headless Accessible Primitives**: Built-in WAI-ARIA components: `ModalDialog`, `Accordion`, `Toast Notification Queue`, `Combobox / Autocomplete`, `Tabs`, `Button`, `Card`, and `Input`.
* **Figma & Tokens Studio Sync**: Two-way design token import/export conforming to the W3C Design Tokens Community Group (DTCG) specification.

---

## 🛠️ MCP Installation & Setup

### 1. Cursor IDE
Open **Cursor Settings** $\rightarrow$ **Features** $\rightarrow$ **MCP Servers** $\rightarrow$ **Add New MCP Server**:
* **Name**: `producer-cue`
* **Type**: `command`
* **Command**: `node /path/to/producer-cue/bin/producer-cue.js`  
  *(or `npx @projectcues/producer-cue`)*

### 2. Claude Desktop
Add to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "producer-cue": {
      "command": "node",
      "args": ["/absolute/path/to/producer-cue/bin/producer-cue.js"]
    }
  }
}
```

### 3. Antigravity / Custom Agent Runner
Add to your agent configuration:
```json
{
  "command": "node",
  "args": ["/Users/lordalmighty/Downloads/producer-cue/bin/producer-cue.js"]
}
```

---

## 🧰 Available MCP Tools

| Tool Name | Description |
| :--- | :--- |
| `producer_generate_theme` | Generates an accessible, WCAG AA-compliant design system theme with 10-step tonal palettes (50–900). |
| `producer_generate_component` | Compiles a high-density Compact Component specification into a full, reactive component AST. |
| `producer_mutate_component` | Applies surgical diff patches (`SetNodeStyle`, `SetNodeText`, `AddVariant`, `InsertChild`, `RemoveNode`) without full regenerations. |
| `producer_audit_and_heal` | Audits a component for accessibility/contrast errors and automatically self-heals any failures. |
| `producer_export_code` | Exports the component into idiomatic **React**, **Svelte 5**, **Vue 3**, or **Custom Web Elements**. |
| `producer_get_primitive` | Retrieves accessible headless primitives (`button`, `card`, `dialog`, `input`, `tabs`, `dropdown`, `accordion`, `toast`, `combobox`). |
| `producer_figma_sync` | Imports or exports Tokens Studio (Figma) design token trees. |

---

## 🧪 Testing the Server
Run the built-in automated test suite:
```bash
node --test test/mcp.test.js
```

---

## 🏛️ Corporate Identity
Producer Cue is designed and maintained by **Project Cues, Inc.** (CAGE 9YWL9, UEI LPSKXU1KEJY8).  
For enterprise licensing, integrations, or federal deployments, contact `government@projectcues.com` or visit [projectcues.com](https://projectcues.com).

## 📄 License
Apache License 2.0.
