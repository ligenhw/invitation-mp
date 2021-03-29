// pages/editor/index.js
Page({
    onShareAppMessage() {
        return {
            title: '制作邀请函'
        }
    },
    data: {

        files: [{
            url: 'http://mmbiz.qpic.cn/mmbiz_png/VUIF3v9blLsicfV8ysC76e9fZzWgy8YJ2bQO58p43Lib8ncGXmuyibLY7O3hia8sWv25KCibQb7MbJW3Q7xibNzfRN7A/0',
        }, {
            loading: true
        }, {
            error: true
        }],
        showTopTips: false,

        radioItems: [
            { name: 'cell standard', value: '0', checked: true },
            { name: 'cell standard', value: '1' }
        ],
        checkboxItems: [
            { name: 'standard is dealt for u.', value: '0', checked: true },
            { name: 'standard is dealicient for u.', value: '1' }
        ],
        items: [
            { name: 'USA', value: '美国' },
            { name: 'CHN', value: '中国', checked: 'true' },
            { name: 'BRA', value: '巴西' },
            { name: 'JPN', value: '日本' },
            { name: 'ENG', value: '英国' },
            { name: 'TUR', value: '法国' },
        ],

        date: "2016-09-01",
        time: "12:01",

        countryCodes: ["+86", "+80", "+84", "+87"],
        countryCodeIndex: 0,

        countries: ["中国", "美国", "英国"],
        countryIndex: 0,

        accounts: ["微信号", "QQ", "Email"],
        accountIndex: 0,

        isAgree: false,
        formData: {

        },
        rules: [{
            name: 'radio',
            rules: { required: false, message: '单选列表是必选项' },
        }, {
            name: 'checkbox',
            rules: { required: true, message: '多选列表是必选项' },
        }, {
            name: 'name',
            rules: { required: true, message: '请输入姓名' },
        }, {
            name: 'qq',
            rules: { required: true, message: 'qq必填' },
        }, {
            name: 'mobile',
            rules: [{ required: true, message: 'mobile必填' }, { mobile: true, message: 'mobile格式不对' }],
        }, {
            name: 'vcode',
            rules: { required: true, message: '验证码必填' },
        }, {
            name: 'idcard',
            rules: {
                validator: function (rule, value, param, modeels) {
                    if (!value || value.length !== 18) {
                        return 'idcard格式不正确'
                    }
                }
            },
        }]
    },
    onLoad() {
        this.setData({
            selectFile: this.selectFile.bind(this),
            uplaodFile: this.uplaodFile.bind(this)
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
    checkboxChange: function (e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value);

        var checkboxItems = this.data.checkboxItems, values = e.detail.value;
        for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
            checkboxItems[i].checked = false;

            for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
                if (checkboxItems[i].value == values[j]) {
                    checkboxItems[i].checked = true;
                    break;
                }
            }
        }

        this.setData({
            checkboxItems: checkboxItems,
            [`formData.checkbox`]: e.detail.value
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
        this.setData({
            [`formData.${field}`]: e.detail.value
        })
    },
    bindTimeChange: function (e) {
        this.setData({
            time: e.detail.value
        })
    },
    bindCountryCodeChange: function (e) {
        console.log('picker country code 发生选择改变，携带值为', e.detail.value);

        this.setData({
            countryCodeIndex: e.detail.value
        })
    },
    bindCountryChange: function (e) {
        console.log('picker country 发生选择改变，携带值为', e.detail.value);

        this.setData({
            countryIndex: e.detail.value
        })
    },
    bindAccountChange: function (e) {
        console.log('picker account 发生选择改变，携带值为', e.detail.value);

        this.setData({
            accountIndex: e.detail.value
        })
    },
    bindAgreeChange: function (e) {
        this.setData({
            isAgree: !!e.detail.value.length
        });
    },
    submitForm() {
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
                wx.showToast({
                    title: '校验通过'
                })
            }
        })
        // this.selectComponent('#form').validateField('mobile', (valid, errors) => {
        //     console.log('valid', valid, errors)
        // })
    },

    // 图片选择器
    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                    files: that.data.files.concat(res.tempFilePaths)
                });
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
    uplaodFile(files) {
        console.log('upload files', files)
        // 文件上传的函数，返回一个promise
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject('some error')
            }, 1000)
        })
    },
    uploadError(e) {
        console.log('upload error', e.detail)
    },
    uploadSuccess(e) {
        console.log('upload success', e.detail)
    },

    chooseLocation() {
        const that = this
        wx.chooseLocation({
          success(res) {
            console.log(res)
            that.setData({
              hasLocation: true,
              location: formatLocation(res.longitude, res.latitude),
              locationAddress: res.address
            })
          }
        })
    }
})