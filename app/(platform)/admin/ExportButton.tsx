"use client";

import { Download } from "lucide-react";

export default function ExportButton({
  articles,
  talks,
  users,
  attempts,
}: {
  articles: object[];
  talks: object[];
  users: object[];
  attempts: object[];
}) {
  function handleExport() {
    const data = {
      exported_at: new Date().toISOString(),
      platform: "Gradion AI Platform",
      articles,
      talks,
      users,
      quiz_attempts: attempts,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gradion-platform-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleExportCSV() {
    // Export users as CSV
    const headers = ["Name", "Email", "Department", "Role", "Tokens", "Joined"];
    const rows = (users as Array<Record<string, unknown>>).map((u) => [
      u.full_name ?? "",
      u.email,
      u.department ?? "",
      u.role,
      u.tokens,
      new Date(u.created_at as string).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gradion-users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex gap-2">
      <button onClick={handleExportCSV} className="btn-secondary">
        <Download className="w-4 h-4" />
        Export Users CSV
      </button>
      <button onClick={handleExport} className="btn-primary">
        <Download className="w-4 h-4" />
        Export All (JSON)
      </button>
    </div>
  );
}
