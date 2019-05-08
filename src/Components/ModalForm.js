import React, { useState } from 'react';
import { Button, Modal, Input, Icon, Header } from 'semantic-ui-react';



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
            basic
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