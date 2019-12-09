import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faCheckSquare } from "@fortawesome/free-solid-svg-icons";

import {
  Table,
  Column,
  AutoSizer,
  defaultTableRowRenderer
} from "react-virtualized";
import faker from "faker";

const generateRandomItem = idx => ({
  id: idx,
  name: faker.name.findName(),
  email: faker.date.past()
});

const defaultItems = [];
for (let i = 0, l = 100; i < l; i++) {
  defaultItems.push(generateRandomItem(i));
}

function App() {
  const [items, setItems] = useState(defaultItems);
  const [loadingMore, setLoadingMore] = useState(false);

  function getMoreItems() {
    let appendedItems = [...items];
    for (let i = 0, l = 100; i < l; i++) {
      appendedItems.push(generateRandomItem(i));
    }
    return appendedItems;
  }

  function onScroll({ clientHeight, scrollHeight, scrollTop }) {
    if (scrollHeight - scrollTop - clientHeight < 1) {
      setLoadingMore(true);
      console.log("hit bottom");
      setTimeout(() => {
        setLoadingMore(false);
        setItems(getMoreItems());
      }, 1000);
    }
  }

  function rowRenderer(props) {
    if (props.index < items.length) {
      return defaultTableRowRenderer(props);
    }

    return loadingMore ? (
      <div
        className="table-row"
        key={props.key}
        role="row"
        style={{ ...props.style }}
      >
        <div className="tableColumn" style={{ justifyContent: "center" }}>
          <span>Loading more...</span>
        </div>
      </div>
    ) : null;
  }

  return (
    <div className="container">
      <AutoSizer>
        {({ width, height }) => (
          <>
            <Table
              style={{ marginTop: "10px" }}
              rowClassName={({ index }) => {
                switch (index) {
                  case -1:
                    return "table-header-row";
                  default:
                    return "table-row";
                }
              }}
              headerClassName="table-header"
              width={width}
              height={height}
              headerHeight={50}
              rowHeight={50}
              rowCount={items.length + 1}
              rowGetter={({ index }) =>
                index < items.length ? items[index] : {}
              }
              rowRenderer={rowRenderer}
              onScroll={onScroll}
            >
              <Column
                label="Id"
                dataKey="id"
                width={width * 0.2}
                className="tableColumn"
                cellRenderer={() => (
                  <>
                    <span className="fa-layers fa-fw">
                      <FontAwesomeIcon icon={faSquare} color="green" />
                      <FontAwesomeIcon icon={faCheckSquare} inverse />
                    </span>
                  </>
                )}
              />

              <Column
                label="Name"
                dataKey="name"
                width={width * 0.4}
                className="tableColumn"
              />
              <Column
                label="Content"
                dataKey="email"
                width={width * 0.4}
                className="tableColumn"
                cellRenderer={() => (
                  <div className="tableColumn">
                    <span
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum.";
                    </span>
                  </div>
                )}
              />
            </Table>
          </>
        )}
      </AutoSizer>
    </div>
  );
}

export default App;
