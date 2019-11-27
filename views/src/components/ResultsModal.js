import React, {useState, useEffect} from 'react'
import {  Modal } from 'semantic-ui-react'

function ResultsModal(props) {
    const [isOpen, setIsOpen] = useState(props.open)

    useEffect(() => {
        setIsOpen(props.open);
    }, [props.open])
const objItems = Object.keys(props.content).map((item) => <pre key={item}>{item}: {props.content[item]}</pre>)

    return (
        <Modal open={isOpen} closeOnDimmerClick={true} closeOnDocumentClick={true} onClose={props.handleModalClosed}>
            <Modal.Header>Results</Modal.Header>
            <Modal.Content image>
                <Modal.Description>
                    <pre>{objItems}</pre>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    );
}

export default ResultsModal;
