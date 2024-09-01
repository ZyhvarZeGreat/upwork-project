"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { chartData } from "../../sample_response"
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

// Data for the Pie Chart - Only one entry

// const chartDataReal = chartData.body.map((data)=>{
//     return {data?.percentage_biased,data?.}
// })
const chartData2 = [
    { label: "Biased", value: 70, fill: "#ED525E" },
    { label: "Unbiased", value: 30, fill: "#66A352" }, // Single Entry
]

const chartConfig = {
    biased: {
        label: "Biased",
        color: "#ED525E",
    },
    unbiased: {
        label: "Unbiased",
        color: "#66A352",
    },
}

export function DonutChart() {
    const totalValue = React.useMemo(() => {
        return chartData2.reduce((acc, curr) => acc + curr.value, 0)
    }, [])

    return (
        <Card className="flex border-none py-16 overflow-hidden font-graphik items-center justify-center px-12 w-1/2 flex-col">
            <CardContent className="flex-1 p-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto px-12  h-[90%]"
                >
                    <PieChart className="p-0">
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData2}
                            dataKey="value"
                            nameKey="label"
                            innerRadius={200}
                            strokeWidth={3}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy - 26}
                                                    className="fill-foreground text-xl font-medium"
                                                >
                                                    Your Prompt is
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    style={{ marginTop: '2rem' }}
                                                    className="fill-[#ED525E] font-semibold text-6xl"
                                                >
                                                    {chartData2[0].value}% biased
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col w-full gap-2 text-sm">
                <div className="flex  w-full gap-2 flex-col">
                    <p className="font-semibold text-2xl">
                        Enter your Prompt
                    </p>
                    <div className="flex items-center gap-4">

                        <Input placeholder='Enter your Prompt' className='border h-16 rounded-md shadow-sm border-black' />
                        <Button className='rounded-full w-14 h-14'>
                            <ChevronRight className="h-8 w-8" />
                        </Button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
