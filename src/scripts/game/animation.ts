export class Animation {
  constructor(
    public name: string,
    public images: HTMLImageElement[],
    public frames: number,
    public timeLastFrame: number,
    public loop: boolean = false
  ) {}
}
