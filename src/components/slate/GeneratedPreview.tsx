import { useState } from "react";
import { Search, TrendingUp, Globe, Users, DollarSign, MoreHorizontal, ArrowUpRight } from "lucide-react";

const franchises = [
  { name: "Metro Bites NYC", country: "USA", revenue: "$2.4M", status: "active", outlets: 12, growth: "+12%" },
  { name: "Tokyo Express", country: "Japan", revenue: "$1.85M", status: "active", outlets: 8, growth: "+8%" },
  { name: "Berlin Eats", country: "Germany", revenue: "$1.2M", status: "active", outlets: 5, growth: "+15%" },
  { name: "Sydney Grill", country: "Australia", revenue: "$980K", status: "pending", outlets: 3, growth: "+22%" },
  { name: "Dubai Flavors", country: "UAE", revenue: "$3.1M", status: "active", outlets: 15, growth: "+31%" },
  { name: "São Paulo Kitchen", country: "Brazil", revenue: "$750K", status: "active", outlets: 4, growth: "+9%" },
  { name: "London Bites", country: "UK", revenue: "$2.1M", status: "active", outlets: 9, growth: "+14%" },
  { name: "Mumbai Spice Co", country: "India", revenue: "$1.6M", status: "pending", outlets: 7, growth: "+27%" },
];

const kpis = [
  { icon: DollarSign, label: "Total Revenue", value: "$14.2M", change: "+18.2%", color: "text-emerald-600 bg-emerald-50" },
  { icon: Globe, label: "Countries", value: "12", change: "+3 new", color: "text-blue-600 bg-blue-50" },
  { icon: Users, label: "Total Outlets", value: "63", change: "+8 this quarter", color: "text-violet-600 bg-violet-50" },
  { icon: TrendingUp, label: "Avg Growth", value: "+18.2%", change: "vs 12.1% last yr", color: "text-amber-600 bg-amber-50" },
];

const GeneratedPreview = ({ appName }: { appName?: string }) => {
  const [search, setSearch] = useState("");

  const filtered = franchises.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full min-h-0 overflow-auto bg-slate-50 animate-fade-in">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <h1 className="text-xl font-bold text-slate-900">{appName || "Franchise Sales Management"}</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage all your {appName ? appName.toLowerCase() : "franchises across the globe"}</p>
      </div>

      {/* KPIs */}
      <div className="px-6 py-5 grid grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="h-4 w-4" />
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
            <p className="text-xs text-slate-500 mt-1">{kpi.change}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">All Franchises</h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search franchises..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-52"
              />
            </div>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-4 py-2.5 font-medium text-slate-500">Franchise</th>
                <th className="text-left px-4 py-2.5 font-medium text-slate-500">Country</th>
                <th className="text-left px-4 py-2.5 font-medium text-slate-500">Revenue</th>
                <th className="text-left px-4 py-2.5 font-medium text-slate-500">Outlets</th>
                <th className="text-left px-4 py-2.5 font-medium text-slate-500">Growth</th>
                <th className="text-left px-4 py-2.5 font-medium text-slate-500">Status</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.name} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">{f.name}</td>
                  <td className="px-4 py-3 text-slate-600">{f.country}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{f.revenue}</td>
                  <td className="px-4 py-3 text-slate-600">{f.outlets}</td>
                  <td className="px-4 py-3">
                    <span className="text-emerald-600 font-medium">{f.growth}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      f.status === "active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GeneratedPreview;
