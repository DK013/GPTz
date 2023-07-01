ZoomMtg.setZoomJSLib('https://source.zoom.us/2.13.0/lib', '/av')
// loads WebAssembly assets
ZoomMtg.preLoadWasm()
ZoomMtg.prepareWebSDK()
// loads language files, also passes any error messages to the ui
ZoomMtg.i18n.load('en-US')
ZoomMtg.i18n.reload('en-US')

$(document).ready(async function() {
    //get meeting context from session
    const response = await fetch('/api/v1/getContext');
    const context = await response.json();

    if(response.ok) {
        document.querySelector('.loader').classList.add('hidden');
        ZoomMtg.init({
            leaveUrl: context.leaveUrl, 
            success: (success) => {
              ZoomMtg.join({
                sdkKey: context.key,
                signature: context.signature,
                meetingNumber: context.meetingId,
                passWord: context.password,
                userName: context.username,
                success: (success) => {
                  //speech recognition
                  listener.listen();
                },
                error: (error) => {
                  console.log(error)
                }
              })
            },
            error: (error) => {
              console.log(error)
            }
        })
    }
});