import { action } from 'mobx';
import IndexStore from './store';

class IndexAction extends IndexStore {
  constructor(props) {
    super(props);
  }

  /**
   * 设置跳回页面头部
   */
  @action
  setJumpingToTop() {
    this.home = -1;
    this.search = -1;
    this.isJumpingToTop = true;
  }

  /**
   * 设置跳回页面头部
   */
  @action
  removeJumpingToTop() {
    this.isJumpingToTop = false;
  }

  /**
   * 重置播放器属性
   */
  @action
  resetPlayersInfo() {
    this.playingVideoPos = -1;
    this.playingVideoDom = "";
    this.playingAudioPos = -1;
    this.playingAudioDom = null;
    this.playingAudioWrapperId = "";
  }

  /**
   * 停止在播放的视频
   */
  @action
  pauseWebPlayingVideo() {
    if(this.playingVideoDom) {
      this.playingVideoDom.querySelector('video')?.pause();
      this.playingVideoDom = "";
    }
    if(this.playingVideoPos >= 0) {
      this.playingVideoPos = -1;
    }
  }

  /**
   * 停止在播放的视频
   */
  @action
  pauseWebPlayingAudio() {
    if(this.playingAudioDom) {
      this.playingAudioDom.pause();
      this.playingAudioDom = null;
    }
    if(this.playingAudioPos >= 0) {
      this.playingAudioPos = -1;
    }
  }

  /**
   * 停止在播放的视频
   */
  @action
  pauseWebAllPlayers() {
    if(this.playingVideoDom) {
      // 暂停之前正在播放的视频
      this.pauseWebPlayingVideo();
    }

    if(this.playingAudioDom) {
      // 暂停之前正在播放的音频
      this.pauseWebPlayingAudio();
    }
  }

}

export default IndexAction;
