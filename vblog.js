app.component('vblog', {
    props: {
        taskId: String,
        zIndex: Number,
        maximized: Boolean,
        minimized: Boolean
    },
    data() {
        return {
            prevEnable: false,
            nextEnable: false,
            refname: 'vblog',
            posts: [],
            currentIndex: 0,
            currentPost: {},
            blogBoxBackup: {},
            isMaximized: false,
            blogBox: {
                marginTop: '10px',
                marginLeft: '100px',
                opacity: 1,
                zIndex: 1,
                width: '800px',
                height: '600px'
            },
            visible: true
        }
    },
    template:
    `
<transition name="genericWindow" >
<div v-if="visible" class="generic-frame" :style="blogBox" id="clickable" @mousedown="moveStart($event)" @dblclick="doAction($event)">
         <div class="window-header noselect" id="clickable">
               <div class="window-title" ><div id="clickable">{{ this.currentPost.title }}</div></div>
                <div class="action-buttons" id="clickable">
                    <button v-on:click="minimizeWindow" class="btn-action-generic"><i class="fas fa-window-minimize fa-lg"></i></button>
                    <button v-on:click="maximizeWindow" class="btn-action-generic"><i class="fas fa-window-maximize fa-lg"></i></button>
                    <button v-on:click="closeWindow" class="btn-action-generic btn-action-generic-close"><i class="fas fa-times fa-lg"></i></button>
                </div>
         </div>
<div class="generic-window">

<div class="nav-buttons">
<button :disabled='!prevEnable' class="nav-btn" @click="navPostLeft" ><i class="fas fa-arrow-left fa-lg"></i></button>
<button :disabled='!nextEnable' class="nav-btn" @click="navPostRight"><i class="fas fa-arrow-right fa-lg"></i></button>
</div>

<div class="blog-content">

<div class="post-header">
<h1>{{ this.currentPost.title  }}</h1>
<div class="post-author">{{ this.currentPost.author }}</div>
<div class="post-date">{{ this.currentPost.date  }}</div>
</div>

<div class="post-content">

<p v-html="this.currentPost.content" />



</div>

</div>
</div>
</div>
</transition>
`,
    mounted() {
        if (this.$props.minimized) {
            this.minimizeWindow()
        }
    },
    created: function () {
        this.blogBox.zIndex = this.$props.zIndex
        this.fetchPosts();
        if (this.$props.minimized) {
            this.visible = false
        }
        if (this.$props.maximized) {
            this.blogBox.isMaximized = this.$props.maximized
            this.maximizeWindow()
        }
    },
    methods: {
        changeZIndex(val) {
            this.blogBox.zIndex = val
        },
        checkPostsAvailabity() {
            const n_posts = this.posts.length
            console.log(n_posts)
            if (this.currentIndex === n_posts - 1) {
                this.nextEnable = false
            }
            else {
                this.nextEnable = true
            }
            if (this.currentIndex === 0) {
                this.prevEnable = false
            }
            else {
                this.prevEnable = true
            }
        },
        navPostLeft() {
            const prevIndex = this.currentIndex - 1
            if (prevIndex >= 0) {
                this.currentPost = this.posts[prevIndex]
                this.currentIndex = prevIndex
            }
            this.checkPostsAvailabity()
        },
        navPostRight() {
            const nextIndex = this.currentIndex + 1
            if (nextIndex < this.posts.length) {
                this.currentPost = this.posts[nextIndex]
                this.currentIndex = nextIndex
            }
            this.checkPostsAvailabity()
        },
        closeWindow(event) {
            this.$emit('close-window', {taskId: this.$props.taskId, ref: this.refname})
        },
        doAction(event) {
            if (event.type === "dblclick" && event.target.id === "clickable") {
                this.maximizeWindow()
            }  
        },
        openWindow() {
            this.visible = true
        },
        minimizeWindow() {
            this.$emit('minimize-window', {trigger: this.openWindow, name: 'v-Blog', icon: 'widgets/vblog/assets/imgs/icon.png', taskId: this.$props.taskId})
            this.visible = false
        },
        maximizeWindow() {

            if (!this.isMaximized) {
                console.log(window.innerHeight)
                this.blogBoxBackup = JSON.parse(JSON.stringify(this.blogBox))
                this.blogBox.width = (window.innerWidth - 85) + 'px'
                this.blogBox.height = window.innerHeight + 'px'
                this.blogBox.marginLeft = '78px'
                this.blogBox.marginTop = '-10px'
                this.isMaximized = true
            }
            else {
                this.isMaximized = false
                const prevValues =  JSON.parse(JSON.stringify(this.blogBoxBackup))
                this.blogBox = prevValues
                console.log(this.blogBoxBackup)
            }
            
        },
        setOpacity(opacity) {
            this.blogBox.opacity = opacity
        },
        moveStart(event) {
            const info = { diffY : event.clientY - parseInt(this.blogBox.marginTop, 10), diffX : event.clientX - parseInt(this.blogBox.marginLeft, 10), ref: this.$props.taskId}
            this.$emit('set-focus', info)
            if (event.target.id === "clickable" && !this.isMaximized) {
                this.setOpacity (0.5)
                this.$emit('move-start', info)
            }
        },
        moveWindow(event, diffX, diffY) {
            this.blogBox.marginTop = (event.clientY - diffY) + 'px';
            this.blogBox.marginLeft = (event.clientX - diffX) + 'px';
        },
        setCurrentPost() {
            this.currentPost = this.posts[this.posts.length-1]
            this.currentIndex = this.posts.length-1
        },
        fetchPosts() {
            console.log('toaqui')
            fetch('widgets/vblog/data/posts.json')
                .then(response => response.json())
                .then(json => {
                    this.posts = json.posts
                })
                .finally(() => {                  
                    this.setCurrentPost()
                    this.checkPostsAvailabity()

                });
        }
    }
})
