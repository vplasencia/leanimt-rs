import { Link } from "react-router-dom"
import ViewSourceCode from "./ViewSourceCode";

export default function Header() {
  return (
    <header className="flex flex-wrap justify-between p-5 mb-5">
      <Link
        to="/"
        className="text-xl md:mb-auto mb-5 font-bold text-indigo-500"
      >
        JS x Rust x WASM
      </Link>
      <div className="flex space-x-3">
      <Link to="/about" className="text-indigo-500 hover:underline">About</Link>
      <ViewSourceCode />
      </div>
    </header>
  );
}