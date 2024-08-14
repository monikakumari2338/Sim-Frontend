import { deleteData, getData, postData } from "../context/auth";
import { endpoints } from "./endpoints";
import { storeName, userName } from "../context/auth";

async function fetchData(type) {
  let data;
  if (type === "IA") {
    data = await getData(endpoints.fetchIA);
  } else if (type === "DSD") {
    data = await getData(endpoints.fetchDSD);
  } else if (type === "PO") {
    data = await getData(endpoints.fetchPO);
  } else if (type === "RTV") {
    data = await getData(endpoints.fetchRTV);
  }
  return data;
}

async function createEntry(type) {
  if (type === "IA") {
    return await postData(endpoints.createIA + `${storeName}/${userName}`);
  } else if (type === "DSD") {
    return await postData(endpoints.createDSD + `${storeName}/${userName}`);
  } else if (type === "RTV") {
    return await postData(endpoints.createRTV + `${storeName}/${userName}`);
  }
}

async function handleDelete(itemId, type) {
  if (type === "IA") {
    await deleteData(endpoints.deleteIA + itemId);
  } else if (type === "DSD") {
    await deleteData(endpoints.deleteDSD + itemId);
  } else if (type === "RTV") {
    await deleteData(endpoints.deleteRTV + itemId);
  }
}

async function searchEntry(type, str) {
  let data;
  if (type === "IA") {
    data = await getData(endpoints.searchIA + str);
  } else if (type === "DSD") {
    data = await getData(endpoints.searchDSD + str);
  } else if (type === "PO") {
    data = await getData(endpoints.searchPo + str);
  } else if (type === "RTV") {
    data = await getData(endpoints.searchRTV + str);
  }
  return data;
}

async function sortEntry(type, sortType) {
  let data;
  if (type === "IA") {
    data = await getData(endpoints.sortIA + `${sortType}/adjustments`);
  } else if (type === "DSD") {
    data = await getData(endpoints.sortDSD + `${sortType}/Dsd`);
  } else if (type === "RTV") {
    data = await getData(endpoints.sortRTV + `${sortType}/rtv`);
  }
  return data;
}

export { fetchData, createEntry, handleDelete, searchEntry, sortEntry };
