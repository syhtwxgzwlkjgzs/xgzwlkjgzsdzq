import Taro, {  } from '@tarojs/taro';
import React from 'react'
import PropTypes from 'prop-types';
import { Canvas } from '@tarojs/components';
import { randomString, getHeight, downloadImageAndInfo } from './utils/tools';
import { drawImage, drawText, drawBlock, drawLine, } from './utils/draw';
import './index.css';

let count = 1;
export default class CanvasDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.toPx = (rpx, int = false, factor = this.state.factor) => {
            if (int) {
                return Math.ceil(rpx * factor * this.state.pixelRatio);
            }
            return rpx * factor * this.state.pixelRatio;
        };
        this.toRpx = (px, int = false, factor = this.state.factor) => {
            if (int) {
                return Math.ceil(px / factor);
            }
            return px / factor;
        };
        this._downloadImageAndInfo = (image, index, pixelRatio) => new Promise((resolve, reject) => {
                downloadImageAndInfo(image, index, this.toRpx, pixelRatio)
                    .then((result) => {
                    this.drawArr.push(result);
                    resolve(result);
                })
                    .catch(err => {
                    reject(err);
                });
            });
        this.downloadResource = ({ images = [], pixelRatio = 1 }) => {
            const drawList = [];
            const imagesTemp = images;
            imagesTemp.forEach((image, index) => drawList.push(this._downloadImageAndInfo(image, index, pixelRatio)));
            return Promise.all(drawList);
        };
        this.downloadResourceTransit = () => {
            const { config } = this.props;
            return new Promise((resolve, reject) => {
                if (config.images && config.images.length > 0) {
                    this.downloadResource({
                        images: config.images,
                        pixelRatio: config.pixelRatio || 1,
                    })
                        .then(() => {
                        resolve();
                    })
                        .catch((e) => {
                        reject(e);
                    });
                }
                else {
                    setTimeout(() => {
                        resolve(1);
                    }, 500);
                }
            });
        };
        this.initCanvas = (w, h, debug) => new Promise((resolve) => {
                this.setState({
                    pxWidth: this.toPx(w),
                    pxHeight: this.toPx(h),
                    debug,
                }, resolve);
            });
        this.onCreate = () => {
            const { onCreateFail, config } = this.props;
            if (config['hide-loading'] === false) {
                Taro.showLoading({ mask: true, title: '生成中...' });
            }
            return this.downloadResourceTransit()
                .then(() => {
                this.create(config);
            })
                .catch((err) => {
                config['hide-loading'] && Taro.hideLoading();
                Taro.showToast({ icon: 'none', title: err.errMsg || '下载图片失败' });
                console.error(err);
                if (!onCreateFail) {
                    console.warn('您必须实现 taro-plugin-canvas 组件的 onCreateFail 方法，详见文档 https://github.com/chuyun/taro-plugin-canvas#fail');
                }
                onCreateFail && onCreateFail(err);
            });
        };
        this.create = (config) => {
            this.ctx = Taro.createCanvasContext(this.canvasId, this.$scope);
            const height = getHeight(config);
            this.setState({
                pixelRatio: config.pixelRatio || 1,
            }, () => {
                this.initCanvas(config.width, height, config.debug)
                    .then(() => {
                    if (config.backgroundColor) {
                        this.ctx.save();
                        this.ctx.setFillStyle(config.backgroundColor);
                        this.ctx.fillRect(0, 0, this.toPx(config.width), this.toPx(height));
                        this.ctx.restore();
                    }
                    const { texts = [], blocks = [], lines = [], } = config;
                    const queue = this.drawArr
                        .concat(texts.map((item) => {
                        item.type = 'text';
                        item.zIndex = item.zIndex || 0;
                        return item;
                    }))
                        .concat(blocks.map((item) => {
                        item.type = 'block';
                        item.zIndex = item.zIndex || 0;
                        return item;
                    }))
                        .concat(lines.map((item) => {
                        item.type = 'line';
                        item.zIndex = item.zIndex || 0;
                        return item;
                    }));
                    queue.sort((a, b) => a.zIndex - b.zIndex);
                    queue.forEach((item) => {
                        const drawOptions = {
                            ctx: this.ctx,
                            toPx: this.toPx,
                            toRpx: this.toRpx,
                        };
                        if (item.type === 'image') {
                            if (drawOptions.ctx !== null) {
                                drawImage(item, drawOptions);
                            }
                        }
                        else if (item.type === 'text') {
                            if (drawOptions.ctx !== null) {
                                drawText(item, drawOptions);
                            }
                        }
                        else if (item.type === 'block') {
                            if (drawOptions.ctx !== null) {
                                drawBlock(item, drawOptions);
                            }
                        }
                        else if (item.type === 'line') {
                            if (drawOptions.ctx !== null) {
                                drawLine(item, drawOptions);
                            }
                        }
                    });
                    const res = Taro.getSystemInfoSync();
                    const {platform} = res;
                    let time = 0;
                    if (platform === 'android') {
                        time = 300;
                    }
                    this.ctx.draw(false, () => {
                        setTimeout(() => {
                            this.getTempFile(null);
                        }, time);
                    });
                })
                    .catch((err) => {
                    Taro.showToast({ icon: 'none', title: err.errMsg || '生成失败' });
                    console.error(err);
                });
            });
        };
        this.getTempFile = (otherOptions) => {
            const { onCreateSuccess, onCreateFail } = this.props;
            Taro.canvasToTempFilePath({
                canvasId: this.canvasId,
                success: (result) => {
                    if (!onCreateSuccess) {
                        console.warn('您必须实现 taro-plugin-canvas 组件的 onCreateSuccess 方法，详见文档 https://github.com/chuyun/taro-plugin-canvas#success');
                    }
                    onCreateSuccess && onCreateSuccess(result);
                },
                fail: (error) => {
                    const { errMsg } = error;
                    if (errMsg === 'canvasToTempFilePath:fail:create bitmap failed') {
                        count += 1;
                        if (count <= 3) {
                            this.getTempFile(otherOptions);
                        }
                        else {
                            if (!onCreateFail) {
                                console.warn('您必须实现 taro-plugin-canvas 组件的 onCreateFail 方法，详见文档 https://github.com/chuyun/taro-plugin-canvas#fail');
                            }
                            onCreateFail && onCreateFail(error);
                        }
                    }
                },
            }, this.$scope);
        };
        this.state = {
            pxWidth: 0,
            pxHeight: 0,
            debug: false,
            factor: 0,
            pixelRatio: 1,
        };
        this.canvasId = randomString(10);
        this.ctx = null;
        this.cache = {};
        this.drawArr = [];
    }
    componentWillMount() {
        const { config } = this.props;
        const height = getHeight(config);
        this.initCanvas(config.width, height, config.debug);
    }
    componentDidMount() {
        const sysInfo = Taro.getSystemInfoSync();
        const {screenWidth} = sysInfo;
        this.setState({
            factor: screenWidth / 750
        });
        this.onCreate();
    }
    componentWillUnmount() { }
    render() {
        const { pxWidth, pxHeight, debug } = this.state;
        if (pxWidth && pxHeight) {
            return (<Canvas canvasId={this.canvasId} style={`width:${pxWidth}px; height:${pxHeight}px;`} className={`${debug ? 'debug' : 'pro'} canvas`}/>);
        }
        return null;
    }
}
CanvasDrawer.propTypes = {
    config: PropTypes.object.isRequired,
    onCreateSuccess: PropTypes.func.isRequired,
    onCreateFail: PropTypes.func.isRequired,
};
CanvasDrawer.defaultProps = {};
