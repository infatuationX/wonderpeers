<template>
	<view class="fontpage">
		<!-- 授权button -->
		<button open-type="getUserInfo" class="getInfo-btn" @getuserinfo="getUserInfoThird" v-if="!isAuthorize"></button>
		<!-- 首页头部 -->
		<view style="position: fixed; z-index: 9; width: 100%;" id="toparea">
			<view class="head" :class="{'head-no-overflow':tabMark === 4}">
				<!-- logo文字图片，svg格式 -->
				<image src="@/static/pic/fontpage/WonderPeers.svg"></image>
				<image src="@/static/pic/fontpage/wandoupai.svg"></image>
				<image src="@/static/pic/fontpage/logo.svg"></image>
			</view>
			<!-- 首页搜索框 -->
			<view class="searchbar">
				<!-- 输入框 -->
				<view class="input-area">
					<input type="text" v-model="searchtext" placeholder="搜索行业、公司、职位等关键词" @confirm="searchConfirm" />
					<image src="../../static/pic/fontpage/close.svg" class="clearicon" v-if="searchtext !== ''" @click="clearSearchText"></image>
				</view>

				<!-- 筛选框 -->
				<view class="selector" @click="selectorUnfold">
					<text :class="{active:selecttext !== '帖子类型'}">{{selecttext}}</text>
					<image src="../../static/pic/fontpage/Polygon.svg" :animation="animationData"></image>
					<view class="selector-item" v-if="isUnfold">
						<view>
						</view>
						<view @click="selectItemEvent(i,item)" v-for="(item,i) in selectItem" :key="i" :class="{active:i===selectmark}">
							{{item}}
						</view>
					</view>
				</view>
			</view>
			<!-- 首页头部tabbar -->
			<view class="topTabbar">
				<view v-for="(item,i) in tabItem" :class="{tabActive:i===tabMark}" :key="i" @click="changeTab(i)">
					<text>{{item}}</text>
				</view>
			</view>
		</view>
		<!-- 占位块 -->
		<view style="height: 340upx;">
		</view>
		<!-- 页面主体区域 -->
		<view class="main" :style="{height:scrollHight+'px'}">
			<swiper :duration="200" style="height: 100%;" @change="swiperChange" :current="swiperMark">
				<!-- 全部开头 -->
				<swiper-item>
					<scroll-view scroll-y="true" style="height: 100%;" :refresher-enabled="true" @scrolltolower="scrollToBottom1"
					 @refresherrefresh="refreshFontpage1" :refresher-triggered="isRefreshed1" :refresher-threshold="1"
					 @refresherrestore="onRestore1" lower-threshold="200" v-if="!fontSearchFlag">
						<view class="left-body" id="fontLeft">
							<!-- 有封面 -->
							<view v-for="(item,i) in fontpageLeft" :key="i">
								<view class="has-cover" @click="switchToDetail(item.interviewexperienceId,item.isCollect,item.isUnlock,i,'font-left',item.colNum,item.openId)"
								 v-if="item.cover !== ''&& item.cover !== null">
									<!-- 背景图 -->
									<view class="bgimage-right" v-if="item.type === 0 || item.type === 1">
										<image :src="item.type === 0?' ../../static/pic/fontpage/bg1.svg':'../../static/pic/fontpage/bg4.svg'" class="bgimage-right"></image>
									</view>
									<view class="bgimage-left" v-if="item.type === 2 || item.type === 3">
										<image :src="item.type === 2?' ../../static/pic/fontpage/bg3.svg':'../../static/pic/fontpage/bg2.svg'" class="bgimage-left"></image>
									</view>
									<!-- 清除浮动 -->
									<view style="overflow: hidden;">

									</view>
									<!-- 用户头像，标签 -->
									<view class="user" @click.stop="switchToUserpage(item.openId)">
										<!-- 头像 -->
										<image :src="`${baseUrl}/file/${item.userPot}`" mode="aspectFill"></image>
										<!-- 用户昵称 -->
										<view>
											<view class="upArea">
												<text>{{item.userName}}</text>
											</view>
											<!-- 全职以及实习标签 -->
											<view class="downArea">
												<text class="fulltime" v-for="(offer,i) in item.fulltime" :key="i">{{offer}}</text>
												<text v-for="(offer,i) in item.internship" :key="i">{{offer}}</text>
											</view>
										</view>
									</view>
									<!-- 封面及详情 -->
									<view class="cover">
										<view class="cover-image">
											<image :src="`${baseUrl}/file/${item.cover}`" mode="aspectFill"></image>
											<!-- 价格标签未解锁 -->
											<view class="price-label" v-if="!item.isUnlock">
												<!-- 免费 -->
												<text class="free" v-if="item.price === 0">FREE!</text>
												<!-- 付费 -->
												<view class="not-free" v-if="item.price !== 0">
													<image :src="require('../../static/pic/fontpage/peer2x.png')" mode="" class="peers"></image>
													<text class="price">x{{item.price}}</text>
												</view>

												<!-- 价格背景label -->
												<image :src="item.price === 0?'../../static/pic/fontpage/price-free.png':'../../static/pic/fontpage/price-outline.png'"
												 mode="" class="labelbg"></image>
											</view>
											<!-- 价格标签解锁后 -->
											<view class="price-label" v-if="item.isUnlock">
												<image src="../../static/pic/fontpage/price-outline.png" mode="" class="labelbg"></image>
												<text class="unlocked" v-if="item.isUnlock">已解锁</text>
											</view>
										</view>
										<view style="overflow: hidden;">

										</view>

										<view style="margin-top: 24upx;">
											<text>{{item.title}}</text>
											<text>{{item.summary}}</text>
											<!-- 	<text>三张财报系统介绍，详情页免费获取链接...</text> -->
										</view>
									</view>

									<view style="height: 100upx;display: flex;align-items: center;">
										<!-- 点赞及转发 -->
										<view class="like">
											<view class="sharebutton">
												<button open-type="share" @click.stop="shareButtonClick" :data-postid="item.interviewexperienceId"></button>
												<image src="../../static/pic/fontpage/plane.svg" mode=""></image>
											</view>
											<image :src="item.isCollect?'../../static/pic/fontpage/heart.png':'../../static/pic/fontpage/heart-outline.png'"
											 @click.stop="likeClick(item.interviewexperienceId,item.title,item.openId,item.type,item.isCollect,i,'left',item.userPot)"
											 class="likeImg"></image>
											<text>{{item.colNum}}</text>
										</view>
									</view>
								</view>
								<!-- 讲座、经历无封面 -->
								<view class="no-cover" @click="switchToDetail(item.interviewexperienceId,item.isCollect,item.isUnlock,i,'font-left',item.colNum,item.openId)"
								 v-if="item.cover === '' || item.cover === null">
									<!-- 占位 -->
									<view style="overflow: hidden;">

									</view>
									<!-- 标题 -->
									<view class="title">
										<text>{{item.title}}</text>
										<!-- <text>直播/录播</text> -->
									</view>
									<!-- 时间及人数 -->

									<!-- 详情及解锁 -->
									<view class="info">
										<text>{{item.summary}}</text>
										<!-- <text>解锁查看更多资料！</text> -->
										<!-- 价格标签 -->
										<!-- 价格标签未解锁 -->
										<view class="price-label" v-if="!item.isUnlock">
											<!-- 免费 -->
											<text class="free" v-if="item.price === 0">FREE!</text>
											<!-- 付费 -->
											<view class="not-free" v-if="item.price !== 0">
												<image :src="require('../../static/pic/fontpage/peer2x.png')" mode="" class="peers"></image>
												<text class="price">x{{item.price}}</text>
											</view>

											<!-- 价格背景label -->
											<image :src="item.price === 0?'../../static/pic/fontpage/price-free.png':'../../static/pic/fontpage/price-outline.png'"
											 mode="" class="labelbg"></image>
										</view>
										<!-- 价格标签解锁后 -->
										<view class="price-label" v-if="item.isUnlock">
											<image src="../../static/pic/fontpage/price-outline.png" mode="" class="labelbg"></image>
											<text class="unlocked" v-if="item.isUnlock">已解锁</text>
										</view>
									</view>
									<!-- 用户头像，标签 -->
									<view class="user" @click.stop="switchToUserpage(item.openId)">
										<!-- 头像 -->
										<image :src="`${baseUrl}/file/${item.userPot}`" mode="aspectFill"></image>
										<!-- 用户昵称 -->
										<view>
											<view class="upArea">
												<text>{{item.userName}}</text>
											</view>
											<!-- 全职以及实习标签 -->
											<view class="downArea">
												<text class="fulltime" v-for="(offer,i) in item.fulltime" :key="i">{{offer}}</text>
												<text v-for="(offer,i) in item.internship" :key="i">{{offer}}</text>
											</view>
										</view>
									</view>
									<!-- 点赞及转发 -->
									<view style="height: 100upx;display: flex;align-items: center;">
										<!-- 点赞及转发 -->
										<view class="like">
											<view class="sharebutton">

												<button open-type="share" @click.stop="shareButtonClick" :data-postid="item.interviewexperienceId"></button>
												<image src="../../static/pic/fontpage/plane.svg" mode=""></image>
											</view>
											<image :src="item.isCollect?'../../static/pic/fontpage/heart.png':'../../static/pic/fontpage/heart-outline.png'"
											 @click.stop="likeClick(item.interviewexperienceId,item.title,item.openId,item.type,item.isCollect,i,'left',item.userPot)"
											 class="likeImg"></image>
											<text>{{item.colNum}}</text>
										</view>
									</view>
									<!-- 背景图 -->
									<view class="bgimage-left" v-if="item.type === 2 || item.type === 3">
										<image :src="item.type === 2?'../../static/pic/fontpage/bg3.svg':'../../static/pic/fontpage/bg2.svg'" mode=""
										 class="bgimage-left"></image>
									</view>

									<view class="bgimage-right" v-if="item.type === 0 || item.type === 1">
										<image :src="item.type === 0?'../../static/pic/fontpage/bg1.svg':'../../static/pic/fontpage/bg4.svg'" mode=""
										 class="bgimage-right"></image>
									</view>
								</view>
							</view>
							<!-- 占位块 -->
							<view style="height: 120upx;clear: both;">
							</view>
						</view>

						<view class="right-body">
							<!-- 有封面 -->
							<view v-for="(item,i) in fontpageRight" :key="i">
								<view class="has-cover" @click="switchToDetail(item.interviewexperienceId,item.isCollect,item.isUnlock,i,'font-right',item.colNum,item.openId)"
								 v-if="item.cover !== ''&& item.cover !== null">
									<!-- 背景图 -->
									<view class="bgimage-right" v-if="item.type === 0 || item.type === 1">
										<image :src="item.type === 0?' ../../static/pic/fontpage/bg1.svg':'../../static/pic/fontpage/bg4.svg'" class="bgimage-right"></image>
									</view>
									<view class="bgimage-left" v-if="item.type === 2 || item.type === 3">
										<image :src="item.type === 2?' ../../static/pic/fontpage/bg3.svg':'../../static/pic/fontpage/bg2.svg'" class="bgimage-left"></image>
									</view>
									<!-- 清除浮动 -->
									<view style="overflow: hidden;">

									</view>
									<!-- 用户头像，标签 -->
									<view class="user" @click.stop="switchToUserpage(item.openId)">
										<!-- 头像 -->
										<image :src="`${baseUrl}/file/${item.userPot}`" mode="aspectFill"></image>
										<!-- 用户昵称 -->
										<view>
											<view class="upArea">
												<text>{{item.userName}}</text>
											</view>
											<!-- 全职以及实习标签 -->
											<view class="downArea">
												<text class="fulltime" v-for="(offer,i) in item.fulltime" :key="i">{{offer}}</text>
												<text v-for="(offer,i) in item.internship" :key="i">{{offer}}</text>
											</view>
										</view>
									</view>
									<!-- 封面及详情 -->
									<view class="cover">
										<view class="cover-image">
											<image :src="`${baseUrl}/file/${item.cover}`" mode="aspectFill"></image>
											<!-- 价格标签未解锁 -->
											<view class="price-label" v-if="!item.isUnlock">
												<!-- 免费 -->
												<text class="free" v-if="item.price === 0">FREE!</text>
												<!-- 付费 -->
												<view class="not-free" v-if="item.price !== 0">
													<image src="../../static/pic/fontpage/peer2x.png" mode="" class="peers"></image>
													<text class="price">x{{item.price}}</text>
												</view>

												<!-- 价格背景label -->
												<image :src="item.price === 0?'../../static/pic/fontpage/price-free.png':'../../static/pic/fontpage/price-outline.png'"
												 mode="" class="labelbg"></image>
											</view>
											<!-- 价格标签解锁后 -->
											<view class="price-label" v-if="item.isUnlock">
												<image src="../../static/pic/fontpage/price-outline.png" mode="" class="labelbg"></image>
												<text class="unlocked" v-if="item.isUnlock">已解锁</text>
											</view>
										</view>
										<view style="overflow: hidden;">

										</view>

										<view style="margin-top: 24upx;">
											<text>{{item.title}}</text>
											<text>{{item.summary}}</text>
											<!-- 	<text>三张财报系统介绍，详情页免费获取链接...</text> -->
										</view>
									</view>

									<view style="height: 100upx;display: flex;align-items: center;">
										<!-- 点赞及转发 -->
										<view class="like">
											<view class="sharebutton">

												<button open-type="share" @click.stop="shareButtonClick" :data-postid="item.interviewexperienceId"></button>
												<image src="../../static/pic/fontpage/plane.svg" mode=""></image>
											</view>

											<image :src="item.isCollect?'../../static/pic/fontpage/heart.png':'../../static/pic/fontpage/heart-outline.png'"
											 @click.stop="likeClick(item.interviewexperienceId,item.title,item.openId,item.type,item.isCollect,i,'right',item.userPot)"
											 class="likeImg"></image>
											<text>{{item.colNum}}</text>
										</view>
									</view>
								</view>
								<!-- 讲座、经历无封面 -->
								<view class="no-cover" @click="switchToDetail(item.interviewexperienceId,item.isCollect,item.isUnlock,i,'font-right',item.colNum,item.openId)"
								 v-if="item.cover === '' || item.cover === null">
									<!-- 占位 -->
									<view style="overflow: hidden;">

									</view>
									<!-- 标题 -->
									<view class="title">
										<text>{{item.title}}</text>
										<!-- <text>直播/录播</text> -->
									</view>
									<!-- 时间及人数 -->

									<!-- 详情及解锁 -->
									<view class="info">
										<text>{{item.summary}}</text>
										<!-- <text>解锁查看更多资料！</text> -->
										<!-- 价格标签未解锁 -->
										<view class="price-label" v-if="!item.isUnlock">
											<!-- 免费 -->
											<text class="free" v-if="item.price === 0">FREE!</text>
											<!-- 付费 -->
											<view class="not-free" v-if="item.price !== 0">
												<image src="../../static/pic/fontpage/peer2x.png" mode="" class="peers"></image>
												<text class="price">x{{item.price}}</text>
											</view>

											<!-- 价格背景label -->
											<image :src="item.price === 0?'../../static/pic/fontpage/price-free.png':'../../static/pic/fontpage/price-outline.png'"
											 mode="" class="labelbg"></image>
										</view>
										<!-- 价格标签解锁后 -->
										<view class="price-label" v-if="item.isUnlock">
											<image src="../../static/pic/fontpage/price-outline.png" mode="" class="labelbg"></image>
											<text class="unlocked" v-if="item.isUnlock">已解锁</text>
										</view>
									</view>
									<!-- 用户头像，标签 -->
									<view class="user" @click.stop="switchToUserpage(item.openId)">
										<!-- 头像 -->
										<image :src="`${baseUrl}/file/${item.userPot}`" mode="aspectFill"></image>
										<!-- 用户昵称 -->
										<view>
											<view class="upArea">
												<text>{{item.userName}}</text>
											</view>
											<!-- 全职以及实习标签 -->
											<view class="downArea">
												<text class="fulltime" v-for="(offer,i) in item.fulltime" :key="i">{{offer}}</text>
												<text v-for="(offer,i) in item.internship" :key="i">{{offer}}</text>
											</view>
										</view>
									</view>
									<!-- 点赞及转发 -->
									<view style="height: 100upx;display: flex;align-items: center;">
										<!-- 点赞及转发 -->
										<view class="like">
											<view class="sharebutton">

												<button open-type="share" @click.stop="shareButtonClick" :data-postid="item.interviewexperienceId"></button>
												<image src="../../static/pic/fontpage/plane.svg" mode=""></image>
											</view>

											<image :src="item.isCollect?'../../static/pic/fontpage/heart.png':'../../static/pic/fontpage/heart-outline.png'"
											 @click.stop="likeClick(item.interviewexperienceId,item.title,item.openId,item.type,item.isCollect,i,'right',item.userPot)"
											 class="likeImg"></image>
											<text>{{item.colNum}}</text>
										</view>
									</view>
									<!-- 背景图 -->
									<view class="bgimage-left" v-if="item.type === 2 || item.type === 3">
										<image :src="item.type === 2?'../../static/pic/fontpage/bg3.svg':'../../static/pic/fontpage/bg2.svg'" mode=""
										 class="bgimage-left"></image>
									</view>

									<view class="bgimage-right" v-if="item.type === 0 || item.type === 1">
										<image :src="item.type === 0?'../../static/pic/fontpage/bg1.svg':'../../static/pic/fontpage/bg4.svg'" mode=""
										 class="bgimage-right"></image>
									</view>
								</view>

								<!-- 		<view class="advertisement">
										<image src="../../static/pic/fontpage/advertisement.png" mode=""></image>
									</view> -->

							</view>
							
							
						</view>
						<!-- 到底了 -->
						<view class="rearch-bottom" v-if="fontCurrentPageNum === fontTotalPageNum">
							到底啦 :D
						</view>
						<!-- 占位块 -->
						<view style="height: 120upx;clear: both;">
						</view>
					</scroll-view>
				
				<!-- 未搜索到任何东西的样式 -->
				<view class="search-nothing" v-if="fontSearchFlag">
					<view>
						<image src="../../static/pic/detail/peers.png" mode=""></image>
						没有搜索到相关内容，换一个关键词试试看!
					</view>
				</view>
				</swiper-item>
				<!-- 互联网开头 -->
				<swiper-item>
					<scroll-view scroll-y="true" style="height: 100%;" :refresher-enabled="true" @scrolltolower="scrollToBottom2"
					 @refresherrefresh="refreshFontpage2" :refresher-triggered="isRefreshed2" :refresher-threshold="1"
					 @refresherrestore="onRestore2" lower-threshold="200" v-if="!interSearchFlag">
						<view class="left-body">
							<!-- 有封面 -->
							<view v-for="(item,i) in internetLeft" :key="i">
								<view class="has-cover" @click="switchToDetail(item.interviewexperienceId,item.isCollect,item.isUnlock,i,'inter-left',item.colNum,item.openId)"
								 v-if="item.cover !== ''&& item.cover !== null">
									<!-- 背景图 -->
									<view class="bgimage-right" v-if="item.type === 0 || item.type === 1">
										<image :src="item.type === 0?' ../../static/pic/fontpage/bg1.svg':'../../static/pic/fontpage/bg4.svg'" class="bgimage-right"></image>
									</view>
									<view class="bgimage-left" v-if="item.type === 2 || item.type === 3">
										<image :src="item.type === 2?' ../../static/pic/fontpage/bg3.svg':'../../static/pic/fontpage/bg2.svg'" class="bgimage-left"></image>
									</view>
									<!-- 清除浮动 -->
									<view style="overflow: hidden;">

									</view>
									<!-- 用户头像，标签 -->
									<view class="user" @click.stop="switchToUserpage(item.openId)">
										<!-- 头像 -->
										<image :src="`${baseUrl}/file/${item.userPot}`" mode="aspectFill"></image>
										<!-- 用户昵称 -->
										<view>
											<view class="upArea">
												<text>{{item.userName}}</text>
											</view>
											<!-- 全职以及实习标签 -->
											<view class="downArea">
												<text class="fulltime" v-for="(offer,i) in item.fulltime" :key="i">{{offer}}</text>
												<text v-for="(offer,i) in item.internship" :key="i">{{offer}}</text>
											</view>
										</view>
									</view>
									<!-- 封面及详情 -->
									<view class="cover">
										<view class="cover-image">
											<image :src="`${baseUrl}/file/${item.cover}`" mode="aspectFill"></image>
											<!-- 价格标签未解锁 -->
											<view class="price-label" v-if="!item.isUnlock">
												<!-- 免费 -->
												<text class="free" v-if="item.price === 0">FREE!</text>
												<!-- 付费 -->
												<view class="not-free" v-if="item.price !== 0">
													<image src="../../static/pic/fontpage/peer2x.png" mode="" class="peers"></image>
													<text class="price">x{{item.price}}</text>
												</view>

												<!-- 价格背景label -->
												<image :src="item.price === 0?'../../static/pic/fontpage/price-free.png':'../../static/pic/fontpage/price-outline.png'"
												 mode="" class="labelbg"></image>
											</view>
											<!-- 价格标签解锁后 -->
											<view class="price-label" v-if="item.isUnlock">
												<image src="../../static/pic/fontpage/price-outline.png" mode="" class="labelbg"></image>
												<text class="unlocked" v-if="item.isUnlock">已解锁</text>
											</view>
										</view>
										<view style="overflow: hidden;">

										</view>

										<view style="margin-top: 24upx;">
											<text>{{item.title}}</text>
											<text>{{item.summary}}</text>
											<!-- 	<text>三张财报系统介绍，详情页免费获取链接...</text> -->
										</view>
									</view>

									<view style="height: 100upx;display: flex;align-items: center;">
										<!-- 点赞及转发 -->
										<view class="like">
											<view class="sharebutton">
												<button open-type="share" @click.stop="shareButtonClick" :data-postid="item.interviewexperienceId"></button>
												<image src="../../static/pic/fontpage/plane.svg" mode=""></image>
											</view>
											<image :src="item.isCollect?'../../static/pic/fontpage/heart.png':'../../static/pic/fontpage/heart-outline.png'"
											 @click.stop="likeClick(item.interviewexperienceId,item.title,item.openId,item.type,item.isCollect,i,'left',item.userPot)"
											 class="likeImg"></image>
											<text>{{item.colNum}}</text>
										</view>
									</view>
								</view>
								<!-- 讲座、经历无封面 -->
								<view class="no-cover" @click="switchToDetail(item.interviewexperienceId,item.isCollect,item.isUnlock,i,'inter-left',item.colNum,item.openId)"
								 v-if="item.cover === '' || item.cover === null">
									<!-- 占位 -->
									<view style="overflow: hidden;">

									</view>
									<!-- 标题 -->
									<view class="title">
										<text>{{item.title}}</text>
										<!-- <text>直播/录播</text> -->
									</view>
									<!-- 时间及人数 -->

									<!-- 详情及解锁 -->
									<view class="info">
										<text>{{item.summary}}</text>
										<!-- <text>解锁查看更多资料！</text> -->
										<!-- 价格标签 -->
										<!-- 价格标签未解锁 -->
										<view class="price-label" v-if="!item.isUnlock">
											<!-- 免费 -->
											<text class="free" v-if="item.price === 0">FREE!</text>
											<!-- 付费 -->
											<view class="not-free" v-if="item.price !== 0">
												<image src="../../static/pic/fontpage/peer2x.png" mode="" class="peers"></image>
												<text class="price">x{{item.price}}</text>
											</view>

											<!-- 价格背景label -->
											<image :src="item.price === 0?'../../static/pic/fontpage/price-free.png':'../../static/pic/fontpage/price-outline.png'"
											 mode="" class="labelbg"></image>
										</view>
										<!-- 价格标签解锁后 -->
										<view class="price-label" v-if="item.isUnlock">
											<image src="../../static/pic/fontpage/price-outline.png" mode="" class="labelbg"></image>
											<text class="unlocked" v-if="item.isUnlock">已解锁</text>
										</view>
									</view>
									<!-- 用户头像，标签 -->
									<view class="user" @click.stop="switchToUserpage(item.openId)">
										<!-- 头像 -->
										<image :src="`${baseUrl}/file/${item.userPot}`" mode="aspectFill"></image>
										<!-- 用户昵称 -->
										<view>
											<view class="upArea">
												<text>{{item.userName}}</text>
											</view>
											<!-- 全职以及实习标签 -->
											<view class="downArea">
												<text class="fulltime" v-for="(offer,i) in item.fulltime" :key="i">{{offer}}</text>
												<text v-for="(offer,i) in item.internship" :key="i">{{offer}}</text>
											</view>
										</view>
									</view>
									<!-- 点赞及转发 -->
									<view style="height: 100upx;display: flex;align-items: center;">
										<!-- 点赞及转发 -->
										<view class="like">
											<view class="sharebutton">

												<button open-type="share" @click.stop="shareButtonClick" :data-postid="item.interviewexperienceId"></button>
												<image src="../../static/pic/fontpage/plane.svg" mode=""></image>
											</view>
											<image :src="item.isCollect?'../../static/pic/fontpage/heart.png':'../../static/pic/fontpage/heart-outline.png'"
											 @click.stop="likeClick(item.interviewexperienceId,item.title,item.openId,item.type,item.isCollect,i,'left',item.userPot)"
											 class="likeImg"></image>
											<text>{{item.colNum}}</text>
										</view>
									</view>
									<!-- 背景图 -->
									<view class="bgimage-left" v-if="item.type === 2 || item.type === 3">
										<image :src="item.type === 2?'../../static/pic/fontpage/bg3.svg':'../../static/pic/fontpage/bg2.svg'" mode=""
										 class="bgimage-left"></image>
									</view>

									<view class="bgimage-right" v-if="item.type === 0 || item.type === 1">
										<image :src="item.type === 0?'../../static/pic/fontpage/bg1.svg':'../../static/pic/fontpage/bg4.svg'" mode=""
										 class="bgimage-right"></image>
									</view>
								</view>
							</view>
							<!-- 占位块 -->
							<view style="height: 120upx;clear: both;">
							</view>
						</view>

						<view class="right-body">
							<!-- 有封面 -->
							<view v-for="(item,i) in internetRight" :key="i">
								<view class="has-cover" @click="switchToDetail(item.interviewexperienceId,item.isCollect,item.isUnlock,i,'inter-right',item.colNum,item.openId)"
								 v-if="item.cover !== ''&& item.cover !== null">
									<!-- 背景图 -->
									<view class="bgimage-right" v-if="item.type === 0 || item.type === 1">
										<image :src="item.type === 0?' ../../static/pic/fontpage/bg1.svg':'../../static/pic/fontpage/bg4.svg'" class="bgimage-right"></image>
									</view>
									<view class="bgimage-left" v-if="item.type === 2 || item.type === 3">
										<image :src="item.type === 2?' ../../static/pic/fontpage/bg3.svg':'../../static/pic/fontpage/bg2.svg'" class="bgimage-left"></image>
									</view>
									<!-- 清除浮动 -->
									<view style="overflow: hidden;">

									</view>
									<!-- 用户头像，标签 -->
									<view class="user" @click.stop="switchToUserpage(item.openId)">
										<!-- 头像 -->
										<image :src="`${baseUrl}/file/${item.userPot}`" mode="aspectFill"></image>
										<!-- 用户昵称 -->
										<view>
											<view class="upArea">
												<text>{{item.userName}}</text>
											</view>
											<!-- 全职以及实习标签 -->
											<view class="downArea">
												<text class="fulltime" v-for="(offer,i) in item.fulltime" :key="i">{{offer}}</text>
												<text v-for="(offer,i) in item.internship" :key="i">{{offer}}</text>
											</view>
										</view>
									</view>
									<!-- 封面及详情 -->
									<view class="cover">
										<view class="cover-image">
											<image :src="`${baseUrl}/file/${item.cover}`" mode="aspectFill"></image>
											<!-- 价格标签未解锁 -->
											<view class="price-label" v-if="!item.isUnlock">
												<!-- 免费 -->
												<text class="free" v-if="item.price === 0">FREE!</text>
												<!-- 付费 -->
												<view class="not-free" v-if="item.price !== 0">
													<image src="../../static/pic/fontpage/peer2x.png" mode="" class="peers"></image>
													<text class="price">x{{item.price}}</text>
												</view>

												<!-- 价格背景label -->
												<image :src="item.price === 0?'../../static/pic/fontpage/price-free.png':'../../static/pic/fontpage/price-outline.png'"
												 mode="" class="labelbg"></image>
											</view>
											<!-- 价格标签解锁后 -->
											<view class="price-label" v-if="item.isUnlock">
												<image src="../../static/pic/fontpage/price-outline.png" mode="" class="labelbg"></image>
												<text class="unlocked" v-if="item.isUnlock">已解锁</text>
											</view>
										</view>
										<view style="overflow: hidden;">

										</view>

										<view style="margin-top: 24upx;">
											<text>{{item.title}}</text>
											<text>{{item.summary}}</text>
											<!-- 	<text>三张财报系统介绍，详情页免费获取链接...</text> -->
										</view>
									</view>

									<view style="height: 100upx;display: flex;align-items: center;">
										<!-- 点赞及转发 -->
										<view class="like">
											<view class="sharebutton">

												<button open-type="share" @click.stop="shareButtonClick" :data-postid="item.interviewexperienceId"></button>
												<image src="../../static/pic/fontpage/plane.svg" mode=""></image>
											</view>

											<image :src="item.isCollect?'../../static/pic/fontpage/heart.png':'../../static/pic/fontpage/heart-outline.png'"
											 @click.stop="likeClick(item.interviewexperienceId,item.title,item.openId,item.type,item.isCollect,i,'right',item.userPot)"
											 class="likeImg"></image>
											<text>{{item.colNum}}</text>
										</view>
									</view>
								</view>
								<!-- 讲座、经历无封面 -->
								<view class="no-cover" @click="switchToDetail(item.interviewexperienceId,item.isCollect,item.isUnlock,i,'inter-right',item.colNum,item.openId)"
								 v-if="item.cover === '' || item.cover === null">
									<!-- 占位 -->
									<view style="overflow: hidden;">

									</view>
									<!-- 标题 -->
									<view class="title">
										<text>{{item.title}}</text>
										<!-- <text>直播/录播</text> -->
									</view>
									<!-- 时间及人数 -->

									<!-- 详情及解锁 -->
									<view class="info">
										<text>{{item.summary}}</text>
										<!-- <text>解锁查看更多资料！</text> -->
										<!-- 价格标签未解锁 -->
										<view class="price-label" v-if="!item.isUnlock">
											<!-- 免费 -->
											<text class="free" v-if="item.price === 0">FREE!</text>
											<!-- 付费 -->
											<view class="not-free" v-if="item.price !== 0">
												<image src="../../static/pic/fontpage/peer2x.png" mode="" class="peers"></image>
												<text class="price">x{{item.price}}</text>
											</view>

											<!-- 价格背景label -->
											<image :src="item.price === 0?'../../static/pic/fontpage/price-free.png':'../../static/pic/fontpage/price-outline.png'"
											 mode="" class="labelbg"></image>
										</view>
										<!-- 价格标签解锁后 -->
										<view class="price-label" v-if="item.isUnlock">
											<image src="../../static/pic/fontpage/price-outline.png" mode="" class="labelbg"></image>
											<text class="unlocked" v-if="item.isUnlock">已解锁</text>
										</view>
									</view>
									<!-- 用户头像，标签 -->
									<view class="user" @click.stop="switchToUserpage(item.openId)">
										<!-- 头像 -->
										<image :src="`${baseUrl}/file/${item.userPot}`" mode="aspectFill"></image>
										<!-- 用户昵称 -->
										<view>
											<view class="upArea">
												<text>{{item.userName}}</text>
											</view>
											<!-- 全职以及实习标签 -->
											<view class="downArea">
												<text class="fulltime" v-for="(offer,i) in item.fulltime" :key="i">{{offer}}</text>
												<text v-for="(offer,i) in item.internship" :key="i">{{offer}}</text>
											</view>
										</view>
									</view>
									<!-- 点赞及转发 -->
									<view style="height: 100upx;display: flex;align-items: center;">
										<!-- 点赞及转发 -->
										<view class="like">
											<view class="sharebutton">

												<button open-type="share" @click.stop="shareButtonClick" :data-postid="item.interviewexperienceId"></button>
												<image src="../../static/pic/fontpage/plane.svg" mode=""></image>
											</view>

											<image :src="item.isCollect?'../../static/pic/fontpage/heart.png':'../../static/pic/fontpage/heart-outline.png'"
											 @click.stop="likeClick(item.interviewexperienceId,item.title,item.openId,item.type,item.isCollect,i,'right',item.userPot)"
											 class="likeImg"></image>
											<text>{{item.colNum}}</text>
										</view>
									</view>
									<!-- 背景图 -->
									<view class="bgimage-left" v-if="item.type === 2 || item.type === 3">
										<image :src="item.type === 2?'../../static/pic/fontpage/bg3.svg':'../../static/pic/fontpage/bg2.svg'" mode=""
										 class="bgimage-left"></image>
									</view>

									<view class="bgimage-right" v-if="item.type === 0 || item.type === 1">
										<image :src="item.type === 0?'../../static/pic/fontpage/bg1.svg':'../../static/pic/fontpage/bg4.svg'" mode=""
										 class="bgimage-right"></image>
									</view>
								</view>

								<!-- 		<view class="advertisement">
										<image src="../../static/pic/fontpage/advertisement.png" mode=""></image>
									</view> -->

							</view>
							
						</view>
						<!-- 到底了 -->
						<view class="rearch-bottom" v-if="internetCurrentPageNum === internetTotalPageNum">
							到底啦 :D
						</view>
						<!-- 占位块 -->
						<view style="height: 120upx;clear: both;">
						</view>
					</scroll-view>

				<!-- 未搜索到任何东西的样式 -->
				<view class="search-nothing" v-if="interSearchFlag">
					<view>
						<image src="../../static/pic/detail/peers.png" mode=""></image>
						没有搜索到相关内容，换一个关键词试试看!
					</view>
				</view>
				</swiper-item>
				<!-- 金融开头 -->
				<swiper-item>
					<scroll-view scroll-y="true" style="height: 100%;" :refresher-enabled="true" @scrolltolower="scrollToBottom3"
					 @refresherrefresh="refreshFontpage3" :refresher-triggered="isRefreshed3" :refresher-threshold="1"
					 @refresherrestore="onRestore3" lower-threshold="200" v-if="!financeSearchFlag">
						<view class="left-body">
							<!-- 有封面 -->
							<view v-for="(item,i) in financeLeft" :key="i">
								<view class="has-cover" @click="switchToDetail(item.interviewexperienceId,item.isCollect,item.isUnlock,i,'fin-left',item.colNum,item.openId)"
								 v-if="item.cover !== ''&& item.cover !== null">
									<!-- 背景图 -->
									<view class="bgimage-right" v-if="item.type === 0 || item.type === 1">
										<image :src="item.type === 0?' ../../static/pic/fontpage/bg1.svg':'../../static/pic/fontpage/bg4.svg'" class="bgimage-right"></image>
									</view>
									<view class="bgimage-left" v-if="item.type === 2 || item.type === 3">
										<image :src="item.type === 2?' ../../static/pic/fontpage/bg3.svg':'../../static/pic/fontpage/bg2.svg'" class="bgimage-left"></image>
									</view>
									<!-- 清除浮动 -->
									<view style="overflow: hidden;">

									</view>
									<!-- 用户头像，标签 -->
									<view class="user" @click.stop="switchToUserpage(item.openId)">
										<!-- 头像 -->
										<image :src="`${baseUrl}/file/${item.userPot}`" mode="aspectFill"></image>
										<!-- 用户昵称 -->
										<view>
											<view class="upArea">
												<text>{{item.userName}}</text>
											</view>
											<!-- 全职以及实习标签 -->
											<view class="downArea">
												<text class="fulltime" v-for="(offer,i) in item.fulltime" :key="i">{{offer}}</text>
												<text v-for="(offer,i) in item.internship" :key="i">{{offer}}</text>
											</view>
										</view>
									</view>
									<!-- 封面及详情 -->
									<view class="cover">
										<view class="cover-image">
											<image :src="`${baseUrl}/file/${item.cover}`" mode="aspectFill"></image>
											<!-- 价格标签未解锁 -->
											<view class="price-label" v-if="!item.isUnlock">
												<!-- 免费 -->
												<text class="free" v-if="item.price === 0">FREE!</text>
												<!-- 付费 -->
												<view class="not-free" v-if="item.price !== 0">
													<image src="../../static/pic/fontpage/peer2x.png" mode="" class="peers"></image>
													<text class="price">x{{item.price}}</text>
												</view>

												<!-- 价格背景label -->
												<image :src="item.price === 0?'../../static/pic/fontpage/price-free.png':'../../static/pic/fontpage/price-outline.png'"
												 mode="" class="labelbg"></image>
											</view>
											<!-- 价格标签解锁后 -->
											<view class="price-label" v-if="item.isUnlock">
												<image src="../../static/pic/fontpage/price-outline.png" mode="" class="labelbg"></image>
												<text class="unlocked" v-if="item.isUnlock">已解锁</text>
											</view>
										</view>
										<view style="overflow: hidden;">

										</view>

										<view style="margin-top: 24upx;">
											<text>{{item.title}}</text>
											<text>{{item.summary}}</text>
											<!-- 	<text>三张财报系统介绍，详情页免费获取链接...</text> -->
										</view>
									</view>

									<view style="height: 100upx;display: flex;align-items: center;">
										<!-- 点赞及转发 -->
										<view class="like">
											<view class="sharebutton">
												<button open-type="share" @click.stop="shareButtonClick" :data-postid="item.interviewexperienceId"></button>
												<image src="../../static/pic/fontpage/plane.svg" mode=""></image>
											</view>
											<image :src="item.isCollect?'../../static/pic/fontpage/heart.png':'../../static/pic/fontpage/heart-outline.png'"
											 @click.stop="likeClick(item.interviewexperienceId,item.title,item.openId,item.type,item.isCollect,i,'left',item.userPot)"
											 class="likeImg"></image>
											<text>{{item.colNum}}</text>
										</view>
									</view>
								</view>
								<!-- 讲座、经历无封面 -->
								<view class="no-cover" @click="switchToDetail(item.interviewexperienceId,item.isCollect,item.isUnlock,i,'fin-left',item.colNum,item.openId)"
								 v-if="item.cover === '' || item.cover === null">
									<!-- 占位 -->
									<view style="overflow: hidden;">

									</view>
									<!-- 标题 -->
									<view class="title">
										<text>{{item.title}}</text>
										<!-- <text>直播/录播</text> -->
									</view>
									<!-- 时间及人数 -->

									<!-- 详情及解锁 -->
									<view class="info">
										<text>{{item.summary}}</text>
										<!-- <text>解锁查看更多资料！</text> -->
										<!-- 价格标签 -->
										<!-- 价格标签未解锁 -->
										<view class="price-label" v-if="!item.isUnlock">
											<!-- 免费 -->
											<text class="free" v-if="item.price === 0">FREE!</text>
											<!-- 付费 -->
											<view class="not-free" v-if="item.price !== 0">
												<image src="../../static/pic/fontpage/peer2x.png" mode="" class="peers"></image>
												<text class="price">x{{item.price}}</text>
											</view>

											<!-- 价格背景label -->
											<image :src="item.price === 0?'../../static/pic/fontpage/price-free.png':'../../static/pic/fontpage/price-outline.png'"
											 mode="" class="labelbg"></image>
										</view>
										<!-- 价格标签解锁后 -->
										<view class="price-label" v-if="item.isUnlock">
											<image src="../../static/pic/fontpage/price-outline.png" mode="" class="labelbg"></image>
											<text class="unlocked" v-if="item.isUnlock">已解锁</text>
										</view>
									</view>
									<!-- 用户头像，标签 -->
									<view class="user" @click.stop="switchToUserpage(item.openId)">
										<!-- 头像 -->
										<image :src="`${baseUrl}/file/${item.userPot}`" mode="aspectFill"></image>
										<!-- 用户昵称 -->
										<view>
											<view class="upArea">
												<text>{{item.userName}}</text>
											</view>
											<!-- 全职以及实习标签 -->
											<view class="downArea">
												<text class="fulltime" v-for="(offer,i) in item.fulltime" :key="i">{{offer}}</text>
												<text v-for="(offer,i) in item.internship" :key="i">{{offer}}</text>
											</view>
										</view>
									</view>
									<!-- 点赞及转发 -->
									<view style="height: 100upx;display: flex;align-items: center;">
										<!-- 点赞及转发 -->
										<view class="like">
											<view class="sharebutton">

												<button open-type="share" @click.stop="shareButtonClick" :data-postid="item.interviewexperienceId"></button>
												<image src="../../static/pic/fontpage/plane.svg" mode=""></image>
											</view>
											<image :src="item.isCollect?'../../static/pic/fontpage/heart.png':'../../static/pic/fontpage/heart-outline.png'"
											 @click.stop="likeClick(item.interviewexperienceId,item.title,item.openId,item.type,item.isCollect,i,'left',item.userPot)"
											 class="likeImg"></image>
											<text>{{item.colNum}}</text>
										</view>
									</view>
									<!-- 背景图 -->
									<view class="bgimage-left" v-if="item.type === 2 || item.type === 3">
										<image :src="item.type === 2?'../../static/pic/fontpage/bg3.svg':'../../static/pic/fontpage/bg2.svg'" mode=""
										 class="bgimage-left"></image>
									</view>

									<view class="bgimage-right" v-if="item.type === 0 || item.type === 1">
										<image :src="item.type === 0?'../../static/pic/fontpage/bg1.svg':'../../static/pic/fontpage/bg4.svg'" mode=""
										 class="bgimage-right"></image>
									</view>
								</view>
							</view>
							<!-- 占位块 -->
							<view style="height: 120upx;clear: both;">
							</view>
						</view>

						<view class="right-body">
							<!-- 有封面 -->
							<view v-for="(item,i) in financeRight" :key="i">
								<view class="has-cover" @click="switchToDetail(item.interviewexperienceId,item.isCollect,item.isUnlock,i,'fin-right',item.colNum,item.openId)"
								 v-if="item.cover !== ''&& item.cover !== null">
									<!-- 背景图 -->
									<view class="bgimage-right" v-if="item.type === 0 || item.type === 1">
										<image :src="item.type === 0?' ../../static/pic/fontpage/bg1.svg':'../../static/pic/fontpage/bg4.svg'" class="bgimage-right"></image>
									</view>
									<view class="bgimage-left" v-if="item.type === 2 || item.type === 3">
										<image :src="item.type === 2?' ../../static/pic/fontpage/bg3.svg':'../../static/pic/fontpage/bg2.svg'" class="bgimage-left"></image>
									</view>
									<!-- 清除浮动 -->
									<view style="overflow: hidden;">

									</view>
									<!-- 用户头像，标签 -->
									<view class="user" @click.stop="switchToUserpage(item.openId)">
										<!-- 头像 -->
										<image :src="`${baseUrl}/file/${item.userPot}`" mode="aspectFill"></image>
										<!-- 用户昵称 -->
										<view>
											<view class="upArea">
												<text>{{item.userName}}</text>
											</view>
											<!-- 全职以及实习标签 -->
											<view class="downArea">
												<text class="fulltime" v-for="(offer,i) in item.fulltime" :key="i">{{offer}}</text>
												<text v-for="(offer,i) in item.internship" :key="i">{{offer}}</text>
											</view>
										</view>
									</view>
									<!-- 封面及详情 -->
									<view class="cover">
										<view class="cover-image">
											<image :src="`${baseUrl}/file/${item.cover}`" mode="aspectFill"></image>
											<!-- 价格标签未解锁 -->
											<view class="price-label" v-if="!item.isUnlock">
												<!-- 免费 -->
												<text class="free" v-if="item.price === 0">FREE!</text>
												<!-- 付费 -->
												<view class="not-free" v-if="item.price !== 0">
													<image src="../../static/pic/fontpage/peer2x.png" mode="" class="peers"></image>
													<text class="price">x{{item.price}}</text>
												</view>

												<!-- 价格背景label -->
												<image :src="item.price === 0?'../../static/pic/fontpage/price-free.png':'../../static/pic/fontpage/price-outline.png'"
												 mode="" class="labelbg"></image>
											</view>
											<!-- 价格标签解锁后 -->
											<view class="price-label" v-if="item.isUnlock">
												<image src="../../static/pic/fontpage/price-outline.png" mode="" class="labelbg"></image>
												<text class="unlocked" v-if="item.isUnlock">已解锁</text>
											</view>
										</view>
										<view style="overflow: hidden;">

										</view>

										<view style="margin-top: 24upx;">
											<text>{{item.title}}</text>
											<text>{{item.summary}}</text>
											<!-- 	<text>三张财报系统介绍，详情页免费获取链接...</text> -->
										</view>
									</view>

									<view style="height: 100upx;display: flex;align-items: center;">
										<!-- 点赞及转发 -->
										<view class="like">
											<view class="sharebutton">

												<button open-type="share" @click.stop="shareButtonClick" :data-postid="item.interviewexperienceId"></button>
												<image src="../../static/pic/fontpage/plane.svg" mode=""></image>
											</view>

											<image :src="item.isCollect?'../../static/pic/fontpage/heart.png':'../../static/pic/fontpage/heart-outline.png'"
											 @click.stop="likeClick(item.interviewexperienceId,item.title,item.openId,item.type,item.isCollect,i,'right',item.userPot)"
											 class="likeImg"></image>
											<text>{{item.colNum}}</text>
										</view>
									</view>
								</view>
								<!-- 讲座、经历无封面 -->
								<view class="no-cover" @click="switchToDetail(item.interviewexperienceId,item.isCollect,item.isUnlock,i,'fin-right',item.colNum,item.openId)"
								 v-if="item.cover === '' || item.cover === null">
									<!-- 占位 -->
									<view style="overflow: hidden;">

									</view>
									<!-- 标题 -->
									<view class="title">
										<text>{{item.title}}</text>
										<!-- <text>直播/录播</text> -->
									</view>
									<!-- 时间及人数 -->

									<!-- 详情及解锁 -->
									<view class="info">
										<text>{{item.summary}}</text>
										<!-- <text>解锁查看更多资料！</text> -->
										<!-- 价格标签未解锁 -->
										<view class="price-label" v-if="!item.isUnlock">
											<!-- 免费 -->
											<text class="free" v-if="item.price === 0">FREE!</text>
											<!-- 付费 -->
											<view class="not-free" v-if="item.price !== 0">
												<image src="../../static/pic/fontpage/peer2x.png" mode="" class="peers"></image>
												<text class="price">x{{item.price}}</text>
											</view>

											<!-- 价格背景label -->
											<image :src="item.price === 0?'../../static/pic/fontpage/price-free.png':'../../static/pic/fontpage/price-outline.png'"
											 mode="" class="labelbg"></image>
										</view>
										<!-- 价格标签解锁后 -->
										<view class="price-label" v-if="item.isUnlock">
											<image src="../../static/pic/fontpage/price-outline.png" mode="" class="labelbg"></image>
											<text class="unlocked" v-if="item.isUnlock">已解锁</text>
										</view>
									</view>
									<!-- 用户头像，标签 -->
									<view class="user" @click.stop="switchToUserpage(item.openId)">
										<!-- 头像 -->
										<image :src="`${baseUrl}/file/${item.userPot}`" mode="aspectFill"></image>
										<!-- 用户昵称 -->
										<view>
											<view class="upArea">
												<text>{{item.userName}}</text>
											</view>
											<!-- 全职以及实习标签 -->
											<view class="downArea">
												<text class="fulltime" v-for="(offer,i) in item.fulltime" :key="i">{{offer}}</text>
												<text v-for="(offer,i) in item.internship" :key="i">{{offer}}</text>
											</view>
										</view>
									</view>
									<!-- 点赞及转发 -->
									<view style="height: 100upx;display: flex;align-items: center;">
										<!-- 点赞及转发 -->
										<view class="like">
											<view class="sharebutton">

												<button open-type="share" @click.stop="shareButtonClick" :data-postid="item.interviewexperienceId"></button>
												<image src="../../static/pic/fontpage/plane.svg" mode=""></image>
											</view>

											<image :src="item.isCollect?'../../static/pic/fontpage/heart.png':'../../static/pic/fontpage/heart-outline.png'"
											 @click.stop="likeClick(item.interviewexperienceId,item.title,item.openId,item.type,item.isCollect,i,'right',item.userPot)"
											 class="likeImg"></image>
											<text>{{item.colNum}}</text>
										</view>
									</view>
									<!-- 背景图 -->
									<view class="bgimage-left" v-if="item.type === 2 || item.type === 3">
										<image :src="item.type === 2?'../../static/pic/fontpage/bg3.svg':'../../static/pic/fontpage/bg2.svg'" mode=""
										 class="bgimage-left"></image>
									</view>

									<view class="bgimage-right" v-if="item.type === 0 || item.type === 1">
										<image :src="item.type === 0?'../../static/pic/fontpage/bg1.svg':'../../static/pic/fontpage/bg4.svg'" mode=""
										 class="bgimage-right"></image>
									</view>
								</view>

								<!-- 		<view class="advertisement">
										<image src="../../static/pic/fontpage/advertisement.png" mode=""></image>
									</view> -->

							</view>
							
						</view>
						<!-- 到底了 -->
						<view class="rearch-bottom" v-if="financeCurrentPageNum === financeTotalPageNum">
							到底啦 :D
						</view>
						<!-- 占位块 -->
						<view style="height: 120upx;clear: both;">
						</view>
					</scroll-view>

				<!-- 未搜索到任何东西的样式 -->
				<view class="search-nothing" v-if="financeSearchFlag">
					<view>
						<image src="../../static/pic/detail/peers.png" mode=""></image>
						没有搜索到相关内容，换一个关键词试试看!
					</view>
				</view>
				</swiper-item>
				<!-- 咨询开头 -->
				<swiper-item>
					<scroll-view scroll-y="true" style="height: 100%;" :refresher-enabled="true" @scrolltolower="scrollToBottom4"
					 @refresherrefresh="refreshFontpage4" :refresher-triggered="isRefreshed4" :refresher-threshold="1"
					 @refresherrestore="onRestore4" lower-threshold="200" v-if="!consultSearchFlag">
						<view class="left-body">
							<!-- 有封面 -->
							<view v-for="(item,i) in consultLeft" :key="i">
								<view class="has-cover" @click="switchToDetail(item.interviewexperienceId,item.isCollect,item.isUnlock,i,'con-left',item.colNum,item.openId)"
								 v-if="item.cover !== ''&& item.cover !== null">
									<!-- 背景图 -->
									<view class="bgimage-right" v-if="item.type === 0 || item.type === 1">
										<image :src="item.type === 0?' ../../static/pic/fontpage/bg1.svg':'../../static/pic/fontpage/bg4.svg'" class="bgimage-right"></image>
									</view>
									<view class="bgimage-left" v-if="item.type === 2 || item.type === 3">
										<image :src="item.type === 2?' ../../static/pic/fontpage/bg3.svg':'../../static/pic/fontpage/bg2.svg'" class="bgimage-left"></image>
									</view>
									<!-- 清除浮动 -->
									<view style="overflow: hidden;">

									</view>
									<!-- 用户头像，标签 -->
									<view class="user" @click.stop="switchToUserpage(item.openId)">
										<!-- 头像 -->
										<image :src="`${baseUrl}/file/${item.userPot}`" mode="aspectFill"></image>
										<!-- 用户昵称 -->
										<view>
											<view class="upArea">
												<text>{{item.userName}}</text>
											</view>
											<!-- 全职以及实习标签 -->
											<view class="downArea">
												<text class="fulltime" v-for="(offer,i) in item.fulltime" :key="i">{{offer}}</text>
												<text v-for="(offer,i) in item.internship" :key="i">{{offer}}</text>
											</view>
										</view>
									</view>
									<!-- 封面及详情 -->
									<view class="cover">
										<view class="cover-image">
											<image :src="`${baseUrl}/file/${item.cover}`" mode="aspectFill"></image>
											<!-- 价格标签未解锁 -->
											<view class="price-label" v-if="!item.isUnlock">
												<!-- 免费 -->
												<text class="free" v-if="item.price === 0">FREE!</text>
												<!-- 付费 -->
												<view class="not-free" v-if="item.price !== 0">
													<image src="../../static/pic/fontpage/peer2x.png" mode="" class="peers"></image>
													<text class="price">x{{item.price}}</text>
												</view>

												<!-- 价格背景label -->
												<image :src="item.price === 0?'../../static/pic/fontpage/price-free.png':'../../static/pic/fontpage/price-outline.png'"
												 mode="" class="labelbg"></image>
											</view>
											<!-- 价格标签解锁后 -->
											<view class="price-label" v-if="item.isUnlock">
												<image src="../../static/pic/fontpage/price-outline.png" mode="" class="labelbg"></image>
												<text class="unlocked" v-if="item.isUnlock">已解锁</text>
											</view>
										</view>
										<view style="overflow: hidden;">

										</view>

										<view style="margin-top: 24upx;">
											<text>{{item.title}}</text>
											<text>{{item.summary}}</text>
											<!-- 	<text>三张财报系统介绍，详情页免费获取链接...</text> -->
										</view>
									</view>

									<view style="height: 100upx;display: flex;align-items: center;">
										<!-- 点赞及转发 -->
										<view class="like">
											<view class="sharebutton">
												<button open-type="share" @click.stop="shareButtonClick" :data-postid="item.interviewexperienceId"></button>
												<image src="../../static/pic/fontpage/plane.svg" mode=""></image>
											</view>
											<image :src="item.isCollect?'../../static/pic/fontpage/heart.png':'../../static/pic/fontpage/heart-outline.png'"
											 @click.stop="likeClick(item.interviewexperienceId,item.title,item.openId,item.type,item.isCollect,i,'left',item.userPot)"
											 class="likeImg"></image>
											<text>{{item.colNum}}</text>
										</view>
									</view>
								</view>
								<!-- 讲座、经历无封面 -->
								<view class="no-cover" @click="switchToDetail(item.interviewexperienceId,item.isCollect,item.isUnlock,i,'con-left',item.colNum,item.openId)"
								 v-if="item.cover === '' || item.cover === null">
									<!-- 占位 -->
									<view style="overflow: hidden;">

									</view>
									<!-- 标题 -->
									<view class="title">
										<text>{{item.title}}</text>
										<!-- <text>直播/录播</text> -->
									</view>
									<!-- 时间及人数 -->

									<!-- 详情及解锁 -->
									<view class="info">
										<text>{{item.summary}}</text>
										<!-- <text>解锁查看更多资料！</text> -->
										<!-- 价格标签 -->
										<!-- 价格标签未解锁 -->
										<view class="price-label" v-if="!item.isUnlock">
											<!-- 免费 -->
											<text class="free" v-if="item.price === 0">FREE!</text>
											<!-- 付费 -->
											<view class="not-free" v-if="item.price !== 0">
												<image src="../../static/pic/fontpage/peer2x.png" mode="" class="peers"></image>
												<text class="price">x{{item.price}}</text>
											</view>

											<!-- 价格背景label -->
											<image :src="item.price === 0?'../../static/pic/fontpage/price-free.png':'../../static/pic/fontpage/price-outline.png'"
											 mode="" class="labelbg"></image>
										</view>
										<!-- 价格标签解锁后 -->
										<view class="price-label" v-if="item.isUnlock">
											<image src="../../static/pic/fontpage/price-outline.png" mode="" class="labelbg"></image>
											<text class="unlocked" v-if="item.isUnlock">已解锁</text>
										</view>
									</view>
									<!-- 用户头像，标签 -->
									<view class="user" @click.stop="switchToUserpage(item.openId)">
										<!-- 头像 -->
										<image :src="`${baseUrl}/file/${item.userPot}`" mode="aspectFill"></image>
										<!-- 用户昵称 -->
										<view>
											<view class="upArea">
												<text>{{item.userName}}</text>
											</view>
											<!-- 全职以及实习标签 -->
											<view class="downArea">
												<text class="fulltime" v-for="(offer,i) in item.fulltime" :key="i">{{offer}}</text>
												<text v-for="(offer,i) in item.internship" :key="i">{{offer}}</text>
											</view>
										</view>
									</view>
									<!-- 点赞及转发 -->
									<view style="height: 100upx;display: flex;align-items: center;">
										<!-- 点赞及转发 -->
										<view class="like">
											<view class="sharebutton">

												<button open-type="share" @click.stop="shareButtonClick" :data-postid="item.interviewexperienceId"></button>
												<image src="../../static/pic/fontpage/plane.svg" mode=""></image>
											</view>
											<image :src="item.isCollect?'../../static/pic/fontpage/heart.png':'../../static/pic/fontpage/heart-outline.png'"
											 @click.stop="likeClick(item.interviewexperienceId,item.title,item.openId,item.type,item.isCollect,i,'left',item.userPot)"
											 class="likeImg"></image>
											<text>{{item.colNum}}</text>
										</view>
									</view>
									<!-- 背景图 -->
									<view class="bgimage-left" v-if="item.type === 2 || item.type === 3">
										<image :src="item.type === 2?'../../static/pic/fontpage/bg3.svg':'../../static/pic/fontpage/bg2.svg'" mode=""
										 class="bgimage-left"></image>
									</view>

									<view class="bgimage-right" v-if="item.type === 0 || item.type === 1">
										<image :src="item.type === 0?'../../static/pic/fontpage/bg1.svg':'../../static/pic/fontpage/bg4.svg'" mode=""
										 class="bgimage-right"></image>
									</view>
								</view>
							</view>
							<!-- 占位块 -->
							<view style="height: 120upx;clear: both;">
							</view>
						</view>

						<view class="right-body">
							<!-- 有封面 -->
							<view v-for="(item,i) in consultRight" :key="i">
								<view class="has-cover" @click="switchToDetail(item.interviewexperienceId,item.isCollect,item.isUnlock,i,'con-right',item.colNum,item.openId)"
								 v-if="item.cover !== '' && item.cover !== null">
									<!-- 背景图 -->
									<view class="bgimage-right" v-if="item.type === 0 || item.type === 1">
										<image :src="item.type === 0?' ../../static/pic/fontpage/bg1.svg':'../../static/pic/fontpage/bg4.svg'" class="bgimage-right"></image>
									</view>
									<view class="bgimage-left" v-if="item.type === 2 || item.type === 3">
										<image :src="item.type === 2?' ../../static/pic/fontpage/bg3.svg':'../../static/pic/fontpage/bg2.svg'" class="bgimage-left"></image>
									</view>
									<!-- 清除浮动 -->
									<view style="overflow: hidden;">

									</view>
									<!-- 用户头像，标签 -->
									<view class="user" @click.stop="switchToUserpage(item.openId)">
										<!-- 头像 -->
										<image :src="`${baseUrl}/file/${item.userPot}`" mode="aspectFill"></image>
										<!-- 用户昵称 -->
										<view>
											<view class="upArea">
												<text>{{item.userName}}</text>
											</view>
											<!-- 全职以及实习标签 -->
											<view class="downArea">
												<text class="fulltime" v-for="(offer,i) in item.fulltime" :key="i">{{offer}}</text>
												<text v-for="(offer,i) in item.internship" :key="i">{{offer}}</text>
											</view>
										</view>
									</view>
									<!-- 封面及详情 -->
									<view class="cover">
										<view class="cover-image">
											<image :src="`${baseUrl}/file/${item.cover}`" mode="aspectFill"></image>
											<!-- 价格标签未解锁 -->
											<view class="price-label" v-if="!item.isUnlock">
												<!-- 免费 -->
												<text class="free" v-if="item.price === 0">FREE!</text>
												<!-- 付费 -->
												<view class="not-free" v-if="item.price !== 0">
													<image src="../../static/pic/fontpage/peer2x.png" mode="" class="peers"></image>
													<text class="price">x{{item.price}}</text>
												</view>

												<!-- 价格背景label -->
												<image :src="item.price === 0?'../../static/pic/fontpage/price-free.png':'../../static/pic/fontpage/price-outline.png'"
												 mode="" class="labelbg"></image>
											</view>
											<!-- 价格标签解锁后 -->
											<view class="price-label" v-if="item.isUnlock">
												<image src="../../static/pic/fontpage/price-outline.png" mode="" class="labelbg"></image>
												<text class="unlocked" v-if="item.isUnlock">已解锁</text>
											</view>
										</view>
										<view style="overflow: hidden;">

										</view>

										<view style="margin-top: 24upx;">
											<text>{{item.title}}</text>
											<text>{{item.summary}}</text>
											<!-- 	<text>三张财报系统介绍，详情页免费获取链接...</text> -->
										</view>
									</view>

									<view style="height: 100upx;display: flex;align-items: center;">
										<!-- 点赞及转发 -->
										<view class="like">
											<view class="sharebutton">

												<button open-type="share" @click.stop="shareButtonClick" :data-postid="item.interviewexperienceId"></button>
												<image src="../../static/pic/fontpage/plane.svg" mode=""></image>
											</view>

											<image :src="item.isCollect?'../../static/pic/fontpage/heart.png':'../../static/pic/fontpage/heart-outline.png'"
											 @click.stop="likeClick(item.interviewexperienceId,item.title,item.openId,item.type,item.isCollect,i,'right',item.userPot)"
											 class="likeImg"></image>
											<text>{{item.colNum}}</text>
										</view>
									</view>
								</view>
								<!-- 讲座、经历无封面 -->
								<view class="no-cover" @click="switchToDetail(item.interviewexperienceId,item.isCollect,item.isUnlock,i,'con-right',item.colNum,item.openId)"
								 v-if="item.cover === '' || item.cover === null">
									<!-- 占位 -->
									<view style="overflow: hidden;">

									</view>
									<!-- 标题 -->
									<view class="title">
										<text>{{item.title}}</text>
										<!-- <text>直播/录播</text> -->
									</view>
									<!-- 时间及人数 -->

									<!-- 详情及解锁 -->
									<view class="info">
										<text>{{item.summary}}</text>
										<!-- <text>解锁查看更多资料！</text> -->
										<!-- 价格标签未解锁 -->
										<view class="price-label" v-if="!item.isUnlock">
											<!-- 免费 -->
											<text class="free" v-if="item.price === 0">FREE!</text>
											<!-- 付费 -->
											<view class="not-free" v-if="item.price !== 0">
												<image src="../../static/pic/fontpage/peer2x.png" mode="" class="peers"></image>
												<text class="price">x{{item.price}}</text>
											</view>

											<!-- 价格背景label -->
											<image :src="item.price === 0?'../../static/pic/fontpage/price-free.png':'../../static/pic/fontpage/price-outline.png'"
											 mode="" class="labelbg"></image>
										</view>
										<!-- 价格标签解锁后 -->
										<view class="price-label" v-if="item.isUnlock">
											<image src="../../static/pic/fontpage/price-outline.png" mode="" class="labelbg"></image>
											<text class="unlocked" v-if="item.isUnlock">已解锁</text>
										</view>
									</view>
									<!-- 用户头像，标签 -->
									<view class="user" @click.stop="switchToUserpage(item.openId)">
										<!-- 头像 -->
										<image :src="`${baseUrl}/file/${item.userPot}`" mode="aspectFill"></image>
										<!-- 用户昵称 -->
										<view>
											<view class="upArea">
												<text>{{item.userName}}</text>
											</view>
											<!-- 全职以及实习标签 -->
											<view class="downArea">
												<text class="fulltime" v-for="(offer,i) in item.fulltime" :key="i">{{offer}}</text>
												<text v-for="(offer,i) in item.internship" :key="i">{{offer}}</text>
											</view>
										</view>
									</view>
									<!-- 点赞及转发 -->
									<view style="height: 100upx;display: flex;align-items: center;">
										<!-- 点赞及转发 -->
										<view class="like">
											<view class="sharebutton">

												<button open-type="share" @click.stop="shareButtonClick" :data-postid="item.interviewexperienceId"></button>
												<image src="../../static/pic/fontpage/plane.svg" mode=""></image>
											</view>

											<image :src="item.isCollect?'../../static/pic/fontpage/heart.png':'../../static/pic/fontpage/heart-outline.png'"
											 @click.stop="likeClick(item.interviewexperienceId,item.title,item.openId,item.type,item.isCollect,i,'right',item.userPot)"
											 class="likeImg"></image>
											<text>{{item.colNum}}</text>
										</view>
									</view>
									<!-- 背景图 -->
									<view class="bgimage-left" v-if="item.type === 2 || item.type === 3">
										<image :src="item.type === 2?'../../static/pic/fontpage/bg3.svg':'../../static/pic/fontpage/bg2.svg'" mode=""
										 class="bgimage-left"></image>
									</view>

									<view class="bgimage-right" v-if="item.type === 0 || item.type === 1">
										<image :src="item.type === 0?'../../static/pic/fontpage/bg1.svg':'../../static/pic/fontpage/bg4.svg'" mode=""
										 class="bgimage-right"></image>
									</view>
								</view>

								<!-- 		<view class="advertisement">
										<image src="../../static/pic/fontpage/advertisement.png" mode=""></image>
									</view> -->

							</view>
							
						</view>
<!-- 到底了 -->
							<view class="rearch-bottom" v-if="consultCurrentPageNum === consultTotalPageNum">
								到底啦 :D
							</view>
							<!-- 占位块 -->
							<view style="height: 120upx;clear: both;">
							</view>
					</scroll-view>

				<!-- 未搜索到任何东西的样式 -->
				<view class="search-nothing" v-if="consultSearchFlag">
					<view>
						<image src="../../static/pic/detail/peers.png" mode=""></image>
						没有搜索到相关内容，换一个关键词试试看!
					</view>
				</view>
				</swiper-item>
				<!-- 快消开头 -->
				<swiper-item>
					<scroll-view scroll-y="true" style="height: 100%;" :refresher-enabled="true" @scrolltolower="scrollToBottom5"
					 @refresherrefresh="refreshFontpage5" :refresher-triggered="isRefreshed5" :refresher-threshold="1"
					 @refresherrestore="onRestore5" lower-threshold="200" v-if="!consumSearchFlag">
						<view class="left-body">
							<!-- 有封面 -->
							<view v-for="(item,i) in consumLeft" :key="i">
								<view class="has-cover" @click="switchToDetail(item.interviewexperienceId,item.isCollect,item.isUnlock,i,'consum-left',item.colNum,item.openId)"
								 v-if="item.cover !== '' && item.cover !== null">
									<!-- 背景图 -->
									<view class="bgimage-right" v-if="item.type === 0 || item.type === 1">
										<image :src="item.type === 0?' ../../static/pic/fontpage/bg1.svg':'../../static/pic/fontpage/bg4.svg'" class="bgimage-right"></image>
									</view>
									<view class="bgimage-left" v-if="item.type === 2 || item.type === 3">
										<image :src="item.type === 2?' ../../static/pic/fontpage/bg3.svg':'../../static/pic/fontpage/bg2.svg'" class="bgimage-left"></image>
									</view>
									<!-- 清除浮动 -->
									<view style="overflow: hidden;">

									</view>
									<!-- 用户头像，标签 -->
									<view class="user" @click.stop="switchToUserpage(item.openId)">
										<!-- 头像 -->
										<image :src="`${baseUrl}/file/${item.userPot}`" mode="aspectFill"></image>
										<!-- 用户昵称 -->
										<view>
											<view class="upArea">
												<text>{{item.userName}}</text>
											</view>
											<!-- 全职以及实习标签 -->
											<view class="downArea">
												<text class="fulltime" v-for="(offer,i) in item.fulltime" :key="i">{{offer}}</text>
												<text v-for="(offer,i) in item.internship" :key="i">{{offer}}</text>
											</view>
										</view>
									</view>
									<!-- 封面及详情 -->
									<view class="cover">
										<view class="cover-image">
											<image :src="`${baseUrl}/file/${item.cover}`" mode="aspectFill"></image>
											<!-- 价格标签未解锁 -->
											<view class="price-label" v-if="!item.isUnlock">
												<!-- 免费 -->
												<text class="free" v-if="item.price === 0">FREE!</text>
												<!-- 付费 -->
												<view class="not-free" v-if="item.price !== 0">
													<image src="../../static/pic/fontpage/peer2x.png" mode="" class="peers"></image>
													<text class="price">x{{item.price}}</text>
												</view>

												<!-- 价格背景label -->
												<image :src="item.price === 0?'../../static/pic/fontpage/price-free.png':'../../static/pic/fontpage/price-outline.png'"
												 mode="" class="labelbg"></image>
											</view>
											<!-- 价格标签解锁后 -->
											<view class="price-label" v-if="item.isUnlock">
												<image src="../../static/pic/fontpage/price-outline.png" mode="" class="labelbg"></image>
												<text class="unlocked" v-if="item.isUnlock">已解锁</text>
											</view>
										</view>
										<view style="overflow: hidden;">

										</view>

										<view style="margin-top: 24upx;">
											<text>{{item.title}}</text>
											<text>{{item.summary}}</text>
											<!-- 	<text>三张财报系统介绍，详情页免费获取链接...</text> -->
										</view>
									</view>

									<view style="height: 100upx;display: flex;align-items: center;">
										<!-- 点赞及转发 -->
										<view class="like">
											<view class="sharebutton">
												<button open-type="share" @click.stop="shareButtonClick" :data-postid="item.interviewexperienceId"></button>
												<image src="../../static/pic/fontpage/plane.svg" mode=""></image>
											</view>
											<image :src="item.isCollect?'../../static/pic/fontpage/heart.png':'../../static/pic/fontpage/heart-outline.png'"
											 @click.stop="likeClick(item.interviewexperienceId,item.title,item.openId,item.type,item.isCollect,i,'left',item.userPot)"
											 class="likeImg"></image>
											<text>{{item.colNum}}</text>
										</view>
									</view>
								</view>
								<!-- 讲座、经历无封面 -->
								<view class="no-cover" @click="switchToDetail(item.interviewexperienceId,item.isCollect,item.isUnlock,i,'consum-left',item.colNum,item.openId)"
								 v-if="item.cover === '' || item.cover === null">
									<!-- 占位 -->
									<view style="overflow: hidden;">

									</view>
									<!-- 标题 -->
									<view class="title">
										<text>{{item.title}}</text>
										<!-- <text>直播/录播</text> -->
									</view>
									<!-- 时间及人数 -->

									<!-- 详情及解锁 -->
									<view class="info">
										<text>{{item.summary}}</text>
										<!-- <text>解锁查看更多资料！</text> -->
										<!-- 价格标签 -->
										<!-- 价格标签未解锁 -->
										<view class="price-label" v-if="!item.isUnlock">
											<!-- 免费 -->
											<text class="free" v-if="item.price === 0">FREE!</text>
											<!-- 付费 -->
											<view class="not-free" v-if="item.price !== 0">
												<image src="../../static/pic/fontpage/peer2x.png" mode="" class="peers"></image>
												<text class="price">x{{item.price}}</text>
											</view>

											<!-- 价格背景label -->
											<image :src="item.price === 0?'../../static/pic/fontpage/price-free.png':'../../static/pic/fontpage/price-outline.png'"
											 mode="" class="labelbg"></image>
										</view>
										<!-- 价格标签解锁后 -->
										<view class="price-label" v-if="item.isUnlock">
											<image src="../../static/pic/fontpage/price-outline.png" mode="" class="labelbg"></image>
											<text class="unlocked" v-if="item.isUnlock">已解锁</text>
										</view>
									</view>
									<!-- 用户头像，标签 -->
									<view class="user" @click.stop="switchToUserpage(item.openId)">
										<!-- 头像 -->
										<image :src="`${baseUrl}/file/${item.userPot}`" mode="aspectFill"></image>
										<!-- 用户昵称 -->
										<view>
											<view class="upArea">
												<text>{{item.userName}}</text>
											</view>
											<!-- 全职以及实习标签 -->
											<view class="downArea">
												<text class="fulltime" v-for="(offer,i) in item.fulltime" :key="i">{{offer}}</text>
												<text v-for="(offer,i) in item.internship" :key="i">{{offer}}</text>
											</view>
										</view>
									</view>
									<!-- 点赞及转发 -->
									<view style="height: 100upx;display: flex;align-items: center;">
										<!-- 点赞及转发 -->
										<view class="like">
											<view class="sharebutton">

												<button open-type="share" @click.stop="shareButtonClick" :data-postid="item.interviewexperienceId"></button>
												<image src="../../static/pic/fontpage/plane.svg" mode=""></image>
											</view>
											<image :src="item.isCollect?'../../static/pic/fontpage/heart.png':'../../static/pic/fontpage/heart-outline.png'" 
											 @click.stop="likeClick(item.interviewexperienceId,item.title,item.openId,item.type,item.isCollect,i,'left',item.userPot)"
											 class="likeImg"></image> 
											<text>{{item.colNum}}</text>
										</view>
									</view>
									<!-- 背景图 -->
									<view class="bgimage-left" v-if="item.type === 2 || item.type === 3">
										<image :src="item.type === 2?'../../static/pic/fontpage/bg3.svg':'../../static/pic/fontpage/bg2.svg'" mode=""
										 class="bgimage-left"></image>
									</view>

									<view class="bgimage-right" v-if="item.type === 0 || item.type === 1">
										<image :src="item.type === 0?'../../static/pic/fontpage/bg1.svg':'../../static/pic/fontpage/bg4.svg'" mode=""
										 class="bgimage-right"></image>
									</view>
								</view>
							</view>
							<!-- 占位块 -->
							<view style="height: 120upx;clear: both;">
							</view>
						</view>

						<view class="right-body">
							<!-- 有封面 -->
							<view v-for="(item,i) in consumRight" :key="i">
								<view class="has-cover" @click="switchToDetail(item.interviewexperienceId,item.isCollect,item.isUnlock,i,'consum-right',item.colNum,item.openId)"
								 v-if="item.cover !== '' && item.cover !== null">
									<!-- 背景图 -->
									<view class="bgimage-right" v-if="item.type === 0 || item.type === 1">
										<image :src="item.type === 0?' ../../static/pic/fontpage/bg1.svg':'../../static/pic/fontpage/bg4.svg'" class="bgimage-right"></image>
									</view>
									<view class="bgimage-left" v-if="item.type === 2 || item.type === 3">
										<image :src="item.type === 2?' ../../static/pic/fontpage/bg3.svg':'../../static/pic/fontpage/bg2.svg'" class="bgimage-left"></image>
									</view>
									<!-- 清除浮动 -->
									<view style="overflow: hidden;">

									</view>
									<!-- 用户头像，标签 -->
									<view class="user" @click.stop="switchToUserpage(item.openId)">
										<!-- 头像 -->
										<image :src="`${baseUrl}/file/${item.userPot}`" mode="aspectFill"></image>
										<!-- 用户昵称 -->
										<view>
											<view class="upArea">
												<text>{{item.userName}}</text>
											</view>
											<!-- 全职以及实习标签 -->
											<view class="downArea">
												<text class="fulltime" v-for="(offer,i) in item.fulltime" :key="i">{{offer}}</text>
												<text v-for="(offer,i) in item.internship" :key="i">{{offer}}</text>
											</view>
										</view>
									</view>
									<!-- 封面及详情 -->
									<view class="cover">
										<view class="cover-image">
											<image :src="`${baseUrl}/file/${item.cover}`" mode="aspectFill"></image>
											<!-- 价格标签未解锁 -->
											<view class="price-label" v-if="!item.isUnlock">
												<!-- 免费 -->
												<text class="free" v-if="item.price === 0">FREE!</text>
												<!-- 付费 -->
												<view class="not-free" v-if="item.price !== 0">
													<image src="../../static/pic/fontpage/peer2x.png" mode="" class="peers"></image>
													<text class="price">x{{item.price}}</text>
												</view>

												<!-- 价格背景label -->
												<image :src="item.price === 0?'../../static/pic/fontpage/price-free.png':'../../static/pic/fontpage/price-outline.png'"
												 mode="" class="labelbg"></image>
											</view>
											<!-- 价格标签解锁后 -->
											<view class="price-label" v-if="item.isUnlock">
												<image src="../../static/pic/fontpage/price-outline.png" mode="" class="labelbg"></image>
												<text class="unlocked" v-if="item.isUnlock">已解锁</text>
											</view>
										</view>
										<view style="overflow: hidden;">

										</view>

										<view style="margin-top: 24upx;">
											<text>{{item.title}}</text>
											<text>{{item.summary}}</text>
											<!-- 	<text>三张财报系统介绍，详情页免费获取链接...</text> -->
										</view>
									</view>

									<view style="height: 100upx;display: flex;align-items: center;">
										<!-- 点赞及转发 -->
										<view class="like">
											<view class="sharebutton">

												<button open-type="share" @click.stop="shareButtonClick" :data-postid="item.interviewexperienceId"></button>
												<image src="../../static/pic/fontpage/plane.svg" mode=""></image>
											</view>

											<image :src="item.isCollect?'../../static/pic/fontpage/heart.png':'../../static/pic/fontpage/heart-outline.png'"
											 @click.stop="likeClick(item.interviewexperienceId,item.title,item.openId,item.type,item.isCollect,i,'right',item.userPot)"
											 class="likeImg"></image>
											<text>{{item.colNum}}</text>
										</view>
									</view>
								</view>
								<!-- 讲座、经历无封面 -->
								<view class="no-cover" @click="switchToDetail(item.interviewexperienceId,item.isCollect,item.isUnlock,i,'consum-right',item.colNum,item.openId)"
								 v-if="item.cover === '' || item.cover === null">
									<!-- 占位 -->
									<view style="overflow: hidden;">

									</view>
									<!-- 标题 -->
									<view class="title">
										<text>{{item.title}}</text>
										<!-- <text>直播/录播</text> -->
									</view>
									<!-- 时间及人数 -->

									<!-- 详情及解锁 -->
									<view class="info">
										<text>{{item.summary}}</text>
										<!-- <text>解锁查看更多资料！</text> -->
										<!-- 价格标签未解锁 -->
										<view class="price-label" v-if="!item.isUnlock">
											<!-- 免费 -->
											<text class="free" v-if="item.price === 0">FREE!</text>
											<!-- 付费 -->
											<view class="not-free" v-if="item.price !== 0">
												<image src="../../static/pic/fontpage/peer2x.png" mode="" class="peers"></image>
												<text class="price">x{{item.price}}</text>
											</view>

											<!-- 价格背景label -->
											<image :src="item.price === 0?'../../static/pic/fontpage/price-free.png':'../../static/pic/fontpage/price-outline.png'"
											 mode="" class="labelbg"></image>
										</view>
										<!-- 价格标签解锁后 -->
										<view class="price-label" v-if="item.isUnlock">
											<image src="../../static/pic/fontpage/price-outline.png" mode="" class="labelbg"></image>
											<text class="unlocked" v-if="item.isUnlock">已解锁</text>
										</view>
									</view>
									<!-- 用户头像，标签 -->
									<view class="user" @click.stop="switchToUserpage(item.openId)">
										<!-- 头像 -->
										<image :src="`${baseUrl}/file/${item.userPot}`" mode="aspectFill"></image>
										<!-- 用户昵称 -->
										<view>
											<view class="upArea">
												<text>{{item.userName}}</text>
											</view>
											<!-- 全职以及实习标签 -->
											<view class="downArea">
												<text class="fulltime" v-for="(offer,i) in item.fulltime" :key="i">{{offer}}</text>
												<text v-for="(offer,i) in item.internship" :key="i">{{offer}}</text>
											</view>
										</view>
									</view>
									<!-- 点赞及转发 -->
									<view style="height: 100upx;display: flex;align-items: center;">
										<!-- 点赞及转发 -->
										<view class="like">
											<view class="sharebutton">

												<button open-type="share" @click.stop="shareButtonClick" :data-postid="item.interviewexperienceId"></button>
												<image src="../../static/pic/fontpage/plane.svg" mode=""></image>
											</view>

											<image :src="item.isCollect?'../../static/pic/fontpage/heart.png':'../../static/pic/fontpage/heart-outline.png'"
											 @click.stop="likeClick(item.interviewexperienceId,item.title,item.openId,item.type,item.isCollect,i,'right',item.userPot)"
											 class="likeImg"></image>
											<text>{{item.colNum}}</text>
										</view>
									</view>
									<!-- 背景图 -->
									<view class="bgimage-left" v-if="item.type === 2 || item.type === 3">
										<image :src="item.type === 2?'../../static/pic/fontpage/bg3.svg':'../../static/pic/fontpage/bg2.svg'" mode=""
										 class="bgimage-left"></image>
									</view>

									<view class="bgimage-right" v-if="item.type === 0 || item.type === 1">
										<image :src="item.type === 0?'../../static/pic/fontpage/bg1.svg':'../../static/pic/fontpage/bg4.svg'" mode=""
										 class="bgimage-right"></image>
									</view>
								</view>

								<!-- 		<view class="advertisement">
										<image src="../../static/pic/fontpage/advertisement.png" mode=""></image>
									</view> -->

							</view>
							
						</view>
						<!-- 到底了 -->
						<view class="rearch-bottom" v-if="consumCurrentPageNum === consumTotalPageNum">
							到底啦 :D
						</view>
						<!-- 占位块 -->
						<view style="height: 120upx;clear: both;">
						</view>
					</scroll-view>

				<!-- 未搜索到任何东西的样式 -->
				<view class="search-nothing" v-if="consumSearchFlag">
					<view>
						<image src="../../static/pic/detail/peers.png" mode=""></image>
						没有搜索到相关内容，换一个关键词试试看!
					</view>
				</view>
				</swiper-item>
				<!-- 其他开头 -->
				<swiper-item>
					<scroll-view scroll-y="true" style="height: 100%;" :refresher-enabled="true" @scrolltolower="scrollToBottom6"
					 @refresherrefresh="refreshFontpage6" :refresher-triggered="isRefreshed6" :refresher-threshold="1"
					 @refresherrestore="onRestore6" lower-threshold="200" v-if="!otherSearchFlag">
						<view class="left-body">
							<!-- 有封面 -->
							<view v-for="(item,i) in otherLeft" :key="i">
								<view class="has-cover" @click="switchToDetail(item.interviewexperienceId,item.isCollect,item.isUnlock,i,'other-left',item.colNum,item.openId)"
								 v-if="item.cover !== '' && item.cover !== null">
									<!-- 背景图 -->
									<view class="bgimage-right" v-if="item.type === 0 || item.type === 1">
										<image :src="item.type === 0?' ../../static/pic/fontpage/bg1.svg':'../../static/pic/fontpage/bg4.svg'" class="bgimage-right"></image>
									</view>
									<view class="bgimage-left" v-if="item.type === 2 || item.type === 3">
										<image :src="item.type === 2?' ../../static/pic/fontpage/bg3.svg':'../../static/pic/fontpage/bg2.svg'" class="bgimage-left"></image>
									</view>
									<!-- 清除浮动 -->
									<view style="overflow: hidden;">

									</view>
									<!-- 用户头像，标签 -->
									<view class="user" @click.stop="switchToUserpage(item.openId)">
										<!-- 头像 -->
										<image :src="`${baseUrl}/file/${item.userPot}`" mode="aspectFill"></image>
										<!-- 用户昵称 -->
										<view>
											<view class="upArea">
												<text>{{item.userName}}</text>
											</view>
											<!-- 全职以及实习标签 -->
											<view class="downArea">
												<text class="fulltime" v-for="(offer,i) in item.fulltime" :key="i">{{offer}}</text>
												<text v-for="(offer,i) in item.internship" :key="i">{{offer}}</text>
											</view>
										</view>
									</view>
									<!-- 封面及详情 -->
									<view class="cover">
										<view class="cover-image">
											<image :src="`${baseUrl}/file/${item.cover}`" mode="aspectFill"></image>
											<!-- 价格标签未解锁 -->
											<view class="price-label" v-if="!item.isUnlock">
												<!-- 免费 -->
												<text class="free" v-if="item.price === 0">FREE!</text>
												<!-- 付费 -->
												<view class="not-free" v-if="item.price !== 0">
													<image src="../../static/pic/fontpage/peer2x.png" mode="" class="peers"></image>
													<text class="price">x{{item.price}}</text>
												</view>

												<!-- 价格背景label -->
												<image :src="item.price === 0?'../../static/pic/fontpage/price-free.png':'../../static/pic/fontpage/price-outline.png'"
												 mode="" class="labelbg"></image>
											</view>
											<!-- 价格标签解锁后 -->
											<view class="price-label" v-if="item.isUnlock">
												<image src="../../static/pic/fontpage/price-outline.png" mode="" class="labelbg"></image>
												<text class="unlocked" v-if="item.isUnlock">已解锁</text>
											</view>
										</view>
										<view style="overflow: hidden;">

										</view>

										<view style="margin-top: 24upx;">
											<text>{{item.title}}</text>
											<text>{{item.summary}}</text>
											<!-- 	<text>三张财报系统介绍，详情页免费获取链接...</text> -->
										</view>
									</view>

									<view style="height: 100upx;display: flex;align-items: center;">
										<!-- 点赞及转发 -->
										<view class="like">
											<view class="sharebutton">
												<button open-type="share" @click.stop="shareButtonClick" :data-postid="item.interviewexperienceId"></button>
												<image src="../../static/pic/fontpage/plane.svg" mode=""></image>
											</view>
											<image :src="item.isCollect?'../../static/pic/fontpage/heart.png':'../../static/pic/fontpage/heart-outline.png'"
											 @click.stop="likeClick(item.interviewexperienceId,item.title,item.openId,item.type,item.isCollect,i,'left',item.userPot)"
											 class="likeImg"></image>
											<text>{{item.colNum}}</text>
										</view>
									</view>
								</view>
								<!-- 讲座、经历无封面 -->
								<view class="no-cover" @click="switchToDetail(item.interviewexperienceId,item.isCollect,item.isUnlock,i,'other-left',item.colNum,item.openId)"
								 v-if="item.cover === '' || item.cover === null">
									<!-- 占位 -->
									<view style="overflow: hidden;">

									</view>
									<!-- 标题 -->
									<view class="title">
										<text>{{item.title}}</text>
										<!-- <text>直播/录播</text> -->
									</view>
									<!-- 时间及人数 -->

									<!-- 详情及解锁 -->
									<view class="info">
										<text>{{item.summary}}</text>
										<!-- <text>解锁查看更多资料！</text> -->
										<!-- 价格标签 -->
										<!-- 价格标签未解锁 -->
										<view class="price-label" v-if="!item.isUnlock">
											<!-- 免费 -->
											<text class="free" v-if="item.price === 0">FREE!</text>
											<!-- 付费 -->
											<view class="not-free" v-if="item.price !== 0">
												<image src="../../static/pic/fontpage/peer2x.png" mode="" class="peers"></image>
												<text class="price">x{{item.price}}</text>
											</view>

											<!-- 价格背景label -->
											<image :src="item.price === 0?'../../static/pic/fontpage/price-free.png':'../../static/pic/fontpage/price-outline.png'"
											 mode="" class="labelbg"></image>
										</view>
										<!-- 价格标签解锁后 -->
										<view class="price-label" v-if="item.isUnlock">
											<image src="../../static/pic/fontpage/price-outline.png" mode="" class="labelbg"></image>
											<text class="unlocked" v-if="item.isUnlock">已解锁</text>
										</view>
									</view>
									<!-- 用户头像，标签 -->
									<view class="user" @click.stop="switchToUserpage(item.openId)">
										<!-- 头像 -->
										<image :src="`${baseUrl}/file/${item.userPot}`" mode="aspectFill"></image>
										<!-- 用户昵称 -->
										<view>
											<view class="upArea">
												<text>{{item.userName}}</text>
											</view>
											<!-- 全职以及实习标签 -->
											<view class="downArea">
												<text class="fulltime" v-for="(offer,i) in item.fulltime" :key="i">{{offer}}</text>
												<text v-for="(offer,i) in item.internship" :key="i">{{offer}}</text>
											</view>
										</view>
									</view>
									<!-- 点赞及转发 -->
									<view style="height: 100upx;display: flex;align-items: center;">
										<!-- 点赞及转发 -->
										<view class="like">
											<view class="sharebutton">

												<button open-type="share" @click.stop="shareButtonClick" :data-postid="item.interviewexperienceId"></button>
												<image src="../../static/pic/fontpage/plane.svg" mode=""></image>
											</view>
											<image :src="item.isCollect?'../../static/pic/fontpage/heart.png':'../../static/pic/fontpage/heart-outline.png'"
											 @click.stop="likeClick(item.interviewexperienceId,item.title,item.openId,item.type,item.isCollect,i,'left',item.userPot)"
											 class="likeImg"></image>
											<text>{{item.colNum}}</text>
										</view>
									</view>
									<!-- 背景图 -->
									<view class="bgimage-left" v-if="item.type === 2 || item.type === 3">
										<image :src="item.type === 2?'../../static/pic/fontpage/bg3.svg':'../../static/pic/fontpage/bg2.svg'" mode=""
										 class="bgimage-left"></image>
									</view>

									<view class="bgimage-right" v-if="item.type === 0 || item.type === 1">
										<image :src="item.type === 0?'../../static/pic/fontpage/bg1.svg':'../../static/pic/fontpage/bg4.svg'" mode=""
										 class="bgimage-right"></image>
									</view>
								</view>
							</view>
							<!-- 占位块 -->
							<view style="height: 120upx;clear: both;">
							</view>
						</view>

						<view class="right-body">
							<!-- 有封面 -->
							<view v-for="(item,i) in otherRight" :key="i">
								<view class="has-cover" @click="switchToDetail(item.interviewexperienceId,item.isCollect,item.isUnlock,i,'other-right',item.colNum,item.openId)"
								 v-if="item.cover !== '' && item.cover !== null">
									<!-- 背景图 -->
									<view class="bgimage-right" v-if="item.type === 0 || item.type === 1">
										<image :src="item.type === 0?' ../../static/pic/fontpage/bg1.svg':'../../static/pic/fontpage/bg4.svg'" class="bgimage-right"></image>
									</view>
									<view class="bgimage-left" v-if="item.type === 2 || item.type === 3">
										<image :src="item.type === 2?' ../../static/pic/fontpage/bg3.svg':'../../static/pic/fontpage/bg2.svg'" class="bgimage-left"></image>
									</view>
									<!-- 清除浮动 -->
									<view style="overflow: hidden;">

									</view>
									<!-- 用户头像，标签 -->
									<view class="user" @click.stop="switchToUserpage(item.openId)">
										<!-- 头像 -->
										<image :src="`${baseUrl}/file/${item.userPot}`" mode="aspectFill"></image>
										<!-- 用户昵称 -->
										<view>
											<view class="upArea">
												<text>{{item.userName}}</text>
											</view>
											<!-- 全职以及实习标签 -->
											<view class="downArea">
												<text class="fulltime" v-for="(offer,i) in item.fulltime" :key="i">{{offer}}</text>
												<text v-for="(offer,i) in item.internship" :key="i">{{offer}}</text>
											</view>
										</view>
									</view>
									<!-- 封面及详情 -->
									<view class="cover">
										<view class="cover-image">
											<image :src="`${baseUrl}/file/${item.cover}`" mode="aspectFill"></image>
											<!-- 价格标签未解锁 -->
											<view class="price-label" v-if="!item.isUnlock">
												<!-- 免费 -->
												<text class="free" v-if="item.price === 0">FREE!</text>
												<!-- 付费 -->
												<view class="not-free" v-if="item.price !== 0">
													<image src="../../static/pic/fontpage/peer2x.png" mode="" class="peers"></image>
													<text class="price">x{{item.price}}</text>
												</view>

												<!-- 价格背景label -->
												<image :src="item.price === 0?'../../static/pic/fontpage/price-free.png':'../../static/pic/fontpage/price-outline.png'"
												 mode="" class="labelbg"></image>
											</view>
											<!-- 价格标签解锁后 -->
											<view class="price-label" v-if="item.isUnlock">
												<image src="../../static/pic/fontpage/price-outline.png" mode="" class="labelbg"></image>
												<text class="unlocked" v-if="item.isUnlock">已解锁</text>
											</view>
										</view>
										<view style="overflow: hidden;">

										</view>

										<view style="margin-top: 24upx;">
											<text>{{item.title}}</text>
											<text>{{item.summary}}</text>
											<!-- 	<text>三张财报系统介绍，详情页免费获取链接...</text> -->
										</view>
									</view>

									<view style="height: 100upx;display: flex;align-items: center;">
										<!-- 点赞及转发 -->
										<view class="like">
											<view class="sharebutton">

												<button open-type="share" @click.stop="shareButtonClick" :data-postid="item.interviewexperienceId"></button>
												<image src="../../static/pic/fontpage/plane.svg" mode=""></image>
											</view>

											<image :src="item.isCollect?'../../static/pic/fontpage/heart.png':'../../static/pic/fontpage/heart-outline.png'"
											 @click.stop="likeClick(item.interviewexperienceId,item.title,item.openId,item.type,item.isCollect,i,'right',item.userPot)"
											 class="likeImg"></image>
											<text>{{item.colNum}}</text>
										</view>
									</view>
								</view>
								<!-- 讲座、经历无封面 -->
								<view class="no-cover" @click="switchToDetail(item.interviewexperienceId,item.isCollect,item.isUnlock,i,'other-right',item.colNum,item.openId)"
								 v-if="item.cover === '' || item.cover === null">
									<!-- 占位 -->
									<view style="overflow: hidden;">

									</view>
									<!-- 标题 -->
									<view class="title">
										<text>{{item.title}}</text>
										<!-- <text>直播/录播</text> -->
									</view>
									<!-- 时间及人数 -->

									<!-- 详情及解锁 -->
									<view class="info">
										<text>{{item.summary}}</text>
										<!-- <text>解锁查看更多资料！</text> -->
										<!-- 价格标签未解锁 -->
										<view class="price-label" v-if="!item.isUnlock">
											<!-- 免费 -->
											<text class="free" v-if="item.price === 0">FREE!</text>
											<!-- 付费 -->
											<view class="not-free" v-if="item.price !== 0">
												<image src="../../static/pic/fontpage/peer2x.png" mode="" class="peers"></image>
												<text class="price">x{{item.price}}</text>
											</view>

											<!-- 价格背景label -->
											<image :src="item.price === 0?'../../static/pic/fontpage/price-free.png':'../../static/pic/fontpage/price-outline.png'"
											 mode="" class="labelbg"></image>
										</view>
										<!-- 价格标签解锁后 -->
										<view class="price-label" v-if="item.isUnlock">
											<image src="../../static/pic/fontpage/price-outline.png" mode="" class="labelbg"></image>
											<text class="unlocked" v-if="item.isUnlock">已解锁</text>
										</view>
									</view>
									<!-- 用户头像，标签 -->
									<view class="user" @click.stop="switchToUserpage(item.openId)">
										<!-- 头像 -->
										<image :src="`${baseUrl}/file/${item.userPot}`" mode="aspectFill"></image>
										<!-- 用户昵称 -->
										<view>
											<view class="upArea">
												<text>{{item.userName}}</text>
											</view>
											<!-- 全职以及实习标签 -->
											<view class="downArea">
												<text class="fulltime" v-for="(offer,i) in item.fulltime" :key="i">{{offer}}</text>
												<text v-for="(offer,i) in item.internship" :key="i">{{offer}}</text>
											</view>
										</view>
									</view>
									<!-- 点赞及转发 -->
									<view style="height: 100upx;display: flex;align-items: center;">
										<!-- 点赞及转发 -->
										<view class="like">
											<view class="sharebutton">

												<button open-type="share" @click.stop="shareButtonClick" :data-postid="item.interviewexperienceId"></button>
												<image src="../../static/pic/fontpage/plane.svg" mode=""></image>
											</view>

											<image :src="item.isCollect?'../../static/pic/fontpage/heart.png':'../../static/pic/fontpage/heart-outline.png'"
											 @click.stop="likeClick(item.interviewexperienceId,item.title,item.openId,item.type,item.isCollect,i,'right',item.userPot)"
											 class="likeImg"></image>
											<text>{{item.colNum}}</text>
										</view>
									</view>
									<!-- 背景图 -->
									<view class="bgimage-left" v-if="item.type === 2 || item.type === 3">
										<image :src="item.type === 2?'../../static/pic/fontpage/bg3.svg':'../../static/pic/fontpage/bg2.svg'" mode=""
										 class="bgimage-left"></image>
									</view>

									<view class="bgimage-right" v-if="item.type === 0 || item.type === 1">
										<image :src="item.type === 0?'../../static/pic/fontpage/bg1.svg':'../../static/pic/fontpage/bg4.svg'" mode=""
										 class="bgimage-right"></image>
									</view>
								</view>

								<!-- 		<view class="advertisement">
										<image src="../../static/pic/fontpage/advertisement.png" mode=""></image>
									</view> -->

							</view>
							
						</view>
						<!-- 到底了 -->
						<view class="rearch-bottom" v-if="otherCurrentPageNum === otherTotalPageNum">
							到底啦 :D
						</view>
						<!-- 占位块 -->
						<view style="height: 120upx;clear: both;">
						</view>
					</scroll-view>

				<!-- 未搜索到任何东西的样式 -->
				<view class="search-nothing" v-if="otherSearchFlag">
					<view>
						<image src="../../static/pic/detail/peers.png" mode=""></image>
						没有搜索到相关内容，换一个关键词试试看!
					</view>
				</view>
				</swiper-item>
			</swiper>
		</view>

		<!-- 首次进入的popup -->
		<uni-popup-sp ref="popup" type="center" :maskClick="false">
			<!-- 新人弹窗 -->
			<view class="rookie">
				<text class="title">新人奖励!</text>
				<!-- 豆子 -->
				<view class="peers">
					<image src="../../static/pic/fontpage/logo-small.png" mode=""></image>
					<text>+10</text>
				</view>
				<text class="notice">珍贵的豆子可用于解锁Offeree发布的面经、资料、讲座等，快去解锁试试看！</text>
				<text class="notice" @click="switchToProvision">点击后表示同意<text>豌豆派法律条款与隐私政策</text></text>
				<button @getuserinfo="getUserInfo" open-type="getUserInfo">收入囊中</button>
			</view>
		</uni-popup-sp>

		<!-- 第一次拒绝的二次弹窗 -->
		<uni-popup-sp ref="failpopup" type="center" :maskClick="false">
			<!-- 拒绝后二次弹窗 -->
			<view class="second">
				<text class="title">确认取消？</text>
				<text class="notice">授权后即可获得新人奖励，解锁小程序全部功能！</text>
				<view class="btngroup">
					<button @click="cancel">取消</button>
					<button open-type="getUserInfo" @getuserinfo="getUserInfoSecond">继续授权</button>
				</view>
			</view>
		</uni-popup-sp>

		<!-- 签到弹窗 -->
		<!-- <uni-popup-sp type="center" ref="signpopup">
			<view class="sign">
				<view class="title">
					每日签到赚豆子
				</view>
				<view class="peers">
					<image src="../../static/pic/detail/peers.png" mode=""></image>+1
				</view>
				<view class="signbutton">
					<button type="default" @click="signUp">签到</button>
				</view>
			</view>
		</uni-popup-sp> -->

		<!-- 点击分享后弹窗 -->
		<uni-popup-sp type="center" ref="sharepopup">
			<view class="share-popup">
				<!-- 分享来源 -->
				<view class="source">
					{{sharePersonInfo.user.userName}}给你分享了：
				</view>
				<!-- 内容卡片 -->
				<view class="content-card">
					<!-- 内容标题 -->
					<view class="title">
						<text>{{shareInterviewInfo.interviewexperience.title}}</text>
					</view>
					<!-- 内容详情 -->
					<view class="content">
						<text>{{shareInterviewInfo.interviewexperience.summary}}</text>
					</view>
					<!-- 用户头像，标签 -->
					<view class="user">
						<!-- 头像 -->
						<image :src="`${baseUrl}/file/${shareInterviewInfo.interviewexperience.userPot}`" mode="aspectFill"></image>
						<!-- 用户昵称 -->
						<view>
							<view class="upArea">
								<text>{{shareInterviewInfo.interviewexperience.userName}}</text>
							</view>
							<!-- 全职以及实习标签 -->
							<view class="downArea">
								<text class="fulltime" v-for="(item,i) in shareInterviewInfo.interviewexperience.fulltime" :key="i">{{item}}</text>
								<text v-for="(item,i) in shareInterviewInfo.interviewexperience.internship" :key="i">{{item}}</text>
							</view>
						</view>
					</view>
					<!-- 背景图片 -->
					<image src="../../static/pic/bg/mianjin.png" mode="" class="bgimg" v-if="shareInterviewInfo.interviewexperience.type ===  0"></image>
					<image src="../../static/pic/bg/ziliao.png" mode="" class="bgimg" v-if="shareInterviewInfo.interviewexperience.type ===  1"></image>
					<image src="../../static/pic/bg/jiangzuo.png" mode="" class="bgimg" v-if="shareInterviewInfo.interviewexperience.type ===  2"></image>
					<image src="../../static/pic/bg/geren.png" mode="" class="bgimg" v-if="shareInterviewInfo.interviewexperience.type ===  3"></image>
				</view>
				<!-- 底部查看详情按钮 -->
				<view class="bottom-btn">
					<button type="default" @click="switchToShareDetail(shareInterviewInfo.interviewexperience.interviewexperienceId)">查看详情</button>
				</view>
			</view>
		</uni-popup-sp>
		
		<!-- 登录过期提示弹窗 -->
		<uni-popup-sp ref="relogin" :maskClick="false">
			<view class="relogin">
				<text>登录提示</text>
				<text>登录已过期</text>
				<text>部分功能无法使用</text>
				<text>请重新授权登录</text>
				<button @click="relogin">重新授权</button>
			</view>
		</uni-popup-sp>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupSp from '@/components/uni-popup-sp/uni-popup-sp.vue'
	export default {
		components: {
			uniPopup,
			uniPopupSp
		},
		data() {
			return {
				// 搜索框内容
				searchtext: '',
				animationData: {},
				isUnfold: false,
				// 筛选项
				selectItem: ['全部展示', '面经笔经', '资料分享', '讲座课程', '个人故事'],
				// 检测选中项
				selectmark: -1,
				// 筛选结果文字
				selecttext: '帖子类型',
				tabItem: ['全部', '互联网', '金融', '咨询', '快消', '其他'],
				// tab激活样式
				tabMark: 0,
				// 爱心图片替换路径
				likeSrc: '../../static/pic/fontpage/heart-outline.png',
				likeNum: 289,
				isLiked: false,
				// 滚动区域高度
				scrollHight: 0,
				// swiper切换到第几个
				swiperMark: 0,
				testnum: 1,
				// 是否登陆
				isLogin: false,
				// 主页从服务器拿到的数据,全部情况下左右两个数组
				fontpageLeft: [],
				fontpageRight: [],
				// 互联网的左右
				internetLeft: [],
				internetRight: [],
				// 金融
				financeLeft: [],
				financeRight: [],
				// 咨询
				consultLeft: [],
				consultRight: [],
				// 快消
				consumLeft: [],
				consumRight: [],
				// 其他
				otherLeft: [],
				otherRight: [],
				isRefreshed1: false,
				isRefreshed2: false,
				isRefreshed3: false,
				isRefreshed4: false,
				isRefreshed5: false,
				isRefreshed6: false,
				baseUrl: '',
				// 用户收藏列表，比对是否收藏
				colList: [],
				// 用户解锁列表
				unlockList: [],
				// 分享者信息
				sharePersonInfo: {},
				// 分享面经信息
				shareInterviewInfo: {},
				// 是否授权
				isAuthorize: false,
				// 全部行业当前page
				fontCurrentPageNum: 1,
				internetCurrentPageNum: 1,
				financeCurrentPageNum: 1,
				consultCurrentPageNum: 1,
				consumCurrentPageNum: 1,
				otherCurrentPageNum: 1,
				// 用于检测输入关键词搜索后，切换tab会发生更新
				fontflag: false,
				interflag: false,
				finflag: false,
				conflag: false,
				consumflag: false,
				otherflag: false,
				shareOpenId: '',
				// 未搜索到东西的flag
				fontSearchFlag:false,
				interSearchFlag:false,
				financeSearchFlag:false,
				consultSearchFlag:false,
				consumSearchFlag:false,
				otherSearchFlag:false,
				
				fontpageLeftLength: 0,
				fontpageRightLength: 0,
				// 互联网的左右
				internetLeftLength: 0,
				internetRightLength: 0,
				// 金融
				financeLeftLength: 0,
				financeRightLength: 0,
				// 咨询
				consultLeftLength: 0,
				consultRightLength: 0,
				// 快消
				consumLeftLength: 0,
				consumRightLength: 0,
				// 其他
				otherLeftLength: 0,
				otherRightLength: 0,
				// 总页码
				fontTotalPageNum: 0,
				internetTotalPageNum: 0,
				financeTotalPageNum: 0,
				consultTotalPageNum: 0,
				consumTotalPageNum: 0,
				otherTotalPageNum: 0,
			}
		},
		methods: {
			// 搜索框输入事件
			searchConfirm: function() {
				if (this.searchtext.match(/^[ ]*$/)) {
					return
				} else {
					this.fontSearchFlag = false
					this.interSearchFlag = false
					this.financeSearchFlag = false
					this.consultSearchFlag = false
					this.consumSearchFlag = false
					this.otherSearchFlag = false
					this.getFontpageInfoBySearch(20, 1)
					this.fontflag = true
					this.interflag = true
					this.finflag = true
					this.conflag = true
					this.consumflag = true
					this.otherflag = true
				}

			},
			// 清空搜索框
			clearSearchText: function() {
				if (this.searchtext.match(/^[ ]*$/)) {
					return
				}
				else{
					this.fontpageLeft = []
					this.fontpageRight = []
					this.internetLeft = []
					this.internetRight = []
					this.financeLeft = []
					this.financeRight = []
					this.consultLeft = []
					this.consumRight = []
					this.consumLeft = []
					this.consumRight = []
					this.otherLeft = []
					this.otherRight = []
					this.homePageRefresh(20, 1)
				}
				this.searchtext = ''
			},
			// 三角旋转动画
			rotate: function() {
				this.animation.rotate(180).step()
				this.animationData = this.animation.export()
			},
			// 动画复位
			resetRotate: function() {
				this.animation.rotate(0).step()
				this.animationData = this.animation.export()
			},
			// 三角旋转动画触发
			selectorUnfold: function() {
				if (this.isUnfold === false) {
					this.rotate()
					this.isUnfold = true
				} else {
					this.resetRotate()
					this.isUnfold = false
				}
			},
			// 筛选列表点击事件
			selectItemEvent: function(i, item) {
				console.log(i)
				this.selectmark = i
				this.selecttext = item
				if(this.searchtext.match(/^[ ]*$/)){
					this.homePageRefresh(20,1)
				}
				else{
					this.getFontpageInfoBySearch(20, 1)
				}
				this.fontflag = true
				this.interflag = true
				this.finflag = true
				this.conflag = true
				this.consumflag = true
				this.otherflag = true
			},
			// tab点击事件
			changeTab: function(i) {
				this.tabMark = i
				this.swiperMark = i
			},
			// 爱心点击事件(item.interviewexperienceId,item.title,item.openId,item.type)
			// 参数:帖子id，标题title，发布者id，类型，是否收藏，i，左右，头像
			likeClick: function(id, title, issueId, type, isCollect, i, part, avatar) {
				// 未收藏时，收藏
				let that = this
				if (isCollect === false) {
					let data = {
						postId: id,
						openid: this.$store.state.userOpenID,
						title: title,
						postPhoto: avatar,
						issueId: issueId,
						type: type
					}
					data = this.$qs.stringify(data)
					this.$axios.request({
						url: `/Message/insertUserCollection`,
						method: 'post',
						data
					}).then(function({
						data
					}) {
						console.log(data)
						// 更新缓存中的用户收藏数
						that.$store.commit('updateUserCollectNum', 1)
						that.getUserCollectList(true)
						if (that.tabMark === 0) {
							if (part === 'left') {
								that.fontpageLeft[i].isCollect = true
								that.fontpageLeft[i].colNum += 1
							}
							if (part === 'right') {
								that.fontpageRight[i].isCollect = true
								that.fontpageRight[i].colNum += 1
							}
						}
						if (that.tabMark === 1) {
							if (part === 'left') {
								that.internetLeft[i].isCollect = true
								that.internetLeft[i].colNum += 1
							}
							if (part === 'right') {
								that.internetRight[i].isCollect = true
								that.internetRight[i].colNum += 1
							}
						}
						if (that.tabMark === 2) {
							if (part === 'left') {
								that.financeLeft[i].isCollect = true
								that.financeLeft[i].colNum += 1
							}
							if (part === 'right') {
								that.financeRight[i].isCollect = true
								that.financeRight[i].colNum += 1
							}
						}
						if (that.tabMark === 3) {
							if (part === 'left') {
								that.consultLeft[i].isCollect = true
								that.consultLeft[i].colNum += 1
							}
							if (part === 'right') {
								that.consultRight[i].isCollect = true
								that.consultRight[i].colNum += 1
							}
						}
						if (that.tabMark === 4) {
							if (part === 'left') {
								that.consumLeft[i].isCollect = true
								that.consumLeft[i].colNum += 1
							}
							if (part === 'right') {
								that.consumRight[i].isCollect = true
								that.consumRight[i].colNum += 1
							}
						}
						if (that.tabMark === 5) {
							if (part === 'left') {
								that.otherLeft[i].isCollect = true
								that.otherLeft[i].colNum += 1
							}
							if (part === 'right') {
								that.otherRight[i].isCollect = true
								that.otherRight[i].colNum += 1
							}
						}

					}).catch(err => {
						console.log(err)
					})
				}
				// 已收藏时，取消收藏
				else {
					this.$axios.request({
						url: `/Message/DeleteUserCollection`,
						method: 'get',
						params: {
							openid: this.$store.state.userOpenID,
							postId: id
						}
					}).then(function({
						data
					}) {
						console.log(data)
						that.$store.commit('updateUserCollectNum', -1)
						// 判断点击的区域，更新前端显示
						that.getUserCollectList(true)
						if (that.tabMark === 0) {
							if (part === 'left') {
								that.fontpageLeft[i].isCollect = false
								that.fontpageLeft[i].colNum -= 1
							}
							if (part === 'right') {
								that.fontpageRight[i].isCollect = false
								that.fontpageRight[i].colNum -= 1
							}
						}
						if (that.tabMark === 1) {
							if (part === 'left') {
								that.internetLeft[i].isCollect = false
								that.internetLeft[i].colNum -= 1
							}
							if (part === 'right') {
								that.internetRight[i].isCollect = false
								that.internetRight[i].colNum -= 1
							}
						}
						if (that.tabMark === 2) {
							if (part === 'left') {
								that.financeLeft[i].isCollect = false
								that.financeLeft[i].colNum -= 1
							}
							if (part === 'right') {
								that.financeRight[i].isCollect = false
								that.financeRight[i].colNum -= 1
							}
						}
						if (that.tabMark === 3) {
							if (part === 'left') {
								that.consultLeft[i].isCollect = false
								that.consultLeft[i].colNum -= 1
							}
							if (part === 'right') {
								that.consultRight[i].isCollect = false
								that.consultRight[i].colNum -= 1
							}
						}
						if (that.tabMark === 4) {
							if (part === 'left') {
								that.consumLeft[i].isCollect = false
								that.consumLeft[i].colNum -= 1
							}
							if (part === 'right') {
								that.consumRight[i].isCollect = false
								that.consumRight[i].colNum -= 1
							}
						}
						if (that.tabMark === 5) {
							if (part === 'left') {
								that.otherLeft[i].isCollect = false
								that.otherLeft[i].colNum -= 1
							}
							if (part === 'right') {
								that.otherRight[i].isCollect = false
								that.otherRight[i].colNum -= 1
							}
						}
					}).catch(err => {
						console.log(err)
					})
				}
			},
			// 通过share切换到详情
			switchToShareDetail: function(id) {
				let that = this
				uni.navigateTo({
					url: `../pageDetail/pageDetail?id=${id}`
				})
				setTimeout(function() {
					that.$refs.sharepopup.close()
				}, 1000);
			},
			// 切换到详情
			switchToDetail: function(id, isCollect, isUnlock, num, area, colnum, openId) {
				let that = this
				if (this.$store.state.userOpenID === openId) {
					uni.navigateTo({
						url: `../pageDetailPublisher/pageDetailPublisher?id=${id}`
					})
				} else {
					uni.navigateTo({
						url: `../pageDetail/pageDetail?id=${id}`,
						success() {
							let tempdata = {
								tempIsCollect: isCollect,
								tempIsUnlock: isUnlock,
								tempNum: num,
								tempArea: area,
								tempColNum: colnum
							}
							that.$store.commit('updateTempState', tempdata)
						}
					})
				}
			},

			// 用户首页
			switchToUserpage: function(id) {
				uni.navigateTo({
					url: '../otherProfile/otherProfile?openId=' + id
				})
			},
			// 收入囊中button
			rookieButtonClick: function() {
				this.$refs.popup.close()
			},
			// 用户登录主函数
			getUserInfo: function() {
				this.$refs.popup.close()
				let that = this
				uni.login({
					success(res) {
						console.log(res)
						// 获取登录code，登录
						that.$axios.request({
							url: `/user/login`,
							method: 'get',
							params: {
								code: res.code
							}
						}).then(function({
							data
						}) {
							console.log(data)
							// 请求无效拦截
							// 将平台的用户信息存储到vuex
							that.$store.commit('saveUserinfoPlatform', data.data)
							// 存储 token
							uni.setStorageSync('token', data.data.token)
							// 如果是平台新用户，
							if (data.data.newPeople === true) {
								// 同步本地豆子，加20
								that.$store.commit('updateUserBeanNum', 20)
								that.$store.commit('updateNewpeople')
							}
							else{
								uni.showToast({
									title:'您已经领取过新人奖励了',
									icon:'none'
								})
							}
							that.getUserUnlock(true)
							
							// 获取用户的原生信息
							uni.getUserInfo({
								success(res) {
									console.log(res.userInfo.avatarUrl)
									// 如果是新用户，打开获得豆子动画，将用户头像存储至服务器
									if(data.data.newPeople === true){
										that.openPeerDialog()
										that.updateAvatar(res.userInfo.nickName, res.userInfo.avatarUrl)
									}
									that.$store.commit('updateAuthState')
									that.isLogin = true
									that.isAuthorize = true	
									// 如果是新用户，并且通过分享进入，则给分享者加豆子
									if (that.shareOpenId !== '' && data.data.newPeople === true) {
										that.uploadShare()
										that.$refs.sharepopup.open()
									}
								},
								fail(err) {
									// 拒绝授权则二次挽留
									console.log('进入了挽留页面?' + err)
									that.$refs.failpopup.open()
									that.$mp.page.getTabBar().setData({
										show: false,
									})
								}
							})
						}).catch(err => {
							console.log(err)
						})
					},
					fail(err) {
						console.log(err)
					}
				})
			},
			// 打开豆子函数
			openPeerDialog: function() {
				return
			},
			// 二次取消
			cancel: function() {
				this.$refs.failpopup.close()
			},
			// 拒绝授权后的二次获取用户信息
			getUserInfoSecond: function() {
				let that = this
				uni.getUserInfo({
					success(res) {
						// 上传头像和昵称到服务器
						if(that.$store.state.newPeople === true){
							that.updateAvatar(res.userInfo.nickName, res.userInfo.avatarUrl)
						}
						// 更新授权状态
						that.$store.commit('updateAuthState')
						that.isLogin = true
						that.isAuthorize = true
						that.openPeerDialog()
					},
					fail(res) {
						that.$refs.failpopup.close()
						return
					}
				})
			},
			// 登录时向服务器同步昵称
			updateUsername: function(nickName, avatar) {
				// 发起请求
				let that = this
				let data = {
					openid: this.$store.state.userOpenID,
					userName: nickName,
					filePot: avatar,
					oldPot: ''
				}
				data = this.$qs.stringify(data)
				this.$axios.request({
					url: `/user/upDataUserName`,
					method: 'post',
					data
				}).then(function({
					data
				}) {
					console.log(data)
					// 同步本地数据
					that.$store.commit('updateAvatar', avatar)
					that.$store.commit('updateUsername', nickName)
				}).catch(err => {
					console.log(err)
				})
			},
			// 同步头像
			updateAvatar: function(nickName, avatar) {
				let that = this
				uni.downloadFile({
					url: avatar,
					success(res) {
						console.log(res)
						if (res.statusCode !== 200) {
							uni.showToast({
								title: res.errMsg,
								icon: 'none'
							})
							that.updateUsername(nickName,'')
							return
						}
						uni.uploadFile({
							url: `${that.baseUrl}/image/upFile`,
							filePath: res.tempFilePath,
							name: 'file',
							formData: {
								path: `user/${that.$store.state.userOpenID}`
							},
							success(res) {
								console.log(res)
								// 切割上传文件后结果，将上传的路径切出
								if(res.statusCode!==200){
									uni.showToast({
										icon:'none',
										title:'上传头像失败！',
									})
									that.updateUsername(nickName, '')
									return
								}
								let data = JSON.parse(res.data)
								console.log(data)
								if(data.code !== 200){
									uni.showToast({
										title:'上传头像失败！',
										icon:'none'
									})
									that.updateUsername(nickName, '')
									return
								}
								that.updateUsername(nickName, data.data)
							},
							fail(err) {
								console.log(err)
							}
						})
					}
				})
			},
			// 页面tab切换事件，页面为空时加载页面
			swiperChange: function(e) {
				console.log(e.detail.current)
				this.tabMark = e.detail.current
				if (this.fontflag === true && this.tabMark === 0) {
					if(this.searchtext.match(/^[ ]*$/)){
						this.homePageRefresh(20,1)
					}
					else{
						this.getFontpageInfoBySearch(20, 1)
					}
					this.fontflag = false
					return
				}
				if (this.interflag === true && this.tabMark === 1) {
					if(this.searchtext.match(/^[ ]*$/)){
						this.homePageRefresh(20,1)
					}
					else{
						this.getFontpageInfoBySearch(20, 1)
					}
					this.interflag = false
					return
				}
				if (this.finflag === true && this.tabMark === 2) {
					if(this.searchtext.match(/^[ ]*$/)){
						this.homePageRefresh(20,1)
					}
					else{
						this.getFontpageInfoBySearch(20, 1)
					}
					this.finflag = false
					return
				}
				if (this.conflag === true && this.tabMark === 3) {
					if(this.searchtext.match(/^[ ]*$/)){
						this.homePageRefresh(20,1)
					}
					else{
						this.getFontpageInfoBySearch(20, 1)
					}
					this.conflag = false
					return
				}
				if (this.consumflag === true && this.tabMark === 4) {
					if(this.searchtext.match(/^[ ]*$/)){
						this.homePageRefresh(20,1)
					}
					else{
						this.getFontpageInfoBySearch(20, 1)
					}
					this.consumflag = false
					return
				}
				if (this.otherflag === true && this.tabMark === 5) {
					if(this.searchtext.match(/^[ ]*$/)){
						this.homePageRefresh(20,1)
					}
					else{
						this.getFontpageInfoBySearch(20, 1)
					}
					this.otherflag = false
					return
				}
				if (this.fontpageLeft.length === 0 && this.tabMark === 0 ) {
					if(this.searchtext.match(/^[ ]*$/)){
						this.homePageRefresh(20,1)
					}
					else{
						this.getFontpageInfoBySearch(20, 1)
					}
					return
				}
				if (this.internetLeft.length === 0 && this.tabMark === 1) {
					if(this.searchtext.match(/^[ ]*$/)){
						this.homePageRefresh(20,1)
					}
					else{
						this.getFontpageInfoBySearch(20, 1)
					}
					return
				}
				if (this.financeLeft.length === 0 && this.tabMark === 2) {
					if(this.searchtext.match(/^[ ]*$/)){
						this.homePageRefresh(20,1)
					}
					else{
						this.getFontpageInfoBySearch(20, 1)
					}
					return
				}
				if (this.consultLeft.length === 0 && this.tabMark === 3) {
					if(this.searchtext.match(/^[ ]*$/)){
						this.getFontpageInfoBySearch(20, 1)
					}
					else{
						this.homePageRefresh(20,1)
					}
					return
				}
				if (this.consumLeft.length === 0 && this.tabMark === 4) {
					if(this.searchtext.match(/^[ ]*$/)){
						this.homePageRefresh(20,1)
					}
					else{
						this.getFontpageInfoBySearch(20, 1)
					}
					return
				}
				if (this.otherLeft.length === 0 && this.tabMark === 5) {
					if(this.searchtext.match(/^[ ]*$/)){
						this.homePageRefresh(20,1)
					}
					else{
						this.getFontpageInfoBySearch(20, 1)
					}
					return
				}
			},

			// 签到框弹出函数
			sign: function() {
				// 获取当日时间，中国地区，加8标准时间
				let date = new Date(+new Date() + 8 * 3600 * 1000).toISOString().substring(0, 10)					
				if ((this.$store.state.userInfoPlatform.user.signTime === null && this.$store.state.isAuthorize === true) || (this.$store.state.userInfoPlatform.user.signTime.substring(0, 10) !== date && this.$store.state.isAuthorize === true)) {
					// 弹出签到
					this.$refs.signpopup.open()
					this.$mp.page.getTabBar().setData({
						show: false
					})
				} else {
					return
				}
			},
			// 同步服务器签到
			signUp: function() {
				let that = this
				// 发起签到请求
				// 关闭签到弹窗
				this.$refs.signpopup.close()
				let date = new Date(+new Date() + 8 * 3600 * 1000).toISOString().substring(0, 10)			
				this.$axios.request({
					url: `/user/upDataSignTime`,
					method: 'get',
					params: {
						openid: that.$store.state.userOpenID
					}
				}).then(function({data}) {
					console.log(data)
					if (data.code === 200) {
						uni.showToast({
							title: '签到成功！'
						})
						// 同步本地的signtime
						that.$store.commit('updateSignDate', data.data)
						// 同步本地豆子
						that.$store.commit('updateUserBeanNum', 1)
					}
					if (data.code === 201) {
						uni.showToast({
							title: '今日已签到！',
							icon:'none'
						})
						// 同步本地的signtime
						that.$store.commit('updateSignDate', date)
					}
					
				}).catch(err => {
					console.log(err)
				})
			},

			// scrollview滚动到底部的函数，123456对应全部，互联网，金融。。。
			scrollToBottom1: function() {
				if(this.searchtext.match(/^[ ]*$/)){
					this.homePageRefresh(20,this.fontCurrentPageNum + 1)
				}
				else{
					if(this.fontCurrentPageNum<this.fontTotalPageNum){
						this.getFontpageInfoBySearch(20, this.fontCurrentPageNum + 1)
					}
				}
				
			},
			scrollToBottom2: function() {
				if(this.searchtext.match(/^[ ]*$/)){
					this.homePageRefresh(20,this.internetCurrentPageNum + 1)
				}
				else{
					if(this.internetCurrentPageNum<this.internetTotalPageNum){
						this.getFontpageInfoBySearch(20, this.internetCurrentPageNum + 1)
					}
				}
				
			},
			scrollToBottom3: function() {
				if(this.searchtext.match(/^[ ]*$/)){
					this.homePageRefresh(20,this.financeCurrentPageNum + 1)
				}
				else{
					if(this.financeCurrentPageNum<this.financeTotalPageNum){
						this.getFontpageInfoBySearch(20, this.financeCurrentPageNum + 1)
					}
				}
				
			},
			scrollToBottom4: function() {
				if(this.searchtext.match(/^[ ]*$/)){
					this.homePageRefresh(20,this.consultCurrentPageNum + 1)
				}
				else{
					if(this.consultCurrentPageNum<this.consultTotalPageNum){
						this.getFontpageInfoBySearch(20, this.consultCurrentPageNum + 1)
					}
				}
				
			},
			scrollToBottom5: function() {
				if(this.searchtext.match(/^[ ]*$/)){
					this.homePageRefresh(20,this.consumCurrentPageNum + 1)
				}
				else{
					if(this.consumCurrentPageNum<this.consumTotalPageNum){
						this.getFontpageInfoBySearch(20, this.consumCurrentPageNum + 1)
					}
				}
				
			},
			scrollToBottom6: function() {
				if(this.searchtext.match(/^[ ]*$/)){
					this.homePageRefresh(20,this.otherCurrentPageNum + 1)
				}
				else{
					if(this.otherCurrentPageNum<this.otherTotalPageNum){
						this.getFontpageInfoBySearch(20, this.otherCurrentPageNum + 1)
					}
				}
			},
			// 全屏监听获取用户授权事件
			// 获取用户信息第三次
			getUserInfoThird: function() {
				let that = this
				uni.getUserInfo({
					success(res) {
						console.log(res.userInfo)
						if(that.$store.state.newPeople === true){
							that.updateAvatar(res.userInfo.nickName, res.userInfo.avatarUrl)
						}
						that.isLogin = true
						that.isAuthorize = true
						that.$store.commit('updateAuthState')
						that.openPeerDialog()
					},
					fail(res) {
						console.log(res)
					}
				})
			},
			// 主页渲染
			homePageRefresh:function(pageSize,pageNum){
				this.fontSearchFlag = false
				this.interSearchFlag = false
				this.financeSearchFlag = false
				this.consultSearchFlag = false
				this.consumSearchFlag = false
				this.otherSearchFlag = false
				let that = this
				let type = 4
				// 判断类型
				if (this.selectmark === -1 || this.selectmark === 0) {
					type = 4
				} else {
					type = this.selectmark - 1
				}
				// 页面参数为1时，清空页面
				let tabMark = this.tabMark
				if (pageNum === 1) {
					if (tabMark === 0) {
						this.fontpageLeft = []
						this.fontpageRight = []
						this.fontpageLeftLength = 0
						this.fontpageRightLength = 0
					}
					if (tabMark === 1) {
						this.internetLeft = []
						this.internetRight = []
						this.internetLeftLength = 0
						this.internetRightLength = 0
					}
					if (tabMark === 2) {
						this.financeLeft = []
						this.financeRight = []
						this.financeLeftLength = 0
						this.financeRightLength = 0
					}
					if (tabMark === 3) {
						this.consultLeft = []
						this.consultRight = []
						this.consultLeftLength = 0
						this.consultRightLength = 0
					}
					if (tabMark === 4) {
						this.consumLeft = []
						this.consumRight = []
						this.consumLeftLength = 0
						this.consumRightLength = 0
					}
					if (tabMark === 5) {
						this.otherLeft = []
						this.otherRight = []
						this.otherLeftLength = 0
						this.otherRightLength = 0
					}
				}
				// 判断行业
				let label = ''
				if (tabMark === 0) {
					label = ''
				}
				if (tabMark === 1) {
					label = '互联网'
				}
				if (tabMark === 2) {
					label = '金融'
				}
				if (tabMark === 3) {
					label = '咨询'
				}
				if (tabMark === 4) {
					label = '快消'
				}
				if (tabMark === 5) {
					label = '其他'
				}
				// 发送请求
				this.$axios.request({
					url: `/interview/homePageRefresh`,
					method: 'get',
					params: {
						type: type,
						label: label,
						pageSize: pageSize,
						pageNum: pageNum
					}
				}).then(function({data}) {
					console.log(data)
					for (let i = 0; i < data.data.length; i++) {
						if(data.data[i].isFold === 1){
							if(data.data[i].openId === that.$store.state.userOpenID){
								that.compareUserUnlock(data.data[i])
							}
							else{
								continue
							}
						}
						else{
							// 先比较用户解锁
							that.compareUserUnlock(data.data[i])
						}
					}
					//将当前页码+1，总页码置0
					if (tabMark === 0) {
						that.fontCurrentPageNum += 1
						that.fontTotalPageNum = 0
					}
					if (tabMark === 1) {
						that.internetCurrentPageNum += 1
						that.internetTotalPageNum = 0
					}
					if (tabMark === 2) {
						that.financeCurrentPageNum += 1
						that.financeTotalPageNum = 0
					}
					if (tabMark === 3) {
						that.consultCurrentPageNum += 1
						that.consultTotalPageNum = 0
					}
					if (tabMark === 4) {
						that.consumCurrentPageNum += 1
						that.consumTotalPageNum = 0
					}
					if (tabMark === 5) {
						that.otherCurrentPageNum += 1
						that.otherTotalPageNum = 0
					}
				}).catch(err => {
					console.log(err)
				})
			},
			// 首页搜索事件
			getFontpageInfoBySearch: function(pageSize, pageNum) {
				let that = this
				let type = 4
				// 判断类型
				if (this.selectmark === -1 || this.selectmark === 0) {
					type = 4
				} else {
					type = this.selectmark - 1
				}
				// 页面参数为1时，清空页面
				let tabMark = this.tabMark
				if (pageNum === 1) {
					if (tabMark === 0) {
						this.fontpageLeft = []
						this.fontpageRight = []
						this.fontpageLeftLength = 0
						this.fontpageRightLength = 0
						this.fontTotalPageNum = 0
					}
					if (tabMark === 1) {
						this.internetLeft = []
						this.internetRight = []
						this.internetLeftLength = 0
						this.internetRightLength = 0
						this.internetTotalPageNum = 0
					}
					if (tabMark === 2) {
						this.financeLeft = []
						this.financeRight = []
						this.financeLeftLength = 0
						this.financeRightLength = 0
						this.financeTotalPageNum = 0
					}
					if (tabMark === 3) {
						this.consultLeft = []
						this.consultRight = []
						this.consultLeftLength = 0
						this.consultRightLength = 0
						this.consultTotalPageNum = 0
					}
					if (tabMark === 4) {
						this.consumLeft = []
						this.consumRight = []
						this.consumLeftLength = 0
						this.consumRightLength = 0
						this.consumTotalPageNum = 0
					}
					if (tabMark === 5) {
						this.otherLeft = []
						this.otherRight = []
						this.otherLeftLength = 0
						this.otherRightLength = 0
						this.otherTotalPageNum = 0
					}

				}
				// 判断行业
				let label = ''
				if (tabMark === 0) {
					label = ''
				}
				if (tabMark === 1) {
					label = '互联网'
				}
				if (tabMark === 2) {
					label = '金融'
				}
				if (tabMark === 3) {
					label = '咨询'
				}
				if (tabMark === 4) {
					label = '快消'
				}
				if (tabMark === 5) {
					label = '其他'
				}
				// 发送请求
				this.$axios.request({
					url: `/interview/getInterviewBySearch`,
					method: 'get',
					params: {
						type: type,
						content: this.searchtext,
						label: label,
						pageSize: pageSize,
						pageNum: pageNum
					}
				}).then(function({
					data
				}) {
					console.log(data)
					//将当前页码以及总页码存储,判断个数0是显示未搜索到结果
					if (tabMark === 0) {
						if(data.data.total === 0){
							that.fontSearchFlag = true
							return
						}
						that.fontCurrentPageNum = data.data.pageNum
						that.fontTotalPageNum = data.data.totalPage
					}
					if (tabMark === 1) {
						if(data.data.total === 0){
							that.interSearchFlag = true
							return
						}
						that.internetCurrentPageNum = data.data.pageNum
						that.internetTotalPageNum = data.data.totalPage
					}
					if (tabMark === 2) {
						if(data.data.total === 0){
							that.financeSearchFlag = true
							return
						}
						that.financeCurrentPageNum = data.data.pageNum
						that.financeTotalPageNum = data.data.totalPage
					}
					if (tabMark === 3) {
						if(data.data.total === 0){
							that.consultSearchFlag = true
							return
						}
						that.consultCurrentPageNum = data.data.pageNum
						that.consultTotalPageNum = data.data.totalPage
					}
					if (tabMark === 4) {
						if(data.data.total === 0){
							that.consumSearchFlag = true
							return
						}
						that.consumCurrentPageNum = data.data.pageNum
						that.consumTotalPageNum = data.data.totalPage
					}
					if (tabMark === 5) {
						if(data.data.total === 0){
							that.otherSearchFlag = true
							return
						}
						that.otherCurrentPageNum = data.data.pageNum
						that.otherTotalPageNum = data.data.totalPage
					}
					for (let i = 0; i < data.data.list.length; i++) {
						if(data.data.list[i].isFold === 1){
							if(data.data.list[i].openId === that.$store.state.userOpenID){
								that.compareUserUnlock(data.data.list[i])
							}
							else{
								continue
							}
						}
						else{
							// 先比较用户解锁
							that.compareUserUnlock(data.data.list[i])
						}
					}
					
				}).catch(err => {
					console.log(err)
				})
			},

			// 主页下拉刷新事件
			refreshFontpage1: function() {
				// 清空搜索框
				this.isRefreshed1 = true
				setTimeout(() => {
					this.isRefreshed1 = false
				}, 1000)
				if(this.searchtext.match(/^[ ]*$/)){
					this.homePageRefresh(20,1)
				}
				else{
					this.getFontpageInfoBySearch(20, 1)
				}
			},
			// 主页下拉刷新事件
			refreshFontpage2: function() {
				// 清空搜索框
				this.isRefreshed2 = true
				setTimeout(() => {
					this.isRefreshed2 = false
				}, 1000)
				if(this.searchtext.match(/^[ ]*$/)){
					this.homePageRefresh(20,1)
				}
				else{
					this.getFontpageInfoBySearch(20, 1)
				}		
			},
			refreshFontpage3: function() {
				// 清空搜索框
				this.isRefreshed3 = true
				setTimeout(() => {
					this.isRefreshed3 = false
				}, 1000)
				if(this.searchtext.match(/^[ ]*$/)){
					this.homePageRefresh(20,1)
				}
				else{
					this.getFontpageInfoBySearch(20, 1)
				}	
			},

			refreshFontpage4: function() {
				// 清空搜索框
				this.isRefreshed4 = true
				setTimeout(() => {
					this.isRefreshed4 = false
				}, 1000)
				if(this.searchtext.match(/^[ ]*$/)){
					this.homePageRefresh(20,1)
				}
				else{
					this.getFontpageInfoBySearch(20, 1)
				}	
			},

			refreshFontpage5: function() {
				// 清空搜索框
				this.isRefreshed5 = true
				setTimeout(() => {
					this.isRefreshed5 = false
				}, 1000)
				if(this.searchtext.match(/^[ ]*$/)){
					this.homePageRefresh(20,1)
				}
				else{
					this.getFontpageInfoBySearch(20, 1)
				}	
			},

			refreshFontpage6: function() {
				// 清空搜索框
				this.isRefreshed6 = true
				setTimeout(() => {
					this.isRefreshed6 = false
				}, 1000)
				if(this.searchtext.match(/^[ ]*$/)){
					// 重置主页列表
					this.otherLeft = []
					this.otherRight = []
					this.homePageRefresh(20,1)
				}
				else{
					// 重置主页列表
					this.otherLeft = []
					this.otherRight = []
					this.getFontpageInfoBySearch(20, 1)
				}	
			},
			onRestore1: function() {
				console.log('onRestore')
			},
			onRestore2: function() {
				console.log('onRestore')
			},
			onRestore3: function() {
				console.log('onRestore')
			},
			onRestore4: function() {
				console.log('onRestore')
			},
			onRestore5: function() {
				console.log('onRestore')
			},
			onRestore6: function() {
				console.log('onRestore')
			},
			// 切割用户实习标签
			cutCompanyLabel: function(offerList) {
				// 按'/'切割
				let temp = ''
				if (offerList.offerAuthentication === null) {
					temp = ''
				} else {
					temp = offerList.offerAuthentication.split('/')
				}
				// 剔除空白
				for (let k = 0; k < temp.length; k++) {
					if (temp[k] === '') {
						temp.splice(k, 1)
					}
				}
				temp = temp.slice(0,3)
				offerList.internship = []
				offerList.fulltime = []
				// 循环给实习全职赋值
				for (let j = 0; j < temp.length; j++) {
					if (temp[j].substring(0, 3) === '实习|') {
						offerList.internship.push(temp[j].substring(3))
					}
					if (temp[j].substring(0, 3) === '全职|') {
						offerList.fulltime.push(temp[j].substring(3))
					}
				}
				let tempLength = 0
				if(offerList.cover !== '' && offerList.cover !== null){
					tempLength += 6
				}
				tempLength += Math.ceil(offerList.title.length / 10) * 1.5
				if(offerList.summary !== undefined && offerList.summary !== null){
					tempLength += Math.ceil(offerList.summary.length / 15)
				}
				// 通过处于哪个tab渲染不同的主页数组
				if (this.tabMark === 0) {
					if(this.fontpageLeftLength <= this.fontpageRightLength){
						this.fontpageLeft.push(offerList)
						this.fontpageLeftLength += tempLength
					}else{
						this.fontpageRight.push(offerList)
						this.fontpageRightLength += tempLength
					}
				}
				if (this.tabMark === 1) {
					if(this.internetLeftLength <= this.internetRightLength){
						this.internetLeft.push(offerList)
						this.internetLeftLength += tempLength
					}else{
						this.internetRight.push(offerList)
						this.internetRightLength += tempLength
					}
				}
				if (this.tabMark === 2) {
					if(this.financeLeftLength <= this.financeRightLength){
						this.financeLeft.push(offerList)
						this.financeLeftLength += tempLength
					}else{
						this.financeRight.push(offerList)
						this.financeRightLength += tempLength
					}
				}
				if (this.tabMark === 3) {
					if(this.consultLeftLength <= this.consultRightLength){
						this.consultLeft.push(offerList)
						this.consultLeftLength += tempLength
					}else{
						this.consultRight.push(offerList)
						this.consultRightLength += tempLength
					}
				}
				if (this.tabMark === 4) {
					if(this.consumLeftLength <= this.consumRightLength){
						this.consumLeft.push(offerList)
						this.consumLeftLength += tempLength
					}else{
						this.consumRight.push(offerList)
						this.consumRightLength += tempLength
					}
				}
				if (this.tabMark === 5) {
					if(this.otherLeftLength <= this.otherRightLength){
						this.otherLeft.push(offerList)
						this.otherLeftLength += tempLength
					}else{
						this.otherRight.push(offerList)
						this.otherRightLength += tempLength
					}
				}
			},
			// 获取用户的收藏列表，判断是否收藏
			getUserCollectList: function(flag,isOld) {
				let that = this
				this.$axios.request({
					url: `/Message/collection`,
					method: 'get',
					params: {
						openid: this.$store.state.userOpenID
					}
				}).then(function({
					data
				}) {
					console.log(data)
					that.colList = data.data
					// 将收藏列表存入store
					that.$store.commit('updateCollectList', data.data)
					if(isOld){
						that.$nextTick(function(){
							that.localRefresh()
						})
						return
					}
					if (flag) {
						return
					}
					that.$nextTick(function() {
						that.homePageRefresh(20, 1)
					})
				}).catch(err => {
					console.log(err)
				})
			},
			// 本地局部刷新
			localRefresh:function(){
				for(let i = 0;i<this.fontpageLeft.length;i++){
					if (this.colList.length === 0) {
						this.fontpageLeft[i].isCollect = false
						this.fontpageRight[i].isCollect = false
					} else {
						for (let j = 0; j < this.colList.length; j++) {
							if (this.fontpageLeft[i].interviewexperienceId === this.colList[j].postId) {
								this.fontpageLeft[i].isCollect = true
							}
							if (this.fontpageRight[i].interviewexperienceId === this.colList[j].postId) {
								this.fontpageRight[i].isCollect = true
							}
						}
					}
					if (this.unlockList.length === 0) {
						this.fontpageLeft[i].isUnlock = false
						this.fontpageRight[i].isUnlock = false
					} else {
						for (let k = 0; k < this.unlockList.length; k++) {
							if (this.fontpageLeft[i].interviewexperienceId === this.unlockList[k].postId) {
								this.fontpageLeft[i].isUnlock = true
							}
							if (this.fontpageRight[i].interviewexperienceId === this.unlockList[k].postId) {
								this.fontpageRight[i].isUnlock = true
							} 
						}
					}
				}
			},
			// 比对收藏
			compareCollect: function(offerList) {
				// 收藏列表为空时
				if (this.colList.length === 0) {
					offerList.isCollect = false
				} else {
					for (let j = 0; j < this.colList.length; j++) {
						if (offerList.interviewexperienceId === this.colList[j].postId) {
							offerList.isCollect = true
							this.cutCompanyLabel(offerList)
							return
						} else {
							offerList.isCollect = false
						}
					}
				}
				this.cutCompanyLabel(offerList)
			},
			// 防止穿透点击的share函数
			shareButtonClick: function() {
				console.log('点击了share')
			},

			// 分享函数
			onShareAppMessage(options) {
				// 设置菜单中的转发按钮触发转发事件时的转发内容
				console.log(options.target.dataset.postid)
				var shareObj = {
					title: "豌豆派 | 职业发展内容分享社区",
					path: `/pages/fontpage/fontpage?shareOpenId=${this.$store.state.userOpenID}&sharePostId=${options.target.dataset.postid}`
				}
				return shareObj;
			},
			// 获取分享者的信息
			getSharePersonInfo: function(openId) {
				let that = this
				this.$axios.request({
					url: `/user/searchById`,
					method: 'get',
					params: {
						openid: openId
					}
				}).then(function({
					data
				}) {
					console.log(data)
					that.sharePersonInfo = data.data
					that.$nextTick(function() {
						that.cutShareLabel()
					})

				}).catch(err => {
					console.log(err)
				})
			},
			// 获取分享的面经信息 
			getShareInterviewInfo: function(postid, openid) {
				let that = this
				this.$axios.request({
					url: `/interview/GetInterviewExperience`,
					method: 'get',
					params: {
						id: postid,
						isLock: 0
					}
				}).then(function({
					data
				}) {
					console.log(data)
					that.shareInterviewInfo = data.data
					that.getSharePersonInfo(openid)

				}).catch(err => {
					console.log(err)
				})
			},
			// 切割分享的行业label
			cutShareLabel: function() {
				// 按'/'切割
				let that = this
				let offerList = this.shareInterviewInfo.interviewexperience.offerAuthentication
				let temp = ''
				if (offerList === null) {
					temp = ''
				} else {
					temp = offerList.split('/')
				}
				console.log(temp)
				// 剔除空白
				for (let k = 0; k < temp.length; k++) {
					if (temp[k] === '') {
						temp.splice(k, 1)
					}
				}
				console.log(temp)
				this.shareInterviewInfo.interviewexperience.internship = []
				this.shareInterviewInfo.interviewexperience.fulltime = []
				// 循环给实习全职赋值
				for (let j = 0; j < temp.length; j++) {
					if (temp[j].substring(0, 3) === '实习|') {
						console.log(temp[j].substring(3))
						this.shareInterviewInfo.interviewexperience.internship.push(temp[j].substring(3))
					}
					if (temp[j].substring(0, 3) === '全职|') {
						this.shareInterviewInfo.interviewexperience.fulltime.push(temp[j].substring(3))
					}
				}
				if (this.$store.state.isAuthorize === true) {
					this.$nextTick(function() {
						that.$mp.page.getTabBar().setData({
							show: false,
						})
						that.$refs.sharepopup.open()
					})
				}
			},
			// 获取解锁列表，主页渲染
			getUserUnlock: function(isOld) {
				let that = this
				this.$axios.request({
					url: `/Message/unlock`,
					method: 'get',
					params: {
						openid: this.$store.state.userOpenID,
					}
				}).then(function({
					data
				}) {
					console.log(data)
					that.unlockList = data.data
					// 解锁列表存储至store
					that.$store.commit('updateUnlockList', data.data)
					// 获取收藏列表
					that.$nextTick(function() {
						if(isOld){
							that.getUserCollectList(false,true)
						}
						else{
							that.getUserCollectList()
						}
					})
				}).catch(err => {
					console.log(err)
				})
			},
			// 比较用户是否解锁，渲染标签
			compareUserUnlock: function(offerList) {
				// 如果用户收藏列表长度为0，不会进入循环
				if (this.unlockList.length === 0) {
					offerList.isUnlock = false
				} else {
					for (let j = 0; j < this.unlockList.length; j++) {
						if (offerList.interviewexperienceId === this.unlockList[j].postId) {
							offerList.isUnlock = true
							this.compareCollect(offerList)
							return
						} else {
							offerList.isUnlock = false
						}
					}
				}
				this.compareCollect(offerList)
			},
			// 切换至条款页面
			switchToProvision: function() {
				uni.navigateTo({
					url: '../provision/provision'
				})
			},
			// 当用户在详情页操作时，更新主页的样式
			updateFontpageState: function() {
				// 进去时为全部
				if (this.$store.state.tempArea === 'font-left') {
					this.fontpageLeft[this.$store.state.tempNum].isCollect = this.$store.state.tempIsCollect
					this.fontpageLeft[this.$store.state.tempNum].isUnlock = this.$store.state.tempIsUnlock
					this.fontpageLeft[this.$store.state.tempNum].colNum = this.$store.state.tempColNum
				}
				if (this.$store.state.tempArea === 'font-right') {
					this.fontpageRight[this.$store.state.tempNum].isCollect = this.$store.state.tempIsCollect
					this.fontpageRight[this.$store.state.tempNum].isUnlock = this.$store.state.tempIsUnlock
					this.fontpageRight[this.$store.state.tempNum].colNum = this.$store.state.tempColNum
				}
				// 进去时为互联网
				if (this.$store.state.tempArea === 'inter-left') {
					this.internetLeft[this.$store.state.tempNum].isCollect = this.$store.state.tempIsCollect
					this.internetLeft[this.$store.state.tempNum].isUnlock = this.$store.state.tempIsUnlock
					this.internetLeft[this.$store.state.tempNum].colNum = this.$store.state.tempColNum
				}
				if (this.$store.state.tempArea === 'inter-right') {
					this.internetRight[this.$store.state.tempNum].isCollect = this.$store.state.tempIsCollect
					this.internetRight[this.$store.state.tempNum].isUnlock = this.$store.state.tempIsUnlock
					this.internetRight[this.$store.state.tempNum].colNum = this.$store.state.tempColNum
				}
				// 进去时为金融
				if (this.$store.state.tempArea === 'fin-left') {
					this.financeLeft[this.$store.state.tempNum].isCollect = this.$store.state.tempIsCollect
					this.financeLeft[this.$store.state.tempNum].isUnlock = this.$store.state.tempIsUnlock
					this.financeLeft[this.$store.state.tempNum].colNum = this.$store.state.tempColNum
				}
				if (this.$store.state.tempArea === 'fin-right') {
					this.financeRight[this.$store.state.tempNum].isCollect = this.$store.state.tempIsCollect
					this.financeRight[this.$store.state.tempNum].isUnlock = this.$store.state.tempIsUnlock
					this.financeRight[this.$store.state.tempNum].colNum = this.$store.state.tempColNum
				}
				// 进去时为咨询
				if (this.$store.state.tempArea === 'con-left') {
					this.consultLeft[this.$store.state.tempNum].isCollect = this.$store.state.tempIsCollect
					this.consultLeft[this.$store.state.tempNum].isUnlock = this.$store.state.tempIsUnlock
					this.consultLeft[this.$store.state.tempNum].colNum = this.$store.state.tempColNum
				}
				if (this.$store.state.tempArea === 'con-right') {
					this.consultRight[this.$store.state.tempNum].isCollect = this.$store.state.tempIsCollect
					this.consultRight[this.$store.state.tempNum].isUnlock = this.$store.state.tempIsUnlock
					this.consultRight[this.$store.state.tempNum].colNum = this.$store.state.tempColNum
				}
				// 快消
				if (this.$store.state.tempArea === 'consum-left') {
					this.consumLeft[this.$store.state.tempNum].isCollect = this.$store.state.tempIsCollect
					this.consumLeft[this.$store.state.tempNum].isUnlock = this.$store.state.tempIsUnlock
					this.consumLeft[this.$store.state.tempNum].colNum = this.$store.state.tempColNum
				}
				if (this.$store.state.tempArea === 'consum-right') {
					this.consumRight[this.$store.state.tempNum].isCollect = this.$store.state.tempIsCollect
					this.consumRight[this.$store.state.tempNum].isUnlock = this.$store.state.tempIsUnlock
					this.consumRight[this.$store.state.tempNum].colNum = this.$store.state.tempColNum
				}
				// 其他
				if (this.$store.state.tempArea === 'other-left') {
					this.otherLeft[this.$store.state.tempNum].isCollect = this.$store.state.tempIsCollect
					this.otherLeft[this.$store.state.tempNum].isUnlock = this.$store.state.tempIsUnlock
					this.otherLeft[this.$store.state.tempNum].colNum = this.$store.state.tempColNum
				}
				if (this.$store.state.tempArea === 'other-right') {
					this.otherRight[this.$store.state.tempNum].isCollect = this.$store.state.tempIsCollect
					this.otherRight[this.$store.state.tempNum].isUnlock = this.$store.state.tempIsUnlock
					this.otherRight[this.$store.state.tempNum].colNum = this.$store.state.tempColNum
				}
				// 更新收藏与解锁
				if (this.$store.state.unlockList !== '') {
					this.unlockList = this.$store.state.unlockList
				}
				if (this.$store.state.collectList !== '') {
					this.colList = this.$store.state.collectList
				}
			},
			// 通过share邀请新用户后获得豆子
			uploadShare: function() {
				let that = this
				this.$axios.request({
					url: `/user/upDateBeans`,
					method: 'get',
					params: {
						openid: this.shareOpenId,
						bean: 5,
						title: '邀请新好友'
					}
				}).then(function({
					data
				}) {
					console.log(data)
				}).catch(err => {
					console.log(err)
				})
			},
			// 打开重新登录弹窗
			openRelogin:function(){
				this.$mp.page.getTabBar().setData({
					show: false
				})
				this.$refs.relogin.open()
			},
			// 重新授权
			relogin:function(){
				let that = this
				this.$refs.relogin.close()
				uni.login({
					success(res) {
						console.log(res)
						// 获取登录code，登录
						that.$axios.request({
							url: `/user/login`,
							method: 'get',
							params: {
								code: res.code
							}
						}).then(function({data}) {
							console.log(data)
							// 请求无效拦截
							// 将平台的用户信息存储到vuex
							that.$store.commit('saveUserinfoPlatform', data.data)
							// 存储 token
							uni.setStorageSync('token', data.data.token)
							that.getUserUnlock()
							uni.showToast({
								title:'登录成功！'
							})
						}).catch(err => {
							console.log(err)
						})
					},
					fail(err) {
						console.log(err)
					}
				})
			}
		},

		onShow: function() {
			// 创建动画序列,三角形旋转动画
			var animation = uni.createAnimation({
				duration: 300,
				timingFunction: 'ease',
			})
			this.animation = animation
			//index为当前tab的索引
			this.setTabBarIndex(0)
			// 更新主页状态
			this.updateFontpageState()
			// 签到函数
			// this.sign()
		},
		onLoad: function(options) {
			if (this.$store.state.isLogin === false) {
				this.homePageRefresh(20, 1)
			} else {
				this.getUserUnlock()
			}
			let that = this
			console.log(options)
			//新人弹窗
			this.isLogin = this.$store.state.isLogin
			this.isAuthorize = this.$store.state.isAuthorize
			if (this.isLogin === false) {
				this.$refs.popup.open()
				this.$mp.page.getTabBar().setData({
					show: false
				})
			}
			// 计算scroll高度
			var systemHeight = 0
			var topHeight = 0
			var scrollHeight = 0
			// 获取屏幕高度
			uni.getSystemInfo({
				success(res) {
					console.log(res)
					systemHeight = res.screenHeight
				}
			})
			// 获取tab底部位置
			const query = uni.createSelectorQuery().in(this);
			query.select('.topTabbar').boundingClientRect(data => {
				topHeight = data.bottom
				// 计算高度
				scrollHeight = systemHeight - topHeight - 20
				that.scrollHight = scrollHeight
			}).exec();
			this.baseUrl = this.$store.state.baseUrl
			// 检测分享参数，如果有分享参数则获取分享信息
			console.log(options.shareOpenId)
			if (options.shareOpenId !== undefined) {
				this.shareOpenId = options.shareOpenId
				// 获取分享者和分享面经信息
			}
			if (options.sharePostId !== undefined) {
				// 获取分享者和分享面经信息
				this.getShareInterviewInfo(options.sharePostId, options.shareOpenId)
			}
			
		},
		watch: {
			// 监听是否授权的全局变化
			"$store.state.isAuthorize": function() {
				this.isAuthorize = this.$store.state.isAuthorize
			},
			"$store.state.reloginFlag":function(){
				console.log('监听到了login值改变')
				if(this.$store.state.reloginFlag === true){
					this.openRelogin()
				}
			}
		}
	}
</script>
<style>
	/* 当前页面背景色 */
	page {
		background-color: #F8F8F8;
	}
</style>
<style lang="less" scoped>
	// 首页头部

	.head {
		z-index: 1;
		height: 224upx;
		background-color: #00A29A;
		display: flex;
		align-items: center;
		position: relative;
		overflow: hidden;
		border-radius: 0 0 20upx 20upx;

		image {

			// wonderpeers
			&:nth-child(1) {
				width: 40%;
				height: 40%;
				margin-left: 30upx;
				z-index: 1;
			}

			// 豌豆派
			&:nth-child(2) {
				width: 20%;
				height: 20%;
				z-index: 1;
			}

			// 豌豆logo
			&:nth-child(3) {
				width: 130%;
				height: 130%;
				position: absolute;
				top: 0upx;
			}
		}
	}

	// 第五个tab取消浮动露出豌豆底部
	.head-no-overflow {
		overflow: visible;
		pointer-events: none;
	}

	// 头部搜索框
	.searchbar {
		position: relative;
		z-index: 2;
		transform: translateY(-50%);
		display: flex;

		.input-area {
			position: relative;

			input {
				box-sizing: border-box;
				background-color: #FFFFFF;
				height: 60upx;
				width: 500upx;
				font-size: 22upx;
				padding: 0 50upx 0 24upx;
				margin-left: 30upx;
				border-radius: 20upx;
				box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.03);
			}

			// 清除按钮
			.clearicon {
				width: 35upx;
				height: 35upx;
				position: absolute;
				right: 10upx;
				bottom: 13upx;
			}
		}


		// 筛选框
		.selector {
			border-radius: 20upx;
			height: 60upx;
			width: 156upx;
			background-color: #FFFFFF;
			color: #828282;
			font-size: 22upx;
			line-height: 60upx;
			text-align: center;
			box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.03);
			z-index: 2;
			margin-left: auto;
			margin-right: 30upx;

			image {
				margin: 0 0 0 10upx;
				width: 18upx;
				height: 18upx;
			}

			// 具体选项样式
			.selector-item {
				position: absolute;
				height: 320upx;
				width: 156upx;
				background-color: #FFFFFF;
				border-radius: 0 0 20upx 20upx;
				z-index: 1;
				transform: translateY(-20upx);

				view {
					&:nth-child(1) {
						height: 20upx;
					}

					border-radius: 0 0 20upx 20upx;
					background-color: #FFFFFF;
					height: 60upx;
					width: 156upx;
					box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.03);
					z-index: 1;
				}

			}

			// 选中样式
			.active {
				color: #40b9b3;
			}
		}

	}

	// 头部tabbar
	.topTabbar {
		height: 120upx;
		transform: translateY(-70%);
		z-index: 0;

		view {
			height: 120upx;
			font-size: 22upx;
			color: #323232;
			float: left;
			width: 100 / 6%;
			position: relative;
			background-color: #F8F8F8;

			text {
				width: 100%;
				position: absolute;
				bottom: 15%;
				text-align: center;
			}
		}

		.tabActive {
			border-radius: 0 0 20upx 20upx;
			background-color: #00A29A;
			color: #FFFFFF;
		}
	}

	// 页面主体区域

	.main {
		width: 100%;

		// 左半部分
		.left-body {
			margin: 0 10upx 0 20upx;
			width: 345upx;
			float: left;
		}

		// 面经
		.has-cover {
			border-radius: 20upx;
			background-color: #FFFFFF;
			margin-bottom: 20upx;
			position: relative;
			box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.05);

			// 背景图
			.bgimage-right {
				width: 160upx;
				height: 186upx;
				position: absolute;
				overflow: hidden;
				border-radius: 20upx;
				right: 0upx;
				top: 0upx;

				image {
					opacity: 0.1;
					right: -10upx;
					top: -10upx;
					width: 160upx;
					height: 186upx;
				}
			}

			.bgimage-left {
				width: 160upx;
				height: 186upx;
				position: absolute;
				overflow: hidden;
				border-radius: 20upx;
				left: 0upx;
				top: 0upx;

				image {
					opacity: 0.1;
					left: -10upx;
					top: -20upx;
					width: 160upx;
					height: 186upx;
				}
			}

			// 用户头像区
			.user {
				overflow: hidden;
				position: relative;
				margin: 0upx 0 24upx 24upx;
				padding-top: 24upx;
				height: 80upx;
				display: flex;
				align-items: center;
				z-index: 5;

				// 头像
				image {
					position: relative;
					width: 80upx;
					height: 80upx;
					margin-right: 10upx;
					border-radius: 50%;
					flex-shrink: 0;
				}

				.upArea {
					display: flex;
					align-items: center;
					font-size: 24upx;
					color: #333333;
					font-weight: bold;

					// 限制昵称超出长度省略号
					text {
						width: 225upx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}

				.downArea {
					position: relative;
					z-index: 2;
					display: flex;
					align-items: center;
					margin-top: 4upx;

					text {
						font-size: 16upx;
						color: #FFFFFF;
						background-color: #F2C94C;
						padding: 2upx 4upx;
						border-radius: 6upx;
						margin-right: 4upx;
					}

					.fulltime {
						background-color: #00a29a;
					}
				}
			}


			// 封面
			.cover {
				border-radius: 0;

				.cover-image {
					// 封面图
					position: relative;
					padding: 0;
					margin: 0;

					image {
						display: block;
						padding: 0;
						margin: 0;
						position: relative;
						border-radius: 0;
						width: 100%;
						height: 172upx;
						z-index: 2;
					}

					// 价格标签
					.price-label {
						position: absolute;
						bottom: -16upx;
						right: -15upx;
						width: 88upx;
						height: 32upx;
						display: flex;
						align-items: center;

						// 收费
						.not-free {
							display: flex;
							align-items: center;
							// 豆子
							.peers {
								z-index: 3;
								width: 30upx;
								height: 20upx;
								margin-left: 4upx;
							}

							// 价格
							.price {
								z-index: 3;
								margin-left: 5upx;
								font-size: 16upx;
								font-weight: bold;
								color: #00A29A;
							}
						}

						// 价格标签背景
						.labelbg {
							position: absolute;
							top: 0;
							left: 0;
							width: 88upx;
							height: 32upx;
						}

						// 免费字样
						.free {
							z-index: 3;
							margin-left: 14upx;
							font-size: 16upx;
							font-weight: bold;
							color: #FFFFFF;
						}

						// 已解锁
						.unlocked {
							z-index: 3;
							margin-left: 14upx;
							font-size: 16upx;
							font-weight: bold;
							color: #00A29A;
						}
					}
				}


				// 介绍文字
				text {
					display: block;

					// 标题
					&:nth-child(1) {
						margin: 0 24upx;
						text-align: justify;
						font-size: 32upx;
						font-weight: bold;
					}

					&:nth-child(2) {
						margin: 10upx 24upx;
						font-size: 20upx;
						font-weight: normal;
						color: #828282;
						text-align: justify;
					}

					&:nth-child(3) {
						margin: 0 24upx;
						font-size: 20upx;
						font-weight: 600;
						color: #595959;
						text-align: justify;
					}

				}
			}

			// 点赞及转发
			.like {
				border-radius: 0;
				float: right;
				display: flex;
				align-items: center;
				margin-right: 24upx;
				margin-left: auto;

				// 分享按钮样式
				.sharebutton {
					width: 42upx;
					height: 42upx;
					display: flex;
					align-items: center;
					justify-content: center;
					position: relative;
					margin-right: 10upx;

					image {
						width: 42upx;
						height: 42upx;
					}

					button {
						position: absolute;
						width: 42upx;
						height: 42upx;
						top: 0;
						right: 0;
						//border: 1px solid pink;
						background-color: rgba(0, 0, 0, 0);

						&::after {
							border: none;
						}
					}
				}

				.likeImg {
					margin-right: 10upx;
					width: 42upx;
					height: 42upx;
				}
				text {
					font-size: 18upx;
					color: #BDBDBD;
				}
			}
		}


		// 讲座
		.no-cover {
			border-radius: 20upx;
			background-color: #FFFFFF;
			margin-bottom: 20upx;
			position: relative;
			box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.05);

			// 标题
			.title {
				margin: 0upx 24upx 0 24upx;
				padding-top: 24upx;

				text {
					&:nth-child(1) {
						text-align: justify;
						font-size: 32upx;
						font-weight: bold;
					}

					&:nth-child(2) {
						font-size: 20upx;
						font-weight: bold;
						color: #00A29A;
						margin-left: 10upx;
					}
				}
			}

			// 时间及人数
			.time {
				margin: 0 24upx;

				text {
					font-size: 20upx;
					font-weight: bold;
				}

				image {
					margin: 0 10upx;
					width: 24upx;
					height: 17.5upx;
				}
			}

			// 详情
			.info {
				position: relative;

				text {
					display: block;
					margin: 10upx 24upx;
					color: #828282;
					text-align: justify;
					font-size: 20upx;
				}

				// 价格标签
				.price-label {
					position: absolute;
					bottom: -36upx;
					right: -15upx;
					width: 88upx;
					height: 32upx;
					display: flex;
					align-items: center;

					// 收费
					.not-free {
						display: flex;
						align-items: center;
						z-index: 3;

						// 豆子
						.peers {
							z-index: 3;
							width: 30upx;
							height: 20upx;
							margin-left: 4upx;
						}

						// 价格
						.price {
							z-index: 3;
							margin-left: 5upx;
							font-size: 16upx;
							font-weight: bold;
							color: #00A29A;
						}
					}

					// 价格标签背景
					.labelbg {
						position: absolute;
						top: 0;
						left: 0;
						width: 88upx;
						height: 32upx;
						z-index: 1;
					}

					// 免费字样
					.free {
						z-index: 3;
						margin-left: 14upx;
						font-size: 16upx;
						font-weight: bold;
						color: #FFFFFF;
					}

					// 已解锁
					.unlocked {
						z-index: 3;
						margin-left: 14upx;
						font-size: 16upx;
						font-weight: bold;
						color: #00A29A;
					}
				}
			}

			// 用户头像区
			// 用户头像区
			.user {
				margin: 24upx 0 24upx 24upx;
				height: 80upx;
				display: flex;
				align-items: center;
				z-index: 5;
				position: relative;

				image {
					position: relative;
					width: 80upx;
					height: 80upx;
					margin-right: 10upx;
					z-index: 2;
					border-radius: 50%;
				}

				.upArea {
					display: flex;
					align-items: center;
					font-size: 24upx;
					color: #333333;
					font-weight: bold;

					// 限制昵称超出长度省略号
					text {
						width: 225upx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}

				.downArea {
					position: relative;
					z-index: 2;
					display: flex;
					align-items: center;
					margin-top: 4upx;

					text {
						font-size: 16upx;
						color: #FFFFFF;
						background-color: #F2C94C;
						padding: 2upx 4upx;
						border-radius: 6upx;
						margin-right: 4upx;
					}

					.fulltime {
						background-color: #00a29a;
					}
				}
			}

			// 点赞及转发
			.like {
				z-index: 2;
				border-radius: 0;
				float: right;
				display: flex;
				align-items: center;
				margin-right: 24upx;
				margin-left: auto;

				// 分享按钮样式
				.sharebutton {
					width: 42upx;
					height: 42upx;
					display: flex;
					align-items: center;
					justify-content: center;
					position: relative;
					margin-right: 10upx;

					image {
						width: 42upx;
						height: 42upx;
					}

					button {
						position: absolute;
						width: 42upx;
						height: 42upx;
						top: 0;
						right: 0;
						//border: 1px solid pink;
						background-color: rgba(0, 0, 0, 0);

						&::after {
							border: none;
						}
					}
				}

				.likeImg {
					margin-right: 10upx;
					width: 42upx;
					height: 42upx;
				}

				text {
					font-size: 18upx;
					color: #BDBDBD;
				}

			}

			// 背景图
			.bgimage-left {
				width: 222upx;
				height: 222upx;
				position: absolute;
				overflow: hidden;
				left: 0upx;
				bottom: 0upx;
				border-radius: 20upx;

				image {
					left: -30upx;
					bottom: -30upx;
					opacity: 0.1;
					width: 222upx;
					height: 222upx;
				}
			}

			.bgimage-right {
				width: 200upx;
				height: 200upx;
				position: absolute;
				overflow: hidden;
				right: 0upx;
				bottom: 0upx;
				border-radius: 20upx;

				image {
					right: -30upx;
					bottom: -30upx;
					opacity: 0.1;
					width: 200upx;
					height: 200upx;
				}
			}
		}


		// 右半部分
		.right-body {
			margin: 0 20upx 0 10upx;
			width: 345upx;
			float: left;
		}
		
		// 没有搜索到任何东西
		.search-nothing{
			display: flex;
			align-items: center;
			justify-content: center;
			height: 80%;
			view{
				image{
					width: 80upx;
					height: 60upx;
					opacity: 0.9;
					margin-right: 10upx;
				}
				color: #BDBDBD;
				font-size: 24upx;
				display: flex;
				align-items: center;
			}
			
		}
		// 到底了
		.rearch-bottom{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #BDBDBD;
			font-size: 24upx;
			clear: both;
			padding: 30upx 0 40upx 0;
		}
	}

	// 广告
	// .advertisement {
	// 	background-color: #FFFFFF;
	// 	border-radius: 20upx;
	// 	margin-bottom: 20upx;
	// 	position: relative;
	// 	overflow: hidden;

	// 	image {
	// 		width: 100%;
	// 	}
	// }


	// 新人弹窗
	.rookie {
		width: 446upx;
		border-radius: 20upx;
		background-color: #FFFFFF;
		text-align: center;
		overflow: hidden;

		// 提示标题
		.title {
			display: block;
			margin-top: 52upx;
			font-size: 36upx;
			font-weight: 500;
		}

		// 豆子
		.peers {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 32upx;

			image {
				width: 60upx;
				height: 40upx;
			}

			text {
				font-size: 28upx;
			}
		}

		// 提示
		.notice {
			display: block;
			margin: 50upx 30upx 0 30upx;
			color: #828282;
			font-size: 20upx;

			text {
				color: #00A29A;
			}
		}

		button {
			margin: 10upx 30upx 30upx 30upx;
			background-color: #00A29A;
			color: #FFFFFF;
			border: none;
			font-size: 28upx;
			height: 78upx;
			border-radius: 20upx;
			line-height: 78upx;
		}
	}

	// 二次弹窗
	.second {
		width: 446upx;
		border-radius: 20upx;
		background-color: #FFFFFF;
		text-align: center;
		overflow: hidden;

		.title {
			display: block;
			margin-top: 52upx;
			font-size: 36upx;
			font-weight: 500;
		}

		// 提示
		.notice {
			display: block;
			margin: 24upx 30upx 0 30upx;
			color: #828282;
			font-size: 20upx;
		}

		.btngroup {
			display: flex;
			justify-content: space-between;
			margin: 14upx 20upx 30upx 20upx;

			button {
				font-size: 28upx;
				width: 180upx;
				height: 80upx;
				line-height: 80upx;
				border-radius: 20upx;

				&:nth-child(1) {
					border: 1.5px solid #00A29A;
					color: #00A29A;
					background-color: #FFFFFF;
				}

				&:nth-child(2) {
					color: #FFFFFF;
					background-color: #00A29A;
				}
			}
		}
	}

	// 豆子弹窗
	.peer-pop {
		background-color: none;
		font-size: 56upx;
		color: #FFFFFF;
		display: flex;
		align-items: center;

		image {
			width: 140upx;
			height: 100upx;
			margin-right: 20upx;
		}
	}

	// 签到弹窗
	.sign {
		width: 446upx;
		background-color: #FFFFFF;
		border-radius: 20upx;
		overflow: hidden;

		.title {
			text-align: center;
			color: #4F4F4F;
			font-size: 36upx;
			font-weight: 500;
			margin-top: 52upx;
		}

		.peers {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 36upx;
			color: #4F4F4F;
			font-size: 28upx;

			image {
				width: 44upx;
				height: 32upx;
				margin-right: 6upx;
			}
		}

		// 签到按钮
		.signbutton {
			button {
				height: 78upx;
				width: 384upx;
				background-color: #00A29A;
				color: #FFFFFF;
				font-size: 28upx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 20upx;
				margin-top: 72upx;
				margin-bottom: 30upx;
			}
		}
	}

	// 授权按钮
	.getInfo-btn {
		z-index: 20;
		width: 750upx;
		height: 2000upx;
		position: fixed;
		background-color: rgba(0, 0, 0, 0);
		top: 0;
		left: 0;

		&::after {
			border: none;
		}
	}

	// 分享弹窗
	.share-popup {
		background: #FFFFFF;
		border-radius: 20upx;
		width: 598upx;
		color: #333333;
		overflow: hidden;

		// 分享人
		.source {
			font-size: 32upx;
			margin: 60upx;
			font-weight: 500;
		}

		// 内容卡片
		.content-card {
			background: #FFFFFF;
			border: 1px solid #F2FAFA;
			width: 480upx;
			margin: 0 59upx;
			overflow: hidden;
			position: relative;

			// 内容标题
			.title {
				margin: 28upx;
				font-size: 36upx;
				font-weight: 600;

				text {
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}
			}

			// 内容详情
			.content {
				margin: 0 28upx;
				font-size: 24upx;

				text {
					text-align: justify;
					color: #828282;
					display: -webkit-box;
					-webkit-line-clamp: 3;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}
			}

			// 用户头像区
			.user {
				margin: 60upx 0 28upx 28upx;
				height: 80upx;
				display: flex;
				align-items: center;
				z-index: 5;
				position: relative;
				flex-shrink: 0;

				// 头像
				image {
					position: relative;
					width: 94upx;
					height: 94upx;
					margin-right: 10upx;
					z-index: 2;
					border-radius: 50%;
				}

				// 昵称
				.upArea {
					display: flex;
					align-items: center;
					font-size: 26upx;
					color: #333333;
					font-weight: bold;
				}

				.downArea {
					position: relative;
					z-index: 2;
					display: flex;
					align-items: center;
					margin-top: 4upx;

					text {
						font-size: 16upx;
						color: #FFFFFF;
						background-color: #F2C94C;
						padding: 2upx 6upx;
						border-radius: 6upx;
						margin-right: 10upx;
					}

					// 全职label
					.fulltime {
						background-color: #00a29a;
					}
				}
			}

			// 背景图片
			.bgimg {
				opacity: 0.1;
				position: absolute;
				bottom: -40upx;
				right: -20upx;
				width: 220upx;
				height: 220upx;
			}
		}

		// 底部卡片
		.bottom-btn {
			margin: 78upx 0 40upx 0;
			display: flex;
			align-items: center;

			button {
				width: 384upx;
				height: 78upx;
				display: flex;
				border-radius: 20upx;
				align-items: center;
				justify-content: center;
				font-size: 14px;
				color: #FFFFFF;
				background-color: #00a29a;

				&::after {
					border: none;
				}
			}
		}
	}
	
	// 重新登录弹窗样式
	.relogin{
		width: 446upx;
		background-color: #FFFFFF;
		border-radius: 20upx;
		overflow: hidden;
		text{
			display: block;
			&:nth-child(1){
				text-align: center;
				color: #4F4F4F;
				font-size: 36upx;
				font-weight: 500;
				margin: 52upx 0 36upx 0;
			}
				
			&:nth-child(n+2){
				text-align: center;
				justify-content: center;
				color: #828282;
				font-size: 20upx;
			}
		}
		button{
			height: 78upx;
			width: 384upx;
			background-color: #00A29A;
			color: #FFFFFF;
			font-size: 28upx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 20upx;
			margin-top: 72upx;
			margin-bottom: 30upx;
		}
	}
</style>
