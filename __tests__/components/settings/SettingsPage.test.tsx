import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import SettingsPage from "@/app/settings/page";

const mockRefresh = jest.fn();

const mockProfile = {
  id: "profile-1",
  display_name: "Old Name",
};

const mockUpdate = jest.fn();
const mockMaybeSingle = jest.fn();

const mockSupabase = {
  from: jest.fn(() => ({
    update: mockUpdate,
  })),
  auth: {
    getUser: jest.fn(),
    signInWithPassword: jest.fn(),
    updateUser: jest.fn(),
  },
};

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}));

jest.mock("@/lib/supabase/client", () => ({
  createClient: () => mockSupabase,
}));

jest.mock("@/lib/hooks/useProfile", () => ({
  useProfile: () => ({
    profile: mockProfile,
    loading: false,
  }),
}));

jest.mock("@/components/auth/AuthCard", () => ({
  __esModule: true,
  default: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div>{children}</div>,
}));

jest.mock("@/components/ui/BackButton", () => ({
  __esModule: true,
  default: () => <button type="button">Back</button>,
}));

jest.mock("@/components/ui/PasswordHint", () => ({
  __esModule: true,
  default: () => <p>Password requirements</p>,
}));

describe("SettingsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockMaybeSingle.mockResolvedValue({
      data: {
        id: "profile-1",
        display_name: "New Name",
      },
      error: null,
    });

    mockUpdate.mockReturnValue({
      eq: jest.fn(() => ({
        select: jest.fn(() => ({
          maybeSingle: mockMaybeSingle,
        })),
      })),
    });

    mockSupabase.auth.getUser.mockResolvedValue({
      data: {
        user: {
          email: "user@example.com",
        },
      },
      error: null,
    });

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      error: null,
    });

    mockSupabase.auth.updateUser.mockResolvedValue({
      error: null,
    });
  });

  it("renders the settings controls", () => {
    render(<SettingsPage />);

    expect(
      screen.getByRole("button", {
        name: "Change name",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Change password",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Save changes",
      })
    ).toBeDisabled();
  });

  it("updates the display name", async () => {
    const user = userEvent.setup();

    render(<SettingsPage />);

    await user.click(
      screen.getByRole("button", {
        name: "Change name",
      })
    );

    const nameInput = screen.getByRole("textbox", {
      name: "Player name",
    });

    await user.clear(nameInput);
    await user.type(nameInput, "New Name");

    await user.click(
      screen.getByRole("button", {
        name: "Save changes",
      })
    );

    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith(
        "profiles"
      );
    });

    expect(mockUpdate).toHaveBeenCalledWith({
      display_name: "New Name",
    });

    expect(
      await screen.findByText(
        "Settings updated successfully."
      )
    ).toBeInTheDocument();
  });

  it("requires the current password", async () => {
  const user = userEvent.setup();

  render(<SettingsPage />);

  await user.click(
    screen.getByRole("button", {
      name: "Change password",
    })
  );

  const currentPassword = screen.getByLabelText(
    "Current password"
  );

  const newPassword = screen.getByLabelText(
    "New password"
  );

  await user.type(newPassword, "NewPassword123!");

  await user.click(
    screen.getByRole("button", {
      name: "Save changes",
    })
  );

  expect(currentPassword).toBeRequired();
  expect(currentPassword).toBeInvalid();

  expect(
    mockSupabase.auth.getUser
  ).not.toHaveBeenCalled();

  expect(
    mockSupabase.auth.updateUser
  ).not.toHaveBeenCalled();
});


 it("rejects an incorrect current password", async () => {
  const user = userEvent.setup();

  mockSupabase.auth.signInWithPassword.mockResolvedValue({
    error: {
      message: "Invalid login credentials",
    },
  });

  render(<SettingsPage />);

  await user.click(
    screen.getByRole("button", {
      name: "Change password",
    })
  );

  await user.type(
    screen.getByLabelText("Current password"),
    "wrong-password"
  );

  await user.type(
    screen.getByLabelText("New password"),
    "ValidPassword123!"
  );

  await user.click(
    screen.getByRole("button", {
      name: "Save changes",
    })
  );

  expect(
    await screen.findByText(
      "Your current password is incorrect."
    )
  ).toBeInTheDocument();

  expect(
    mockSupabase.auth.updateUser
  ).not.toHaveBeenCalled();
});

it("updates the password after verifying the old password", async () => {
  const user = userEvent.setup();

  render(<SettingsPage />);

  await user.click(
    screen.getByRole("button", {
      name: "Change password",
    })
  );

  await user.type(
    screen.getByLabelText("Current password"),
    "OldPassword123!"
  );

  await user.type(
    screen.getByLabelText("New password"),
    "NewPassword123!"
  );

  await user.click(
    screen.getByRole("button", {
      name: "Save changes",
    })
  );

  await waitFor(() => {
    expect(
      mockSupabase.auth.signInWithPassword
    ).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "OldPassword123!",
    });
  });

  expect(
    mockSupabase.auth.updateUser
  ).toHaveBeenCalledWith({
    password: "NewPassword123!",
  });

  expect(
    await screen.findByText(
      "Settings updated successfully."
    )
  ).toBeInTheDocument();
});

});