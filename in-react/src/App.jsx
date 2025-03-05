import axios from "axios";
import React, { useEffect, useState } from "react";

const URL = `http://localhost:4000/users`;

function App() {
  const [isVisible, setIsVisible] = useState(true);

  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    axios
      .get(URL)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [users]);

  function handleChange(e) {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  }

  function handleAddUser(e) {
    e.preventDefault();

    if (!user.name || !user.email) {
      alert("Fill the form");
      return;
    }

    axios
      .post(URL, user)
      .then((res) => {
        setUser({ name: "", email: "" });
      })
      .catch((err) => console.log(err));
  }

  function handleDeleteUser(id) {
    axios
      .delete(`${URL}/${id}`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  function handleEditUser(user) {
    setIsVisible(false);
    setUser({
      name: user.name,
      email: user.email,
    });
    setEditId(user.id);
  }

  function handleUpdateUser(e) {
    e.preventDefault();

    axios
      .put(`${URL}/${editId}`, user)
      .then((res) =>
        setUser({
          name: "",
          email: "",
        })
      )
      .catch((err) => console.log(err));
      setIsVisible(true)
  }

  return (
    <div>
      <form>
        <input
          type="text"
          placeholder="Enter your name"
          onChange={handleChange}
          name="name"
          value={user.name}
        />
        <input
          type="text"
          placeholder="Enter your email"
          onChange={handleChange}
          name="email"
          value={user.email}
        />
        {isVisible ? (
          <button onClick={handleAddUser}>Add User</button>
        ) : (
          <button onClick={(e) => handleUpdateUser(e)}>Update User</button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleEditUser(user)}>
                    Edit User
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)}>
                    Delete User
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
