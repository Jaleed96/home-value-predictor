import React, { useState } from 'react';
import { Button, Popup } from 'semantic-ui-react';
import PinIcon from '../img/pin.png';
import ResultsModal from './ResultsModal';

const baseUrl = "http://localhost:8080"

function Pin(props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPopupOpen, setIsPopUpOpen] = useState(false);
    const [response, updateResponse] = useState({}); 

    const markerStyle = {
        position: "absolute",
        transform: "translate(-50%, -95%)"
    }

    async function fetchPrediction() {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "lat": props.lat,
                "lng": props.lng,
            })
        }
        const response = await fetch(`${baseUrl}/predict`, options).catch(e => Promise.reject(e));
    
        return Promise.resolve(response.json());
    }

    function onDetermineValueClick(event) {
        event.preventDefault();

        fetchPrediction().then((response) => {
            updateResponse(response);
            setIsPopUpOpen(false);
            setIsModalOpen(true);
            console.log(response);
        }).catch((error) => {
            console.error(error);
        })
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
                open={isPopupOpen}
                onOpen={() => {setIsPopUpOpen(true)}}
                onClose={() => {setIsPopUpOpen(false)}}
                position='top right'
            />
            <ResultsModal open={isModalOpen} handleModalClosed={handleModalClosed} content={response}/>
        </div>
    );
}

export default Pin