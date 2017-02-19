class Auth {
  login(param = {}) {

    let { host, username, password, clientid, regid } = param;
//    let host = param.host;
//    let username = param.username;
//    let password = param.password;
//    let clientid = param.clientid;
//    let regid = param.regid;

    if(host == '' || username == '' || password == '') return false;
    let ssl = false; // default http://
    if(host.indexOf('http://') == 0){
      host = host.replace('http://', '');
      ssl = false;
    }
    if(host.indexOf('https://') == 0){
      host = host.replace('https://', '');
      ssl = true;
    }
    let e = host.indexOf('/');
    if(e != -1){
      host = host.substring(0, e);
    }
    let postVal = {
      command: 'verifyRegister',
      email: username,
      password: password,
      device_id: regid,
      client_id: clientid,
      tempid: (new Date()).getTime(),
      ret: 'json',
    };
    //Toast.show(JSON.stringify(postVal), Toast.LONG);
    let url = 'http' + (ssl ? 's':'') + '://'+ host + '/cgi-bin/index.cgi?Action=Mobile_API.run';
    console.log(url);
    console.log(postVal);
    return fetch( url, {
      method: 'POST',
      headers: {
        'Accept': 'text/plain, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: Object.keys(postVal).map((t)=>t+"="+postVal[t]).join('&')
    }).then((res) => {
      //console.log('post result');
      //console.log(res.text());
      if(res.status === 200 || res.status === 0){
        return Promise.resolve(res)
      }else{
        return Promise.reject(new Error(res.statusText))
      }
    }).catch((e) => {
      console.log(e.message);
    });

  }
}

let auth = new Auth();
export default auth;