# Tree Builder Frontend

A React + TypeScript + Vite application for building and managing a hierarchical tree of nodes.

This UI lets users:

- create root nodes
- create child nodes under any existing node
- expand and collapse branches
- delete nodes
- view optimistic updates immediately while backend persistence happens in the background

## Tech Stack

- React 19
- TypeScript
- Vite
- Axios
- Tailwind CSS 4

## Features

### Tree management

- Render nested tree data with recursive components
- Add root nodes
- Add child nodes
- Delete nodes
- Expand and collapse branches

### Optimistic UI

When a node is created:

- the UI updates immediately with a temporary node
- the API request runs in the background
- if the request succeeds, the temporary node is replaced with the real backend node
- if the request fails, the optimistic node is rolled back and an error is shown

### Smart auto-scroll

The tree list is rendered inside a scrollable container.

- when new nodes are added, the container can auto-scroll to the bottom
- scrolling only happens if the content overflows
- scrolling only happens if the user is already near the bottom
- smooth scrolling is used for a better experience

## Environment

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5001/api/v1
```

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the app:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

## API Expectations

The frontend expects a backend with the following endpoints:

### Get tree

```http
GET /nodes
```

Returns an array of nodes:

```ts
type TreeNodeType = {
  id: string;
  name: string;
  parentId?: string;
  children: TreeNodeType[];
};
```

### Create node

```http
POST /nodes
```

Example payload:

```json
{
  "name": "Frontend",
  "parentId": "123"
}
```

### Delete node

```http
DELETE /nodes/:id
```

## Project Structure

```text
src/
  features/
    tree/
      components/
        nodeActions.tsx
        tree.tsx
        treeNode.tsx
      hooks/
        useAutoScroll.ts
        useTree.ts
      services/
        tree.api.ts
      types/
        tree.types.ts
      utils/
        tree.helpers.ts
  services/
    api.ts
    endpoints.ts
```

## Architecture Notes

### `useTree`

`src/features/tree/hooks/useTree.ts`

Responsible for:

- fetching initial tree data
- storing tree state
- handling optimistic create flows
- syncing with backend APIs
- rollback on create failure
- exposing actions for the UI

### `useAutoScroll`

`src/features/tree/hooks/useAutoScroll.ts`

Responsible for:

- tracking whether the user is near the bottom of the scroll container
- detecting overflow
- scrolling to the bottom when the dependency changes

### `tree.helpers.ts`

Contains immutable tree update helpers such as:

- `addNodeOptimistic`
- `removeNodeById`
- `replaceNodeById`
- `toggleNodeById`
- `addTreeUiState`

## UX Notes

- New nodes may briefly appear with a pending state before the backend confirms creation.
- If saving fails, the optimistic node is removed and an error message is shown.
- The UI avoids full tree refetches after node creation for better responsiveness.

## Future Improvements

- Toast notifications instead of inline error messages
- Edit/rename node support
- Drag-and-drop tree reordering
- Search and filter within the tree
- Better delete error handling with rollback
- Unit tests for tree helper functions and hooks

## Summary

This project is a small but solid example of a modern React tree UI with:

- recursive rendering
- optimistic updates
- immutable tree operations
- reusable hooks
- backend synchronization
- user-friendly scroll behavior
