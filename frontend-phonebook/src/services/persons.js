import axios from "axios";
const baseUrl = "/api/persons";

const createPerson = (newNameObj) => {
  const request = axios.post(baseUrl, newNameObj);
  return request.then((response) => response.data);
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const deletePerson = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

const updatePerson = (id, updatedPerson) => {
  const request = axios.put(`${baseUrl}/${id}`, updatedPerson);
  return request.then((response) => response.data);
};

export default {
  createPerson,
  deletePerson,
  updatePerson,
  getAll,
};
