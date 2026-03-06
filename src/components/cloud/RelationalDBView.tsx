import { useState } from "react";
import { Search, Table as TableIcon, Plus } from "lucide-react";

// ─── Sample Data ───

interface TableColumn {
  columnId: string;
  columnName: string;
  dataType: string;
  defaultValue: string;
  searchIndexed: string;
  isUnique: string;
  isMandatory: string;
  piiEphi: string;
}

interface TableDef {
  name: string;
  tableId: string;
  columns: TableColumn[];
  scopes: { roleName: string; scope: "Global" | "Org" | "User" }[];
  permissions: { roleName: string; select: boolean; update: boolean; insert: boolean; delete: boolean }[];
}

const TABLES: TableDef[] = [
  {
    name: "Leads",
    tableId: "2050800000098814",
    columns: [
      { columnId: "2050800000098817", columnName: "ROWID", dataType: "bigint", defaultValue: "", searchIndexed: "false", isUnique: "false", isMandatory: "false", piiEphi: "false" },
      { columnId: "2050800000098819", columnName: "CREATORID", dataType: "bigint", defaultValue: "", searchIndexed: "true", isUnique: "false", isMandatory: "false", piiEphi: "false" },
      { columnId: "2050800000098821", columnName: "CREATEDTIME", dataType: "datetime", defaultValue: "", searchIndexed: "true", isUnique: "false", isMandatory: "false", piiEphi: "false" },
      { columnId: "2050800000098823", columnName: "MODIFIEDTIME", dataType: "datetime", defaultValue: "", searchIndexed: "true", isUnique: "false", isMandatory: "false", piiEphi: "false" },
    ],
    scopes: [
      { roleName: "App Administrator", scope: "Global" },
      { roleName: "App User", scope: "Global" },
    ],
    permissions: [
      { roleName: "App Administrator", select: true, update: true, insert: true, delete: true },
      { roleName: "App User", select: true, update: false, insert: false, delete: false },
    ],
  },
  {
    name: "ABC",
    tableId: "2050800000099001",
    columns: [
      { columnId: "2050800000099003", columnName: "ROWID", dataType: "bigint", defaultValue: "", searchIndexed: "false", isUnique: "false", isMandatory: "false", piiEphi: "false" },
      { columnId: "2050800000099005", columnName: "CREATORID", dataType: "bigint", defaultValue: "", searchIndexed: "true", isUnique: "false", isMandatory: "false", piiEphi: "false" },
      { columnId: "2050800000099007", columnName: "CREATEDTIME", dataType: "datetime", defaultValue: "", searchIndexed: "true", isUnique: "false", isMandatory: "false", piiEphi: "false" },
      { columnId: "2050800000099009", columnName: "MODIFIEDTIME", dataType: "datetime", defaultValue: "", searchIndexed: "true", isUnique: "false", isMandatory: "false", piiEphi: "false" },
    ],
    scopes: [
      { roleName: "App Administrator", scope: "Global" },
      { roleName: "App User", scope: "Global" },
    ],
    permissions: [
      { roleName: "App Administrator", select: true, update: true, insert: true, delete: true },
      { roleName: "App User", select: true, update: false, insert: false, delete: false },
    ],
  },
];

type SubTab = "schema" | "scopes" | "data";

interface RelationalDBViewProps {
  showCreate?: boolean;
}

const RelationalDBView = ({ showCreate = false }: RelationalDBViewProps) => {
  const [selectedTable, setSelectedTable] = useState(TABLES[0].name);
  const [tableSearch, setTableSearch] = useState("");
  const [columnSearch, setColumnSearch] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("schema");

  const table = TABLES.find(t => t.name === selectedTable) || TABLES[0];
  const filteredTables = TABLES.filter(t => t.name.toLowerCase().includes(tableSearch.toLowerCase()));
  const filteredColumns = table.columns.filter(c => c.columnName.toLowerCase().includes(columnSearch.toLowerCase()));

  return (
    <div className="flex h-full min-h-[500px]">
      {/* Left sidebar – Tables List */}
      <div className="w-64 border-r border-border flex flex-col shrink-0">
        <div className="px-4 pt-4 pb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">Tables List</h3>
          {showCreate && (
            <button className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              New Table
            </button>
          )}
        </div>
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search Table Names"
              value={tableSearch}
              onChange={e => setTableSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2">
          {filteredTables.map(t => (
            <button
              key={t.name}
              onClick={() => { setSelectedTable(t.name); setActiveSubTab("schema"); setColumnSearch(""); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                selectedTable === t.name
                  ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <TableIcon className="h-4 w-4 shrink-0" />
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Right content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sub-tabs */}
        <div className="border-b border-border flex gap-0">
          {([
            { id: "schema" as SubTab, label: "Schema View" },
            { id: "scopes" as SubTab, label: "Scopes & Permissions" },
            { id: "data" as SubTab, label: "Data View" },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeSubTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* ─── Schema View ─── */}
          {activeSubTab === "schema" && (
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{table.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Table ID : {table.tableId}</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search Column Names"
                    value={columnSearch}
                    onChange={e => setColumnSearch(e.target.value)}
                    className="h-8 pl-8 pr-3 w-52 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Column Id", "Column Name", "Data Type", "Default value", "Search Indexed", "Is Unique", "Is Mandatory", "PII/ePHI"].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-primary whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredColumns.map(col => (
                      <tr key={col.columnId} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground">{col.columnId}</td>
                        <td className="px-4 py-3 text-foreground font-medium">{col.columnName}</td>
                        <td className="px-4 py-3 text-muted-foreground">{col.dataType}</td>
                        <td className="px-4 py-3 text-muted-foreground">{col.defaultValue || "—"}</td>
                        <td className="px-4 py-3 text-muted-foreground">{col.searchIndexed}</td>
                        <td className="px-4 py-3 text-muted-foreground">{col.isUnique}</td>
                        <td className="px-4 py-3 text-muted-foreground">{col.isMandatory}</td>
                        <td className="px-4 py-3 text-muted-foreground">{col.piiEphi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── Scopes & Permissions ─── */}
          {activeSubTab === "scopes" && (
            <div className="space-y-8">
              {/* Table Scope */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Table Scope</h3>
                <p className="text-sm text-muted-foreground mb-4">Table Scope defines the availability scope of a table's data.</p>

                <div className="bg-muted/30 rounded-lg p-5 space-y-4 mb-6">
                  <div>
                    <p className="font-semibold text-foreground text-sm">Global</p>
                    <p className="text-sm text-muted-foreground">The entire table data will be returned to anyone who queries this table.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Org</p>
                    <p className="text-sm text-muted-foreground">Only the data inserted by the org members of the user who queries the table will be returned.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">User</p>
                    <p className="text-sm text-muted-foreground">Only the data inserted by the user who queries the table will be returned.</p>
                  </div>
                </div>

                <table className="w-full text-sm max-w-2xl">
                  <thead>
                    <tr className="border-b border-border">
                      {["Role Name", "Global", "Org", "User"].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-primary">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.scopes.map(s => (
                      <tr key={s.roleName} className="border-b border-border/50">
                        <td className="px-4 py-3 text-foreground">{s.roleName}</td>
                        {(["Global", "Org", "User"] as const).map(scope => (
                          <td key={scope} className="px-4 py-3">
                            <span className={`inline-block h-4 w-4 rounded-full border-2 ${
                              s.scope === scope
                                ? "border-primary bg-primary"
                                : "border-border bg-background"
                            }`}>
                              {s.scope === scope && (
                                <span className="block h-full w-full rounded-full border-2 border-background bg-primary" />
                              )}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Permissions */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Table Permissions</h3>
                <table className="w-full text-sm max-w-2xl">
                  <thead>
                    <tr className="border-b border-border">
                      {["Role Name", "Select", "Update", "Insert", "Delete"].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-primary">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.permissions.map(p => (
                      <tr key={p.roleName} className="border-b border-border/50">
                        <td className="px-4 py-3 text-foreground">{p.roleName}</td>
                        {(["select", "update", "insert", "delete"] as const).map(perm => (
                          <td key={perm} className="px-4 py-3">
                            <span className={`inline-flex items-center justify-center h-4 w-4 rounded ${
                              p[perm]
                                ? "bg-primary text-primary-foreground"
                                : "border border-border bg-background"
                            }`}>
                              {p[perm] && (
                                <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              )}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── Data View ─── */}
          {activeSubTab === "data" && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Add your first row</h3>
              <p className="text-sm text-muted-foreground max-w-md mb-5">
                Add rows to create, edit, and delete records in your table. Make sure you've created columns in the schema view before trying to add new rows.
              </p>
              <button className="h-9 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                Add Row
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelationalDBView;
