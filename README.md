# React Render Multiple

React component to render a list of components inline, with full TypeScript support.

```javascript
<RenderMultiple of={MyComponent} from={propsList} />
```

## Installation and Usage

```bash
  npm i @mikeshort10/react-render-multiple
```

or

```bash
  yarn add @mikeshort10/react-render-multiple
```

Now you can render this:

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

Simply as this:

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

| Name            | Required                                                                          | Type          | Description                                                                                                 |
| --------------- | --------------------------------------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| of              | Required                                                                          | `React.FC<T>` | The React Component that will be rendered for each value in `from`.                                         |
| from            | Required                                                                          | `T[]          | Partial<T>[]`                                                                                               | The list of props that will be passed to the component defined in `of`, which may be a Partial of the props needed to render the component. See `withCommonProps`.                                                                                                                                                                                                                                          |
| useKey          | Recommended ([See React docs](https://reactjs.org/docs/lists-and-keys.html#keys)) | `keyof T      | (props: T, index: number) => string`                                                                        | Field or method to get the `key` for each Component rendered inside `RenderMultiple`. If a string, it must be a key of props passed into to the Component (`T`) which holds a value of type `string`. If a function, it takes the current props and index and must return a `string` to be used as a key. If no `useKey` is provided, RenderMultiple will simply use the index of the component as the key. |
| withCommonProps | Optional                                                                          | `Partial<T>`  | Any props that are common to all of the components rendered, such as a common className or onClick handler. |

## Example using `withCommonProps`

```typescript
import { Card } from "./Card";
import { RenderMultiple } from "react-render-multiple";

const MyCardList = ({ cards }) => {
  const getHref = (card) => `/posts/${card.id}`;
  return (
    <ul>
      <RenderMultiple
        of={Card}
        from={cards}
        useKey="id"
        withCommonProps={{ getHref }}
      />
    </ul>
  );
};
```

## Wrapping the Rendered Components

RenderMultiple wraps your list in a `React.Fragment`. To render the contents of RenderMultiple inside another a parent element, just make RenderMultiple the child of your selected wrapper component:

```typescript
<ul>
  <RenderMultiple of={ListItem} from={propsList} />
</ul>
```
