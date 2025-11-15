import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    ResponsiveContainer,
    Cell,
} from "recharts";

type LimeBarChartProps = {
    featureNames: string[];
    meanContrib: number[];
};

export default function LimeBarChart({ featureNames, meanContrib }: LimeBarChartProps) {
    const data = featureNames.map((name, i) => ({
        name,
        value: meanContrib[i],
    }));

    return (
        <div style={{ width: "600px", height: 450 }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 80 }}>

                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} interval={0} />

                    <YAxis />

                    <ReferenceLine y={0} stroke="black" strokeWidth={1} />

                    <Tooltip />

                    <Bar dataKey="value" isAnimationActive={false}>
                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={entry.value > 0 ? "#4CAF50" : "#E57373"}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
