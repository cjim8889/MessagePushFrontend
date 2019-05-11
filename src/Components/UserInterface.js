import React, {useState} from 'react';
import { Button, Header, Divider, Message, TextArea, Form, Segment } from 'semantic-ui-react';
import ModalForm, {ValidationForm} from './ModalForm';
import axios from 'axios';



export default class UserInterface extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {subscribers: []}, 
            messages: [],
            validateStatus: false
        }


        this.handleUserInfoFail = this.handleUserInfoFail.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.refreshUserToken = this.refreshUserToken.bind(this);
        this.pullUserInfo = this.pullUserInfo.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
        this.handleAddReceiverSuccess = this.handleAddReceiverSuccess.bind(this);
    
    }

    componentDidMount() {
        this.pullUserInfo();
    }
    
    handleUserInfoFail() {
        this.setState({ messages: [...this.state.messages, {type:1, text:"Failed to load user information..."}]});
    }

    async pullUserInfo() {
        axios.get("https://api.oxifus.com/v1.0/users/user", 
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

        axios.get("https://api.oxifus.com/v1.0/users/user/password/change", 
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
        let response = await axios.get("https://api.oxifus.com/v1.0/users/user/token/refresh",
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
        let response = await axios.delete("https://api.oxifus.com/v1.0/users/user",
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

    async handleAddReceiverSuccess() {
        this.pullUserInfo();
    }




    render() {

        return (

            <div className="user-info">
                {
                    this.state.user.subscribers.length === 0 ?
                    <Message negative>
                        <Message.Header>Unvalidated Account</Message.Header>
                        <p>Please validate your account by adding at least one receiver</p>
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
                <ApiPanel pushToken={this.state.user.pushToken}></ApiPanel>
                <Divider hidden />
                <UserInfo user={this.state.user}></UserInfo>
                <Divider hidden />
                <ValidationForm userToken={this.props.userToken} onSuccess={this.handleAddReceiverSuccess}></ValidationForm>
                <Button color='google plus' onClick={this.refreshUserToken}>Refresh Token</Button>
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
                <p>{this.props.user.subscribers.length}</p>
            </div>
        )
    }
}

function ApiPanel(props) {
    const [message, setMessage] = useState('');
    const [msg, setMsg] = useState(null);

    function handleMessageInput(e) {
        setMessage(e.target.value);
    }

    async function handleSend() {
        axios.get("https://api.oxifus.com/v1.0/push",
            {
                crossDomain: true,
                params: {
                    't': props.pushToken,
                    'm': message
                },
                validateStatus: () => true
            }).then((response) => {
                setMsg("Message Sent");
            }).catch((err) => {
                setMsg("Failed");
            })
    }
    return (
        <div>
            <Message
            attached
            header='Api Panel'
            content='Api 调用'
            />
            <Form className='attached segment'>
                {
                    msg ?
                    <Message>
                        <Message.Header>{msg}</Message.Header>
                    </Message>
                    : null
                }
                <Form.Field>
                    <Header as='h5' attached='top'>
                        HTTP Endpoint
                    </Header>
                    <Segment attached className="segement-fix"><p>https://api.oxifus.com/v1.0/push?t={props.pushToken}&m={encodeURI(message)}</p></Segment>
                    <Header as='h5' attached>
                        CURL
                    </Header>
                    <Segment attached className="segement-fix"><p>curl -X GET -i 'https://api.oxifus.com/v1.0/push?t={props.pushToken}&m={encodeURI(message)}'</p></Segment>
                </Form.Field>
                <Form.Field>
                    <TextArea placeholder='消息' style={{ minHeight: 100 }} onChange={handleMessageInput} />
                </Form.Field>
                <Form.Field>
                    <Button color='blue' onClick={handleSend}>发送</Button>
                </Form.Field>
            </Form>
        </div>

    )
}