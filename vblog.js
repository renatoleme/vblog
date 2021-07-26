app.component('vblog', {
    props: {
        taskId: String
    },
    data() {
        return {
            refname: 'vblog',
            posts: [],
            currentIndex: 0,
            currentPost: {},
            blogBox: {
                marginTop: 10,
                marginLeft: 100,
                opacity: 1
            },
            visible: true
        }
    },
    template:
    `
<transition name="genericWindow" >
<div v-if="visible" class="generic-frame" :style="blogBox" id="clickable" @mousedown="moveStart($event)" @dblclick="doAction($event)">
         <div class="window-header"  id="clickable">
               <div class="window-title"><b>{{ this.currentPost.title }}</b></div>
                <div class="action-buttons" id="clickable">
                    <button v-on:click="minimizeWindow" class="btn-action"><i class="fas fa-window-minimize fa-lg"></i></button>
                    <button v-on:click="closeWindow" class="btn-action"><i class="fas fa-times fa-lg"></i></button>
                </div>
         </div>
<div class="generic-window">

<div class="nav-buttons">
<button class="nav-btn" @click="navPostLeft" ><i class="fas fa-arrow-left fa-lg"></i></button>
<button class="nav-btn" @click="navPostRight"><i class="fas fa-arrow-right fa-lg"></i></button>
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
`,
    created: function () {
        this.fetchPosts();
    },
    methods: {
        navPostLeft() {
            const prevIndex = this.currentIndex - 1
            if (prevIndex >= 0) {
                this.currentPost = this.posts[prevIndex]
                this.currentIndex = prevIndex
            }
        },
        navPostRight() {
            const nextIndex = this.currentIndex + 1
            if (nextIndex < this.posts.length) {
                this.currentPost = this.posts[nextIndex]
                this.currentIndex = nextIndex
            }
        },
        closeWindow(event) {
            this.$emit('close-window', {taskId: this.$props.taskId, ref: this.refname})
        },
        doAction(event) {
            if (event.type === "dblclick" && event.target.id === "clickable") {
                this.minimizeWindow()
            }  
        },
        openWindow() {
            this.visible = true
        },
        minimizeWindow() {
            this.$emit('minimize-window', {trigger: this.openWindow, name: 'v-Blog', icon: 'widgets/vblog/assets/imgs/icon.png'})
            this.visible = false
        },
        setOpacity(opacity) {
            this.blogBox.opacity = opacity
        },
        moveStart(event) {
            if (event.target.id === "clickable") {
                const info = { diffY : event.clientY - this.blogBox.marginTop, diffX : event.clientX - this.blogBox.marginLeft, ref: this.$props.taskId}
                this.setOpacity (0.5)
                this.$emit('move-start', info)
            }
        },
        moveWindow(event, diffX, diffY) {
            this.blogBox.marginTop = event.clientY - diffY;
            this.blogBox.marginLeft = event.clientX - diffX;
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

                    console.log(json)
                    this.posts = json.posts
                 
                    
                })
                .finally(() => {

                    console.log(this.posts[0])
                  
                    this.setCurrentPost()
                });
        }
    }
})
