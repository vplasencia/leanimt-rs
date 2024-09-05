import Chart from "react-apexcharts";

export type LineChartProps = {
    options: any,
    series: any
  }
  
  export default function LineChart({ options, series }: LineChartProps) {
    return (
        <div>
            <Chart
              options={options}
              series={series}
              type="line"
              width="500"
            />
        </div>
    )
  }
  