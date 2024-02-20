import {
  render,
  fireEvent,
  act,
  screen,
  waitFor,
} from "@testing-library/react";
import { AttendanceForm } from "./AttendanceForm";
import { httpClient } from "../__mocks__/http";

const localStorageGetItemMock = vi.spyOn(Storage.prototype, "getItem");
vi.mock("../http");

const cacheJSON = `{"firstName": "test","lastName": "test", "email":"test@test.com"}`;

describe("<AttendanceForm/> component", () => {
  it("should show empty, editable fields if cache is empty", async () => {
    localStorageGetItemMock.mockReturnValue("{}");
    act(() => render(<AttendanceForm onSuccess={vi.fn()} />));
    expect(
      ((await screen.findByTestId("first-name")) as HTMLInputElement).value
    ).toBe("");
    expect(
      ((await screen.findByTestId("last-name")) as HTMLInputElement).value
    ).toBe("");
    expect(
      ((await screen.findByTestId("email")) as HTMLInputElement).value
    ).toBe("");
  });

  it("should show disabled, filled fields if cache is full", async () => {
    localStorageGetItemMock.mockReturnValue(cacheJSON);
    act(() => render(<AttendanceForm onSuccess={vi.fn()} />));

    const firstNameInput = (await screen.findByTestId(
      "first-name"
    )) as HTMLInputElement;
    const lastNameInput = (await screen.findByTestId(
      "last-name"
    )) as HTMLInputElement;
    const emailInput = (await screen.findByTestId("email")) as HTMLInputElement;

    expect(firstNameInput.value).toBe("test");
    expect(firstNameInput.disabled).toBe(true);
    expect(lastNameInput.value).toBe("test");
    expect(lastNameInput.disabled).toBe(true);
    expect(emailInput.value).toBe("test@test.com");
    expect(emailInput.disabled).toBe(true);
  });

  it("should show submitting if submission is pending", async () => {
    localStorageGetItemMock.mockReturnValue(cacheJSON);
    act(() => render(<AttendanceForm onSuccess={vi.fn()} />));
    const checkinBtn = await screen.findByTestId("check-in");
    act(() => {
      fireEvent.click(checkinBtn);
    });
    expect(await screen.findByTestId("form-submitting")).toBeInstanceOf(
      HTMLParagraphElement
    );
  });

  it("should call httpClient with correct payload", async () => {
    localStorageGetItemMock.mockReturnValue(cacheJSON);
    act(() => render(<AttendanceForm onSuccess={vi.fn()} />));
    const checkinBtn = await screen.findByTestId("check-in");
    act(() => {
      fireEvent.click(checkinBtn);
    });
    expect(httpClient).toHaveBeenCalledWith("/api/attendance/log-entry", {
      method: "POST",
      body: JSON.stringify({
        fields: {
          firstName: "test",
          lastName: "test",
          email: "test@test.com",
        },
        type: "CHECK_IN",
      }),
    });
  });

  it("should call onSuccess callback if valid submission", async () => {
    localStorageGetItemMock.mockReturnValue(cacheJSON);
    const onSuccessMock = vi.fn();
    act(() => render(<AttendanceForm onSuccess={onSuccessMock} />));
    const checkinBtn = await screen.findByTestId("check-in");
    act(() => {
      fireEvent.click(checkinBtn);
    });
    await waitFor(() => onSuccessMock.mock.calls.length === 1);
    expect(onSuccessMock).toHaveBeenCalledOnce();
  });

  it("should show error and enable edits if invalid submission", async () => {
    httpClient.mockResolvedValue({ success: false });
    localStorageGetItemMock.mockReturnValue(cacheJSON);
    act(() => render(<AttendanceForm onSuccess={vi.fn()} />));
    const checkinBtn = await screen.findByTestId("check-in");
    act(() => {
      fireEvent.click(checkinBtn);
    });
    expect(await screen.findByTestId("form-error")).toBeInstanceOf(
      HTMLParagraphElement
    );
    const firstNameInput = (await screen.findByTestId(
      "first-name"
    )) as HTMLInputElement;
    const lastNameInput = (await screen.findByTestId(
      "last-name"
    )) as HTMLInputElement;
    const emailInput = (await screen.findByTestId("email")) as HTMLInputElement;

    expect(firstNameInput.disabled).toBe(false);
    expect(lastNameInput.disabled).toBe(false);
    expect(emailInput.disabled).toBe(false);
  });
});
