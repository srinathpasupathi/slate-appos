import { useState } from "react";
import { MoreHorizontal, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

const roles = ["Super Admin", "Admin", "App Owner", "Editor", "Viewer"] as const;

const initialMembers = [
  { id: "1", name: "Aravind Kumar", email: "aravind@slate.in", role: "Super Admin", joined: "12 Jan 2025", usage: "842", creditLimit: 200 },
  { id: "2", name: "Priya Sharma", email: "priya@slate.in", role: "Admin", joined: "18 Feb 2025", usage: "431", creditLimit: 150 },
  { id: "3", name: "Rahul Menon", email: "rahul@slate.in", role: "Editor", joined: "05 Mar 2025", usage: "217", creditLimit: 100 },
  { id: "4", name: "Deepa Nair", email: "deepa@slate.in", role: "Viewer", joined: "22 Mar 2025", usage: "54", creditLimit: 50 },
];

const TeamSettings = () => {
  const [members, setMembers] = useState(initialMembers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("Editor");
  const [editCreditId, setEditCreditId] = useState<string | null>(null);
  const [editCreditValue, setEditCreditValue] = useState("");
  const [editRoleId, setEditRoleId] = useState<string | null>(null);
  const [editRoleValue, setEditRoleValue] = useState("");

  const handleInvite = () => {
    if (!inviteEmail) return;
    setMembers((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: inviteEmail.split("@")[0],
        email: inviteEmail,
        role: inviteRole,
        joined: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        usage: "0",
        creditLimit: 100,
      },
    ]);
    setInviteEmail("");
    setInviteRole("Editor");
    setInviteOpen(false);
  };

  const handleRemove = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSaveCreditLimit = (id: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, creditLimit: Number(editCreditValue) || m.creditLimit } : m))
    );
    setEditCreditId(null);
  };

  const handleSaveRole = (id: string, role: string) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
    setEditRoleId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-foreground">Team Members</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{members.length} members in your organization</p>
        </div>
        <Button size="sm" onClick={() => setInviteOpen(true)} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Invite Member
        </Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="text-xs">Name</TableHead>
              <TableHead className="text-xs">Role</TableHead>
              <TableHead className="text-xs">Joined</TableHead>
              <TableHead className="text-xs text-right">Total Usage</TableHead>
              <TableHead className="text-xs text-right">Credit Limit</TableHead>
              <TableHead className="text-xs w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-medium bg-muted px-2.5 py-1 rounded-full text-foreground">
                    {member.role}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{member.joined}</TableCell>
                <TableCell className="text-sm text-right font-medium text-foreground">{member.usage}</TableCell>
                <TableCell className="text-sm text-right font-medium text-foreground">{member.creditLimit}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditCreditId(member.id);
                          setEditCreditValue(String(member.creditLimit));
                        }}
                      >
                        Update Credit Limit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setEditRoleId(member.id);
                          setEditRoleValue(member.role);
                        }}
                      >
                        Change Role
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleRemove(member.id)}
                      >
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <Input
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Role</label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={handleInvite}>Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Credit Limit Dialog */}
      <Dialog open={!!editCreditId} onOpenChange={() => setEditCreditId(null)}>
        <DialogContent className="sm:max-w-[360px]">
          <DialogHeader>
            <DialogTitle>Update Credit Limit</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5 py-2">
            <label className="text-sm font-medium text-foreground">Credit Limit</label>
            <Input
              type="number"
              value={editCreditValue}
              onChange={(e) => setEditCreditValue(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCreditId(null)}>Cancel</Button>
            <Button onClick={() => editCreditId && handleSaveCreditLimit(editCreditId)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={!!editRoleId} onOpenChange={() => setEditRoleId(null)}>
        <DialogContent className="sm:max-w-[360px]">
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5 py-2">
            <label className="text-sm font-medium text-foreground">Role</label>
            <Select value={editRoleValue} onValueChange={setEditRoleValue}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRoleId(null)}>Cancel</Button>
            <Button onClick={() => editRoleId && handleSaveRole(editRoleId, editRoleValue)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamSettings;
