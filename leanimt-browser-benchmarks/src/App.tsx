import TableNode from "./components/TableNode"
import TableBrowser from "./components/TableBrowser"
import InsertLineChart from "./components/InsertLineChart"
import UpdateLineChart from "./components/UpdateLineChart"
import Header from "./components/Header"
import Footer from "./components/Footer"

export default function App() {
  return (
    <div className="flex flex-col min-h-screen px-2 text-slate-950">
      <Header />
      <div className="mb-auto">
        <div className="flex justify-center items-center space-x-1">
          The following benchmarks were conducted on a computer with the system
          and software specifications listed
          <a
            className="flex space-x-1 text-indigo-500 hover:underline ml-1"
            href="https://github.com/vplasencia/leanimt-rs?tab=readme-ov-file#benchmarks"
            target="_blank"
            rel="noreferrer noopener nofollow"
          >
            <span>here</span>
          </a>
          .
        </div>
        <div className="flex justify-center items-center space-x-1">
          To know more about this project, please refer to the
          <a
            className="flex space-x-1 text-indigo-500 hover:underline ml-1"
            href="https://github.com/vplasencia/leanimt-rs?tab=readme-ov-file#js-x-rust-x-wasm"
            target="_blank"
            rel="noreferrer noopener nofollow"
          >
            <span>README file</span>
          </a>
          .
        </div>
        <div className="flex flex-col justify-center items-center my-10">
          <div className="text-3xl font-medium">Node.js Benchmarks</div>
          <TableNode />
          <InsertLineChart />
          <UpdateLineChart />
        </div>
        <div className="flex flex-col justify-center items-center my-10">
          <div className="text-3xl font-medium">Browser Benchmarks</div>
          <TableBrowser />
        </div>
      </div>
      <Footer />
    </div>
  )
}
