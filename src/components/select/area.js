import React, { useState, useEffect } from "react";
import { Select, Spin } from "antd";
import { stein } from "config";

const { Option } = Select;

export const SelectArea = ({ onChange, ...props }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const _loadData = () => {
    setLoading(true);
    stein.option
      .area()
      .then(rsp => setItems(mapValue(rsp)))
      .catch(err => console.error("err", err))
      .finally(() => setLoading(false));
  };

  const _handleChange = value => {
    return onChange(items[value]);
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
      onChange={_handleChange}
    >
      <Option value={null} disabled>
        {props.placeholder}
      </Option>
      {Object.keys(items).map(key => (
        <Option key={items[key]} value={key}>
          {items[key].province} - {items[key].city}
        </Option>
      ))}
    </Select>
  );
};

const mapValue = data => {
  let mappedValue = {};
  for (let x = 0; x < data.length; x++) {
    mappedValue[`${data[x].province}${data[x].city}`] = data[x];
  }
  return mappedValue;
};
