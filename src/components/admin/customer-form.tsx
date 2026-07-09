"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdmin } from "@/lib/admin/store";
import {
  MEMBERSHIP_TIERS,
  MEMBERSHIP_TIER_LABEL,
  type Customer,
  type MembershipTier,
} from "@/lib/admin/types";

interface Props {
  onSaved: () => void;
  onCancel?: () => void;
  editing?: Customer;
}

export function CustomerForm({ onSaved, onCancel, editing }: Props) {
  const { dispatch } = useAdmin();
  const [firstName, setFirstName] = useState(editing?.firstName ?? "");
  const [lastName, setLastName] = useState(editing?.lastName ?? "");
  const [email, setEmail] = useState(editing?.email ?? "");
  const [phone, setPhone] = useState(editing?.phone ?? "");
  const [dob, setDob] = useState(editing?.dob ?? "");
  const [address, setAddress] = useState(editing?.address ?? "");
  const [membership, setMembership] = useState<MembershipTier>(
    editing?.membership ?? "standard",
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      firstName,
      lastName,
      email,
      phone,
      dob: dob || undefined,
      address: address || undefined,
      membership,
      membershipStart: editing?.membershipStart ?? new Date().toISOString(),
    };
    if (editing) {
      dispatch({ type: "customer_update", id: editing.id, patch: payload });
    } else {
      dispatch({ type: "customer_add", data: payload });
    }
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fn">First name</Label>
          <Input
            id="fn"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ln">Last name</Label>
          <Input
            id="ln"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dob">Date of birth</Label>
          <Input
            id="dob"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="membership">Membership</Label>
          <Select value={membership} onValueChange={(v) => setMembership(v as MembershipTier)}>
            <SelectTrigger id="membership">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEMBERSHIP_TIERS.map((m) => (
                <SelectItem key={m} value={m}>
                  {MEMBERSHIP_TIER_LABEL[m]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">{editing ? "Save changes" : "Add customer"}</Button>
      </div>
    </form>
  );
}
