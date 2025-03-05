import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";

const URL = `http://localhost:4000/users`;

function App() {
  const [isVisible, setIsVisible] = useState(true);

  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);

  /* ----------------------------------- */
  /* START : Fetch users once on mount   */
  /* ----------------------------------- */
  useEffect(() => {
    axios
      .get(URL)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  /* ----------------------------------- */
  /* END   : Fetch users once on mount   */
  /* ----------------------------------- */

  function handleChange(e) {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!user.name || !user.email) {
      alert("Fill the form");
      return;
    }

    /* --------------------------------- */
    /* START : add user and update user  */
    /* --------------------------------- */

    if (isVisible) {
      axios
        .post(URL, user)
        .then((res) => {
          setUsers((prev) => [...prev, res.data]);
          resetForm();
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .put(`${URL}/${editId}`, user)
        .then((res) => {
          setUsers((prev) =>
            prev.map((u) => (u.id === editId ? { ...u, ...user } : u))
          );
          resetForm();
        })
        .catch((err) => console.log(err));
    }

    /* --------------------------------- */
    /* END   : add user and update user  */
    /* --------------------------------- */
  }

  /* -------------------------- */
  /* START : useCallback here   */
  /* -------------------------- */
  // ✅ Use useCallback for functions that are passed as props to child components (to prevent unnecessary child re-renders).
  // ✅ Use useCallback when dealing with lists or API calls (like deleting an item).
  const handleDeleteUser = useCallback((id) => {
    axios
      .delete(`${URL}/${id}`)
      .then((res) => setUsers((prev) => prev.filter((user) => user.id !== id)))
      .catch((err) => console.error(err));
  }, []);
  /* -------------------------- */
  /* END   : useCallback here   */
  /* -------------------------- */

  // ❌ Avoid useCallback when functions are used locally inside the same component (like handleEditUser).
  function handleEditUser(user) {
    setIsVisible(false);
    setUser({
      name: user.name,
      email: user.email,
    });
    setEditId(user.id);
  }

  /* -------------------- */
  /* START : Reset form   */
  /* -------------------- */
  function resetForm() {
    setUser({ name: "", email: "" });
    setEditId(null);
    setIsVisible(true);
  }
  /* -------------------- */
  /* END   : Reset form   */
  /* -------------------- */

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">{isVisible ? "Add User" : "Update User"}</button>
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
