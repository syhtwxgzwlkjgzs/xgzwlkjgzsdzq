import { observable } from 'mobx';
class IndexStore {
  constructor() {}

  @observable home = -1;

  @observable search = -1;

  @observable isJumpingToTop = false;

  @observable playingVideoPos = -1;

  @observable playingVideoDom = "";

  @observable playingAudioPos = -1;

  @observable playingAudioDom = "";

}

export default IndexStore;
