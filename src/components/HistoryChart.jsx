import React, { useId } from 'react';

const HistoryChart = ({ data = [], dataKey = 'value', strokeColor = '#6366f1', height = 80 }) => {
  const gradientId = useId();

  if (!data || data.length < 2) {
    return (
      <div className="w-full flex items-center justify-center text-xs text-gray-400 dark:text-gray-500 font-medium" style={{ height }}>
        Collecting data...
      </div>
    );
  }

  // Extract values
  const values = data.map(item => item[dataKey] ?? 0);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  
  // Calculate boundary padding
  const valRange = maxVal - minVal;
  const padding = valRange === 0 ? 1 : valRange * 0.1;
  const yMin = Math.max(0, minVal - padding);
  const yMax = maxVal + padding;
  const yRange = yMax - yMin;

  const svgWidth = 300;
  const svgHeight = height;
  const paddingX = 4;
  const paddingY = 8;

  // Map points to SVG coordinates
  const points = data.map((item, idx) => {
    const val = item[dataKey] ?? 0;
    const x = paddingX + (idx / (data.length - 1)) * (svgWidth - 2 * paddingX);
    // In SVG, y=0 is at the top, so we invert
    const y = svgHeight - paddingY - ((val - yMin) / yRange) * (svgHeight - 2 * paddingY);
    return { x, y, value: val };
  });

  // Construct SVG Path
  const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  
  // Construct Area Path (closing the path to the bottom of the chart)
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const areaPath = `
    ${linePath} 
    L ${lastPoint.x.toFixed(1)} ${svgHeight} 
    L ${firstPoint.x.toFixed(1)} ${svgHeight} 
    Z
  `;

  return (
    <div className="w-full select-none">
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full overflow-visible" style={{ height }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {/* Grid lines (min, max, mid) */}
        <line 
          x1={0} y1={paddingY} 
          x2={svgWidth} y2={paddingY} 
          stroke="currentColor" className="text-gray-200 dark:text-gray-800" 
          strokeDasharray="3 3" strokeWidth={0.5} 
        />
        <line 
          x1={0} y1={svgHeight / 2} 
          x2={svgWidth} y2={svgHeight / 2} 
          stroke="currentColor" className="text-gray-200 dark:text-gray-800" 
          strokeDasharray="3 3" strokeWidth={0.5} 
        />
        <line 
          x1={0} y1={svgHeight - paddingY} 
          x2={svgWidth} y2={svgHeight - paddingY} 
          stroke="currentColor" className="text-gray-200 dark:text-gray-800" 
          strokeDasharray="3 3" strokeWidth={0.5} 
        />

        {/* Gradient Area */}
        <path d={areaPath} fill={`url(#${gradientId})`} />

        {/* Stroke Line */}
        <path d={linePath} fill="none" stroke={strokeColor} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />

        {/* Hover / Endpoint Dot */}
        <circle 
          cx={lastPoint.x} 
          cy={lastPoint.y} 
          r={3} 
          fill={strokeColor} 
          className="animate-pulse"
        />
      </svg>
    </div>
  );
};

export default HistoryChart;
