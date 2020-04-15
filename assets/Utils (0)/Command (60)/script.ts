class Command {
  private static componentsLst: any[] = [];
  
  private static cmd(evt: string, val: boolean) {
    Command.componentsLst.forEach(component => {
      component.setValue(evt, val);
    })
  }
  
  public static add(v: any) {
    Sup.log("add component");
    Command.componentsLst.push(v);
  }
  
  public static remove(v: any) {    
    const index = Command.componentsLst.indexOf(v);
    if (index > -1) {
        Sup.log("remove component");
        Command.componentsLst.splice(index, 1);
    }
  }
  
  public static parseGameMessage(msg: string) {
    Sup.log("game:", msg);
    switch(msg) {
      case 'left':
        return Command.cmd('left', true);
      case 'left-down':
        return Command.cmd('left', false);
      case 'right':
       return Command.cmd('right', true);
      case 'right-down':
        return Command.cmd('right', false);
      case 'up':
        return Command.cmd('up', true);
      case 'close':
        Sup.loadScene("Menus/Scene");
        break;
      default:
        Sup.log("unknown cmd:", msg);
    }
  }
}
