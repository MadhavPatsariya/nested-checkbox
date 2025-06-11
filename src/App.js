import { useState } from "react";
import "./styles.css";

export default function App() {
  const data = [
    {
      id: 1,
      name: "Vegetable",
      children: [
        {
          id: 2,
          name: "Potato",
        },
        {
          id: 3,
          name: "Okra",
        },
        {
          id: 4,
          name: "Onion",
          children: [
            {
              id: 5,
              name: "Spring Onion",
            },
            {
              id: 6,
              name: "White Onion",
            },
          ],
        },
      ],
    },
    {
      id: 7,
      name: "Fruits",
      children: [
        {
          id: 8,
          name: "Banana",
        },
        {
          id: 9,
          name: "Mango",
        },
      ],
    },
    {
      id: 10,
      name: "Water",
    },
    {
      id: 11,
      name: "Salt",
    },
  ];

  const transform = (d, parent) => {
    return d.map((e) => {
      let transformParent = { ...e, checked: false, parent: parent };
      if (e.children) {
        transformParent.children = transform(e.children, transformParent);
      }
      return transformParent;
    });
  };

  const [transformed, setTransformed] = useState(transform(data, null));

  const recursiveCall = (element, margin) => {
    //console.log("this called for: ", element);
    return element.map((e) => (
      <div key={e.id} style={{ marginLeft: `${margin}px` }}>
        <input
          type="checkbox"
          id={e.id}
          checked={e.checked}
          onChange={(event) => handleClick(event)}
        />
        <label>{e.name}</label>
        {e.children && recursiveCall(e.children, margin + 50)}
      </div>
    ));
  };

  const handleClick = (e) => {
    console.log("Checked:", e.target.checked);
    console.log("ID:", e.target.id);
    setTransformed(
      updateCheckStatus(
        transformed,
        parseInt(e.target.id, 10),
        e.target.checked
      )
    );
  };

  const updateCheckStatus = (data, id, checked) => {
    return data.map((node) => {
      if (node.id === id) {
        updateAllChildren(node, checked);
      } else {
        if (node.children) {
          node.children = updateCheckStatus(node.children, id, checked);
        }
      }
      return node;
    });
  };

  const updateAllChildren = (node, checked) => {
    node.checked = checked;
    if (node.children) {
      node.children.forEach((child) => updateAllChildren(child, checked));
    }
    if (node.parent) {
      node.parent = updateCheckForParent(node.parent);
    }
  };

  const updateCheckForParent = (node) => {
    if (node.children) {
      const unchecked = node.children.filter((child) => !child.checked);
      if (unchecked.length === 0) {
        node.checked = true;
      } else {
        node.checked = false;
      }
    }
    if (node.parent) {
      node.parent = updateCheckForParent(node.parent);
    }
    return node;
  };

  return (
    <div className="App">
      <div style={{ top: "10rem" }}>{recursiveCall(transformed, 0)}</div>
    </div>
  );
}
