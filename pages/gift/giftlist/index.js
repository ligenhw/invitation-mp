// pages/editor/index.js
import api from "../../../invitation/api"
import { cli } from "../../../starry/collctApi";

const iconPath = '/image/card_giftcard.svg'

Page({
    data: {
        giftList: {},
        list: [
            {
                text: '收礼',
                iconPath: iconPath,
                selectedIconPath: iconPath
            },
            {
                text: '送礼',
                iconPath: iconPath,
                selectedIconPath: iconPath
            }
        ],
        giftList: [],
        tagIndex: 0,
        groups: [
            { text: '示例菜单', value: 1 },
            { text: '示例菜单', value: 2 },
            { text: '负向菜单', type: 'warn', value: 3 }
        ],
        showDialog: false
    },
    async onShow() {
        await this.loadGift()
    },
    async loadGift() {
        const tag = this.getGiftTag(this.data.tagIndex)
        const giftList = await api.queryGift(tag)
        console.log(giftList)
        this.setData({
            giftList
        })
    },
    async tabChange(e) {
        this.setData({
            tagIndex: e.detail.index
        })
        await this.loadGift()
    },
    getGiftTag(index) {
        const tags = ['receive', 'send']
        return tags[index]
    },
    createGift() {
        cli('createGift')
    
        wx.navigateTo({
            url: '/pages/gift/gifteditor/index',
        })
    },
    async onGiftClick(e) {
        const gift = e.currentTarget.dataset.content
        console.log('click ', gift)
        wx.showActionSheet({
            itemList: ['删除'],
            success: async res => {
                if (!res.cancel) {
                    await api.deleteGift(gift.id)
                    await this.onShow()
                }
            }
        });
    },
})