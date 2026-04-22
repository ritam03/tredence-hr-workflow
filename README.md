# HR Workflow Designer - Tredence Case Study

**Live Demo:** [Demo Link](https://tredence-hr-workflow-one.vercel.app/)

## Objective
A functional prototype of a mini-HR Workflow Designer module. This application allows HR admins to visually create, configure, and simulate internal workflows (like onboarding or document verification) using a drag-and-drop canvas.

## Features Completed
* **Interactive Canvas:** Built with React Flow, supporting drag-and-drop from a custom sidebar, edge connections, and smooth zoom/pan controls.
* **Custom Nodes:** Implemented 5 distinct node types (Start, Task, Approval, Automated Step, End) with custom SVG icons and distinct visual states.
* **Dynamic Configuration Panels:** A context-aware properties panel that dynamically updates its fields based on the currently selected node type.
* **Mock API Integration:** Simulated asynchronous endpoints to fetch automated actions and execute workflow simulations.
* **Execution Sandbox:** A validation and simulation engine that serializes the graph structure, traverses the nodes, detects structural errors (e.g., missing start nodes, infinite cycles), and outputs a step-by-step execution log.

## Architecture & Tech Stack
* **Framework:** React + Vite + TypeScript. (TypeScript ensures strict interfaces for node data payloads and graph structures).
* **Graph Engine:** React Flow.
* **State Management:** Zustand. Chosen over Redux/Context for its minimal boilerplate and superior performance. It allows the canvas and the configuration forms to share state seamlessly without heavy provider wrapping.
* **Styling:** Tailwind CSS + Lucide React for clean, utility-first design matching modern analytical UI patterns.

## Design Decisions & Assumptions
1. **Local Mock API:** Instead of setting up a separate JSON server which complicates deployment, I engineered a robust local mock service utilizing JavaScript `Promises` and `setTimeout`. This perfectly mimics network latency while allowing the application to remain a static SPA, ensuring a frictionless live demo deployment on Vercel.
2. **Simulation Traversal:** For the scope of this prototype, the graph traversal algorithm assumes a linear or first-available-edge execution path. It incorporates cycle detection (visited sets) and boundary checks to prevent infinite loops during simulation.
3. **Form Handling:** I utilized controlled components tied directly to the Zustand store. The configuration panel safely updates a node's internal data object `onChange` without causing unnecessary canvas re-renders.

## What I Would Add With More Time
* **Backend Persistence:** Transitioning the local mock API to a real backend using Node.js, Express, and PostgreSQL to save and retrieve complex workflow definitions persistently.
* **Complex Branching Logic:** Upgrading the simulation engine to handle parallel execution paths (e.g., waiting for two concurrent "Task" nodes to complete before triggering an "Approval" node).
* **Undo/Redo History:** Implementing a time-travel state wrapper around the Zustand store to allow admins to revert accidental canvas deletions.
* **Authentication & RBAC:** Securing the designer behind an admin login and restricting certain node deployments based on user roles.

## How to Run Locally

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/ritam03/tredence-hr-workflow.git
   \`\`\`
2. Navigate to the project directory:
   \`\`\`bash
   cd tredence-hr-workflow
   \`\`\`
3. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
4. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`