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
    updatedAt: new Date().toISOString(),
    futureEvent: new Date(Date.now() + 86400000 * 2).toISOString(),
    recentEvent: Math.floor(Date.now() / 1000) - 300,
    isActive: true,
    isGlutenFree: false,
    discontinued: null,
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

  return <JsonViewer data={jsonData} className="h-[500px]" />;
};

export default JsonViewerDemo;
