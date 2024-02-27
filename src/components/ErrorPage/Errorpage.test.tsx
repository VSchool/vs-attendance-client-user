import { render } from "@testing-library/react";
import { ErrorPage } from "./ErrorPage";
import { useSearch } from "../../../__mocks__/@tanstack/react-router";

vi.mock("@tanstack/react-router");

describe("<ErrorPage> component", () => {
  it("should render", async () => {
    const cmp = render(<ErrorPage />);
    expect(await cmp.findByTestId("error-page")).toBeInstanceOf(HTMLDivElement);
  });

  it("should display error message", async () => {
    useSearch.mockImplementationOnce(() => ({ error: "error-message" }));
    const cmp = render(<ErrorPage />);
    expect(await cmp.findByText("error-message")).toBeInstanceOf(
      HTMLParagraphElement
    );
  });
});
