# TsvContent

Renders TSV data.

```jsx
import React from 'react'
import Card from '../Card'

function Component() {
  return (
    <Card
      title={<div>Notes</div>}
      onClose={() => console.log('closed')}
    >
      <TsvContent
        id='kx1g'
        book='EPH'
        verse={1}
        chapter={1}
        occurrence={1}
        supportReference='figs-you'
        glQuote='Paul, an apostle…to the saints who are in Ephesus'
        originalQuote='Παῦλος, ἀπόστολος Χριστοῦ Ἰησοῦ…τοῖς ἁγίοις τοῖς οὖσιν ἐν Ἐφέσῳ'
        occurrenceNote='Your language may have a particular way of introducing the author of a letter and its intended audience. Alternate translation: “I, Paul, an apostle…write this letter to you, God’s holy people in Ephesus”'
      />
    </Card>
  )
}

<Component />
```
