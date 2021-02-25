Component({
	data:{
		show:true,
		selected:0,
		color: "#7a7e83",
		selectedColor: "#3cc51f",
		list: [{
		    pagePath: "/pages/fontpage/fontpage",
		    iconPath: "/static/pic/tabbar/planet.png",
			selectedIconPath:"/static/pic/tabbar/planet-select.png"
		}, {
		    pagePath: "/pages/publish/publish",
		    iconPath: "/static/pic/tabbar/plus.png",
			selectedIconPath:"/static/pic/tabbar/plus-select.png"
		},
		{
		    pagePath: "/pages/profile/profile",
		    iconPath: "/static/pic/tabbar/me.png",
			selectedIconPath:"/static/pic/tabbar/me-select.png"
		}]
	},
	attached(){
		
	},
	methods:{
		switchTab(e){
			const data = e.currentTarget.dataset
			const url = data.path
			console.log(data.index)

			wx.switchTab({url})
			this.setData({
				selected:data.index,
			})
		}
	},
})