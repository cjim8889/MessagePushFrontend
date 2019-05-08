import React from 'react';
import { Button, Header, Divider, Message } from 'semantic-ui-react';
import ModalForm from './ModalForm';
import axios from 'axios';



export default class UserInterface extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {}, 
            messages: []
        }


        this.handleUserInfoFail = this.handleUserInfoFail.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.refreshUserToken = this.refreshUserToken.bind(this);
        this.pullUserInfo = this.pullUserInfo.bind(this);
    }

    componentWillMount() {
        this.pullUserInfo();
    }
    
    handleUserInfoFail() {
        this.setState({ messages: [...this.state.messages, {type:1, text:"Failed to load user information..."}]});
    }

    async pullUserInfo() {
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
                this.handleUserInfoFail();                
        })
    }

    async changePassword(password) {

        axios.get("http://localhost:5000/api/users/user/password/change", 
            {
                crossDomain: true,
                headers : {
                    "Authorization" : `Bearer ${this.props.userToken}`
                },
                params : {
                    "password": password,
                }
            }).then((response) => {
                this.props.onLogOut();
            }).catch((err) => {
                this.setState({ messages: [...this.state.messages, {type:1, text:"Failed to load user information..."}]});
        })
    }

    async refreshUserToken() {
        let response = await axios.get("http://localhost:5000/api/users/user/token/refresh",
            {
                crossDomain: true,
                headers: {
                    "Authorization" : `Bearer ${this.props.userToken}`
                },
                validateStatus: () => true
            });

        if (response.status === 200) {
            let user = {...this.state.user};
            user.adminToken = response.data.adminToken;
            user.pushToken = response.data.pushToken;
            this.setState({user});
        }
    }

    async deleteAccount() {
        let response = await axios.delete("http://localhost:5000/api/users/user",
        {
            crossDomain: true,
            headers: {
                "Authorization" : `Bearer ${this.props.userToken}`
            },
            validateStatus: () => true
        })

        if (response.status === 204) {
            this.props.onLogOut();
        }
    }

    render() {

        return (

            <div className="user-info">
                {
                    !this.state.user.validated ?
                    <Message negative>
                        <Message.Header>Unvalidated Account</Message.Header>
                        <p>Please validate your account</p>
                        <Button color="blue">Validate</Button>
                    </Message>
                    : null
                }
                {
                    this.state.messages.map((msg) => {
                        return (
                            <Message negative={msg.type === 1}>
                                <Message.Header>{msg.text}</Message.Header>
                            </Message>
                        )
                    })
                }
                {this.msgList}         
                <Header as="h1">
                Hi there!
                    <Button floated="right" onClick={this.props.onLogOut}>Log out</Button>
                </Header>
                <Divider hidden />
                <UserInfo user={this.state.user}></UserInfo>
                <Divider hidden />
                <Button onClick={this.refreshUserToken}>Refresh Token</Button>
                <ModalForm buttonText="Change Password" modalTitle="Password Change" modalContent="Enter your new password below" submitButtonText="Change" onSubmit={this.changePassword}></ModalForm>
                <Button color="red" onClick={this.deleteAccount}>Delete Account</Button>
            </div>
        )
    }
}

class UserInfo extends React.Component {
    render() {

        return (
            <div>
                <Header as="h3">Username</Header>
                <p>{this.props.user.username}</p>
                <Header as="h3">PushToken</Header>
                <p>{this.props.user.pushToken}</p>
                <Header as="h3">AdminToken</Header>
                <p>{this.props.user.adminToken}</p>
                <Header as="h3">Receivers Total</Header>
                <p>{this.props.user.subsribers ? this.props.user.subsribers.length : 0}</p>
            </div>
        )
    }
}