import { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/user/admin/users/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setUsers(res.data.results);
    });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>{user.user_type}</td>
              <td>{user.is_active ? "Active" : "Inactive"}</td>
              <td>
                {/* Add buttons for view/edit/delete */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
