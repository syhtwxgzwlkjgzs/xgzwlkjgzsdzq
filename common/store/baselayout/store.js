import { observable } from 'mobx';
class IndexStore {
  constructor() {}

  @observable home = -1;

  @observable search = -1;

  @observable isJumpingToTop = false;

  @observable playingVideoPos = -1;

  @observable playingVideoDom = ""; // Video的selector string

  @observable playingAudioPos = -1;

  @observable playingAudioDom = null; // 来自组件Audio的context

  @observable playingAudioWrapperId = ""; // 只在mini中使用，用于定位

}

export default IndexStore;
