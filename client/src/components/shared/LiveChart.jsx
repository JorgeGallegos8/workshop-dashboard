import { ResponsiveContainer, Line, LineChart, XAxis, YAxis, Tooltip } from 'recharts';

export default function LiveChart({ data, lines }) {
  return (
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart  
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        onContextMenu={(_, e) => e.preventDefault()}
      >
        {lines.map(line => (
          <Line 
            key={line.key} 
            dataKey={line.key} 
            stroke={line.color}
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false}
          />
        ))}
        <XAxis 
          dataKey='time' 
          interval={10}
          tick={{ fontSize: 10 }}
        />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip contentStyle={{ backgroundColor: 'black', color: 'white' }} />
      </LineChart>
    </ResponsiveContainer>
  );
}