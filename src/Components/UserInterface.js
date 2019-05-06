import React, { useState, useEffect } from 'react';
import { Button, Header, Divider, Message } from 'semantic-ui-react';
import axios from 'axios';


export default function UserInterface(props) {
    const [user, setUser] = useState({});


    

    useEffect(() => {
        const pullUserInfo = async () => {
            axios.get("http://localhost:5000/api/users/user", 
                {
                    crossDomain: true,
                    headers : {
                        "Authorization" : `Bearer ${props.userToken}`
                    }
                }).then((response) => {
                    if (response.status === 200) {
                        setUser(response.data);
                    }
                }).catch((err) => {
                    // props.onFailed();
            })
        }

        pullUserInfo();
    }, [props.userToken])
    

    async function refreshUserToken() {
        let response = await axios.get("http://localhost:5000/api/users/user/token/refresh",
            {
                crossDomain: true,
                headers: {
                    "Authorization" : `Bearer ${props.userToken}`
                },
                validateStatus: () => true
            });

        if (response.status === 200) {
            setUser(Object.assign({}, user, {adminToken: response.data.adminToken, pushToken: response.data.pushToken}));
        }
    }

    async function deleteAccount() {
        let response = await axios.delete("http://localhost:5000/api/users/user",
        {
            crossDomain: true,
            headers: {
                "Authorization" : `Bearer ${props.userToken}`
            },
            validateStatus: () => true
        })

        if (response.status === 204) {
            props.onLogOut();
        }
    }

    return (

        <div className="user-info">
            {
                !user.validate ?
                <Message negative>
                    <Message.Header>Unvalidated Account</Message.Header>
                    <p>Please validate your email address</p>
                    <Button color="blue">Validate</Button>
                </Message>
                : null
            }                
            <Header as="h1">
            Hi there!
                <Button floated="right" onClick={props.onLogOut}>Log out</Button>
            </Header>
            <Divider hidden />
            <Header as="h3">Email</Header>
            <p>{user.email}</p>
            <Header as="h3">PushToken</Header>
            <p>{user.pushToken}</p>
            <Header as="h3">AdminToken</Header>
            <p>{user.adminToken}</p>
            <Header as="h3">Receivers Total</Header>
            <p>{user.subsribers ? user.subsribers.length : 0}</p>
            <Divider hidden />
            <Button onClick={refreshUserToken}>Refresh Token</Button>
            <Button color="red" onClick={deleteAccount}>Delete Account</Button>
        </div>
    )

}
