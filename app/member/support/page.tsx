"use client";

import {
  ArrowLeft,
  Clock3,
  Headphones,
  LoaderCircle,
  MessageSquare,
  Plus,
  Send,
  Upload,
} from "lucide-react";
import Link from "next/link";
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
};

type Message = {
  id: string;
  sender_type: "member" | "admin";
  message: string;
  attachment_path: string | null;
  created_at: string;
};

const categories = [
  ["registration", "Registration"],
  ["login_password", "Login / Password"],
  ["kyc", "KYC"],
  ["purchase", "Purchase"],
  ["payment", "Payment"],
  ["balloting", "Balloting"],
  ["technical_error", "Technical Error"],
  ["other", "Other"],
] as const;

function makeTicketNo() {
  const stamp = new Date()
    .toISOString()
    .replaceAll("-", "")
    .replaceAll(":", "")
    .replace("T", "")
    .slice(0, 12);

  const random = crypto.randomUUID().slice(0, 4).toUpperCase();
  return `EZT-${stamp}-${random}`;
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

export default function MemberSupportPage() {
  const [memberId, setMemberId] = useState("");
  const [authUserId, setAuthUserId] = useState("");
  const [defaultEmail, setDefaultEmail] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [reply, setReply] = useState("");
  const [replyFile, setReplyFile] = useState<File | null>(null);
  const [ticketFile, setTicketFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    category: "technical_error",
    subject: "",
    description: "",
    contact_email: "",
    contact_mobile: "",
    priority: "normal",
  });

  async function loadPage() {
    setIsLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        window.location.href = "/member/login";
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("member_id, email, role, status")
        .eq("auth_user_id", session.user.id)
        .single();

      if (
        profileError ||
        !profile ||
        profile.role !== "member" ||
        profile.status !== "active" ||
        !profile.member_id
      ) {
        await supabase.auth.signOut();
        window.location.href = "/member/login";
        return;
      }

      setMemberId(profile.member_id);
      setAuthUserId(session.user.id);
      setDefaultEmail(profile.email ?? session.user.email ?? "");
      setForm((current) => ({
        ...current,
        contact_email:
          current.contact_email || profile.email || session.user.email || "",
      }));

      const { data, error } = await supabase
        .from("support_tickets")
        .select(
          "id, ticket_no, category, subject, description, contact_email, contact_mobile, priority, status, resolution_note, created_at, updated_at",
        )
        .eq("member_id", profile.member_id)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);

      setTickets((data ?? []) as Ticket[]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Support page load nahi hua.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadPage();
  }, []);

  async function loadMessages(ticket: Ticket) {
    setSelected(ticket);

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

  async function uploadAttachment(
    ticketId: string,
    file: File | null,
  ) {
    if (!file) return null;

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Attachment must be 5 MB or less.");
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
    const path = `${authUserId}/${ticketId}/${Date.now()}.${extension}`;

    const { error } = await supabase.storage
      .from("support-attachments")
      .upload(path, file, {
        upsert: false,
        contentType: file.type,
      });

    if (error) throw new Error(error.message);
    return path;
  }

  async function createTicket(event: React.FormEvent) {
    event.preventDefault();

    if (
      !form.subject.trim() ||
      !form.description.trim() ||
      !form.contact_email.trim()
    ) {
      toast.error("Subject, description aur email required hain.");
      return;
    }

    setIsSaving(true);

    try {
      const ticketNo = makeTicketNo();

      const { data, error } = await supabase
        .from("support_tickets")
        .insert({
          ticket_no: ticketNo,
          member_id: memberId,
          category: form.category,
          subject: form.subject.trim(),
          description: form.description.trim(),
          contact_email: form.contact_email.trim().toLowerCase(),
          contact_mobile: form.contact_mobile.trim() || null,
          priority: form.priority,
          status: "open",
        })
        .select("id")
        .single();

      if (error || !data) {
        throw new Error(error?.message ?? "Ticket create nahi hua.");
      }

      const attachmentPath = await uploadAttachment(data.id, ticketFile);

      const { error: messageError } = await supabase
        .from("support_ticket_messages")
        .insert({
          ticket_id: data.id,
          sender_type: "member",
          sender_user_id: authUserId,
          message: form.description.trim(),
          attachment_path: attachmentPath,
        });

      if (messageError) throw new Error(messageError.message);

      toast.success(`Ticket ${ticketNo} created successfully.`);

      setForm({
        category: "technical_error",
        subject: "",
        description: "",
        contact_email: defaultEmail,
        contact_mobile: "",
        priority: "normal",
      });
      setTicketFile(null);

      await loadPage();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Ticket create nahi hua.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function sendReply() {
    if (!selected || !reply.trim()) {
      toast.error("Reply message required hai.");
      return;
    }

    setIsSaving(true);

    try {
      const attachmentPath = await uploadAttachment(
        selected.id,
        replyFile,
      );

      const { error } = await supabase
        .from("support_ticket_messages")
        .insert({
          ticket_id: selected.id,
          sender_type: "member",
          sender_user_id: authUserId,
          message: reply.trim(),
          attachment_path: attachmentPath,
        });

      if (error) throw new Error(error.message);

      await supabase
        .from("support_tickets")
        .update({
          status: "open",
          updated_at: new Date().toISOString(),
        })
        .eq("id", selected.id);

      setReply("");
      setReplyFile(null);
      toast.success("Reply sent.");
      await loadMessages(selected);
      await loadPage();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Reply send nahi hua.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  const openCount = useMemo(
    () =>
      tickets.filter(
        (ticket) =>
          ticket.status !== "resolved" && ticket.status !== "closed",
      ).length,
    [tickets],
  );

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <LoaderCircle className="h-8 w-8 animate-spin text-violet-300" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/member/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-bold text-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
              <Headphones className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-violet-300">
                Technical Support
              </p>
              <h1 className="mt-1 text-3xl font-black">Help Desk</h1>
              <p className="mt-2 text-slate-400">
                Open tickets: {openCount}. Email is required for future
                resolution notifications.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <form
            onSubmit={createTicket}
            className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
          >
            <div className="flex items-center gap-3">
              <Plus className="h-5 w-5 text-violet-300" />
              <h2 className="text-xl font-black">Create Support Ticket</h2>
            </div>

            <div className="mt-6 grid gap-5">
              <label>
                <span className="text-sm font-bold">Category *</span>
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 outline-none focus:border-violet-400"
                >
                  {categories.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="text-sm font-bold">Subject *</span>
                <input
                  value={form.subject}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      subject: event.target.value,
                    }))
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 outline-none focus:border-violet-400"
                  placeholder="Short problem title"
                />
              </label>

              <label>
                <span className="text-sm font-bold">Email Address *</span>
                <input
                  type="email"
                  value={form.contact_email}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      contact_email: event.target.value,
                    }))
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 outline-none focus:border-violet-400"
                  placeholder="name@example.com"
                />
              </label>

              <label>
                <span className="text-sm font-bold">Mobile Number</span>
                <input
                  value={form.contact_mobile}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      contact_mobile: event.target.value,
                    }))
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 outline-none focus:border-violet-400"
                  placeholder="03XXXXXXXXX"
                />
              </label>

              <label>
                <span className="text-sm font-bold">Priority</span>
                <select
                  value={form.priority}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      priority: event.target.value,
                    }))
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 outline-none focus:border-violet-400"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                </select>
              </label>

              <label>
                <span className="text-sm font-bold">Problem Details *</span>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  rows={6}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-400"
                  placeholder="Explain the problem and steps where it occurred."
                />
              </label>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-950 px-4 py-4 text-sm text-slate-400 transition hover:border-violet-400">
                <Upload className="h-4 w-4" />
                {ticketFile?.name ?? "Attach Screenshot / Document"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  className="hidden"
                  onChange={(event) =>
                    setTicketFile(event.target.files?.[0] ?? null)
                  }
                />
              </label>

              <p className="-mt-2 text-xs text-slate-600">
                JPG, PNG, WEBP or PDF. Maximum 5 MB.
              </p>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 font-black hover:bg-violet-500 disabled:opacity-50"
              >
                {isSaving ? (
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
                Submit Ticket
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-black">My Tickets</h2>

            <div className="mt-5 space-y-4">
              {tickets.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-500">
                  No support ticket created yet.
                </div>
              ) : (
                tickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    type="button"
                    onClick={() => void loadMessages(ticket)}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-5 text-left transition hover:border-violet-400/40"
                  >
                    <div className="flex flex-wrap justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-violet-300">
                          {ticket.ticket_no}
                        </p>
                        <h3 className="mt-2 font-black">{ticket.subject}</h3>
                      </div>

                      <span
                        className={`self-start rounded-full border px-3 py-1 text-xs font-bold capitalize ${statusClass(
                          ticket.status,
                        )}`}
                      >
                        {ticket.status.replaceAll("_", " ")}
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                      {ticket.description}
                    </p>

                    <p className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                      <Clock3 className="h-3.5 w-3.5" />
                      {new Date(ticket.created_at).toLocaleString("en-PK")}
                    </p>
                  </button>
                ))
              )}
            </div>
          </section>
        </div>

        {selected && (
          <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-violet-300">
                  {selected.ticket_no}
                </p>
                <h2 className="mt-2 text-2xl font-black">
                  {selected.subject}
                </h2>
              </div>

              <span
                className={`self-start rounded-full border px-3 py-1 text-xs font-bold capitalize ${statusClass(
                  selected.status,
                )}`}
              >
                {selected.status.replaceAll("_", " ")}
              </span>
            </div>

            {selected.resolution_note && (
              <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-emerald-200">
                <strong>Resolution:</strong> {selected.resolution_note}
              </div>
            )}

            <div className="mt-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-3xl rounded-2xl p-4 ${
                    message.sender_type === "member"
                      ? "ml-auto bg-violet-500/15"
                      : "bg-slate-950"
                  }`}
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {message.sender_type === "member"
                      ? "You"
                      : "EZ Life Support"}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-300">
                    {message.message}
                  </p>

                  {message.attachment_path && (
                    <button
                      type="button"
                      onClick={async () => {
                        const { data, error } = await supabase.storage
                          .from("support-attachments")
                          .createSignedUrl(message.attachment_path!, 600);

                        if (error || !data?.signedUrl) {
                          toast.error(error?.message ?? "Attachment open nahi hua.");
                          return;
                        }

                        window.open(data.signedUrl, "_blank", "noopener,noreferrer");
                      }}
                      className="mt-3 inline-flex items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-400/10 px-3 py-2 text-xs font-bold text-violet-200"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      View Attachment
                    </button>
                  )}
                </div>
              ))}
            </div>

            {selected.status !== "closed" && (
              <div className="mt-6 border-t border-slate-800 pt-6">
                <textarea
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  rows={4}
                  placeholder="Write your reply..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-400"
                />

                <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-400">
                    <Upload className="h-4 w-4" />
                    {replyFile?.name ?? "Attach Screenshot"}
                    <input
                      type="file"
                      className="hidden"
                      onChange={(event) =>
                        setReplyFile(event.target.files?.[0] ?? null)
                      }
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => void sendReply()}
                    disabled={isSaving}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 font-black hover:bg-violet-500 disabled:opacity-50"
                  >
                    <MessageSquare className="h-5 w-5" />
                    Send Reply
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
