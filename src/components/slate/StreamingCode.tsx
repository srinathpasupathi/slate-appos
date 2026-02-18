import { useState, useEffect, useRef } from "react";

const GENERATED_CODE = `import React, { useState, useMemo } from "react";
import { Search, Filter, TrendingUp, Globe, Users, DollarSign } from "lucide-react";

interface Franchise {
  id: string;
  name: string;
  country: string;
  region: string;
  revenue: number;
  status: "active" | "pending" | "inactive";
  outlets: number;
}

const franchises: Franchise[] = [
  { id: "1", name: "Metro Bites NYC", country: "USA", region: "North America", revenue: 2400000, status: "active", outlets: 12 },
  { id: "2", name: "Tokyo Express", country: "Japan", region: "Asia Pacific", revenue: 1850000, status: "active", outlets: 8 },
  { id: "3", name: "Berlin Eats", country: "Germany", region: "Europe", revenue: 1200000, status: "active", outlets: 5 },
  { id: "4", name: "Sydney Grill", country: "Australia", region: "Asia Pacific", revenue: 980000, status: "pending", outlets: 3 },
  { id: "5", name: "Dubai Flavors", country: "UAE", region: "Middle East", revenue: 3100000, status: "active", outlets: 15 },
];

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = useMemo(() =>
    franchises.filter(f =>
      f.name.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === "all" || f.status === statusFilter)
    ), [search, statusFilter]);

  const totalRevenue = franchises.reduce((s, f) => s + f.revenue, 0);
  const totalOutlets = franchises.reduce((s, f) => s + f.outlets, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-6 py-4">
        <h1 className="text-2xl font-bold">Franchise Sales Management</h1>
        <p className="text-muted-foreground">Manage franchises across the globe</p>
      </header>

      <div className="p-6 grid grid-cols-4 gap-4">
        <KPICard icon={<DollarSign />} label="Total Revenue" value={"$" + (totalRevenue / 1e6).toFixed(1) + "M"} />
        <KPICard icon={<Globe />} label="Countries" value="12" />
        <KPICard icon={<Users />} label="Total Outlets" value={totalOutlets.toString()} />
        <KPICard icon={<TrendingUp />} label="Growth" value="+18.2%" />
      </div>

      <div className="px-6">
        <FranchiseTable data={filtered} search={search} onSearch={setSearch} />
      </div>
    </div>
  );
};

export default Dashboard;`;

const StreamingCode = ({ isGenerating }: { isGenerating: boolean }) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lines = GENERATED_CODE.split("\n");

  useEffect(() => {
    if (!isGenerating) {
      setVisibleLines(lines.length);
      return;
    }

    setVisibleLines(0);
    let line = 0;
    const interval = setInterval(() => {
      line++;
      setVisibleLines(line);
      if (line >= lines.length) clearInterval(interval);
    }, 180);

    return () => clearInterval(interval);
  }, [isGenerating, lines.length]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleLines]);

  return (
    <div ref={containerRef} className="p-4 font-mono text-xs leading-6 text-muted-foreground overflow-auto h-full">
      {lines.slice(0, visibleLines).map((text, i) => (
        <div key={i} className="flex">
          <span className="w-8 text-right mr-4 text-muted-foreground/40 select-none">{i + 1}</span>
          <span className="text-foreground/80 whitespace-pre">{text}</span>
        </div>
      ))}
      {isGenerating && visibleLines < lines.length && (
        <div className="flex">
          <span className="w-8 text-right mr-4 text-muted-foreground/40 select-none">{visibleLines + 1}</span>
          <span className="inline-block w-2 h-4 bg-primary animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default StreamingCode;
