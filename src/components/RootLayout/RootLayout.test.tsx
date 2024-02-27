import { render } from "@testing-library/react";
import { RootLayout } from "./RootLayout";
import { Outlet } from "../../../__mocks__/@tanstack/react-router";

vi.mock("@tanstack/react-router");

describe("<RootLayout> component", () => {
  it("should render", async () => {
    const cmp = render(<RootLayout />);
    expect(await cmp.findByTestId("root-layout")).toBeInstanceOf(
      HTMLDivElement
    );
    expect(Outlet).toHaveBeenCalledOnce();
  });
});
