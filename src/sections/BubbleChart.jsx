"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { Card, CardContent } from "@/components/ui/card"
import { chartData } from "../../sample_response"

export function BubbleChart() {
    const chartRef = useRef(null)
    const [tooltip, setTooltip] = useState({ text: "", x: 0, y: 0, visible: false })

    useEffect(() => {
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
                keyword: keyword.keyword
            }))
        )

        // Set up a scale for the bubble sizes
        const radiusScale = d3.scaleSqrt()
            .domain([0, 1])
            .range([10, 100])

        // Create simulation with forces
        const simulation = d3.forceSimulation(bubbleData)
            .force("charge", d3.forceManyBody().strength(-7))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide(d => radiusScale(d.score) * 0.9))
            .on("tick", ticked)

        // Create and append circles
        const nodes = svg.selectAll("circle")
            .data(bubbleData)
            .enter()
            .append("circle")
            .attr("r", d => radiusScale(d.score))
            .attr("fill", d => d.label === "Biased" ? "#ED525E" : "#66A352")
            .attr("stroke", "transparent")
            .attr("stroke-width", 2)
            .on("mouseover", (event, d) => {
                setTooltip({
                    text: `${d.keyword}: ${d.score.toFixed(2)}`,
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
            .data(bubbleData)
            .enter()
            .append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .style("fill", "#fff")
            .style("font-size", "16px")
            .text(d => d.keyword)

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
    }, [])

    return (
        <Card className="w-full border-none relative bg-[url(assets/bg.png)] p-0 lg:w-1/2 h-screen ">
            <div className="text-white font-graphik absolute z-50 w-full px-12 py-12">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#ED525E]"><p className="hidden">s</p></div> Biased
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-[#66A352]"><p className="hidden">s</p></div> Unbiased
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
                            {tooltip.text}
                            <a href="#">Link</a>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
