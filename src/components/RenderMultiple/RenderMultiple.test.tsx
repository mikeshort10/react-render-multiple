import "@testing-library/jest-dom/extend-expect";
import React from "react";
import RenderMultiple from "./RenderMultiple";
import { render } from "@testing-library/react";

type TestComponentProps = {
  title: string;
  description: string;
  testId: number;
};

const TestComponent = ({ title, description, testId }: TestComponentProps) => {
  return (
    <div data-testid={testId}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

describe("RenderMultiple", () => {
  it("renders", async () => {
    render(<RenderMultiple of={TestComponent} from={[]} />);
  });

  it("renders from list", async () => {
    const propsList: TestComponentProps[] = [
      {
        title: "First component",
        description: "This is the first component",
        testId: 1,
      },
      {
        title: "First component",
        description: "This is the first component",
        testId: 2,
      },
    ];

    const { getByTestId } = render(
      <RenderMultiple of={TestComponent} from={propsList} />
    );

    expect(getByTestId(1).querySelector("h2")?.innerHTML).toEqual(
      propsList[0]?.title
    );
    expect(getByTestId(1).querySelector("p")?.innerHTML).toEqual(
      propsList[0]?.description
    );
    expect(getByTestId(1).querySelector("h2")?.innerHTML).toEqual(
      propsList[1]?.title
    );
    expect(getByTestId(1).querySelector("p")?.innerHTML).toEqual(
      propsList[1]?.description
    );
  });

  it("renders from list and withCommonProps", async () => {
    const withCommonProps = { description: "Common description" };
    const propsList: Omit<TestComponentProps, "description">[] = [
      {
        title: "First component",
        testId: 1,
      },
      {
        title: "First component",
        testId: 2,
      },
    ];

    const { getByTestId } = render(
      <RenderMultiple
        of={TestComponent}
        from={propsList}
        withCommonProps={withCommonProps}
      />
    );

    expect(getByTestId(1).querySelector("h2")?.innerHTML).toEqual(
      propsList[0]?.title
    );
    expect(getByTestId(1).querySelector("p")?.innerHTML).toEqual(
      withCommonProps.description
    );
    expect(getByTestId(1).querySelector("h2")?.innerHTML).toEqual(
      propsList[1]?.title
    );
    expect(getByTestId(1).querySelector("p")?.innerHTML).toEqual(
      withCommonProps.description
    );
  });
});
