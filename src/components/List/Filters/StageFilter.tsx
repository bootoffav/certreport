import * as React from "react";
import Task from "../../../Task/Task";
import { Dropdown } from "tabler-react";
import { countTotalPrice } from "../../../helpers";

const StageFilter: React.FunctionComponent<{
  allProducts: any;
  update: any;
  tasks: any;
}> = ({ tasks, update, allProducts }) => {
  function filter(stage?: string) {
    let visibleData;

    if (stage === "products") {
      update({
        stage,
        visibleData: allProducts,
      });
      return;
    }

    switch (stage) {
      case "all":
        visibleData = tasks;
        break;
      case "overdue":
        visibleData = tasks.filter((t: Task) => t.overdue);
        break;
      default:
        visibleData = tasks.filter((t: Task) => t.state.stage === stage);
    }

    update({
      visibleData,
      stage,
      totalPrice: countTotalPrice(visibleData),
      columnFilterValue: "",
      startDate: undefined,
      endDate: undefined,
    });
  }

  const stages = [
    "00. Paused",
    "0. Sample to be prepared",
    "1. Sample Sent",
    "2. Sample Arrived",
    "3. PI Issued",
    "4. Payment Done",
    "5. Testing is started",
    "6. Pre-treatment done",
    "7. Test-report ready",
    "8. Certificate ready",
    "9. Ended",
  ];

  const more = ["products", "overdue"];

  const DropDownItem = (item: any) => {
    return {
      value: item,
      key: item,
      onClick: () => filter(item),
    };
  };

  return (
    <div
      id="toolbar"
      style={{ width: "inherit" }}
      className="btn-group"
      role="group"
    >
      <div className="mr-2">
        <Dropdown
          type="button"
          value="Stages"
          color="indigo"
          triggerContent={
            <>
              Stages<sup>*</sup>
            </>
          }
          itemsObject={stages.map(DropDownItem)}
        ></Dropdown>
      </div>
      <Dropdown
        type="button"
        value="More"
        color="cyan"
        triggerContent="More"
        itemsObject={more.map(DropDownItem)}
      ></Dropdown>
    </div>
  );
};

export default StageFilter;
