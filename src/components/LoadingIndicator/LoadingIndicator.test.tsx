import { render } from "@testing-library/react";
import { LoadingIndicator } from "./LoadingIndicator";

vi.mock("@tanstack/react-router");

describe("<LoadingIndicator> component", () => {
  it("should render", async () => {
    const cmp = render(<LoadingIndicator />);
    expect(await cmp.findByTestId("loading-indicator")).toBeInstanceOf(
      HTMLDivElement
    );
  });
});
