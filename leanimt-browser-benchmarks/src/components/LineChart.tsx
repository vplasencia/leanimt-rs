import Chart from "react-apexcharts"

export type LineChartProps = {
  options: any
  series: any
}

export default function LineChart({ options, series }: LineChartProps) {
  return (
    <div className="w-90 h-auto">
      <div className="font-medium text-2xl">Insert members</div>
      <Chart
        options={options}
        series={series}
        type="line"
        width="800"
        height="500"
      />
    </div>
  )
}
