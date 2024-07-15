import { useEffect, useState } from 'react';
import './usersLists.scss';
import { makeRequests } from '../../../customHooks/useMakeRequests';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await makeRequests("/admin/users");
                console.log(response);
                setUsers(response);
            } catch (error) {
                console.error(error);
            }
        }

        getUsers();

    }, []);

    const editUserProperties = (id, property, newValue = 0) => {
        setUsers((prevUsers) => 
            prevUsers.map((user) => {
                switch (property) {
                    case "isAdmin" :
                    case "isLocked" :
                        return user.id === id ? { ...user, [property]: user[property] === 1 ? 0 : 1 } : user;
                    case "maxAttempts" :
                        return user.id === id ? { ...user, [property]: newValue } : user;
                    default: 
                        return user;
                }
            })
        );
    }
    

    // const handleCheckboxToggled = (id, property) => {

    // }

    const handleUpdate = async (user) => {
        console.log(user);
        try {
            const response = await makeRequests(`/admin/users/${user.id}`, 'PUT', user);
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    }



  return (
    <div className='usersList'>
        <h4>List of users</h4>
        <table className="users">
            <thead>
                <tr>
                    <th>id</th>
                    <th>username</th>
                    <th>isAdmin</th>
                    <th>isLocked</th>
                    <th>maxAttempts</th>
                </tr>
            </thead>
            <tbody>
                {
                    users?.map((user) => {
                        const { id, username, isLocked, isAdmin, maxAttempts } = user;
                        return (
                            <tr key={id}>
                                <td>{id}</td>
                                <td>{username}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={isAdmin === 1 ? true : false}
                                        onChange={() => editUserProperties(id, 'isAdmin')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={isLocked === 1 ? true : false}
                                        onChange={() => editUserProperties(id, 'isLocked')}
                                    />
                                </td>
                                <td>
                                    <div className="max-attempts">
                                        <p>{maxAttempts}</p>
                                        <button onClick={() => editUserProperties(id, 'maxAttempts', 0)}>clear</button>
                                    </div>
                                </td>
                                <td>
                                    <button onClick={()=> handleUpdate(user)}>update</button>
                                </td>
                            </tr>
                        );
                    })
                }
            </tbody>
        </table>
    </div>
  )
}

export default UsersList