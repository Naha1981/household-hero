import React from 'react';
import { MonthlySpending } from '../../types';

interface SpendingLineChartProps {
  data: MonthlySpending[]; // Expects data like [{ month: "Jan", amount: 1000 }, ...]
  width?: number;
  height?: number;
}

const SpendingLineChart: React.FC<SpendingLineChartProps> = ({ data, height = 148 }) => {
  if (!data || data.length === 0) {
    return <p className="text-theme-dark-text-muted text-center py-8">No spending data for the chart.</p>;
  }

  const chartWidth = 472; // SVG intrinsic width from mockup
  const chartHeight = height;
  const padding = 20; // Padding around the chart

  const dataPoints = data.length > 1 ? data.length -1 : 1;
  const xStep = (chartWidth - 2 * padding) / dataPoints;

  const yMax = Math.max(...data.map(d => d.amount), 0);
  const yMin = 0; // Assuming spending doesn't go negative

  const toPathPoint = (amount: number, index: number) => {
    const x = padding + index * xStep;
    const y = chartHeight - padding - ((amount - yMin) / (yMax - yMin || 1)) * (chartHeight - 2 * padding);
    return `${x},${y}`;
  };
  
  const pathD = data.map((point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${command} ${toPathPoint(point.amount, index)}`;
    }).join(' ');

  const areaPathD = `${pathD} L ${padding + (data.length -1) * xStep},${chartHeight - padding} L ${padding},${chartHeight - padding} Z`;

  return (
    <div className="flex flex-col items-center">
      <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="spendingLineChartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#483e23" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#483e23" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {yMax > 0 && (
          <>
            <path d={areaPathD} fill="url(#spendingLineChartFill)" />
            <path d={pathD} stroke="#caba91" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
        {/* Optional: Add circles for data points if desired */}
        {/* {data.map((point, index) => (
          <circle key={index} cx={padding + index * xStep} cy={chartHeight - padding - ((point.amount - yMin) / (yMax - yMin || 1)) * (chartHeight - 2 * padding)} r="4" fill="#f4c653" />
        ))} */}
      </svg>
      <div className="flex justify-around w-full mt-2 px-1">
        {data.map((item, index) => (
          <p key={index} className="text-theme-dark-text-muted text-[13px] font-bold leading-normal tracking-[0.015em]">
            {item.month}
          </p>
        ))}
      </div>
    </div>
  );
};

export default SpendingLineChart;