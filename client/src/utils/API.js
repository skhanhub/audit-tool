import axios from "axios";

export default {
  // Gets all books
  getOptions: function() {
    return axios.get("api/options");
  },

//   // Deletes the book with the given id
//   deleteBook: function(id) {
//     return axios.delete("/api/books/" + id);
//   },
//   // Saves a book to the database
  getConfigs: function(filter) {
    return axios.post("/api/configs", filter);
  },
  getComments: function(body) {
    return axios.post("/api/comments", body);
  },
  saveComments: function(body) {
    return axios.post("/api/comments/save", body);
  }
};
