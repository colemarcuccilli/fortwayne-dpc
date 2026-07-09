"use client";

import { useState } from "react";
import { MessageSquare, Plus, Send, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdmin } from "@/lib/admin/store";
import { formatDateTime } from "@/lib/admin/format";
import { cn } from "@/lib/utils";

export default function MessagingPage() {
  const { state, dispatch } = useAdmin();
  const [tab, setTab] = useState<"drafts" | "sent">("drafts");
  const [composeOpen, setComposeOpen] = useState(false);

  const list = state.messages.filter((m) =>
    tab === "drafts" ? m.status === "draft" : m.status === "sent",
  );

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Messaging"
        subtitle="Draft emails and SMS. Sending is stubbed until Resend/Twilio are wired."
        actions={
          <Button onClick={() => setComposeOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            New message
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as "drafts" | "sent")}>
        <TabsList>
          <TabsTrigger value="drafts">
            Drafts{" "}
            <span className="ml-1.5 rounded-full bg-slate-200 px-1.5 py-0 font-mono text-[10px]">
              {state.messages.filter((m) => m.status === "draft").length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>
      </Tabs>

      {list.length === 0 ? (
        <EmptyState icon={MessageSquare} title={tab === "drafts" ? "No drafts" : "Nothing sent"} />
      ) : (
        <ul className="space-y-3">
          {list.map((m) => (
            <li
              key={m.id}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                      m.channel === "email"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-emerald-100 text-emerald-700",
                    )}>
                      {m.channel}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      To: {m.toName ?? m.to}
                    </span>
                  </div>
                  {m.subject && (
                    <div className="mt-1 text-sm text-slate-700">{m.subject}</div>
                  )}
                  <div className="mt-1 text-[11px] text-slate-500">
                    {m.status === "sent"
                      ? `Sent ${formatDateTime(m.sentAt ?? m.createdAt)}`
                      : `Drafted ${formatDateTime(m.createdAt)}`}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {m.status === "draft" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        dispatch({ type: "message_send", id: m.id })
                      }
                    >
                      <Send className="h-4 w-4" />
                      Send
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm("Delete message?"))
                        dispatch({ type: "message_delete", id: m.id });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {m.body}
              </p>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New message</DialogTitle>
          </DialogHeader>
          <MessageForm onSaved={() => setComposeOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MessageForm({ onSaved }: { onSaved: () => void }) {
  const { dispatch } = useAdmin();
  const [channel, setChannel] = useState<"email" | "sms">("email");
  const [to, setTo] = useState("");
  const [toName, setToName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        dispatch({
          type: "message_add",
          data: {
            channel,
            to,
            toName: toName || undefined,
            subject: subject || undefined,
            body,
          },
        });
        onSaved();
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="channel">Channel</Label>
          <Select value={channel} onValueChange={(v) => setChannel(v as "email" | "sms")}>
            <SelectTrigger id="channel">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="to">To</Label>
          <Input
            id="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
            placeholder={channel === "email" ? "person@example.com" : "260-555-0100"}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="toName">Recipient name</Label>
        <Input id="toName" value={toName} onChange={(e) => setToName(e.target.value)} />
      </div>
      {channel === "email" && (
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="body">Body</Label>
        <Textarea
          id="body"
          rows={6}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Save draft
      </Button>
    </form>
  );
}
