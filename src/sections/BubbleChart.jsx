"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { Card, CardContent } from "@/components/ui/card"
import { chartData } from "../../sample_response"

// eslint-disable-next-line react/prop-types
export function BubbleChart({ data, classification }) {

    const chartRef = useRef(null)
    const [tooltip, setTooltip] = useState({ text: "", x: 0, y: 0, visible: false })

    useEffect(() => {
        if (!data) return
        console.log(data)
        const width = chartRef.current.clientWidth
        const height = chartRef.current.clientHeight || 500

        // Clear any existing SVG elements before rendering
        d3.select(chartRef.current).selectAll("*").remove()

        // Create SVG container
        const svg = d3.select(chartRef.current)
            .attr("width", width)
            .attr("height", height)
            .style("background-color", "transparent")

        const bubbleData = chartData.body.flatMap(item =>
            item.lemmatized.map(keyword => ({
                label: keyword.label,
                score: keyword.score,

            }))

        )

        // Set up a scale for the bubble sizes
        const radiusScale = d3.scaleSqrt()
            .domain([0, 1])
            .range([10, 100])

        // Create simulation with forces
        const simulation = d3.forceSimulation(data)
            .force("charge", d3.forceManyBody().strength(4))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide(d => radiusScale(d.score) * 0.9))
            .on("tick", ticked)

        // Create and append circles
        const nodes = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", d => radiusScale(d.score))
            .attr("fill", d => d.label === "Biased" ? "#ED525E" : "#66A352")
            .attr("stroke", "transparent")
            .attr("stroke-width", 2)
            .on("mouseover", (event, d) => {
                setTooltip({
                    label: `${d.label}`,
                    score: `${d.score.toFixed(2)}`,
                    x: event.pageX,
                    y: event.pageY,
                    visible: true
                })
            })
            .on("mousemove", (event) => {
                setTooltip(prev => ({
                    ...prev,
                    x: event.pageX,
                    y: event.pageY
                }))
            })
            .on("mouseout", () => {
                setTooltip(prev => ({
                    ...prev,
                    visible: false
                }))
            })

        // Create and append labels
        const labels = svg.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .style("fill", "#fff")
            .style("font-size", "16px")
            .text(d => (d.keyword))


        function ticked() {
            nodes
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)

            labels
                .attr("x", d => d.x)
                .attr("y", d => d.y)
        }

        return () => {
            // Cleanup simulation on component unmount
            simulation.stop()
        }

    }, [data])
    console.log(data)
    return (
        <Card className="w-full border-none relative bg-[url(assets/bg.png)] p-0 lg:w-1/2 h-screen ">
            <div className="text-white font-graphik flex absolute z-50 w-full items-center justify-between px-12 py-12">
                <div className="flex items-center gap-2">
                    <img src={'https://tabodozo.sirv.com/bubble-img2.png'} className="h-14 object-contain" />
                </div>
                <div className="text-xl flex flex-col">
                    {data && <p>Overall label: {classification?.label}</p>}
                    {data && <p>Score: {classification?.score?.toFixed(2)}</p>}
                </div>
            </div>
            <CardContent className="w-auto flex-col p-0 font-graphik h-full flex justify-center items-center">
                <div className="relative w-full h-full">
                    <svg ref={chartRef} className="w-full h-full"></svg>
                    {tooltip.visible && (
                        <div
                            className="absolute bg-white flex flex-col gap-1 text-gray-800 text-xs py-6 px-2 w-[13rem] rounded shadow-lg"
                            style={{ top: tooltip.y + 10, left: tooltip.x + 10 }}
                        >
                            <p className="font-bold text-xl"> Title</p>
                            <div className="flex flex-col">
                                <p className="text-lg "><span className="font-semibold">label:</span>{tooltip.label}</p>
                                <p className="text-lg "><span className="font-semibold">score:</span>  {tooltip.score}</p>
                            </div>

                            <a href="#">Link</a>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
