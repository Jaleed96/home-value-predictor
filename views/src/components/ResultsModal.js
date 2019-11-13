import React, {useState, useEffect} from 'react'
import {  Header, Image, Modal } from 'semantic-ui-react'

function ResultsModal(props) {
    const [isOpen, setIsOpen] = useState(props.open)
    useEffect(() => {
        setIsOpen(props.open);
    }, [props.open])

    return (
        <Modal open={isOpen} closeOnDimmerClick={true} closeOnDocumentClick={true} closeIcon={true} onClose={props.handleModalClosed}>
            <Modal.Header>Select a Photo</Modal.Header>
            <Modal.Content image>
                <Image wrapped size='medium' src='/images/avatar/large/rachel.png' />
                <Modal.Description>
                    <Header>Default Profile Image</Header>
                    <p>
                        We've found the following gravatar image associated with your e-mail
                        address.
        </p>
                    <p>Is it okay to use this photo?</p>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    );
}

export default ResultsModal;