# React Render Multiple

React component to render a list of components inline, with full TypeScript support.

```javascript
<RenderMultiple of={MyComponent} from={propsList} />
```

## Installation

```bash
  npm i @mikeshort10/react-render-multiple
```

or

```bash
  yarn add @mikeshort10/react-render-multiple
```

## Usage

Now replace any inline mapping with RenderMultiple

### Before

```typescript
import { Card } from "./Card";

const MyCardList = ({ cards }) => {
  return (
    <ul>
      {cards.map((card) => {
        return <Card key={card.id} {...card} />;
      })}
    </ul>
  );
};
```

### After

```typescript
import { Card } from "./Card";
import { RenderMultiple } from "react-render-multiple";

const MyCardList = ({ cards }) => {
  return (
    <ul>
      <RenderMultiple of={Card} from={cards} useKey="id" />
    </ul>
  );
};
```

## Props

| Name            | Required                                                                          | Type                                               | Description                                                                                                                                                                                                                                                              |
| --------------- | --------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| of              | Required                                                                          | `React.FC<T>`                                      | The React Component that will be rendered for each value in `from`.                                                                                                                                                                                                      |
| from            | Required                                                                          | `T[]` \| `Pick<T, Keys>[]`                         | The list of props that will be passed to the component defined in `of`, which may be a Partial of the props needed to render the component. See `withCommonProps`.                                                                                                       |
| useKey          | Recommended ([See React docs](https://reactjs.org/docs/lists-and-keys.html#keys)) | `keyof T` \| `(props: T, index: number) => string` | Getter for the `key` of the Components rendered inside `RenderMultiple`. <ul><li> Strings must be a key of the props passed to `from` which holds a value of type string.</li> <li>Functions take the current props and index and must return a `string` key. </li></ul> |
| withCommonProps | Optional                                                                          | `Omit<T, Keys>`                                    | Any props that are common to all of the Components rendered, such as a common className or onClick handler.                                                                                                                                                              |

## Example using `withCommonProps`

```typescript
import { Card } from "./Card";
import { RenderMultiple } from "react-render-multiple";

const MyCardList = ({ cards }) => {
  const [selectedCardId, setSelectedCardId] = React.useState<string | null>(
    null
  );

  const onClick = (id) => {
    setSelectedCard(id);
  };

  return (
    <ul>
      <RenderMultiple of={Card} from={cards} withCommonProps={{ onClick }} />
    </ul>
  );
};
```

## Wrapping the Rendered Components

RenderMultiple wraps your list in a `React.Fragment`. To render the contents of RenderMultiple inside a specific parent element, simply place RenderMultiple inside selected wrapper component:

```typescript
<ul>
  <RenderMultiple of={ListItem} from={propsList} />
</ul>
```
