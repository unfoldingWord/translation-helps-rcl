# FontSizeSlider

Font Size Slider component.

```jsx
import React, { useState } from 'react'

const Component () => {
  const [fontSize, setFontSize] = useState(100)

  return <FontSizeSlider value={fontSize} onChange={setFontSize} />
}

<Component/>
```
