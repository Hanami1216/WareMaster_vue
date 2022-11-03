<template>
  <el-dialog
    class="el-dialog-cus"
    v-bind="attributes"
    :visible="visible"
    :before-close="beClose"
    append-to-body
    :close-on-click-modal="false"
    v-on="on"
  >
    <!-- 给弹窗中加入的主体内容都会出现在这里 -->
    <!-- 加上v-if 防止在弹窗中嵌套一些其他组件时，那些组件的生命周期只会执行一次的问题出现 -->
    <slot v-if="visibleSlot" />
    <div slot="footer">
      <el-button plain @click="cancel">{{ btnTxt[0] }}</el-button>
      <el-button v-if="btnTxt[1]" type="primary" @click="confirm">{{ btnTxt[1] }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    config: Object,
    autoClose: {
      type: Boolean,
      default: true
    },
    beforeClose: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    const { top = '20vh', width = '420px', title = '提示', center = false, btnTxt = ['取消', '确定'] } = this.config || {}
    return {
      visible: false,
      attributes: {
        top,
        width,
        title,
        center,
        ...this.config
      },
      btnTxt,
      on: this.getDialogEvents(),
      visibleSlot: false
    }
  },
  methods: {
    //  弹出弹窗的方法
    //  点击一个按钮并使用ref来获取弹窗组件的这个方法即可打开弹窗
    //  剩下的关闭弹窗的操作就交给弹窗的确定或取消按钮来完成即可
    //  我们不用再额外的写关闭弹窗的方法并将关闭弹窗的props参数传给弹窗组件
    //  个ok事件是用于在点击了弹窗组件的确定或提交按钮后所触发的回调函数
    //  比如我们点击了弹窗的提交按钮，我们需要调一个接口来完成数据的存储或修改
    open(ok) {
      this.ok = ok
      this.visible = true
      this.visibleSlot = true
      //   nextTick是将回调函数延迟在下一次DOM更新数据后调用，简单的理解就是当数据更新了，在DOM中渲染后，自动执行该函数。
      return this.$nextTick()
    },
    cancel() {
      this.visible = false
    },
    confirm() {
      const cancel = () => this.cancel()
      this.ok(cancel)
      this.autoClose && cancel()
    },
    beClose(done) {
      done()
      this.beforeClose()
      this.cancel()
    },
    getDialogEvents() {
      // closed: () => this.visibleSlot = false是为了防止弹窗中的内容先于弹窗消失而造成弹窗在关闭时有一个突然向上缩小的情况
      // eslint-disable-next-line no-return-assign
      const { close } = this.config || {}; const events = { closed: () => this.visibleSlot = false }

      if (close && typeof close === 'function') {
        Object.assign(events, {
          close
        })
      }

      return events
    }
  }
}
</script>

  <style lang="scss">
  .el-dialog-cus {
    .el-dialog {
      padding: 8px;
    }
    .el-dialog__title {
      font-weight: bold;
    }
    .el-dialog__header {
      padding: 20px 0 12px;
    }
    .el-dialog__headerbtn {
      top: 8px;
      right: 8px;
    }
    .el-dialog__body {
      padding: 0 24px;
    }
    .el-dialog__footer {
      padding: 20px;
      .el-button {
        padding: 8px 20px;
        & + .el-button {
          margin-left: 40px;
        }
      }
    }
  }
  </style>

