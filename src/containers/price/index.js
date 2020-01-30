import React, { useState, useEffect } from "react";
import View from "./view";

import { confirmDelete, openNotification } from "utils";
import { stein } from "config";

const Handler = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const _loadData = () => {
    setLoading(true);
    stein.price
      .list()
      .then(rsp => setData(rsp))
      .catch(err => console.error("err", err))
      .finally(() => setLoading(false));
  };

  const _handleDelete = id =>
    confirmDelete({
      message: "Anda yakin akan menghapus data ini?",
      onDelete: () => _doDelete(id)
    });

  const _doDelete = id => {
    setLoading(true);
    stein.price
      .delete(id)
      .then(() => {
        openNotification("success", "Berhasil", "Harga berhasil dihapus");
        _loadData();
      })
      .catch(err => console.error("err", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    _loadData();

    return () => {};
  }, []);

  return (
    <View
      data={data}
      isLoading={isLoading}
      reload={_loadData}
      onDelete={_handleDelete}
    />
  );
};

export default Handler;
