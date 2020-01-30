import React, { useEffect, useState } from "react";
import moment from "moment";
import uuidv4 from "uuid/v4";
import View from "./view";

import { MODE } from "constant";
import { openNotification } from "utils";
import { stein } from "config";

const emptyData = {
  uuid: "",
  komoditas: "Penaeus Vannamei",
  area_provinsi: null,
  area_kota: null,
  size: null,
  price: null,
  tgl_parsed: null,
  timestamp: null,
  selectedArea: null
};

const Handler = ({ toggleModal, reload, id, mode }) => {
  const isEdit = mode === MODE.EDIT;

  const [data, setData] = useState(emptyData);
  const [isLoading, setLoading] = useState(false);

  const _handleChange = (name, value) => {
    setData({
      ...data,
      [name]: value
    });
  };

  const _handleChangeArea = value => {
    setData({
      ...data,
      area_provinsi: value.province,
      area_kota: value.city,
      selectedArea: `${value.province}${value.city}`
    });
  };

  const _onSubmit = () => {
    const { komoditas, area_provinsi, area_kota, size, price } = data;
    const payload = {
      komoditas,
      area_provinsi,
      area_kota,
      size,
      price,
      uuid: uuidv4(),
      timestamp: moment().unix(),
      tgl_parsed: moment().toISOString()
    };

    if (isEdit) {
      _update(payload);
      return;
    }
    _create(payload);
  };

  const _loadData = () => {
    setLoading(true);
    stein.price
      .getByID(id)
      .then(rsp => setData(constructResponse(rsp[0]) || emptyData))
      .catch(err => console.error("err", err))
      .finally(() => setLoading(false));
  };

  const _create = payload => {
    setLoading(true);
    stein.price
      .create(payload)
      .then(() => {
        setLoading(false);
        reload();
        openNotification("success", "Berhasil", "Harga berhasil ditambahkan");
        toggleModal();
      })
      .catch(err => {
        setLoading(false);
        console.error("err", err);
      });
  };

  const _update = payload => {
    setLoading(true);
    stein.price
      .update(id, payload)
      .then(() => {
        setLoading(false);
        reload();
        openNotification("success", "Berhasil", "Harga berhasil diubah");
        toggleModal();
      })
      .catch(err => {
        setLoading(false);
        console.error("err", err);
      });
  };

  useEffect(() => {
    if (id) {
      _loadData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View
      isLoading={isLoading}
      onCancel={toggleModal}
      onOk={_onSubmit}
      onChange={_handleChange}
      onChangeArea={_handleChangeArea}
      data={data}
      mode={mode}
    />
  );
};

export default Handler;

const constructResponse = rsp => {
  const selectedArea = `${rsp.area_provinsi}${rsp.area_kota}`;
  return { ...rsp, selectedArea };
};
