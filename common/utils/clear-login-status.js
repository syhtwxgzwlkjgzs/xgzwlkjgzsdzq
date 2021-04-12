import locals from '@common/utils/local-bridge';
import constants from '@common/constants';
export default function clearLoginStatus() {
    locals.remove(constants.ACCESS_TOKEN_NAME);
    if (process.env.DISCUZ_ENV === 'web') {
        var ca = document.cookie.split(';');	
        var cookieStr="";
        for(var i=0; i<ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(constants.ACCESS_TOKEN_NAME)==0) {
                document.cookie =c + ';expires=' + new Date(0).toUTCString()  
            }else{
                cookieStr+=c;
                cookieStr+=";";
            }
            document.cookie =cookieStr;
        }
    }
}