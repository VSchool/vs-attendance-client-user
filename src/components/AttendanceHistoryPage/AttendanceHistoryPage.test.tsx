import { render, waitFor } from "@testing-library/react";
import { AttendanceHistoryPage } from ".";
import { mockNavigate } from "../../../__mocks__/@tanstack/react-router";

vi.mock("@tanstack/react-router");
vi.mock("../../client");

describe("<AttendanceHistoryPage> component", () => {
  it("should render", async () => {
    const cmp = render(<AttendanceHistoryPage />);
    expect(await cmp.findByTestId("attendance-history-page")).toBeInstanceOf(
      HTMLDivElement
    );
  });

  it("should show loading on mount", async () => {
    const cmp = render(<AttendanceHistoryPage />);
    expect(await cmp.findByTestId("loading-indicator")).toBeDefined();
  });

  it("should show message for empty list", async () => {
    const cmp = render(<AttendanceHistoryPage />);
    vi.doMock("../../client", () => ({
      getAttendanceLogsForUser: vi.fn(() => Promise.resolve([])),
    }));
    expect(await cmp.findByTestId("attendance-history-no-logs")).toBeDefined();
  });

  it("should redirect to error page if fetch fails", async () => {
    render(<AttendanceHistoryPage />);
    vi.doMock("../../client", () => ({
      getAttendanceLogsForUser: vi.fn(() => Promise.reject("test error")),
    }));
    await waitFor(() =>
      expect(mockNavigate.mock.calls[0][0].to).toBe("/error-page")
    );
  });

  it("should show entries if they exist", async () => {
    const cmp = render(<AttendanceHistoryPage />);
    vi.doMock("../../client", () => ({
      getAttendanceLogsForUser: vi.fn(() =>
        Promise.resolve([
          {
            first_name: "test",
            last_name: "test",
            full_name: "test",
            _id: "test",
            start: new Date().toISOString(),
            end: new Date().toISOString(),
            week_of: new Date().toISOString(),
          },
        ])
      ),
    }));
    await waitFor(() =>
      expect(cmp.findByTestId("attendance-history-logs")).toBeDefined()
    );
  });
});
