<template>
  <div class="welcome-page">
    <vue-particles
      color="#ffffff"
      :particle-opacity="0.7"
      :particles-number="50"
      shape-type="circle"
      :particle-size="4"
      lines-color="#dedede"
      :lines-width="1"
      :line-linked="true"
      :line-opacity="0.4"
      :lines-distance="150"
      :move-speed="2"
      :hover-effect="true"
      hover-mode="grab"
      :click-effect="true"
      click-mode="push"
    />
    <div class="welcome-page-center">
      <div class="welcome-page-content">
        <div class="welcome-page-title">系统名称</div>
        <div
          v-for="(item, index) in topNav"
          :key="index"
          class="nav-item-group"
        >
          <div class="nav-item-title">
            {{ item.title }}
          </div>
          <div>
            <label
              v-for="(item2, index) in item.children"
              :key="index"
              class="nav-item"
              @click="jumpSystem(item2.path)"
            >
              {{ item2.name }}
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      topNav: [{
        title: '子标题',
        children: [
          {
            name: '系统入口',
            path: 'https://blog.csdn.net/fifteen718'
          }
        ]
      }, {
        title: '子标题',
        children: [
          {
            name: '系统入口',
            path: 'https://blog.csdn.net/fifteen718'
          }, {
            name: '系统入口',
            path: 'https://blog.csdn.net/fifteen718'
          }
        ]
      }, {
        title: '子标题',
        children: [
          {
            name: '系统入口',
            path: 'https://blog.csdn.net/fifteen718'
          }, {
            name: '系统入口',
            path: 'https://blog.csdn.net/fifteen718'
          }, {
            name: '系统入口',
            path: 'https://blog.csdn.net/fifteen718'
          }
        ]
      }]
    }
  },
  methods: {
    jumpSystem(path) {
      window.open(path)
    }
  }
}
</script>

<style scoped>
.welcome-page {
    font-size: 16px;
    color: #fff;
    background: rgb(25, 14, 14) no-repeat;
    min-height: 100vh;
}
.welcome-page-center {
    width: 70%;
    height: 50%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
}
.welcome-page-title {
    font-size: 42px;
    padding-top: 10px;
    text-align: center;
    user-select:none;
}
.welcome-page-content {
    background-color: rgba(46,46,46,.61);
    border-radius: 10px;
    box-shadow: 0 0 20px 0 #f0f8ff;
}
.nav-item-group {
    padding: 18px 0;
}
.nav-item-title {
    font-size: 22px;
    padding-left: 20px;
}
.nav-item {
    display: inline-block;
    min-width: 128px;
    padding: 5px 10px;
    text-align: center;
    background: transparent;
    border: 1px solid #FFF;
    color: #f0f8ff;
    text-shadow: 0 0 0;
    border-radius: 5px;
    margin: 10px 20px;
}
.nav-item:hover {
    cursor: pointer;
    animation: .5s ease-in-out 0s 1 normal both running pulsate-bck;
}
@-webkit-keyframes pulsate-bck {
    0%,to {
        -webkit-transform: scale(1);
        transform: scale(1)
    }
    50% {
        -webkit-transform: scale(.9);
        transform: scale(.9)
    }
}
@keyframes pulsate-bck {
    0%,to {
        -webkit-transform: scale(1);
        transform: scale(1)
    }
    50% {
        -webkit-transform: scale(.9);
        transform: scale(.9)
    }
}
</style>
