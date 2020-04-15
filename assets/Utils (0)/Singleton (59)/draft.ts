declare var WebSocket: any;

class Singleton {
  private static instance = new Singleton();
  
  public static getInstance() {
    return Singleton.instance;
  }
  
  private ws: any;
  private fct: any = {};
  
  constructor() {
    Sup.log("singleton init");
    this.ws = new WebSocket("wss://jouhei.ratal.eu");
    this.ws.onmessage = this._onMessage.bind(this);
    this.ws.onerror = this._onError.bind(this);
    this.ws.onclose = this._onClose.bind(this);
  }
  
  private _onMessage(event: any) {
    if (!event.data || event.data.length === 0)
      return;
    
    event.data.split('\n').forEach(msg => {
      if (!msg || msg.length === 0)
        return;
      
      Sup.log("ws receive:", msg);
      
      if (msg === 'WELCOME')
        this.ws.send("nav\n");
      else {
        if (this.fct.message)
          this.fct.message(msg);
      }
    })
  }
  
  private _onError(err) {
    Sup.log("singleton error:", err);
    if (this.fct.error)
      this.fct.error(err);
  }
  
  private _onClose() {
    Sup.log("singleton closed");
    if (this.fct.close)
      this.fct.close();
  }
  
  on(evt: string, fct: any) {
    this.fct[evt] = fct;
  }
  
  send(msg: string) {
    Sup.log("sending pad:", msg);
    this.ws.send(msg);
  }
}

