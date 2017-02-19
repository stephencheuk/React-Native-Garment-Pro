class TodoMessage {
  constructor() {
  }
  get(param = {}) {

    let { host, username, password, clientid, regid } = param;

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
      command: 'getMessage',
      email: username,
      password: password,
      device_id: regid,
      client_id: clientid,
      tempid: (new Date()).getTime(),
      ret: 'json',
    };
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
    })
    .then((res) => {
      if(res.status === 200 || res.status === 0){
        return Promise.resolve(res)
      }else{
        return Promise.reject(new Error(res.statusText))
      }
    }).catch((e) => {
      return Promise.reject(new Error(e.message))
    });

  }
}

let todoMessage = new TodoMessage();
export default todoMessage;