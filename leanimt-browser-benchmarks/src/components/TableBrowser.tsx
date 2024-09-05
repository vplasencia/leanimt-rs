import FunctionsBrowser from "../assets/data/functions-browser.json"
import Table from "./Table"

export default function TableBrowser() {
  return (
    <div className="flex justify-center items-center my-5">
      <Table data={FunctionsBrowser} />
    </div>
  )
}
