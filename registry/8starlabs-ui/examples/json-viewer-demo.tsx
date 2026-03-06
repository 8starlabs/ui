"use client";

import JsonViewer from "../blocks/json-viewer";

const JsonViewerDemo = () => {
  const jsonData = {
    id: "0001",
    type: "donut",
    name: "Cake",
    ppu: 0.55,
    website: "https://example.com/donuts/cake",
    primaryColor: "#FF5733",
    secondaryColor: "rgb(255, 255, 255)",
    createdAt: 1709251200000,
    updatedAt: "2026-03-06T12:00:00.000Z",
    isActive: true,
    isGlutenFree: false,
    discontinued: null,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lobortis tellus eu justo hendrerit, a viverra turpis aliquam. Morbi sollicitudin accumsan lectus, eget sollicitudin magna tempus et. Cras fringilla risus sed libero consequat faucibus. Nulla facilisi. Quisque pretium, lorem id dignissim iaculis, est sem aliquet risus, sed suscipit elit sem sit amet dui. Vivamus tempor orci nec imperdiet molestie. Integer elit ex, elementum sed libero vitae, varius porta nisi. Pellentesque eget nibh justo. Morbi nec cursus metus, et faucibus nunc. Quisque vehicula sollicitudin ipsum, laoreet aliquam libero lobortis nec. Nulla facilisi.",
    batters: {
      batter: [
        { id: "1001", type: "Regular" },
        { id: "1002", type: "Chocolate" },
        { id: "1003", type: "Blueberry" },
        { id: "1004", type: "Devil's Food" }
      ]
    },
    topping: [
      { id: "5001", type: "None" },
      { id: "5002", type: "Glazed" },
      { id: "5005", type: "Sugar" },
      { id: "5007", type: "Powdered Sugar" },
      { id: "5006", type: "Chocolate with Sprinkles" },
      { id: "5003", type: "Chocolate" },
      { id: "5004", type: "Maple" }
    ]
  };

  return (
    <JsonViewer data={jsonData} className="h-[500px]" title="Response Data" />
  );
};

export default JsonViewerDemo;
