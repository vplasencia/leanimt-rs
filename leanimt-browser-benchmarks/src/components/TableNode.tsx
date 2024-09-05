import FunctionsNode from "../assets/data/functions-node.json"
import Table from "./Table"

export default function TableNode() {
  return (
    <div className="flex justify-center items-center my-5">
      <Table data={FunctionsNode} />
    </div>
  )
}
