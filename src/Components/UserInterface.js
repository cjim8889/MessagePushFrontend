import React, { useState, useEffect } from 'react';
import { Button, Header, Divider, Message, Modal, Input, Icon } from 'semantic-ui-react';
import axios from 'axios';


export default function UserInterface(props) {
    const [user, setUser] = useState({});
    const [pwdModal, setPwdModal] = useState(false);
    const [newPwd, setNewPwd] = useState(null);
    const [changePwdError, setChangePwdError] = useState(false);

    

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
                        console.log(response.data);
                        setUser(response.data);
                    }
                }).catch((err) => {
                    // props.onFailed();
            })
        }

        pullUserInfo();
    }, [props.userToken])

    function handlePwdChangeButton() {
        setPwdModal(true);
    }

    function handleModalClose() {
        setPwdModal(false);
    }
    
    function handlePwdChange(e) {
        setNewPwd(e.target.value);
    }

    async function changePassword() {

        axios.get("http://localhost:5000/api/users/user/password/change", 
            {
                crossDomain: true,
                headers : {
                    "Authorization" : `Bearer ${props.userToken}`
                },
                params : {
                    "password": newPwd,
                }
            }).then((response) => {
                props.onLogOut();
            }).catch((err) => {
                setChangePwdError(true);
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
            {
                changePwdError ?
                <Message negative>
                    <Message.Header>Failed to change password</Message.Header>
                </Message>
                : null
            }                
            <Header as="h1">
            Hi there!
                <Button floated="right" onClick={props.onLogOut}>Log out</Button>
            </Header>
            <Divider hidden />
            <Header as="h3">Username</Header>
            <p>{user.username}</p>
            <Header as="h3">PushToken</Header>
            <p>{user.pushToken}</p>
            <Header as="h3">AdminToken</Header>
            <p>{user.adminToken}</p>
            <Header as="h3">Receivers Total</Header>
            <p>{user.subsribers ? user.subsribers.length : 0}</p>
            <Divider hidden />
            <Button onClick={refreshUserToken}>Refresh Token</Button>
            <Button color="red" onClick={deleteAccount}>Delete Account</Button>
            <Modal
                trigger={<Button onClick={handlePwdChangeButton} color='red' >Change Password</Button>}
                open={pwdModal}
                onClose={handleModalClose}
                basic
                size='small'
            >
                <Header icon='browser' content='Password Change' />
                <Modal.Content>
                <h3>Enter your new password below</h3>
                <Input size='large' type='password' onChange={handlePwdChange}></Input>
                </Modal.Content>
                <Modal.Actions>
                <Button color='green' onClick={changePassword} inverted>
                    <Icon name='checkmark' /> Change it
                </Button>
                </Modal.Actions>
            </Modal>
        </div>
    )

}
