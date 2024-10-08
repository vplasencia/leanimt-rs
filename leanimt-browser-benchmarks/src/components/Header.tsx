import { Link } from "react-router-dom"
import ViewSourceCode from "./ViewSourceCode"

export default function Header() {
  return (
    <header className="flex flex-wrap justify-between p-5 mb-5">
      <Link
        to="/"
        className="flex space-x-1 text-xl md:mb-auto mb-5 font-bold text-indigo-500"
      >
        <div>JS</div>
        <div className="text-slate-950">x</div> <div>Rust</div>{" "}
        <div className="text-slate-950">x</div> <div>WASM</div>
      </Link>
      <div className="flex justify-center items-center space-x-3">
        <Link to="/browser" className="text-indigo-500 hover:underline">
          Run Browser Benchmarks
        </Link>
        <div className="text-indigo-500 text-xl">&bull;</div>
        <ViewSourceCode />
      </div>
    </header>
  )
}
