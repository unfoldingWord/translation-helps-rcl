# Card

A Card Component.

```jsx
import React from "react";
import Card from "./Card";

<Card
  alert
  title={<div>Notes</div>}
  center={<div>{"< 1 of 7 >"}</div>}
  onClose={() => console.log("closed")}
>
  <p>Description</p>
</Card>;
```
