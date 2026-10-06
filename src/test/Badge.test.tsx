import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/Badge";

describe("Badge Component", () => {
  it("renders text content properly", () => {
    render(<Badge>Afrobeats</Badge>);
    expect(screen.getByText("Afrobeats")).toBeTruthy();
  });

  it("applies gold variant classes", () => {
    render(<Badge variant="gold">Exclusive</Badge>);
    const badge = screen.getByText("Exclusive");
    expect(badge).toBeTruthy();
    expect(badge.className).toContain("text-[#E5A93C]");
  });

  it("applies success variant classes", () => {
    render(<Badge variant="success">Confirmed</Badge>);
    const badge = screen.getByText("Confirmed");
    expect(badge).toBeTruthy();
    expect(badge.className).toContain("text-[#22C55E]");
  });
});
