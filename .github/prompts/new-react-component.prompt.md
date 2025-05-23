---
mode: 'agent'
---

Your goal is to generate a new React component. Ask for the name if not provided.

A component will always create 1 files by default in the `apps/web/src/components` directory:

ComponentName.tsx - The component itself

A component will look like this:

```tsx
type Props = {}

export function ComponentName({}: Props) {
  return <div></div>
}
```
