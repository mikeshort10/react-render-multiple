import React from "react";

type Props<K extends string> = Record<string, unknown> & Record<K, unknown>;

type Maybe<T> = T | null | undefined;

type GetKey<K extends string, T extends Maybe<Props<K>>> =
  | K
  | ((t: T, i?: number) => string | number);

type PropsList<P> = Maybe<P[]> | Record<string, P>;

type BaseRenderMultipleProps<
  K extends string,
  L extends Maybe<Props<K>>,
  C extends Record<string, unknown> = Record<never, never>
> = {
  of: React.FC<L & C>;
  useKey?: GetKey<K, L>;
  ifNone?: React.FC;
};

type WithoutCommonProps<
  K extends string,
  P extends Maybe<Props<K>>
> = BaseRenderMultipleProps<K, P> & {
  from: PropsList<P>;
};

type WithCommonProps<
  K extends string,
  L extends Maybe<Props<K>>,
  C extends Record<string, unknown>
> = BaseRenderMultipleProps<K, L, C> & {
  from: PropsList<L>;
  withCommonProps: C;
};

const hasCommonProps = <
  K extends string,
  L extends Maybe<Props<K>>,
  C extends Record<string, unknown>
>(
  props: WithoutCommonProps<K, L> | WithCommonProps<K, L, C>
): props is WithCommonProps<K, L, C> => {
  const key: keyof WithCommonProps<K, L, C> = "withCommonProps";
  return Object.prototype.hasOwnProperty.call(props, key);
};

const createGetKey = <K extends string, P extends Maybe<Props<K>>>(
  useKey: Maybe<GetKey<K, P>>
) => {
  return (props: P, i: number) => {
    if (useKey == null) {
      return i;
    }
    const getKeyFn =
      typeof useKey === "function"
        ? useKey
        : (props: P, i: number): string | undefined => {
            return `${props?.[useKey]}` ?? i.toString();
          };
    return getKeyFn(props, i);
  };
};

const toArray = <T,>(t: Maybe<T[] | Record<string, T>>): T[] => {
  if (t == null) {
    return [];
  }
  return Array.isArray(t) ? t : Object.values(t);
};

type MultipleProps<K extends string, P extends Maybe<Props<K>>> = Omit<
  WithoutCommonProps<K, P>,
  "withCommonProps" | "from"
> & {
  from: Maybe<P[]>;
};

const Multiple = <K extends string, L extends Maybe<Props<K>>>({
  of: Component,
  from,
  useKey,
}: MultipleProps<K, L>) => {
  const getKey = createGetKey(useKey);
  const list = (from ?? []).map((ownProps, i) => {
    const key = getKey(ownProps, i);
    return <Component {...ownProps} key={key} />;
  });
  return <>{list}</>;
};

const hasNone = <T,>(ts: PropsList<T>) =>
  ts == null || ts.length === 0 || Object.values(ts);

export const RenderMultiple = <
  K extends string,
  L extends Maybe<Props<K>>,
  C extends Record<string, unknown>
>(
  props: WithCommonProps<K, L, C> | WithoutCommonProps<K, L>
) => {
  if (hasNone(props.from) && props.ifNone != null) {
    return <props.ifNone />;
  } else if (hasCommonProps(props)) {
    const { from, withCommonProps, ...rest } = props;
    const propsList = toArray(from).map((ownProps) => ({
      ...withCommonProps,
      ...ownProps,
    }));
    return <Multiple from={propsList} {...rest} />;
  }
  const { from, ...rest } = props;
  const propsList = toArray(from);

  return <Multiple from={propsList} {...rest} />;
};

export default RenderMultiple;
