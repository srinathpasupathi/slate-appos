import { useState } from "react";
import { Search, HelpCircle, ExternalLink, Pencil, Info, Shield, Lock, UserCheck, KeyRound } from "lucide-react";

type AuthTab = "user-management" | "auth-type" | "email-templates";
type UserSubTab = "users" | "roles";
type EmailSubTab = "invitation" | "password-reset";

const AUTH_USERS = [
  {
    firstName: "Srinath",
    lastName: "Pasupathi",
    userId: "2050800000101559",
    zuid: "50039559355",
    email: "srinath.p@zohocorp.com",
    orgId: "50039559354",
    createdTime: "Mar 5, 2026 at 09:17 AM",
    role: "App Administrator",
    confirm: "No",
    status: true,
  },
];

const ROLES = [
  { name: "App Administrator", description: "Full access to all application features and settings.", users: 1 },
  { name: "App User", description: "Standard access to application features.", users: 0 },
];

const SOCIAL_LOGINS = [
  { name: "Zoho", icon: "🔷" },
  { name: "Google", icon: "🟡" },
  { name: "Microsoft365", icon: "🟦" },
  { name: "LinkedIn", icon: "🔵" },
  { name: "Facebook", icon: "🔵" },
];

interface AuthenticationViewProps {
  showCreate?: boolean;
}

const AuthenticationView = ({ showCreate = false }: AuthenticationViewProps) => {
  const [activeTab, setActiveTab] = useState<AuthTab>("user-management");
  const [userSubTab, setUserSubTab] = useState<UserSubTab>("users");
  const [emailSubTab, setEmailSubTab] = useState<EmailSubTab>("invitation");
  const [emailSearch, setEmailSearch] = useState("");
  const [publicSignup, setPublicSignup] = useState(false);

  const filteredUsers = AUTH_USERS.filter(u =>
    u.email.toLowerCase().includes(emailSearch.toLowerCase())
  );

  // ─── Setup Landing Page (for /om Cloud tab) ───
  if (showCreate) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        {/* Illustration */}
        <div className="relative mb-8">
          <div className="w-40 h-40 relative">
            {/* Background circle */}
            <div className="absolute inset-2 rounded-full border-2 border-dashed border-muted-foreground/20" />
            {/* Center card */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-24 rounded-lg bg-muted/60 border border-border flex flex-col items-center justify-center gap-1 shadow-sm">
                <UserCheck className="h-6 w-6 text-muted-foreground/60" />
                <div className="w-10 h-1 rounded bg-muted-foreground/20" />
                <div className="w-8 h-1 rounded bg-muted-foreground/15" />
              </div>
            </div>
            {/* Decorative icons */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2">
              <div className="h-7 w-7 rounded-full bg-green-100 border border-green-200 flex items-center justify-center">
                <Shield className="h-3.5 w-3.5 text-green-600" />
              </div>
            </div>
            <div className="absolute bottom-3 left-0">
              <div className="h-7 w-7 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                <Info className="h-3.5 w-3.5 text-amber-500" />
              </div>
            </div>
            <div className="absolute top-1/3 right-0">
              <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Lock className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="absolute bottom-6 right-2">
              <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                <KeyRound className="h-3 w-3 text-primary/60" />
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-3">Authentication</h2>
        <p className="text-sm text-muted-foreground text-center max-w-lg mb-10 leading-relaxed">
          Enable authentication for your application, add and manage end-users securely from the console. You can configure multiple authentication methods, based on your requirements.
        </p>

        {/* Native Authentication Card */}
        <div className="w-full max-w-2xl space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <h3 className="text-base font-semibold text-foreground">Native Authentication</h3>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-sm text-primary hover:underline">Learn More</button>
                <button className="h-9 px-4 rounded-md border border-primary text-sm font-medium text-primary hover:bg-primary/5 transition-colors">
                  Set Up
                </button>
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Handles the entire implementation of authentication. You can select one of these native authentication types:
                  </p>
                  <ul className="space-y-1.5 ml-1">
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                      Hosted Login
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                      Embedded Login
                    </li>
                  </ul>
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                  Recommended
                </span>
              </div>
            </div>
          </div>

          {/* Third-party Authentication Card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/50 flex items-center justify-center">
                  <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                </div>
                <h3 className="text-base font-semibold text-foreground">Third-party Authentication</h3>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-sm text-primary hover:underline">Learn More</button>
                <button className="h-9 px-4 rounded-md border border-primary text-sm font-medium text-primary hover:bg-primary/5 transition-colors">
                  Set Up
                </button>
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">
                You can also set up a third-party authentication service of your choice in your application.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col h-full min-h-[500px]">
      {/* Header */}
      <div className="px-6 pt-5 pb-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Authentication</h2>
          <button className="flex items-center gap-1.5 text-sm text-primary hover:underline">
            <HelpCircle className="h-4 w-4" />
            Help
          </button>
        </div>
        {/* Top tabs */}
        <div className="border-b border-border flex gap-0">
          {([
            { id: "user-management" as AuthTab, label: "User Management" },
            { id: "auth-type" as AuthTab, label: "Authentication Type" },
            { id: "email-templates" as AuthTab, label: "Email Templates" },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* ─── User Management ─── */}
        {activeTab === "user-management" && (
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-1">Manage Application Users</h3>
            <p className="text-sm text-muted-foreground mb-4">Invite users to your application, manage them, and configure their roles.</p>

            {/* Users / Roles sub-tabs */}
            <div className="border-b border-border flex gap-0 mb-6">
              {([
                { id: "users" as UserSubTab, label: "Users" },
                { id: "roles" as UserSubTab, label: "Roles" },
              ]).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setUserSubTab(tab.id)}
                  className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                    userSubTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {userSubTab === "users" && (
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-base font-semibold text-foreground mb-0.5">User Details</h4>
                    <p className="text-sm text-muted-foreground">View all the users of your application and manage their accounts.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search Email"
                        value={emailSearch}
                        onChange={e => setEmailSearch(e.target.value)}
                        className="h-9 pl-8 pr-3 w-48 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <button className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                      Invite User
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        {["First Name", "Last Name", "User ID", "ZUID", "Email", "Org ID", "Created Time", "Role", "Confirm", "Status"].map(h => (
                          <th key={h} className="text-left px-3 py-2.5 text-xs font-medium text-primary whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => (
                        <tr key={u.userId} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="px-3 py-3 text-foreground">{u.firstName}</td>
                          <td className="px-3 py-3 text-foreground">{u.lastName}</td>
                          <td className="px-3 py-3 text-muted-foreground text-xs">{u.userId}</td>
                          <td className="px-3 py-3 text-muted-foreground text-xs">{u.zuid}</td>
                          <td className="px-3 py-3 text-muted-foreground">{u.email}</td>
                          <td className="px-3 py-3 text-muted-foreground text-xs">{u.orgId}</td>
                          <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">{u.createdTime}</td>
                          <td className="px-3 py-3 text-foreground">{u.role}</td>
                          <td className="px-3 py-3 text-muted-foreground">{u.confirm}</td>
                          <td className="px-3 py-3">
                            <div className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${u.status ? "bg-primary" : "bg-muted"}`}>
                              <div className={`h-4 w-4 rounded-full bg-primary-foreground transition-transform ${u.status ? "translate-x-4" : "translate-x-0"}`} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {userSubTab === "roles" && (
              <div>
                <h4 className="text-base font-semibold text-foreground mb-4">Application Roles</h4>
                <div className="space-y-3">
                  {ROLES.map(role => (
                    <div key={role.name} className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div>
                        <p className="text-sm font-medium text-foreground">{role.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{role.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{role.users} user{role.users !== 1 ? "s" : ""}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Authentication Type ─── */}
        {activeTab === "auth-type" && (
          <div className="space-y-6">
            <div className="border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                    <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Native Authentication</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      Enabled Type: Hosted
                      <Info className="h-3.5 w-3.5" />
                    </p>
                  </div>
                </div>
              </div>

              {/* Public Signup */}
              <div className="flex items-center justify-between py-4 border-t border-border">
                <div>
                  <p className="text-sm font-semibold text-foreground">Public Signup</p>
                  <p className="text-sm text-muted-foreground">This will display a sign-up button on your login form and allow social logins.</p>
                </div>
                <button
                  onClick={() => setPublicSignup(!publicSignup)}
                  className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors ${publicSignup ? "bg-primary" : "bg-muted-foreground/30"}`}
                >
                  <div className={`h-4 w-4 rounded-full bg-primary-foreground shadow transition-transform ${publicSignup ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Social Logins */}
              <div className="py-4 border-t border-border">
                <p className="text-sm font-semibold text-foreground mb-1">Social Logins</p>
                <p className="text-sm text-muted-foreground mb-4">Select common social platforms to display on your login form, that users can log in from with their accounts.</p>
                <div className="flex items-center gap-3 flex-wrap">
                  {SOCIAL_LOGINS.map(s => (
                    <div key={s.name} className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background text-sm text-foreground">
                      <span>{s.icon}</span>
                      {s.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hosted Auth Type */}
              <div className="py-4 border-t border-border">
                <p className="text-sm font-semibold text-foreground mb-1">Hosted Authentication Type</p>
                <p className="text-sm text-muted-foreground mb-4">View a preview of your login form and configure it as per your branding preferences</p>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-background text-sm">
                    Login Page
                    <svg className="h-3.5 w-3.5 text-muted-foreground" viewBox="0 0 12 12" fill="none"><path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span className="text-xs text-muted-foreground flex-1 truncate">https://franchise-sales.development.app/__auth/login</span>
                  <button className="flex items-center gap-1.5 text-sm text-primary hover:underline shrink-0">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Access URL
                  </button>
                </div>

                {/* Login Preview */}
                <div className="bg-primary/5 rounded-lg p-8 flex items-center justify-center">
                  <div className="bg-background rounded-lg shadow-lg border border-border p-6 w-72">
                    <div className="h-1 w-full bg-primary rounded-full mb-4" />
                    <p className="text-center text-sm text-muted-foreground mb-1">FranchiseSales</p>
                    <h4 className="text-center text-lg font-semibold text-foreground mb-4">Sign In</h4>
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Please enter your email address"
                        className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm placeholder:text-muted-foreground"
                        readOnly
                      />
                    </div>
                    <button className="w-full h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Email Templates ─── */}
        {activeTab === "email-templates" && (
          <div className="space-y-4">
            {/* Info banner */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-primary/5 border border-primary/20">
              <Info className="h-4 w-4 text-primary shrink-0" />
              <p className="text-sm text-muted-foreground">
                Ensure the domain address you use to send emails is verified using the <span className="text-primary cursor-pointer hover:underline">Domain</span> feature in the Mail component! This will ensure the emails are sent per DKIM protocols.
              </p>
            </div>

            <div className="border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-1">Email Templates</h3>
              <p className="text-sm text-muted-foreground mb-4">Customize the templates for the emails to be sent to users to add them to your app or while resetting their passwords.</p>

              {/* Invitation / Password Reset sub-tabs */}
              <div className="border-b border-border flex gap-0 mb-6">
                {([
                  { id: "invitation" as EmailSubTab, label: "Invitation" },
                  { id: "password-reset" as EmailSubTab, label: "Password Reset" },
                ]).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setEmailSubTab(tab.id)}
                    className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                      emailSubTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {emailSubTab === "invitation" && (
                <div className="grid grid-cols-2 gap-6">
                  {/* Left – Template details */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-base font-semibold text-foreground">Invitation</h4>
                      <button className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">This email will be sent to verify your users when they sign up for your application.</p>

                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-primary mb-0.5">Sender Email</p>
                        <p className="text-sm text-foreground">noreply@catalystmailer.in</p>
                      </div>
                      <div>
                        <p className="text-xs text-primary mb-0.5">Subject</p>
                        <p className="text-sm text-foreground">Welcome to %APP_NAME%</p>
                      </div>
                      <div>
                        <p className="text-xs text-primary mb-0.5">Welcome message</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {'<p>Hello %FIRST_NAME% %LAST_NAME%,</p> <p>You have been invited to join %APP_NAME%. You can access the app from this link:</p> <p><a href=\'%LINK%\'>%LINK%</a></p> <p>You are assigned to the role %ROLE_NAME% in this app.</p> <p>If you didn\'t ask to join the application or if you think this was a mistake, you can ignore this email.</p> <p>Thanks,</p> <p>%APP_NAME% team</p>'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right – Preview */}
                  <div>
                    <h4 className="text-base font-semibold text-foreground mb-3">Preview</h4>
                    <div className="bg-muted/40 rounded-lg p-6 text-sm text-foreground leading-relaxed">
                      <p className="mb-3"><strong>Hello FIRST_NAME LAST_NAME,</strong></p>
                      <p className="mb-3">You have been invited to join Om. You can access the app from this link:</p>
                      <p className="mb-3 text-primary underline break-all">https://franchise-sales.development.app/confirmaccount?serviceurl=DUMMY_REDIRECT_URL&projectId=Om&digest=DIGEST_VALUE</p>
                      <p className="mb-3">You are assigned to the role ROLE_NAME in this app.</p>
                      <p className="mb-3">If you didn't ask to join the application or if you think this was a mistake, you can ignore this email.</p>
                      <p>Thanks,</p>
                    </div>
                  </div>
                </div>
              )}

              {emailSubTab === "password-reset" && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-base font-semibold text-foreground">Password Reset</h4>
                      <button className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">This email will be sent when a user requests to reset their password.</p>

                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-primary mb-0.5">Sender Email</p>
                        <p className="text-sm text-foreground">noreply@catalystmailer.in</p>
                      </div>
                      <div>
                        <p className="text-xs text-primary mb-0.5">Subject</p>
                        <p className="text-sm text-foreground">Reset your %APP_NAME% password</p>
                      </div>
                      <div>
                        <p className="text-xs text-primary mb-0.5">Message</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {'<p>Hello %FIRST_NAME%,</p> <p>We received a request to reset your password for %APP_NAME%.</p> <p>Click the link below to reset it:</p> <p><a href=\'%LINK%\'>%LINK%</a></p> <p>If you didn\'t request this, you can safely ignore this email.</p> <p>Thanks,</p> <p>%APP_NAME% team</p>'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-semibold text-foreground mb-3">Preview</h4>
                    <div className="bg-muted/40 rounded-lg p-6 text-sm text-foreground leading-relaxed">
                      <p className="mb-3"><strong>Hello FIRST_NAME,</strong></p>
                      <p className="mb-3">We received a request to reset your password for Om.</p>
                      <p className="mb-3">Click the link below to reset it:</p>
                      <p className="mb-3 text-primary underline break-all">https://franchise-sales.development.app/resetpassword?token=RESET_TOKEN</p>
                      <p className="mb-3">If you didn't request this, you can safely ignore this email.</p>
                      <p>Thanks,</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthenticationView;
