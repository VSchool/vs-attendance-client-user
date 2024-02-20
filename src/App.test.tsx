import { render } from "@testing-library/react";
import App from "./App";
import { httpClient } from "./__mocks__/http";
import { ACCESS_TOKEN_CACHE_KEY } from "./constants";

const localStorageGetItemMock = vi.spyOn(Storage.prototype, "getItem");
const locationSearchMock = vi.spyOn(location, "search", "get");
vi.mock("./http");

describe("<App/> component", () => {

  it("should render loading message on mount", async () => {
    const cmp = render(<App />);
    httpClient.mockResolvedValue({ success: false });
    expect(await cmp.findByTestId("app-loading")).toBeInstanceOf(
      HTMLDivElement
    );
  });

  it("should render success message if url token matches cached token", async () => {
    httpClient.mockResolvedValue({ success: false });
    localStorageGetItemMock.mockImplementation(vi.fn(() => "access_token"));
    locationSearchMock.mockImplementation(
      vi.fn(() => "?access_token=access_token")
    );
    const cmp = render(<App />);
    expect(await cmp.findByTestId("app-success")).toBeInstanceOf(
      HTMLDivElement
    );
  });

  it("should render error message if token validation fails", async () => {
    httpClient.mockResolvedValue({ success: false });
    localStorageGetItemMock.mockImplementation(vi.fn(() => null));
    locationSearchMock.mockImplementation(vi.fn(() => "?access_token=invalid"));
    const cmp = render(<App />);
    expect(await cmp.findByTestId("app-error")).toBeInstanceOf(HTMLDivElement);
  });

  it("should authenticate and render form if new token is issued", async () => {
    httpClient.mockResolvedValue({ success: true });
    localStorageGetItemMock.mockImplementation(vi.fn((key) => key === ACCESS_TOKEN_CACHE_KEY ? 'expired' : "{}"));
    locationSearchMock.mockImplementation(
      vi.fn(() => "?access_token=new-token")
    );
    const cmp = render(<App />);
    expect(await cmp.findByTestId("app-loaded")).toBeInstanceOf(HTMLDivElement);
    expect(await cmp.findByTestId("attendance-form")).toBeInstanceOf(HTMLFormElement);
  });
});
