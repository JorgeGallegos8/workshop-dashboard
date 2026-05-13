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
          <Line key={line.key} dataKey={line.key} stroke={line.color} dot={false} />
        ))}
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip contentStyle={{ backgroundColor: 'black', color: 'white' }} />
      </LineChart>
    </ResponsiveContainer>
  );
}