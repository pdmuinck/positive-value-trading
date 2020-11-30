const axios = require('axios')

const headers = {
    headers: {
        'Content-Type': 'text/plain'
    }
}

const body = 'callCount=1\nnextReverseAjaxIndex=0\nc0-scriptName=IF_GetAvvenimentoSingolo\nc0-methodName=getEvento\nc0-id=0\nc0-param0=string:1\nc0-param1=string:280\nc0-param2=string:30481\nc0-param3=string:2549\nc0-param4=string:STANLEYBET\nc0-param5=number:0\nc0-param6=number:0\nc0-param7=string:nl\nc0-param8=boolean:true\nbatchId=781\ninstanceId=0\npage=%2FXSport%2Fpages%2Flive_match.jsp%3Ftoken%3Dsample_token%26ip%3D127.0.0.1%26system_code%3DSTANLEYBET%26id_pvr%3D%26language%3Dnl%26operator%3Dfalse%26cashier%3Dfalse%26prenotatore%3Dfalse%26hide_switcher_bar%3Dfalse\nscriptSessionId=NzRgVIcEnGbOpnSsd4bO~wYbxnp\u0021hnUVqon/MCl8ron-ome$1g3hu\n'

axios.post('https://sportsbook.stanleybet.be/XSport/dwr/call/plaincall/IF_GetAvvenimentoSingolo.getEvento.dwr', body, headers).then(response => console.log(response)).catch(error => console.log(error))