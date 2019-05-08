import React, { useState } from 'react';
import { Button, Header, Divider, Message } from 'semantic-ui-react';
import ModalForm from './ModalForm';
import axios from 'axios';


export default function UserInterface(props) {
    const [user, setUser] = useState({});
    const [messages, setMessages] = useState([]);

    const msgList = messages.map((msg) => {
        return (
            <Message negative={msg.type === 1}>
                <Message.Header>{msg.text}</Message.Header>
            </Message>
        )
    });

    function handleUserInfoFail() {
        setMessages([...messages, {type:1, text:"Failed to load user information..."}]);
    }

    async function changePassword(password) {

        axios.get("http://localhost:5000/api/users/user/password/change", 
            {
                crossDomain: true,
                headers : {
                    "Authorization" : `Bearer ${props.userToken}`
                },
                params : {
                    "password": password,
                }
            }).then((response) => {
                props.onLogOut();
            }).catch((err) => {
                setMessages([...messages, {type:1, text:"Failed to change password"}]);
        })
    }

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
                !user.validated ?
                <Message negative>
                    <Message.Header>Unvalidated Account</Message.Header>
                    <p>Please validate your account</p>
                    <Button color="blue">Validate</Button>
                </Message>
                : null
            }
            {msgList}           
            <Header as="h1">
            Hi there!
                <Button floated="right" onClick={props.onLogOut}>Log out</Button>
            </Header>
            <Divider hidden />
            <UserInfo userToken={props.userToken} onFailed={handleUserInfoFail}></UserInfo>
            <Divider hidden />
            <Button onClick={refreshUserToken}>Refresh Token</Button>
            <ModalForm buttonText="Change Password" modalTitle="Password Change" modalContent="Enter your new password below" submitButtonText="Change" onSubmit={changePassword}></ModalForm>
            <Button color="red" onClick={deleteAccount}>Delete Account</Button>
        </div>
    )

}



class UserInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = { user: {} };

        this.pullUserInfo = this.pullUserInfo.bind(this);
    }

    pullUserInfo() {
        axios.get("http://localhost:5000/api/users/user", 
            {
                crossDomain: true,
                headers : {
                    "Authorization" : `Bearer ${this.props.userToken}`
                }
            }).then((response) => {
                if (response.status === 200) {
                    this.setState({user: response.data});
                }
            }).catch((err) => {
                this.props.onFailed();                    
        })
    }
    
    componentWillMount() {
        this.pullUserInfo();
    }

    render() {

        return (
            <div>
                <Header as="h3">Username</Header>
                <p>{this.state.user.username}</p>
                <Header as="h3">PushToken</Header>
                <p>{this.state.user.pushToken}</p>
                <Header as="h3">AdminToken</Header>
                <p>{this.state.user.adminToken}</p>
                <Header as="h3">Receivers Total</Header>
                <p>{this.state.user.subsribers ? this.state.user.subsribers.length : 0}</p>
            </div>
        )
    }
}