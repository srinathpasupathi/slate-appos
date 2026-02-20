import { useState } from "react";
import { MoreHorizontal, Plus, X, ChevronDown, ChevronRight } from "lucide-react";
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

const orgRoles = ["Admin", "Member"] as const;
const appRoles = ["App Owner", "Editor", "Viewer"] as const;

const availableApps = [
  { id: "app1", name: "Franchise Sales App" },
  { id: "app2", name: "HR Management App" },
  { id: "app3", name: "Inventory Tracker" },
  { id: "app4", name: "Customer Portal" },
];

interface AppAccess {
  appId: string;
  appName: string;
  role: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  joined: string;
  usage: string;
  creditLimit: number;
  appAccess: AppAccess[];
}

const initialMembers: Member[] = [
  { id: "1", name: "Aravind Siva", email: "aravind.siva@zohocorp.com", role: "Admin", joined: "12 Jan 2025", usage: "842", creditLimit: 200, appAccess: [] },
  { id: "2", name: "Erai Anbu", email: "erai.anbu@zohocorp.com", role: "Admin", joined: "18 Feb 2025", usage: "431", creditLimit: 150, appAccess: [] },
  { id: "3", name: "Viswanath M", email: "viswanath.m@zohocorp.com", role: "Member", joined: "05 Mar 2025", usage: "217", creditLimit: 100, appAccess: [{ appId: "app1", appName: "Franchise Sales App", role: "Editor" }, { appId: "app3", appName: "Inventory Tracker", role: "Viewer" }] },
  { id: "4", name: "Thangaram S", email: "thangaram.s@zohocorp.com", role: "Member", joined: "22 Mar 2025", usage: "54", creditLimit: 50, appAccess: [{ appId: "app2", appName: "HR Management App", role: "Viewer" }] },
];

const TeamSettings = () => {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("Member");
  const [inviteAppAccess, setInviteAppAccess] = useState<AppAccess[]>([]);
  const [editCreditId, setEditCreditId] = useState<string | null>(null);
  const [editCreditValue, setEditCreditValue] = useState("");
  const [editMemberId, setEditMemberId] = useState<string | null>(null);
  const [editMemberRole, setEditMemberRole] = useState("");
  const [editMemberAppAccess, setEditMemberAppAccess] = useState<AppAccess[]>([]);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  const isPerAppRole = (role: string) => role === "Member";
  const isAllAccessRole = (role: string) => role === "Admin";

  const handleAddAppToInvite = () => {
    const usedIds = inviteAppAccess.map((a) => a.appId);
    const next = availableApps.find((a) => !usedIds.includes(a.id));
    if (next) {
      setInviteAppAccess((prev) => [...prev, { appId: next.id, appName: next.name, role: inviteRole }]);
    }
  };

  const handleRemoveAppFromInvite = (appId: string) => {
    setInviteAppAccess((prev) => prev.filter((a) => a.appId !== appId));
  };

  const handleUpdateInviteAppRole = (appId: string, role: string) => {
    setInviteAppAccess((prev) => prev.map((a) => a.appId === appId ? { ...a, role } : a));
  };

  const handleUpdateInviteApp = (oldAppId: string, newAppId: string) => {
    const app = availableApps.find((a) => a.id === newAppId);
    if (!app) return;
    setInviteAppAccess((prev) => prev.map((a) => a.appId === oldAppId ? { ...a, appId: newAppId, appName: app.name } : a));
  };

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
        appAccess: isPerAppRole(inviteRole) ? inviteAppAccess : [],
      },
    ]);
    setInviteEmail("");
    setInviteRole("Editor");
    setInviteAppAccess([]);
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

  const handleOpenEdit = (member: Member) => {
    setEditMemberId(member.id);
    setEditMemberRole(member.role);
    setEditMemberAppAccess([...member.appAccess]);
  };

  const handleAddAppToEdit = () => {
    const usedIds = editMemberAppAccess.map((a) => a.appId);
    const next = availableApps.find((a) => !usedIds.includes(a.id));
    if (next) {
      setEditMemberAppAccess((prev) => [...prev, { appId: next.id, appName: next.name, role: "Editor" }]);
    }
  };

  const handleRemoveAppFromEdit = (appId: string) => {
    setEditMemberAppAccess((prev) => prev.filter((a) => a.appId !== appId));
  };

  const handleUpdateEditAppRole = (appId: string, role: string) => {
    setEditMemberAppAccess((prev) => prev.map((a) => a.appId === appId ? { ...a, role } : a));
  };

  const handleUpdateEditApp = (oldAppId: string, newAppId: string) => {
    const app = availableApps.find((a) => a.id === newAppId);
    if (!app) return;
    setEditMemberAppAccess((prev) => prev.map((a) => a.appId === oldAppId ? { ...a, appId: newAppId, appName: app.name } : a));
  };

  const handleSaveEdit = () => {
    if (!editMemberId) return;
    setMembers((prev) => prev.map((m) =>
      m.id === editMemberId
        ? { ...m, role: editMemberRole, appAccess: isPerAppRole(editMemberRole) ? editMemberAppAccess : [] }
        : m
    ));
    setEditMemberId(null);
  };

  const handleSaveRole = (id: string, role: string) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role, appAccess: isAllAccessRole(role) ? [] : m.appAccess } : m)));
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
              <TableHead className="text-xs w-6" />
              <TableHead className="text-xs">Name</TableHead>
              <TableHead className="text-xs">Role</TableHead>
              <TableHead className="text-xs">App Access</TableHead>
              <TableHead className="text-xs">Joined</TableHead>
              <TableHead className="text-xs text-right">Total Usage</TableHead>
              <TableHead className="text-xs text-right">AI Usage Limit</TableHead>
              <TableHead className="text-xs w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => {
              const hasAppAccess = isPerAppRole(member.role) && member.appAccess.length > 0;
              const isExpanded = expandedMember === member.id;

              return (
                <>
                  <TableRow key={member.id} className="group">
                    <TableCell className="px-2">
                      {hasAppAccess ? (
                        <button
                          onClick={() => setExpandedMember(isExpanded ? null : member.id)}
                          className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                        </button>
                      ) : null}
                    </TableCell>
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
                    <TableCell>
                      {isAllAccessRole(member.role) ? (
                        <span className="text-xs text-muted-foreground italic">All apps</span>
                      ) : member.appAccess.length > 0 ? (
                        <span className="text-xs text-muted-foreground">{member.appAccess.length} app{member.appAccess.length > 1 ? "s" : ""}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No apps assigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{member.joined}</TableCell>
                    <TableCell className="text-sm text-right font-medium text-foreground">{member.usage}</TableCell>
                    <TableCell className="text-sm text-right font-medium text-foreground">${member.creditLimit}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => { setEditCreditId(member.id); setEditCreditValue(String(member.creditLimit)); }}>
                             Update AI Usage Limit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenEdit(member)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleRemove(member.id)}>
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  {hasAppAccess && isExpanded && (
                    <TableRow key={`${member.id}-apps`} className="bg-muted/20">
                      <TableCell colSpan={8} className="px-8 py-3">
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">App-level Access</p>
                          {member.appAccess.map((access) => (
                            <div key={access.appId} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-background border border-border">
                              <span className="text-sm text-foreground font-medium">{access.appName}</span>
                              <span className="text-xs font-medium bg-muted px-2.5 py-1 rounded-full text-foreground">{access.role}</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-[480px]">
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
              <Select value={inviteRole} onValueChange={(val) => { setInviteRole(val); if (isAllAccessRole(val)) setInviteAppAccess([]); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {orgRoles.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isAllAccessRole(inviteRole) && (
                <p className="text-xs text-muted-foreground mt-1">
                  {inviteRole}s have access to all apps by default.
                </p>
              )}
            </div>

            {isPerAppRole(inviteRole) && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">App Access</label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddAppToInvite}
                    disabled={inviteAppAccess.length >= availableApps.length}
                    className="gap-1 h-7 text-xs"
                  >
                    <Plus className="h-3 w-3" /> Add App
                  </Button>
                </div>

                {inviteAppAccess.length === 0 && (
                  <p className="text-xs text-muted-foreground py-2">No apps added yet. Click "Add App" to assign per-app access.</p>
                )}

                {inviteAppAccess.map((access) => {
                  const usedIds = inviteAppAccess.filter((a) => a.appId !== access.appId).map((a) => a.appId);
                  return (
                    <div key={access.appId} className="flex items-center gap-2 p-2 rounded-lg border border-border bg-muted/30">
                      <div className="flex-1">
                        <Select value={access.appId} onValueChange={(val) => handleUpdateInviteApp(access.appId, val)}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {availableApps
                              .filter((a) => !usedIds.includes(a.id))
                              .map((a) => (
                                <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-32">
                        <Select value={access.role} onValueChange={(val) => handleUpdateInviteAppRole(access.appId, val)}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {appRoles.map((r) => (
                              <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <button
                        onClick={() => handleRemoveAppFromInvite(access.appId)}
                        className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
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
            <DialogTitle>Update AI Usage Limit</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5 py-2">
            <label className="text-sm font-medium text-foreground">AI Usage Limit ($)</label>
            <Input type="number" value={editCreditValue} onChange={(e) => setEditCreditValue(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCreditId(null)}>Cancel</Button>
            <Button onClick={() => editCreditId && handleSaveCreditLimit(editCreditId)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={!!editMemberId} onOpenChange={() => setEditMemberId(null)}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Role</label>
              <Select value={editMemberRole} onValueChange={(val) => { setEditMemberRole(val); if (isAllAccessRole(val)) setEditMemberAppAccess([]); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {orgRoles.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isAllAccessRole(editMemberRole) && (
                <p className="text-xs text-muted-foreground mt-1">Admins have access to all apps by default.</p>
              )}
            </div>

            {isPerAppRole(editMemberRole) && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">App Access</label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddAppToEdit}
                    disabled={editMemberAppAccess.length >= availableApps.length}
                    className="gap-1 h-7 text-xs"
                  >
                    <Plus className="h-3 w-3" /> Add App
                  </Button>
                </div>

                {editMemberAppAccess.length === 0 && (
                  <p className="text-xs text-muted-foreground py-2">No apps added yet. Click "Add App" to assign per-app access.</p>
                )}

                {editMemberAppAccess.map((access) => {
                  const usedIds = editMemberAppAccess.filter((a) => a.appId !== access.appId).map((a) => a.appId);
                  return (
                    <div key={access.appId} className="flex items-center gap-2 p-2 rounded-lg border border-border bg-muted/30">
                      <div className="flex-1">
                        <Select value={access.appId} onValueChange={(val) => handleUpdateEditApp(access.appId, val)}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {availableApps
                              .filter((a) => !usedIds.includes(a.id))
                              .map((a) => (
                                <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-32">
                        <Select value={access.role} onValueChange={(val) => handleUpdateEditAppRole(access.appId, val)}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {appRoles.map((r) => (
                              <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <button
                        onClick={() => handleRemoveAppFromEdit(access.appId)}
                        className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMemberId(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamSettings;
