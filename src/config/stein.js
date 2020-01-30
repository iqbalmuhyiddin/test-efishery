import SteinStore from "stein-js-client";

const store = new SteinStore(
  "https://stein.efishery.com/v1/storages/5e1edf521073e315924ceab4"
);

const option = {
  area: () => store.read("option_area"),
  size: () => store.read("option_size")
};

const price = {
  list: () => store.read("list"),
  getByID: uuid => store.read("list", { search: { uuid } }),
  create: payload => store.append("list", [payload]),
  update: (uuid, payload) =>
    store.edit("list", {
      search: { uuid },
      set: payload
    }),
  delete: uuid => store.delete("list", { search: { uuid } })
};

export default {
  option,
  price
};
