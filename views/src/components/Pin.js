import React, { useState } from 'react';
import { Button, Popup } from 'semantic-ui-react';
import PinIcon from '../img/pin.png';
import ResultsModal from './ResultsModal';

function Pin(props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const markerStyle = {
        position: "absolute",
        transform: "translate(-50%, -95%)"
    }

    function onDetermineValueClick(event) {
        event.preventDefault();
        setTimeout(() => {
            setIsModalOpen(true);
        }, 200);
    }

    function handleModalClosed(event, data) {
        setIsModalOpen(false);
    }

    return (
        <div id="map-marker" style={markerStyle}>

            <Popup
                trigger={
                    <img id="map-marker-icon" src={PinIcon} />
                }
                content={<Button color='green' content='Determine Value' onClick={onDetermineValueClick} />}
                on='click'
                position='top right'
            />
            <ResultsModal open={isModalOpen} handleModalClosed={handleModalClosed}/>
        </div>
    );
}

export default Pin