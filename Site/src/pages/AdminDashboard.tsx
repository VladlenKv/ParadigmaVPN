import { useEffect, useState } from "react";
import { LogOut, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { apiFetch } from "../lib/api";

type AdminRequest = {
  id: string;
  type: string;
  status: "new" | "in_progress" | "done" | "archived";
  name: string | null;
  email: string | null;
  telegram_username: string | null;
  message: string;
  source: string;
  created_at: string;
};

type AdminLog = {
  id: number;
  action: string;
  admin_email: string | null;
  created_at: string;
};

export function AdminDashboard() {
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setError("");
    setLoading(true);
    try {
      const [requestData, logData] = await Promise.all([
        apiFetch<{ requests: AdminRequest[] }>("/api/admin/requests"),
        apiFetch<{ logs: AdminLog[] }>("/api/admin/logs"),
      ]);
      setRequests(requestData.requests);
      setLogs(logData.logs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function updateStatus(id: string, status: AdminRequest["status"]) {
    const data = await apiFetch<{ request: AdminRequest }>(`/api/admin/requests/${id}/status`, {
      method: "PATCH",
      csrf: true,
      body: JSON.stringify({ status }),
    });
    setRequests((items) => items.map((item) => (item.id === id ? data.request : item)));
  }

  async function archiveRequest(id: string) {
    await apiFetch(`/api/admin/requests/${id}`, { method: "DELETE", csrf: true });
    setRequests((items) => items.map((item) => (item.id === id ? { ...item, status: "archived" } : item)));
  }

  async function logout() {
    await apiFetch("/api/admin/logout", { method: "POST", csrf: true });
    window.location.href = "/admin/login";
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 text-blue-300 mb-2">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm font-medium">Protected admin area</span>
            </div>
            <h1 className="text-3xl font-semibold">Requests and logs</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={load}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="ghost" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </header>

        {error && <div className="border border-red-500/20 bg-red-500/10 rounded-xl p-4 text-red-300">{error}</div>}
        {loading && <div className="text-white/50">Loading...</div>}

        <section className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} glass>
                <CardContent className="p-5 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2 py-1 rounded-lg bg-white/10 text-xs">{request.type}</span>
                        <span className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-300 text-xs">{request.status}</span>
                        <span className="text-xs text-white/40">{new Date(request.created_at).toLocaleString()}</span>
                      </div>
                      <h2 className="font-medium">{request.name || request.telegram_username || request.email || "Anonymous"}</h2>
                      <p className="text-sm text-white/50">{[request.email, request.telegram_username].filter(Boolean).join(" / ")}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(["new", "in_progress", "done"] as const).map((status) => (
                        <Button key={status} variant="secondary" size="sm" onClick={() => updateStatus(request.id, status)}>
                          {status}
                        </Button>
                      ))}
                      <Button variant="destructive" size="sm" onClick={() => archiveRequest(request.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-white/80 whitespace-pre-wrap">{request.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card glass className="h-fit">
            <CardContent className="p-5">
              <h2 className="text-lg font-semibold mb-4">Admin logs</h2>
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="border-b border-white/10 pb-3 last:border-0">
                    <div className="text-sm text-white/80">{log.action}</div>
                    <div className="text-xs text-white/40">{new Date(log.created_at).toLocaleString()}</div>
                    <div className="text-xs text-white/40">{log.admin_email || "system"}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
