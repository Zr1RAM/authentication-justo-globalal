import React, { useContext } from 'react'
import { AuthContext } from '../../context/authContext'
import UsersList from '../../components/admin/usersList/UsersList'

const home = () => {
  const { currentUser, logout } = useContext(AuthContext)


  return (
    <div style={{ padding: '10px' }}>
      <h1>{currentUser.isAdmin ? "Hello Admin" : "Welcome back Normie"}</h1>
      {currentUser.isAdmin && <UsersList />}
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export default home