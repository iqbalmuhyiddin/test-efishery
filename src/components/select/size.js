import React, { useState, useEffect } from "react";
import { Select, Spin } from "antd";
import { stein } from "config";

const { Option } = Select;

export const SelectSize = props => {
  const [items, setItems] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const _loadData = () => {
    setLoading(true);
    stein.option
      .size()
      .then(rsp => setItems(mapValue(rsp)))
      .catch(err => console.error("err", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    _loadData();
  }, []);

  return (
    <Select
      showSearch
      optionFilterProp="children"
      notFoundContent={isLoading ? <Spin size="small" /> : null}
      {...props}
    >
      <Option value={null} disabled>
        {props.placeholder}
      </Option>
      {items.map(item => (
        <Option key={item} value={item}>
          {item}
        </Option>
      ))}
    </Select>
  );
};

const mapValue = data => {
  let sizes = [];
  for (let x = 0; x < data.length; x++) {
    sizes.push(data[x].size);
  }
  return sizes;
};
