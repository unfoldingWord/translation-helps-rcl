# Card

A Card Component.

```jsx
import React from "react";
import Card from "./Card";

<Card
  alert
  // closeable
  title={<div>Title</div>}
  center={<div>Center</div>}
  onClose={() => console.log("closed")}
>
  <p>Description</p>
</Card>;
```
