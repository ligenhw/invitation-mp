// pages/editor/index.js

import api from '../../invitation/api'
import { pv } from "../../starry/collctApi";

const Upyun = require('../../utils/upyun-wxapp-sdk')

const upyun = new Upyun({
    bucket: 'color-stage',
    operator: 'invitation',
    getSignatureUrl: 'https://bestlang.cn/api/oss/upyun'
  })

Page({
    data: {
        user: {},

        groom_name: '',
        groom_mobile: '',
        bride_name: '',
        bride_mobile: '',

        date: '',
        poster_img: '',
        poster_welcome: '',

        address_text: '',
        address: {
            text: '',
        },
        latitude: '',
        longitude: '',

        album: [],

        audio_name: '',
        audio_url: '',
        audio_auto_play: true,

        formData: {

        },
        rules: [{
            name: 'groom_name',
            rules: { required: true, message: '新郎姓名必填' },
        }, {
            name: 'bride_name',
            rules: { required: true, message: '新娘姓名必填' },
        }, {
            name: 'address_text',
            rules: { required: true, message: '地址名称必填' },
        }
    ]
    },
    async onLoad() {
        this.setData({
            selectFile: this.selectFile.bind(this),
            uploadFile: this.uploadFile.bind(this),
            uploadAlbumFile: this.uploadAlbumFile.bind(this)
        })

        const user = await api.queryUser()
        this.setData({
            user
        })
    },
    onShow() {
        pv('editor')
    },
    createWedding: async function() {
        console.log('createWedding groom_name : ', this.data.groom_name)
        await api.createWedding({
            groom: {
                name: this.data.formData.groom_name,
                tel: this.data.formData.groom_tel
            },
            bride: {
                name: this.data.formData.bride_name,
                tel: this.data.formData.bride_tel
            },
            time: this.data.formData.date,
            address: {
                text: this.data.formData.address_text,
                latitude: this.data.address.latitude,
                longitude: this.data.address.longitude
            },
            poster: {
                img: this.data.poster_img,
                welcome: this.data.formData.poster_welcome
            },
            album: this.data.album,
            audio: {
                name: "今天你要嫁给我",
                url: "http://music.163.com/song/media/outer/url?id=5254811.mp3",
                autoPlay: true
            }
        })
    },
    radioChange: function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value);

        var radioItems = this.data.radioItems;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == e.detail.value;
        }

        this.setData({
            radioItems: radioItems,
            [`formData.radio`]: e.detail.value
        });
    },
    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value,
            [`formData.date`]: e.detail.value
        })
    },
    formInputChange(e) {
        const { field } = e.currentTarget.dataset
        console.log('field : ', field)
        this.setData({
            [`formData.${field}`]: e.detail.value
        })
    },
    submitForm: async function () {
        this.selectComponent('#form').validate((valid, errors) => {
            console.log('valid', valid, errors)
            if (!valid) {
                const firstError = Object.keys(errors)
                if (firstError.length) {
                    this.setData({
                        error: errors[firstError[0]].message
                    })

                }
            } else {
                // wx.showToast({
                //     title: '校验通过'
                // })
                this.createWedding()
                wx.navigateBack()
            }
        })
    },
    previewImage: function(e){
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览的图片http链接列表
        })
    },
    selectFile(files) {
        console.log('files', files)
        // 返回false可以阻止某次文件上传
    },
    uploadFile(files) {
        console.log('upload files', files)
        // 文件上传的函数，返回一个promise
        return new Promise((resolve, reject) => {
            // setTimeout(() => {
            //     reject('some error')
            // }, 1000)
            this.doUploadFile(files, resolve)
        })
    },
    uploadAlbumFile(files) {
        console.log('uploadAlbumFile ', files)
        // 文件上传的函数，返回一个promise
        return new Promise((resolve, reject) => {
            // setTimeout(() => {
            //     reject('some error')
            // }, 1000)
            this.doUploadAlbumFile(files, resolve)
        })
    },
    getFileName(uri) {
        const parts = uri.split('/')
        return parts[parts.length -1]
    },
    doUploadFile(files, resolve) {
        this.upyunUpload(files.tempFilePaths[0], (success, path) => {
            if (success) {
                this.setData({
                    poster_img: path
                })
                resolve({
                    urls: [path]
                })
            } else {
                console.log('doUpload file failed')
            }
        })
    },
    upyunUpload(fp, callback) {
        const tmpFileName = this.getFileName(fp);
        const remotePath = `invitation/user/${this.data.user.id}/${tmpFileName}`
        const ossPath = 'http://oss.bestlang.cn/' + remotePath
        upyun.upload({
          localPath: fp,
          remotePath: remotePath,
          success : (res) => {
            console.log('success ', res)
            callback(true, ossPath)
          },
          fail(e) {
              console.log('fail ', e)
              callback(false)
          }
        })
    },
    doUploadAlbumFile(files, resolve) {
        console.log('doUploadAlbumFile ', files.tempFiles)
        var album = []
        files.tempFiles.forEach(f => {
            this.upyunUpload(f.path, (success, path) => {
                if (success) {
                    album = album.concat(path)
                    if (album.length === files.tempFiles.length) {
                        this.setData({
                            album
                        })
                        resolve({
                            urls: album
                        })
                    }
                } else {
                    console.log('doUploadAlbumFile error')
                }
            })
        })
    },
    uploadError(e) {
        console.log('upload error', e.detail)
    },
    uploadSuccess(e) {
        console.log('upload success', e)
    },
    chooseLocation() {
        wx.chooseLocation({
          success: (res) => {
            console.log(res)
            this.setData({
                address: {
                    longitude: res.longitude,
                    latitude: res.latitude
                }
            })
            if (!this.data.formData.address_text) {
                this.setData({
                    [`formData.address_text`]: res.address
                })
            }
          }
        })
    }
})