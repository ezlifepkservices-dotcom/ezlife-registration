"use client";

import {
  CheckCircle2,
  Clock3,
  Headphones,
  LoaderCircle,
  MessageSquare,
  RefreshCcw,
  Search,
  Send,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";

type TicketStatus =
  | "open"
  | "in_progress"
  | "waiting_member"
  | "resolved"
  | "closed";

type Ticket = {
  id: string;
  ticket_no: string;
  member_id: string;
  category: string;
  subject: string;
  description: string;
  contact_email: string;
  contact_mobile: string | null;
  priority: "normal" | "urgent";
  status: TicketStatus;
  resolution_note: string | null;
  created_at: string;
  updated_at: string;
  members:
    | {
        full_name: string;
        email: string;
        mobile: string | null;
      }
    | {
        full_name: string;
        email: string;
        mobile: string | null;
      }[]
    | null;
};

type Message = {
  id: string;
  sender_type: "member" | "admin";
  message: string;
  attachment_path: string | null;
  created_at: string;
};

function one<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

function statusClass(status: TicketStatus) {
  if (status === "resolved" || status === "closed") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  }

  if (status === "waiting_member") {
    return "border-amber-400/20 bg-amber-400/10 text-amber-300";
  }

  return "border-violet-400/20 bg-violet-400/10 text-violet-300";
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TicketStatus>("open");
  const [reply, setReply] = useState("");
  const [resolution, setResolution] = useState("");
  const [authUserId, setAuthUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  async function loadTickets() {
    setIsLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        window.location.href = "/admin/login";
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, status")
        .eq("auth_user_id", session.user.id)
        .single();

      if (
        profileError ||
        !profile ||
        profile.role !== "admin" ||
        profile.status !== "active"
      ) {
        await supabase.auth.signOut();
        window.location.href = "/admin/login";
        return;
      }

      setAuthUserId(session.user.id);

      const { data, error } = await supabase
        .from("support_tickets")
        .select(
          "id, ticket_no, member_id, category, subject, description, contact_email, contact_mobile, priority, status, resolution_note, created_at, updated_at, members(full_name, email, mobile)",
        )
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      setTickets((data ?? []) as Ticket[]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Tickets load nahi huay.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadTickets();
  }, []);

  async function openTicket(ticket: Ticket) {
    setSelected(ticket);
    setStatus(ticket.status);
    setResolution(ticket.resolution_note ?? "");

    const { data, error } = await supabase
      .from("support_ticket_messages")
      .select("id, sender_type, message, attachment_path, created_at")
      .eq("ticket_id", ticket.id)
      .order("created_at", { ascending: true });

    if (error) {
      toast.error(error.message);
      return;
    }

    setMessages((data ?? []) as Message[]);
  }

  async function saveStatus() {
    if (!selected) return;

    setIsSaving(true);

    try {
      const resolved = status === "resolved";
      const closed = status === "closed";

      const { error } = await supabase
        .from("support_tickets")
        .update({
          status,
          resolution_note: resolution.trim() || null,
          resolved_at: resolved ? new Date().toISOString() : null,
          closed_at: closed ? new Date().toISOString() : null,
          email_notification_pending: resolved || closed,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selected.id);

      if (error) throw new Error(error.message);

      toast.success(
        resolved || closed
          ? "Ticket updated. Resolution email is queued for future email setup."
          : "Ticket status updated.",
      );

      await loadTickets();
      await openTicket({ ...selected, status });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Status update nahi hua.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function sendReply() {
    if (!selected || !reply.trim()) {
      toast.error("Reply required hai.");
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("support_ticket_messages")
        .insert({
          ticket_id: selected.id,
          sender_type: "admin",
          sender_user_id: authUserId,
          message: reply.trim(),
        });

      if (error) throw new Error(error.message);

      await supabase
        .from("support_tickets")
        .update({
          status: "waiting_member",
          email_notification_pending: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selected.id);

      setReply("");
      setStatus("waiting_member");
      toast.success(
        "Reply sent. Member email notification is queued for future email setup.",
      );

      await openTicket({ ...selected, status: "waiting_member" });
      await loadTickets();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Reply send nahi hua.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return tickets;

    return tickets.filter((ticket) => {
      const member = one(ticket.members);

      return [
        ticket.ticket_no,
        ticket.subject,
        ticket.category,
        ticket.contact_email,
        ticket.contact_mobile ?? "",
        member?.full_name ?? "",
        member?.email ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [search, tickets]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-violet-300">
              Administration
            </p>
            <h1 className="mt-2 text-3xl font-black">Technical Support</h1>
            <p className="mt-2 text-slate-400">
              Review, reply, resolve and close member support tickets.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadTickets()}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 font-bold text-slate-300"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        <div className="relative mt-6 max-w-xl">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search ticket, member, email or category"
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-900 pl-11 pr-4 outline-none focus:border-violet-400"
          />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center gap-3">
              <Headphones className="h-5 w-5 text-violet-300" />
              <h2 className="text-xl font-black">All Tickets</h2>
            </div>

            <div className="mt-5 space-y-3">
              {isLoading ? (
                <LoaderCircle className="mx-auto h-7 w-7 animate-spin text-violet-300" />
              ) : filteredTickets.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-500">
                  No tickets found.
                </div>
              ) : (
                filteredTickets.map((ticket) => {
                  const member = one(ticket.members);

                  return (
                    <button
                      key={ticket.id}
                      type="button"
                      onClick={() => void openTicket(ticket)}
                      className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-left transition hover:border-violet-400/40"
                    >
                      <div className="flex flex-wrap justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold text-violet-300">
                            {ticket.ticket_no}
                          </p>
                          <h3 className="mt-1 font-black">{ticket.subject}</h3>
                        </div>

                        <span
                          className={`self-start rounded-full border px-3 py-1 text-xs font-bold capitalize ${statusClass(
                            ticket.status,
                          )}`}
                        >
                          {ticket.status.replaceAll("_", " ")}
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-slate-500">
                        {member?.full_name ?? "Unknown Member"} ·{" "}
                        {ticket.contact_email}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            {!selected ? (
              <div className="flex min-h-[500px] items-center justify-center text-center text-slate-500">
                Select a support ticket.
              </div>
            ) : (
              <>
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-violet-300">
                      {selected.ticket_no}
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                      {selected.subject}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Email: {selected.contact_email}
                      {selected.contact_mobile
                        ? ` · Mobile: ${selected.contact_mobile}`
                        : ""}
                    </p>
                  </div>

                  {selected.priority === "urgent" && (
                    <span className="self-start rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-xs font-bold text-rose-300">
                      Urgent
                    </span>
                  )}
                </div>

                <div className="mt-6 max-h-[400px] space-y-4 overflow-y-auto pr-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`max-w-3xl rounded-2xl p-4 ${
                        message.sender_type === "admin"
                          ? "ml-auto bg-violet-500/15"
                          : "bg-slate-950"
                      }`}
                    >
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {message.sender_type === "admin"
                          ? "EZ Life Support"
                          : "Member"}
                      </p>
                      <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-300">
                        {message.message}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-slate-800 pt-6">
                  <label className="text-sm font-bold">Admin Reply</label>
                  <textarea
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    rows={4}
                    placeholder="Write a reply to the member..."
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-400"
                  />

                  <button
                    type="button"
                    onClick={() => void sendReply()}
                    disabled={isSaving}
                    className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet-600 px-5 font-black hover:bg-violet-500 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    Reply & Wait for Member
                  </button>
                </div>

                <div className="mt-6 grid gap-4 border-t border-slate-800 pt-6">
                  <label>
                    <span className="text-sm font-bold">Ticket Status</span>
                    <select
                      value={status}
                      onChange={(event) =>
                        setStatus(event.target.value as TicketStatus)
                      }
                      className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 outline-none focus:border-violet-400"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="waiting_member">Waiting for Member</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </label>

                  <label>
                    <span className="text-sm font-bold">
                      Resolution Note
                    </span>
                    <textarea
                      value={resolution}
                      onChange={(event) =>
                        setResolution(event.target.value)
                      }
                      rows={4}
                      placeholder="Explain how the issue was resolved."
                      className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-400"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => void saveStatus()}
                    disabled={isSaving}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 font-black hover:bg-emerald-500 disabled:opacity-50"
                  >
                    {status === "resolved" || status === "closed" ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Clock3 className="h-5 w-5" />
                    )}
                    Save Ticket Status
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
