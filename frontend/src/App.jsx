import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";

class UsersListErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  componentDidCatch(error, info) {
    this.setState({
      error,
    });
  }

  render() {
    if (this.state.error) {
      return <div>Error: {this.state.error?.message}</div>;
    }

    return this.props.children;
  }
}
var base_url = window._CONFIG.REACT_APP_API;
console.log("base_url", window._CONFIG)
const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Read all users at page load
  useEffect(() => {
    readAllUsers();
  }, []);


  // Read all users
  async function readAllUsers() {
    try {
      // Send a GET request to the API to read all users
      const response = await fetch(`${base_url}/users`);

      // Check the response status code
      if (response.status === 200) {
        // The users were read successfully
        // Update the users state with the users
        let newUsers = await response.json();

        setUsers(newUsers || []);
        setError(null);
          setIsLoading(false);
      } 
    } catch (error) {
      setError(error.message);
        setIsLoading(false);
      console.log('error', error);
    }

  }

  // Create a new user
  async function createUser(e) {
    e.preventDefault();
    try {
      let formdata= e.target.elements;
      let user = {
        name:formdata?.name?.value || "",
        role:formdata?.role?.value || "",
        dob:formdata?.dob?.value || "",
      }
      // Send a POST request to the API to create a new user
      setIsLoading(true);
      const response = await fetch(`${base_url}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      // Check the response status code
      if (response.status === 201) {
        // The user was created successfully
        // Update the users state with the new user
        let user = await response.json()
        setUsers([...users,user ]);
        setError(null);
          setIsLoading(false);
      } else {
        // There was an error creating the user
      }
    } catch (error) {
      setError(error.message);
        setIsLoading(false);
    }

  }

  // Read a single user by ID
  async function readUserById(userId) {
    try {
      // Send a GET request to the API to read a single user by ID
      const response = await fetch(`${base_url}/users/${userId}`);
  
      // Check the response status code
      if (response.status === 200) {
        // The user was read successfully
        // Update the users state with the user
        const user = await response.json();
        console.log('User:', user);
        // setUsers([...users, user]);
        setError(null);
          setIsLoading(false);
        return user;
      } else {
        // There was an error reading the user
        
      }     
    } catch (error) {
      
      setError(error.message);
        setIsLoading(false);
    }
  }

  // Update a user
  async function updateUser(user) {
    try {
      let userObj = {
        name:user?.name || "",
        role:user?.role || "",
        dob:user?.dob || "",
      }
      // Send a POST request to the API to create a new user
      setIsLoading(true);
      const response = await fetch(`${base_url}/users/${user?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userObj),
      });

      // Check the response status code
      if (response.status === 201) {
        // The user was created successfully
        // Update the users state with the new user
        let user = await response.json()
        setUsers(users.map((u) => (u._id === user._id ? user : u)));
        setError(null);
          setIsLoading(false);
      } else {
        // There was an error creating the user
      }
    } catch (error) {
      setError(error.message);
        setIsLoading(false);
    }
  }

  // Delete a user
  async function deleteUser(userId) {
    try {
      // Send a DELETE request to the API to delete a user
      const response = await fetch(`${base_url}/users/${userId}`, {
        method: "DELETE",
      });
  
      // Check the response status code
      if (response.status === 200) {
        // The user was deleted successfully
        // Update the users state by removing the deleted user
        setUsers(users.filter((u) => u._id !== userId));
      } else {
        // There was an error deleting the user
      }
    } catch (error) {
      
      setError(error.message);
        setIsLoading(false);
    }
  }

  // Filter users by search query
  const filteredUsers = users.filter((user) => {
    return user.name.toLowerCase().includes(searchQuery.toLowerCase());
  });
  // Paginate users
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // Render the users list
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <UsersListErrorBoundary>
      <div>
        <h1>Users List</h1>
        <form onSubmit={(e) => createUser(e)}  >
          <input type="text" name="name" placeholder="Name" />
          <input type="date" name="dob" placeholder="Date of Birth" />
          <select  name="role" placeholder="Role" >
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
          <button type="submit">Create User</button>
        </form>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <table className="table" >
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Date of Birth</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, i) => (
              <tr key={i} >
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.createdAt}</td>
                <td>{user.updatedAt}</td>
                <td>{user.dob}</td>
                <td>
                  <button onClick={() => updateUser(user)}>Update</button>
                  <button onClick={() => deleteUser(user._id)}>Delete</button>
                  <button onClick={() => readUserById(user._id)}>Read</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="pagination">
          <li>
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
          </li>
          <li>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}>
              Next
            </button>
          </li>
        </ul>
      </div>
    </UsersListErrorBoundary>
  );
};

export default UsersList;
