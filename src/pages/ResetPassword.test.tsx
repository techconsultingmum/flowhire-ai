import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

// --- Mock supabase client BEFORE importing the component under test -------
type AuthChangeCb = (event: string, session: unknown) => void;
const authListeners: AuthChangeCb[] = [];
const updateUserMock = vi.fn();
const signOutMock = vi.fn().mockResolvedValue({ error: null });
const getSessionMock = vi.fn().mockResolvedValue({ data: { session: null } });
const invokeMock = vi.fn().mockResolvedValue({ data: { ok: true }, error: null });

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      onAuthStateChange: (cb: AuthChangeCb) => {
        authListeners.push(cb);
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      getSession: () => getSessionMock(),
      updateUser: (...args: unknown[]) => updateUserMock(...args),
      signOut: () => signOutMock(),
    },
    functions: { invoke: (...args: unknown[]) => invokeMock(...args) },
  },
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

import ResetPassword from "./ResetPassword";

function renderPage() {
  return render(
    <MemoryRouter>
      <ResetPassword />
    </MemoryRouter>,
  );
}

function setHash(hash: string) {
  window.history.replaceState(null, "", `/reset-password${hash}`);
}

beforeEach(() => {
  authListeners.length = 0;
  updateUserMock.mockReset();
  signOutMock.mockClear();
  invokeMock.mockClear();
  getSessionMock.mockReset().mockResolvedValue({ data: { session: null } });
  setHash("");
});

afterEach(() => {
  setHash("");
});

describe("ResetPassword page", () => {
  it("shows a loading state before recovery status is known", () => {
    renderPage();
    expect(screen.getByTestId("reset-loading")).toBeInTheDocument();
  });

  it("shows the invalid-link state when no recovery context is present", async () => {
    renderPage();
    await waitFor(() =>
      expect(screen.getByTestId("reset-invalid")).toBeInTheDocument(),
    );
    expect(screen.getByText(/invalid or expired link/i)).toBeInTheDocument();
  });

  it("surfaces Supabase's error_description from the URL on expired links", async () => {
    setHash(
      "#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired",
    );
    renderPage();
    await waitFor(() =>
      expect(screen.getByTestId("reset-invalid")).toBeInTheDocument(),
    );
    expect(
      screen.getByText(/email link is invalid or has expired/i),
    ).toBeInTheDocument();
  });

  it("renders the reset form when a recovery hash is present and updates the password successfully", async () => {
    setHash("#access_token=fake&type=recovery");
    getSessionMock.mockResolvedValue({
      data: { session: { access_token: "fake", user: { id: "u1" } } },
    });
    updateUserMock.mockResolvedValue({ data: {}, error: null });

    const user = userEvent.setup();
    renderPage();

    await waitFor(() =>
      expect(screen.getByTestId("reset-form")).toBeInTheDocument(),
    );

    const submit = screen.getByRole("button", { name: /update password/i });
    expect(submit).toBeDisabled();

    // Weak password: inline validation should fire and keep submit disabled.
    await user.type(screen.getByLabelText(/new password/i), "weakpass");
    await user.type(screen.getByLabelText(/confirm password/i), "weakpass");
    expect(
      await screen.findByText(/must contain an uppercase letter/i),
    ).toBeInTheDocument();
    expect(submit).toBeDisabled();

    // Strong password.
    await user.clear(screen.getByLabelText(/new password/i));
    await user.clear(screen.getByLabelText(/confirm password/i));
    await user.type(screen.getByLabelText(/new password/i), "StrongPass1");
    await user.type(screen.getByLabelText(/confirm password/i), "StrongPass1");

    await waitFor(() => expect(submit).toBeEnabled());
    await user.click(submit);

    await waitFor(() =>
      expect(updateUserMock).toHaveBeenCalledWith({ password: "StrongPass1" }),
    );
    await waitFor(() =>
      expect(screen.getByTestId("reset-success")).toBeInTheDocument(),
    );
    // Audit log + sign-out fired.
    expect(invokeMock).toHaveBeenCalledWith("log-password-reset", {
      body: { event: "password_reset_succeeded", reason: undefined },
    });
    expect(signOutMock).toHaveBeenCalled();
  });

  it("activates the form when Supabase fires PASSWORD_RECOVERY post-mount", async () => {
    renderPage();
    // Initially loading, then resolves to invalid because no hash/session.
    await waitFor(() =>
      expect(screen.getByTestId("reset-invalid")).toBeInTheDocument(),
    );
    // Now simulate the recovery event coming in.
    await act(async () => {
      authListeners.forEach((cb) => cb("PASSWORD_RECOVERY", null));
    });
    await waitFor(() =>
      expect(screen.getByTestId("reset-form")).toBeInTheDocument(),
    );
  });

  it("surfaces server-side errors from updateUser and logs the failure", async () => {
    setHash("#access_token=fake&type=recovery");
    getSessionMock.mockResolvedValue({
      data: { session: { access_token: "fake", user: { id: "u1" } } },
    });
    updateUserMock.mockResolvedValue({
      data: {},
      error: { message: "Invalid token" },
    });

    const user = userEvent.setup();
    renderPage();
    await waitFor(() =>
      expect(screen.getByTestId("reset-form")).toBeInTheDocument(),
    );

    await user.type(screen.getByLabelText(/new password/i), "StrongPass1");
    await user.type(screen.getByLabelText(/confirm password/i), "StrongPass1");
    await user.click(screen.getByRole("button", { name: /update password/i }));

    await waitFor(() =>
      expect(invokeMock).toHaveBeenCalledWith("log-password-reset", {
        body: { event: "password_reset_failed", reason: "Invalid token" },
      }),
    );
    expect(await screen.findByText(/invalid token/i)).toBeInTheDocument();
  });
});