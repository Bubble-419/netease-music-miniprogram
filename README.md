# 微信小程序仿网易云音乐：复盘从0到1的过程
## 前言

断断续续地肝完了本学期的大项目，来好好复盘一下第一次做小程序的过程，总结一些经验和教训。总体上来说学习小程序难度并不是很大，尤其是接触过Vue以后，配合官方文档就很容易入门了，主要就是移动端布局+组件化思想。

这次的复盘将从功能块入手，难点主要集中在**音乐播放**这一块，反思一些**页面功能的实现过程**以及**如何更好做到组件化开发**。

**项目GitHub地址**

[小程序实现网易云音乐](https://github.com/Bubble-419/netease-music-miniprogram)

**API**

[binaryify大佬抓的网易云API](https://binaryify.github.io/NeteaseCloudMusicApi/#/)

**技术栈**

- 原生微信小程序
- Less预处理语言

**UI组件库**

Vant

## 前期准备

### 封装API

1. 在utils文件夹中新建一个`api.js`，用来封装项目需要用到的api。

2. 声明全局变量，包括前置url、token和cookie。

3. 用Promise封装请求函数，因为`wx.request`本身不支持Promise风格调用。

   ```javascript
   function request(method, url, data) {
     return new Promise((resolve, reject) => {
       wx.request({
         url: baseUrl + url,
         data: data,
         header: {
           'content-type': 'application/json',
           'Authorization': 'Bearer ' + token ? token : '',
         },
         method: method,
         dataType: 'json',
         responseType: 'text',
         success: (result) => {
           resolve(result);
         },
         fail: (err) => {
           reject(err);
         },
       });
     })
   }
   ```

4. 导出接口函数：把不同的接口方法封装在exports对象里，外部需要使用时直接调用即可。

### 全局样式

这次项目我首次使用了Less，作为一门CSS预处理语言，它使得CSS代码的风格更贴近编程的习惯，用来处理一些全局样式也更方便。

### 规划组件

在正式开始写代码之前可以观察一下网易云音乐app的界面，提前设计和规划一些通用程度比较高的组件，避免后期开始写了再提取组件重构页面。

**规划组件包括样式和 `props` 两方面**。

比如一定会牵涉到的歌曲组件，在首页、搜索、歌单页都会有。

![image-20211117133658844](C:\Users\胖可丁\AppData\Roaming\Typora\typora-user-images\image-20211117133658844.png)

- 观察它们的异同点，可以得出对歌曲组件在样式上的设计：

![image-20211117134216449](C:\Users\胖可丁\AppData\Roaming\Typora\typora-user-images\image-20211117134216449.png)

- 确定了样式以后，就可以得到组件所需的`props`，比如上图的歌曲组件，需要的`props`有歌曲名、tags、歌手、专辑、专辑封面图、序号等。

  **传入`props`有两种方式**：传入一个对象或者只传入组件所需的属性。传入对象比较省事，避免了冗长的组件书写，但是传入属性比较符合复用性，因为很多情况下从api获取到的数据对象的属性名都是不一样的。

有的时候，**组件需要对`props`数据进行一些操作**，比如希望在组件挂载时利用`props`发送请求，或者对`props`进行修改。

- 当组件异步获取`props`数据，却同步被挂载时，是没办法拿到`props`的，解决方法有**给`props`设置`observers`数据监听器**或**在wxml中给组件加上条件渲染**，确保我们希望的操作是在获取到`props`后进行的。
- 根据组件间数据的单项流动性，子组件对`props`是不应该直接进行修改的，可以通过`triggerEvent`和父组件通信，由父组件对数据进行修改。但是有的时候，数据的修改需要即时的反馈，比如点赞数目增加、点击歌曲喜欢等，如果等到通信之后再刷新数据，会影响用户体验。这种情况可以**把`props`内化成组件内部数据，需要修改时，先修改内部数据（直接反馈到视图层），再发送请求，真正修改数据**。

在本项目中，为了满足复用需求，我把很多部分都抽出来做成了组件：

- 比较小型的组件：比如关注用户、点赞、加载中，这类比较细的功能抽成组件以后，使用起来会很灵活
- 复用性比较高的组件：比如上例中的歌曲组件、歌单组件、在搜索结果页中歌单用户专辑等都通用的组件
- 满足一些特定页面需求的组件：评论组件、评论内容组件，播放歌曲页的播放器wrapper组件和歌曲页尾部组件

## 页面实现

组件写好以后，实现页面就像一个拼拼图的过程，只要把该放在一起的东西拼起来就好了。这里简要复盘一下各个页面的实现。

1. #### 首页

   <img src="C:\Users\胖可丁\Downloads\1637150653312.gif" alt="1637150653312" style="zoom:67%;" />

   - **页面结构**：搜索框+轮播图+其他页面入口+首页展示块

     其中首页展示块（推荐音乐列表、推荐歌单等等）只需要使用组件展示即可，页面结构不复杂。

   - **页面数据**：主要是通过 *获取首页信息* 这个接口获取到用户的首页展示块信息，由于返回数据很多是我并不需要的，所以对数据做了一层封装。

     ```javascript
     setBlocks: function () {
     api.getIndexBlocks({}).then(res => {
       if (res.data.code === 200) {
         // 筛选出歌单
         let indexPlaylists = res.data.data.blocks.filter(item => {
           return item.showType === "HOMEPAGE_SLIDE_PLAYLIST"
         });
         // 修改action
         indexPlaylists.map(item => {
           item.action = "goToPlaylists"
         });
         this.setData({
           // 筛选banner
           banners: res.data.data.blocks.find(item => {
             return item.showType === "BANNER";
           }).extInfo.banners,
           indexPlaylists,
           // 筛选歌曲列表
           indexSongList: res.data.data.blocks.filter(item => {
             return item.showType === "HOMEPAGE_SLIDE_SONGLIST_ALIGN"
           }),
         })
       }
     })
     },
     ```

2. #### 搜索页

   <img src="C:\Users\胖可丁\Downloads\1637151486453.gif" alt="1637151486453" style="zoom:67%;" />

   - **页面结构**：搜索头部组件（包括搜索框+搜索联想）+（历史搜索+热搜榜）/（搜索结果tab页）

     之所以一个页面杂糅了搜索页和搜索结果页，是因为根据网易云音乐app的设计，搜索头部组件是搜索页和搜索结果页都有的，即用户可以在结果页再次进行搜索，我认为放在同一个页面可以实现更无痛刷新的效果，加强用户体验。

   - **页面逻辑**：

     1. 历史搜索记录：注意搜索记录是每次打开搜索页都要展示的，应该放在本地存储，记录的搜索时间越近在数组中越靠前（应使用`unshift()`），且需要去重

        ```javascript
          // 搜索，传参是搜索关键词
        onSearch: function (value) {
            this.setData({
              value: value
            });
            // 存储搜索历史
            // 注意历史记录应该是一个需要去重的栈
            let history = wx.getStorageSync('history') || [];
            history.unshift(this.data.value);
            history = Array.from(new Set(history));
            wx.setStorageSync("history", history);
            // 跳往搜索展示页
            this.setAllRes();
            this.setData({
              showType: 3
            });
         },
        ```

     2. 搜索结果展示：获取标签页的类别值，切换标签时就相应地发送请求获取数据即可

3. #### 歌单广场页

   <img src="C:\Users\胖可丁\Downloads\1637153974703.gif" alt="1637153974703" style="zoom:67%;" />

   - **页面结构**：标签页+存放歌单wrapper组件的容器+歌单wrapper组件
   - **页面数据**：推荐页的精选歌单和私人推荐歌单需要额外api获取，其他标签页的歌单都是通过标签页的类别值获取对应tag的歌单

4. #### 歌单/榜单详情页

   <img src="C:\Users\胖可丁\Downloads\1637154489438.gif" alt="1637154489438" style="zoom:67%;" />

   - **页面结构**：弧形歌单信息+歌单交互+歌单歌曲

   - **页面设计**：八百年前学过的毛玻璃效果派上用场了！！！这里重温一下背景的毛玻璃效果（页面其他部分都是普通的flex布局）

     1. ```html
        <!-- 把盒子的背景利用行内样式声明为专辑封面 -->
        <view class="top frosted-glass" style="background:url({{playlist.coverImgUrl}})"></view>
        ```

     2. ```less
        // 毛玻璃效果的外层盒子
        .frosted-glass {
          position: relative;
          overflow: hidden;
          z-index: 100;
        // 毛玻璃效果实现
          &::before {
            content: '';
            position: absolute;
            // 玻璃需要继承背景，且要比外层盒子更大
            background: inherit;
            width: 200%;
            height: 200%;
            top: -100rpx;
            left: -100rpx;
            filter: blur(50rpx);
            z-index: -1;
          }
        }
        ```

   - **页面数据**：页面数据获取逻辑也很简单，把歌单id通过路由传入，页面在onLoad方法里获取，再发送请求即可

5. #### 私人FM&歌曲播放页

   <img src="C:\Users\胖可丁\Downloads\1637156385875.gif" alt="1637156385875" style="zoom:67%;" />

   <img src="C:\Users\胖可丁\AppData\Roaming\Typora\typora-user-images\image-20211117214220027.png" alt="image-20211117214220027" style="zoom:67%;" />

   - **页面结构**：歌曲信息头部（私人FM页没有）+歌曲播放wrapper+歌曲播放页尾部组件
   - **页面逻辑**：歌曲播放页负责通过管理音频管理器对象来管理歌曲的跳转和切换功能，详见[主要功能逻辑实现中的歌曲处理部分](#歌曲处理)

6. #### 评论页

   <img src="C:\Users\胖可丁\Downloads\1637157210906.gif" alt="1637157210906" style="zoom:67%;" />

   - **页面结构**：标签页+评论项组件

   - **页面逻辑**：评论页只负责获取歌曲/歌单的评论（即发送请求），对于评论的操作（点赞、查看楼层评论等等）交给评论项组件控制。

     我的思路是用两个组件来实现评论，一个是评论内容组件（`commentContent`），包括评论者信息+评论文本+点赞组件，一个是评论项组件(`commentItem`)，包括评论内容组件+回复弹窗，这么做是为了解耦楼层评论和普通评论。在评论项组件中发送请求获取楼层评论，也使得评论内容组件的功能更清晰。

7. #### 排行榜页

   <img src="C:\Users\胖可丁\Downloads\1637157552313.gif" alt="1637157552313" style="zoom:67%;" />

   - **页面结构**：榜单item组件+歌单wrapper组件
   - **页面逻辑**：榜单也属于歌单的一种，所以相同逻辑的歌单组件用起来很方便。

8. #### 登录&个人中心页

   <img src="C:\Users\胖可丁\AppData\Roaming\Typora\typora-user-images\image-20211117231909939.png" alt="image-20211117231909939" style="zoom:67%;" />

   <img src="C:\Users\胖可丁\AppData\Roaming\Typora\typora-user-images\image-20211117234726745.png" alt="image-20211117234726745" style="zoom:67%;" />

   <img src="C:\Users\胖可丁\AppData\Roaming\Typora\typora-user-images\image-20211117231815554.png" alt="image-20211117231815554" style="zoom:67%;" />

   - **页面逻辑**：当某个页面需要登录才能查看时，会跳转到登录页，只接受手机号+验证码方式的登录方式。登录成功后会把用户id、cookie和token存储在本地。

## 主要功能逻辑实现

### 展示内容实现（加载+被展示内容+分页）

展示内容的实现逻辑在很多地方都是通用的，包括评论页、歌单广场页、搜索结果页等等，这里以**歌单广场页**为例，复盘一下展示内容的实现逻辑。

1. **封装`Loading`组件**

   <img src="C:\Users\胖可丁\Downloads\1637221028891.gif" alt="1637221028891" style="zoom:67%;" />

   加载动画的控制在很多地方都用得到，所以封装成一个组件会比较合适，组件的显示状态由使用组件的页面控制，因此只接受一个`props`，即`isLoading`。

   ```less
   // Loading动画
     i {
       display: inline-block;
       width: 8rpx;
       height: 50%;
       margin: 0 3rpx;
       .round(8rpx);
       animation: load 1s ease infinite;
   
         // 递归调用mixin生成循环，给每个子元素不同的动画延迟值
       .load-mixin(@selector) when(@selector <=5) {
         &:nth-child(@{selector}) {
           animation-delay: (@selector - 1)*0.2s;
         }
   
         .load-mixin(@selector + 1)
       }
   
       .load-mixin(2);
     }
   
     @keyframes load {
   
       0%,
       100% {
         height: 20rpx;
         background-color: lighten(@font-gray, 60%);
       }
   
       50% {
         height: 40rpx;
         background-color: @light-netease-red;
       }
     }
   ```

2. **列表渲染**

   把需要展示的元素（在歌单广场页中，需要展示的是歌单组件）通过列表渲染展示出来，使用`block`标签作为循环的包装元素，会让wxml的结构更清楚，注意`block`标签不会被渲染成节点，仅仅作为一个控制循环的包装元素。

   ```html
   <view class="container" wx:else>
   <view class="list-box">
     <block wx:for="{{tagPlaylist}}" wx:key="item.id">
       <view class="list-item">
         <playlist-wrapper itemId="{{item.id}}" picUrl="{{item.coverImgUrl}}" name="{{item.name}}" count="{{item.playCount}}"></playlist-wrapper>
       </view>
     </block>
   </view>
   </view>
   ```

3. **分页控制**

   在小程序中，分页通常是通过用户上拉页面完成的，因此分页的交互过程就是：**用户上拉页面 --> 展示Loading组件，发送请求 --> 获取返回结果并渲染，隐藏Loading组件**。

   - 通过`onReachBottom`方法监听用户上拉页面的操作

     ```javascript
     // 触底加载更多
     onReachBottom: function () {
         if (this.data.hasMore) {
             // 切换Loading状态    
           this.setLoading();
             // 发送请求
           this.setTagPlaylist({
             cat: this.data.tabsActive,
             before: this.data.offset,
             limit: 18
           });
         };
     },
     ```
     
     这里的分页参数`before`直接取data中的分页数据`offset`是因为这个接口（歌单）要求的分页参数是上一页最后一个歌单的 `updateTime` 属性，所以在获取返回结果后就直接设置`offset`的值了。
     
     如果api是需要按照第n页的格式来分页的话，应该先把`offset`的值+1，再发送请求。
   
   - 在移动端中展示分页数据，我的思路是把返回结果拼接在原数组上，加载完后直接显示。
   
     ```js
     this.setData({
       offset: res.data.lasttime,
       tagPlaylist: this.data.tagPlaylist.concat(res.data.playlists),
       hasMore: res.data.more
     });
     ```
   
   - 当在标签页中展示内容时，要注意每切换一个标签，需要重置`offset`的值。

### 歌曲处理

1. **处理音频管理器实例对象**

   通过api获取歌曲的url以后，在小程序中进行音乐播放需要通过`wx.getBackgroundAudioManager()`获取小程序唯一的音频管理器对象，并把api返回的歌曲url赋值给实例对象的src属性。

   定义实例对象的`onTimeUpdate`方法，实时获取音频当前播放的秒数。注意音频总时长也是在这个方法中获取，在其它方法中获取会失效。

   ```js
    initBackgroundAudioManager: function () {
       api.getSongUrl({
         id: this.data.song.id
       }).then(res => {
         if (res.data.code === 200 && res.data.data[0].url) {
           bam.src = res.data.data[0].url;
           // 给实例的其他属性值赋值
           bam.title = this.data.song.name;
           bam.epname = this.data.song.al.name;
           bam.coverImgUrl = this.data.song.al.picUrl;
           bam.singer = this.data.song.ar[0].name;
           bam.onTimeUpdate(() => {
             this.setData({
               songDuration: bam.duration,
             });
             if (!this.data.onSlide) {
               this.setData({
                 songCurr: bam.currentTime,
               })
             }
           });
           bam.onEnded(() => {
             this.onSwitchSong({
               detail: {
                 flag: true
               }
             });
           });
         }
       })
    },
   ```

2. **歌词处理**

   对歌词的处理被我封装在了`songWrapper`组件中，包括两部分：**格式化歌词**、**处理歌词跳动**。

   - **格式化歌词**

     通过api拿到的歌词是一个长文本，我的处理思路是把长文本分割成数组，数组元素是歌词对象，即每一句歌词都是一个歌词对象，包括`lid`和`lrc`两个属性，`lid`表示该句歌词对应的秒数，`lrc`表示这句歌词的字符串。

     ```js
     formatLyrics: function (lrc) {
         // 1. 利用split方法把歌词按照"\n"分隔成字符串数组
       let lrcArr = lrc.split("\n");
         // 注意数组的最末元素是一个空字符串，需要处理掉
       lrcArr.pop();
       let res = [];
         // 封装歌词对象
       for (let lyric of lrcArr) {
         let pos = lyric.indexOf(']');
           // lid是格式化后的，在util中定义了一个方法转化为秒数，即01:53 ==> 113(s)
         let lid = util.formatLyc(lyric.slice(1, pos));
         if (pos !== -1) {
           res.push({
             lid,
             lrc: lyric.slice(pos + 1)
           })
         }
       }
       return res;
     },
     ```

   - **处理歌词跳动**

     歌词跳动有两种情况：

     1.  随着音乐播放自动跳向下一行

             2. 音频进度改变，歌词需要跳动到相应进度的部分

     由于歌词是被封装在组件中的，组件接收一个`songCurr`的`props`，即音频的当前播放时间，通过监听`songCurr`值的变化来改变歌词。但因为组件无法知道歌词的跳动属于上述两种情况的哪种，所以也需要父组件提供一个`props`告知。

     知道歌词的跳动是哪种情况后，怎么让歌词实现滚动呢？

     使用`scroll-view`容器（注意一定要给一个高度），通过控制其`scroll-top`属性的值，实现容器向上滚动的效果。（曾经考虑从过`scroll-into-view`属性，后来发现这个属性适用于容器高度只允许展示一个子元素的情况。）

     `scroll-top`属性的值通过当前歌词索引值来确定，即需要知道“音频当前播放时间所对应的歌词在哪一行“，因为`songCurr`的值基本不可能和歌词秒数对上，所以只能采取比较的方法得出当前歌词索引值：当`songCurr`的值大于当前歌词的下一行歌词对象的`lid`时(`this.data.lyrics[this.data.lyricIndex + 1].lid`)，当前歌词需要移动。

     ```js
     'songCurr': function (val) {
       if (val) {
         // 歌词跳去某一句
         if (this.properties.jumpLyc) {
           let lyricIndex = this.data.lyrics.findIndex(lyc => {
             return this.properties.songCurr < lyc.lid;
           }) - 1;
           this.setData({
             scrollVal: lyricIndex * 34,
             lyricIndex,
           });
           this.triggerEvent('jumpEnd');
         } else if (this.data.lyricIndex < this.data.lyrics.length - 1) {
           // 歌词正常往下移动
           if (val >= this.data.lyrics[this.data.lyricIndex + 1].lid) {
             this.setData({
               lyricIndex: this.data.lyricIndex + 1,
               scrollVal: this.data.lyricIndex * 34
             });
           };
         };
       };
     },
     ```

3. **进度条交互处理**

   - 进度条的本质是一个`slider`组件，其值会随着音频播放而增大，用户也可以拖动进度条来改变`slider`的值。组件接受`max`属性和`value`属性，在这里分别是歌曲总时长和当前播放进度。

     同时进度条还需要对这两个属性值进行包装，因为展示给用户的值应该是`01:53`这样的形式，而不是`113s`。

     为了避免页面的数据冗余（因为包装后的属性值在页面其他地方用不到），所以我把进度条封装成了一个组件，接收当前音频进度值`songCurr`和音频总时长`songDuration`两个`props`，在组件内定义两个包装数据`songCurrShow`和`songDurationShow`。

     ```js
     /**
     * 表示时间的两种格式：
     * 1. 音频管理器实例：以秒为单位，无格式，type为Number，精确位数不定（ex: 1.013573，表示第1.013573秒）
     * 2. 界面展示时间：格式为[00:00]，type为String（ex：[02:53]，表示第2分钟第53秒）
     * 把第一种时间转换为第二种
     */
     formatSec: (time) => {
         let min = '00',
           sec = '00.000';
         if (typeof time == 'String') time = Number(time);
         if (time) {
           // 对分钟进行格式化
           min = ('0' + Math.floor(time / 60)).slice(-2);
           // 对秒钟进行格式化
           let secArr = (time % 60).toString().split('.');
           sec = secArr[0];
           sec = sec.length === 1 ? '0' + sec : sec;
         }
         return `${min}:${sec}`;
     },
     ```

   - 当用户拖动进度条时，由于`onTimeUpdate`方法中`songCurr`是实时更新的，因此会出现进度条闪回的bug。我的处理是在`onTimeUpdate`方法中加一层判断，即当用户开始拖动时，不实时更新`songCurr`的值。

     ```js
       if (!this.data.onSlide) {
         this.setData({
           songCurr: bam.currentTime,
         })
       }
     ```

     注意背景音频管理器是在歌曲播放页面`playSong.js`定义和管理的，而拖动进度条的事件监听在进度条组件中，因此这里需要子组件和父组件通信。

4. **切换歌曲**

   - **歌曲列表**

     歌曲列表作为全局变量存储在`app.js`里，每次搜索后、点击歌单、点击私人FM等都会改变歌曲列表，歌曲列表里存储的是歌曲的id值

   - 切换歌曲的思路是：找到当前歌曲在歌曲列表中的索引值，再根据用户操作（上一首还是下一首）来获取要播放歌曲的id，重新调用当前页面的`onLoad`方法来刷新。

     ```js
     // 监听切歌事件
     onSwitchSong: function (e) {
         // 获取歌曲列表
         let wsl = app.globalData.waitingSongsList;
         let pos = wsl.findIndex(s => {
           return s.id === this.data.song.id
         });
         let target = pos + 1;
         // true:next false:prev
         if (e.detail.flag) {
           // 当前已经是最后一首时，循环播放
           if (target > wsl.length - 1) {
             target = 0;
           }
         } else {
           target = pos - 1;
           // 第一首时，跳到最后一首
           if (target < 0) {
             target = wsl.length - 1;
           }
         }
         let curPages = getCurrentPages();
         curPages[curPages.length - 1].onLoad({
           ids: wsl[target].id
         });
     },
     ```

## 总结

网易云音乐小程序实现起来还是比较流畅的，这次的项目中我还学会了使用Less预处理语言，以及如何用GitHub的issue来管理项目进程、尽量多写注释等，这样复盘时也能更轻松。

自己也有需要改进的地方，封装组件的工作很多都是我写完一个页面后才反应过来“可以把某一部分封装成组件”，又加大了不少工作量，如果能从一开始就观察和规划好组件的话，开发起来能更顺利，减轻后期重构的压力。
