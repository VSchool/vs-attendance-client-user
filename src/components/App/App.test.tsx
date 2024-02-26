import { render, waitFor } from "@testing-library/react";
import { App } from ".";
import { httpClient } from "../../__mocks__/http";
import { ACCESS_TOKEN_CACHE_KEY } from "../../constants";
import { mockNavigate } from "../../../__mocks__/@tanstack/react-router";

vi.mock("../../http");
vi.mock("@tanstack/react-router");
const localStorageGetItemMock = vi.spyOn(Storage.prototype, "getItem");
const locationSearchMock = vi.spyOn(location, "search", "get");

describe("<App/> component", () => {
  it("should render loading message on mount", async () => {
    httpClient.mockResolvedValue({ success: false });
    const cmp = render(<App />);
    expect(await cmp.findByTestId("loading-indicator")).toBeInstanceOf(
      HTMLDivElement
    );
  });

  it("should navigate to success page if url token matches cached token", async () => {
    httpClient.mockResolvedValue({ success: false });
    localStorageGetItemMock.mockImplementation(vi.fn(() => "access_token"));
    locationSearchMock.mockImplementation(
      vi.fn(() => "?access_token=access_token")
    );
    render(<App />);
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/success" });
  });

  it("should navigate to error page if token validation fails", async () => {
    httpClient.mockResolvedValue({ success: false });
    localStorageGetItemMock.mockImplementation(vi.fn(() => null));
    locationSearchMock.mockImplementation(vi.fn(() => "?access_token=invalid"));
    render(<App />);
    await waitFor(() =>
      expect(mockNavigate.mock.calls[0][0].to).toBe("/error-page")
    );
  });

  it("should authenticate and render form if new token is issued", async () => {
    httpClient.mockResolvedValue({ success: true });
    localStorageGetItemMock.mockImplementation(
      vi.fn((key) => (key === ACCESS_TOKEN_CACHE_KEY ? "expired" : "{}"))
    );
    locationSearchMock.mockImplementation(
      vi.fn(() => "?access_token=new-token")
    );
    const cmp = render(<App />);
    expect(await cmp.findByTestId("attendance-form")).toBeInstanceOf(
      HTMLFormElement
    );
  });
});
