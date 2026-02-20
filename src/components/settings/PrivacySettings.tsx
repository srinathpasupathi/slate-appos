import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const PrivacySettings = () => {
  const [defaultAccess, setDefaultAccess] = useState("org");
  const [mcpAccess, setMcpAccess] = useState(true);
  
  const [defaultCreditLimit, setDefaultCreditLimit] = useState("100");

  return (
    <div className="space-y-6">
      {/* Default App Access */}
      <div className="rounded-xl border border-border p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 mr-6">
            <h4 className="text-sm font-semibold text-foreground">Default App Access</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Control who can access newly created apps by default.
            </p>
          </div>
          <Select value={defaultAccess} onValueChange={setDefaultAccess}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="org">Org Only</SelectItem>
              <SelectItem value="anyone">Anyone</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* MCP Servers Access */}
      <div className="rounded-xl border border-border p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 mr-6">
            <h4 className="text-sm font-semibold text-foreground">MCP Servers Access</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Allow workspace members to use MCP servers connected to this organization.
            </p>
          </div>
          <Switch checked={mcpAccess} onCheckedChange={setMcpAccess} />
        </div>
      </div>

      {/* Default Credit Limit */}
      <div className="rounded-xl border border-border p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 mr-6">
            <h4 className="text-sm font-semibold text-foreground">Default Credit Limit for Org Members</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Set the default monthly credit limit assigned to new members joining the organization.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              className="w-24 text-right"
              value={defaultCreditLimit}
              onChange={(e) => setDefaultCreditLimit(e.target.value)}
            />
            <Button size="sm" variant="outline">Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
