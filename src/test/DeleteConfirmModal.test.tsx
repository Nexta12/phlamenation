import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";

describe("DeleteConfirmModal Component", () => {
  it("does not render when isOpen is false", () => {
    render(
      <DeleteConfirmModal
        isOpen={false}
        title="Delete Item"
        message="Are you sure?"
      />
    );
    expect(screen.queryByText("Delete Item")).toBeNull();
  });

  it("renders title and message when isOpen is true", () => {
    render(
      <DeleteConfirmModal
        isOpen={true}
        title="Delete Artist Record"
        message="This action cannot be undone."
      />
    );
    expect(screen.getByText("Delete Artist Record")).toBeTruthy();
    expect(screen.getByText("This action cannot be undone.")).toBeTruthy();
  });

  it("triggers onConfirm when confirm button is clicked", () => {
    const handleConfirm = vi.fn();
    render(
      <DeleteConfirmModal
        isOpen={true}
        onConfirm={handleConfirm}
        confirmText="Confirm Delete"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /confirm delete/i }));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it("triggers onClose when cancel button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <DeleteConfirmModal
        isOpen={true}
        onClose={handleClose}
        cancelText="Cancel"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
