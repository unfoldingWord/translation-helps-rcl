# Card

A Card Component.

```jsx
import React from "react";
import Card from "./Card";

<Card
  alert
  title={<div>Notes</div>}
  items={[1, 2, 3]}
  onClose={() => console.log("closed")}
>
  <p>Description</p>
</Card>;
```
