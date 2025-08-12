import { InsightCard } from "@/components/insights/insight-card";
import { getMockData } from "@/services/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, RefreshCw, Zap } from "lucide-react";
import { useState } from "react";

const Insights = () => {
  const insights = getMockData.insights();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const categoryFilters = [
    { label: "All", value: "all" },
    { label: "Cashflow", value: "cashflow" },
    { label: "Clients", value: "clients" },
    { label: "Growth", value: "growth" },
    { label: "Operational", value: "operational" },
  ];
  
  const [activeFilter, setActiveFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  
  const filteredInsights = activeFilter === "all" 
    ? insights 
    : insights.filter(insight => insight.category === activeFilter);
    
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };
  
  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">AI Insights</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button 
            size="sm"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            <Zap className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate New Insights"}
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categoryFilters.map((filter) => (
          <Badge
            key={filter.value}
            variant={activeFilter === filter.value ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.label}
          </Badge>
        ))}
      </div>
      
      {filteredInsights.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {filteredInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <BrainCircuit className="h-16 w-16 text-muted-foreground/60" />
          <h3 className="mt-4 text-xl font-medium">No insights available</h3>
          <p className="mt-2 text-center text-muted-foreground">
            {activeFilter !== "all" 
              ? `No ${activeFilter} insights found. Try selecting a different category.`
              : "Generate your first insight to get started with AI-powered business recommendations."}
          </p>
          <Button className="mt-4" onClick={handleGenerate}>
            <Zap className="mr-2 h-4 w-4" /> Generate Insights
          </Button>
        </div>
      )}
    </div>
  );
};

export default Insights;