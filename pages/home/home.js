// pages/home/home.js
// 这里只能写相对路径
import request from "../../service/network"
import {getMultiData,getProduct} from '../../service/home'

import {POP,SELL,NEW} from '../../common/const'


const TOP_DISTANCE = 1000;
Page({

    /**
     * 页面的初始数据
     */
    data: {
      banners: [],
      recommends: [],
			titles: ["流行","新款","精选"],
      currentType: 'pop',
      showBackTop: false,
      showTabControl: false,
      tabScrollTop: 0,
      goods: {
        'pop': {page: 1,list: []},
        'sell': {page: 1,list: []},
        'new': {page: 1,list: []}
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      // 请求数据
      this._getData();
      // console.log(this.data.goods)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     * 页面显示是否意味着所有的图片都加载完成
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      this._getProduct(this.data.currentType)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    // 监听页面滚动
    onPageScroll(options) {
      // console.log(options);
      // 1.取出scrollTop
      const scrollTop = options.scrollTop;
      // 2.修改showBackTop属性
      // 官方：不要在滚动的的回调函数中频繁的调用this.setData
      const flag1 = scrollTop > TOP_DISTANCE;
      if(flag1 != this.data.showBackTop){
        this.setData({
        showBackTop: flag1
        })
      }
      // 设置吸顶是否显示
      const flag2 = scrollTop > this.data.tabScrollTop
      if(flag2 != this.data.showTabControl){
        this.setData({
          showTabControl: flag2
        })
      }
    },
    // 封装请求轮播图数据的函数
		_getMutilData() {
			getMultiData().then(res => {
        // console.log(res)
        const banners = res.data.banner.list.map(item => {
          return item.image
        })
				this.setData({
          banners: banners,
          recommends: res.data.recommend.list
        })
			}).catch(err => {
				console.log(err)
			})
    },
    
    // 封装请求商品信息的函数
		_getProduct(type) {

      // 1.获取数据对应的页码
      const page = this.data.goods[type].page;
      
      // 2.请求数据
      getProduct(type,page).then(res =>{
        console.log(res);
        // 3.取出数据
        const list = res.data.list;
        const goods = this.data.goods;

        goods[type].list.push(...list);
        goods[type].page += 1;

        this.setData({
          goods: goods
        })
      }).catch(err => {
        console.log(err);
      })
    },
    // 封装请求首页数据的函数
    _getData() {

      this._getMutilData();

      this._getProduct(POP);
      this._getProduct(SELL);
      this._getProduct(NEW);
    },

    // 监听tab点击事件
    handletabclick(event) {
      console.log(event)
      let currentType = "";
      switch(event.detail){
        case 0:
          currentType = POP;
          break;
        case 1:
          currentType = NEW;
          break;
        case 2:
            currentType = SELL;
            break;
      }

      // 更新数据
      this.setData({
        currentType: currentType
      })
    },

    // 监听recommend发送的图片加载完成事件
    handleImageLoad() {
      console.log('图片加载完成')
      wx.createSelectorQuery().select('#tab-control').boundingClientRect((rect) => {
        this.data.tabScrollTop = rect.top;
      }).exec()
    }
})