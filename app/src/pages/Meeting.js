import React from 'react'
import { ZoomMtg } from '@zoomus/websdk'
import { useZoomContext } from '../hooks/useZoomContext';

const Meeting = () => {
  const { state, dispatch } = useZoomContext();

  ZoomMtg.setZoomJSLib('https://source.zoom.us/2.13.0/lib', '/av')
  ZoomMtg.preLoadWasm()
  ZoomMtg.prepareWebSDK()
  ZoomMtg.i18n.load('en-US')
  ZoomMtg.i18n.reload('en-US')
  const zoomMeetingSDK = document.getElementById('zmmtg-root')
  zoomMeetingSDK.style.display = 'block';

  return (
    <div>
      
    </div>
  )
}

export default Meeting
