import React from "react";

type Props<K extends string> = Record<string, unknown> & Record<K, string>;

type Maybe<T> = T | null | undefined;

type GetKey<K extends string, T extends Maybe<Props<K>>> =
  | K
  | ((t: T, i?: number) => string | number);

type PropsList<P> = Maybe<P[]> | Record<string, P>;

type BaseRenderMultipleProps<
  K extends string,
  L extends Maybe<Props<K>>,
  C extends Record<string, unknown> = {}
> = {
  of: React.FC<L & C>;
  useKey: GetKey<K, L>;
};

type WithoutCommonProps<
  K extends string,
  P extends Maybe<Props<K>>
> = BaseRenderMultipleProps<K, P> & {
  fromPropsList: PropsList<P>;
};

type WithCommonProps<
  K extends string,
  L extends Maybe<Props<K>>,
  C extends Record<string, unknown>
> = BaseRenderMultipleProps<K, L, C> & {
  fromPropsList: PropsList<L>;
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
  return props.hasOwnProperty(key);
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
        : (props: P, i: number): string | undefined =>
            props?.[useKey] ?? i.toString();
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
  "withCommonProps" | "fromPropsList"
> & {
  fromPropsList: Maybe<P[]>;
};

const Multiple = <K extends string, L extends Maybe<Props<K>>>({
  of: Component,
  fromPropsList,
  useKey,
}: MultipleProps<K, L>) => {
  const getKey = createGetKey(useKey);
  const list = (fromPropsList ?? []).map((ownProps, i) => {
    const key = getKey(ownProps, i);
    return <Component {...ownProps} key={key} />;
  });
  return <>{list}</>;
};

export const RenderMultiple = <
  K extends string,
  L extends Maybe<Props<K>>,
  C extends Record<string, unknown>
>(
  props: WithCommonProps<K, L, C> | WithoutCommonProps<K, L>
) => {
  if (hasCommonProps(props)) {
    const { fromPropsList, withCommonProps, ...rest } = props;
    const propsList = toArray(fromPropsList).map((ownProps) => ({
      ...withCommonProps,
      ...ownProps,
    }));
    return <Multiple fromPropsList={propsList} {...rest} />;
  }
  const { fromPropsList, ...rest } = props;
  const propsList = toArray(fromPropsList);

  return <Multiple fromPropsList={propsList} {...rest} />;
};
