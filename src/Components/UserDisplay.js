import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';

export default function UserDisplay() {
    const [username, setUsername] = useState('');

    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('jwToken');
        console.log(token)

        if (token) {
            const decodedToken = decodeJWT(token);
            const { username } = decodedToken;
            console.log(username)
            setUsername(username);
        }
    }, []);


    const decodeJWT = (token) => {
        try {
            const payload = token.split('.')[1];
            const decodedPayload = atob(payload);
            const parsedPayload = JSON.parse(decodedPayload);
            console.log(parsedPayload)
            return parsedPayload;
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    };

    return (
        <div>
            {/* Afficher le nom d'utilisateur */}
            <p onClick={() => navigate('/dashboard')}>Bienvenue, {username} !</p>
        </div>
    );
}
