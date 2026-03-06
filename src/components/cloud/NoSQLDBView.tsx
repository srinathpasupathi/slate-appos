import { useState } from "react";
import { Search, Table as TableIcon, MoreHorizontal, Plus } from "lucide-react";

interface NoSQLTable {
  name: string;
  tableId: string;
  tableName: string;
  createdBy: string;
  createdOn: string;
  storageSize: string;
  noOfItems: number;
  partitionKey: { name: string; type: string };
  sortKey: string;
  noOfIndexes: number;
}

const TABLES: NoSQLTable[] = [
  {
    name: "notes_table",
    tableId: "2050800000101549",
    tableName: "notes_table",
    createdBy: "srinath.p@zohocorp.com",
    createdOn: "Mar 5, 2026 at 09:15 AM",
    storageSize: "0 bytes",
    noOfItems: 0,
    partitionKey: { name: "Noteid", type: "NUMERIC" },
    sortKey: "N/A",
    noOfIndexes: 0,
  },
];

type SubTab = "overview" | "indexes" | "data";

interface NoSQLDBViewProps {
  showCreate?: boolean;
}

const NoSQLDBView = ({ showCreate = false }: NoSQLDBViewProps) => {
  const [selectedTable, setSelectedTable] = useState(TABLES[0].name);
  const [tableSearch, setTableSearch] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("overview");

  const table = TABLES.find(t => t.name === selectedTable) || TABLES[0];
  const filteredTables = TABLES.filter(t => t.name.toLowerCase().includes(tableSearch.toLowerCase()));

  return (
    <div className="flex h-full min-h-[500px]">
      {/* Left sidebar – Tables */}
      <div className="w-64 border-r border-border flex flex-col shrink-0">
        <div className="px-4 pt-4 pb-3">
          <h3 className="text-base font-semibold text-foreground">Tables</h3>
          {showCreate && (
            <button className="w-full h-8 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              Create Table
            </button>
          )}
        </div>
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search"
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
              onClick={() => { setSelectedTable(t.name); setActiveSubTab("overview"); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                selectedTable === t.name
                  ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
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
            { id: "overview" as SubTab, label: "Overview" },
            { id: "indexes" as SubTab, label: "Indexes" },
            { id: "data" as SubTab, label: "Data" },
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
          {/* ─── Overview ─── */}
          {activeSubTab === "overview" && (
            <div>
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Table Details</h3>
                <button className="h-8 w-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  { label: "Table ID", value: table.tableId },
                  { label: "Table Name", value: table.tableName },
                  { label: "Created By", value: table.createdBy },
                  { label: "Created On", value: table.createdOn },
                  { label: "Storage Size", value: table.storageSize },
                  { label: "No. of Items", value: String(table.noOfItems) },
                ].map(row => (
                  <div key={row.label} className="flex items-center gap-4">
                    <span className="w-36 text-sm text-muted-foreground shrink-0">{row.label}</span>
                    <span className="text-sm text-muted-foreground">:</span>
                    <span className="text-sm font-medium text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-4">Key Details</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground">Partition key</span>
                    <span className="text-xs font-medium text-primary">{table.partitionKey.type}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{table.partitionKey.name}</span>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <div className="mb-2">
                    <span className="text-sm font-semibold text-foreground">Sort key</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{table.sortKey}</span>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground">No. of Indexes</span>
                    <span className="text-xs font-medium text-primary cursor-pointer hover:underline">View</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{table.noOfIndexes}</span>
                </div>
              </div>
            </div>
          )}

          {/* ─── Indexes ─── */}
          {activeSubTab === "indexes" && (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">No indexes configured</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Indexes help improve query performance on your NoSQL tables. No indexes have been created for this table yet.
              </p>
            </div>
          )}

          {/* ─── Data ─── */}
          {activeSubTab === "data" && (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">No items in this table</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                This table doesn't contain any items yet. Items will appear here once data is added to the table.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoSQLDBView;
