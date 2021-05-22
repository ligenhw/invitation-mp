// pages/editor/index.js

import api from '../../../invitation/api'
import { cli } from "../../../starry/collctApi";

Page({
    data: {
        user: {},
        formData: {
            radio: 'receive'
        },
        radioItems: [
            {name: '收礼', value: 'receive', checked: true},
            {name: '送礼', value: 'send'}
        ],
        rules: [{
            name: 'name',
            rules: { required: true, message: '姓名必填' },
        }, {
            name: 'amount',
            rules: { required: true, message: '金额必填' },
        }
    ]
    },
    async onLoad(options) {
        const user = await api.queryUser()
        this.setData({
            user
        })
    },
    createGift: async function() {
        await api.createGift({
            tag: this.data.formData.radio,
            name: this.data.formData.name,
            amount: this.data.formData.amount,
            note: this.data.formData.note,
            date: new Date()
        })
    },
    formInputChange(e) {
        const { field } = e.currentTarget.dataset
        this.setData({
            [`formData.${field}`]: e.detail.value
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
    submitForm: async function () {
        cli('submitGift')

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
                this.createGift()
                wx.navigateBack()
            }
        })
    },
})