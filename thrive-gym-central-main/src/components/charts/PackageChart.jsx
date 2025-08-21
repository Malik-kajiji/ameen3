import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

// Define colors and helper function outside the component to avoid scope issues
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function getColorForPackage(packageName) {
  // Ensure packageName is a string before processing
  if (!packageName || typeof packageName !== 'string') {
    return COLORS[0];
  }
  
  // Create a hash from the package name to determine color
  const hash = Array.from(packageName).reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  return COLORS[hash % COLORS.length];
}

// Function to generate random package data for testing
const generateRandomPackageData = () => {
  const packageNames = ['الباقة الأساسية', 'الباقة الفضية', 'الباقة الذهبية', 'الباقة البلاتينية', 'الباقة الماسية'];
  return packageNames.map((name, index) => ({
    name: name,
    value: Math.floor(Math.random() * 100),
    color: COLORS[index % COLORS.length]
  }));
};

const PackageChart = ({ data, title }) => {
  console.log("PackageChart received data:", data);
  
  // Format data for the chart, with safety checks
  let chartData = [];
  
  if (data && data.length > 0) {
    // Check if data is in the expected format or needs transformation
    if (Array.isArray(data)) {
      chartData = data.map((item, index) => {
        // Handle different possible data structures
        let packageName, percentage;
        
        if (typeof item === 'object' && item !== null) {
          // Standard format: { packageName: "Name", percentage: 50 }
          if (item.packageName !== undefined) {
            packageName = item.packageName;
            percentage = typeof item.percentage === 'number' ? item.percentage : 0;
          } 
          // Alternative format: { name: "Name", value: 50 }
          else if (item.name !== undefined) {
            packageName = item.name;
            percentage = typeof item.value === 'number' ? item.value : 0;
          }
          // Fallback: try to get any string property as name and any number as value
          else {
            const keys = Object.keys(item);
            const nameKey = keys.find(key => typeof item[key] === 'string');
            const valueKey = keys.find(key => typeof item[key] === 'number');
            packageName = (nameKey ? item[nameKey] : `Package ${index + 1}`);
            percentage = (valueKey ? item[valueKey] : 0);
          }
        } else {
          // If item is not an object, treat it as the percentage value
          packageName = `Package ${index + 1}`;
          percentage = typeof item === 'number' ? item : 0;
        }
        
        return {
          name: packageName,
          value: percentage,
          color: getColorForPackage(packageName)
        };
      });
    }
  } else {
    // If no data provided, generate random data for testing
    console.log("No data provided, generating random data for testing");
    chartData = generateRandomPackageData();
  }

  console.log("PackageChart processed data:", chartData);

  // Show data even if all percentages are 0 (don't filter out everything)
  // Only show "No data available" if chartData is actually empty
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartConfig = chartData.reduce((acc, item) => {
    acc[item.name] = {
      label: item.name,
      color: item.color,
    };
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PackageChart;