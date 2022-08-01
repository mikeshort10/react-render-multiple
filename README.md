# React Render Multiple

React component to render a list of components inline, with full TypeScript support.

```javascript
<RenderMultiple of={MyComponent} from={propsList} />
```

## Installation and Usage

```bash
  npm i react-render-multiple
```

or

```bash
  yarn add react-render-multiple
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

The following props are supported:

### of: `React.FC<T>`

`of` should be a React Component that will be rendered for each value in `from`.

### from: `T[] | Partial<T>[]`

`from` defines the props that will be passed to the React Components. The props may be a Partial of the props needed to render the component, so long as the remaining props are passed to the `withCommonProps` attribute.

### useKey: `keyof T | (props: T, index: number) => string`

`useKey` defines how to get the `key` for each Component rendered inside `RenderMultiple`. If it is a string, it must be a key of T that evaluates to a string. If it is a function, it will be passed the current props and the index of the props and must return a string to be used as a key. If no useKey is provided, RenderMultiple will simply use the index of the component as the key. [It's highly recommended that you set this value](https://reactjs.org/docs/lists-and-keys.html#keys), however.

### withCommonProps: `Partial<T>`

`withCommonProps` defines any props that are common to all of the components rendered, such as a common className or onClick handler.

```typescript
import { Card } from "./Card";
import { RenderMultiple } from "react-render-multiple";

const MyCardList = ({ cards }) => {
  const onClick = (card) => `/posts/${card.id}`;
  return (
    <ul>
      <RenderMultiple
        of={Card}
        from={cards}
        useKey="id"
        withCommonProps={{ onClick }}
      />
    </ul>
  );
};
```
