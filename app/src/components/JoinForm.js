import { useState } from 'react'
import { useZoomContext } from '../hooks/useZoomContext'
import { useNavigate } from "react-router-dom";

const JoinForm = () => {
  const navigate = useNavigate();
  const { dispatch } = useZoomContext();
  const [zoomlink, setZoomlink] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    let id;


    if(zoomlink.length < 1) {
        setError('Please Enter a Metting Link');
        return;
    }

    if(zoomlink.startsWith('http')) {
        var link = zoomlink.split('/');
        var token = link[link.length - 1].split('?');
        id = token[0];
        const urlParams = new URLSearchParams(token[1]);
        dispatch({type: 'SET_PASS', payload: urlParams.get('pwd')});
    }
    else
        id = zoomlink;
    
    const response = await fetch('https://8234-103-215-226-42.ngrok-free.app/api/v1/jwt', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({meetingId: id})
    });

    const jsonData = await response.json();

    if(response.ok) {
        dispatch({type: 'SET_ID', payload: id});
        dispatch({type: 'SET_JWT', payload: jsonData.signature});
        dispatch({type: 'SET_KEY', payload: jsonData.key});
        navigate('/meeting');
    }
    else {
        setError(jsonData.error);
    }
  }

  return (
    <form id="joinForm" className="flex center w-50" onSubmit={handleSubmit}>
        <input type="text" className="form-control w-100 mb-3 text-center" id="zoomlink" name="zoomlink" 
            value={zoomlink} 
            onChange={(e) => setZoomlink(e.target.value)} 
            placeholder="Enter Zoom meeting ID or link"/>
        <button type="submit" className="btn btn-primary w-33">JOIN MEETING</button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
    </form>
  )
}

export default JoinForm
