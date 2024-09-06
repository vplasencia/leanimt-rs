import TableNode from "./components/TableNode"
import TableBrowser from "./components/TableBrowser"
import InsertLineChart from "./components/InsertLine"
import Header from "./components/Header"
import Footer from "./components/Footer"

export default function App() {
  return (
    <div className="flex flex-col min-h-screen px-2 text-slate-950">
      <Header />
      <div className="mb-auto">
        <div className="flex flex-col justify-center items-center my-10">
          <div className="text-3xl font-medium">Node.js</div>
          <TableNode />
          <InsertLineChart />
        </div>
        <div className="flex flex-col justify-center items-center my-10">
          <div className="text-3xl font-medium">Browser</div>
          <TableBrowser />
        </div>
      </div>
      <Footer />
    </div>
  )
}
