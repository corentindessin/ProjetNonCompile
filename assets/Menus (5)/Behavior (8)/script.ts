class StartMenuBehavior extends Sup.Behavior {
  
  private introStarted = false;
  private introTimeout = null;
  
  private startGame: boolean = false;
  
  private edit: boolean = true;
  private padId: string = "";
  
  private textBox: any;
  private inputBox: any;

  awake() {
    Fade.start(Fade.Direction.In, { duration: 500 });
    const instance = Singleton.getInstance();
    instance.on('message', (msg) => {
      if (msg === 'start')
        this.startGame = true;
    });
    
    instance.on("close", () => {
      Sup.log("ws closed");
      Sup.loadScene("Menus/Scene");
    })
    
    this.inputBox = Sup.getActor("Inputbox").textRenderer;
    this.textBox = Sup.getActor("TextBox").textRenderer;
  }

  update() { 
    if (this.edit) {
      for (let c of Sup.Input.getTextEntered()) {
        if (c >= '0' && c <= '9')
          this.padId += c;
      }
    
      if (Sup.Input.wasKeyJustPressed("DELETE", { autoRepeat: true })) {
        if (this.padId.length > 0) {
           Sup.log("Remove char");
           this.padId = this.padId.substring(0, this.padId.length - 1);
        }
      }
    
      if (Sup.Input.wasKeyJustPressed("RETURN")) {
        if (this.padId.length > 0) {
          this.edit = false;
          this.textBox.setText("En attente de la manette");
          Singleton.getInstance().send(this.padId + "\n");
        }
      }
    }
    
    if (this.padId.length === 0)
      this.inputBox.setText("entrer l'identifiant");
    else
      this.inputBox.setText(this.padId);
    
    if (!this.introStarted && this.startGame) {
      this.introStarted = true;
    
    if (this.introStarted && this.introTimeout == null) {
      this.introTimeout = Sup.setTimeout(500, () => { 
        Fade.start(Fade.Direction.Out, { duration: 1000 }, () => {
          Singleton.getInstance().on('message', Command.parseGameMessage)
          Sup.loadScene("In-Game/Maps/Niveau/NIV1") 
        });
      });
    }
    }
}
}
Sup.registerBehavior(StartMenuBehavior);