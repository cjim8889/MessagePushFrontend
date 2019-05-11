import React, { useState } from 'react';
import { Button, Modal, Input, Icon, Header, Message } from 'semantic-ui-react';
import axios from 'axios';



export default function ModalForm(props) {
    const [visibility, setVisibility] = useState(false);
    const [formData, setFormData] = useState(null);

    function handleButton() {
        setVisibility(true);
    }

    function handleClose() {
        setVisibility(false);
        setFormData(null);
    }

    function handleFormChange(e) {
        setFormData(e.target.value);
    }

    function handleFormSubmit() {
        setVisibility(false);
        props.onSubmit(formData);
    }

    return (
        <Modal
            trigger={<Button onClick={handleButton} color='green' >{props.buttonText}</Button>}
            open={visibility}
            onClose={handleClose}
            size='small'
        >
            <Header icon='browser' content={props.modalTitle} />
            <Modal.Content>
            <h3>{props.modalContent}</h3>
            <Input size='large' onChange={handleFormChange}></Input>
            </Modal.Content>
            <Modal.Actions>
            <Button color='green' onClick={handleFormSubmit} inverted>
                <Icon name='checkmark' /> {props.submitButtonText}
            </Button>
            </Modal.Actions>
        </Modal>
    )
}

export function ValidationForm(props) {

    const [visibility, setVisibility] = useState(false);
    const [receiverId, setreceiverId] = useState(null);

    const [challengeState, setChallengeState] = useState(null);

    const [challengeCode, setChallengeCode] = useState(null);

    function handleButton() {
        setVisibility(true);
    }

    function handleClose() {
        setChallengeState(null)
        setVisibility(false);
    }

    function handleReceiverId(e) {
        setreceiverId(e.target.value);
    }

    function handleChallengeCode(e) {
        setChallengeCode(e.target.value);
    }

    function handleSuccess() {
        setVisibility(false);
        setChallengeState(null);
        props.onSuccess();
    }

    async function validate() {
        if (!challengeCode) {
            return;
        }

        axios.get("https://api.oxifus.com/v1.0/validation/validate", 
        {
            crossDomain: true,
            headers : {
                "Authorization" : `Bearer ${props.userToken}`
            },
            params: {
                "challengeCode": challengeCode
            }
        }).then((response) => {
            handleSuccess();
        }).catch((err) => {
            setChallengeState("Error");
        })
    }

    async function requestValidation() {

        if (!receiverId) {
            return;
        }

        axios.get("https://api.oxifus.com/v1.0/validation/new", 
        {
            crossDomain: true,
            headers : {
                "Authorization" : `Bearer ${props.userToken}`
            },
            params: {
                "receiverId": receiverId
            }
        }).then((response) => {
            setChallengeState("Challenge Code Sent");
        }).catch((err) => {
            setChallengeState("Failed to send challenge code");
        })
    }



    return (

        <Modal
            trigger={<Button onClick={handleButton} color='blue' >Add Receiver</Button>}
            open={visibility}
            onClose={handleClose}
            size='small'
        >
            <Header icon='browser' content="Add Receiver" />
            <Modal.Content>
                {
                    challengeState ?
                    <Message>
                        <Message.Header>{challengeState}</Message.Header>
                    </Message>
                    : null
                }
                <h3>Please enter the receiver ID shown in Telegram bot</h3>
                <Input label="Receiver Id" size='large' type='text' onChange={handleReceiverId} action={{ content: 'Send Challenge Code',onClick: requestValidation }}></Input>
                <h3>Enter the challenge code</h3>
                <Input label="Challenge Code" onChange={handleChallengeCode}></Input>
            </Modal.Content>
            <Modal.Actions>
            <Button color='green' onClick={validate} inverted>
                <Icon name='checkmark' /> Add
            </Button>
            </Modal.Actions>
        </Modal>
    )
} 