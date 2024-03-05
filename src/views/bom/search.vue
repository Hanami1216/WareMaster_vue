<template>
  <div>
    <el-row>
      <el-col :span="3" class="left">
        <img src="//s0.meituan.net/bs/fe-web-meituan/fa5f0f0/img/logo.png" alt="美团">
      </el-col>
      <el-col :span="8" class="center">
        <el-input
          v-model="search"
          placeholder="搜索产品"
          @focus="focus"
          @blur="blur"
          @keyup.enter.native="searchHandler"
        >
          <el-button id="search" slot="append" icon="el-icon-search" @click="searchHandler" />
        </el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getAllBom } from '@/api/bom'
import RandomUtil from '@/views/bom/RandomUtil'
import Store from '@/views/bom/store'
export default {
  data() {
    return {
      search: '', // 当前输入框的值
      isFocus: false, // 是否聚焦
      hotSearchList: ['暂无热门搜索'], // 热门搜索数据
      historySearchList: [], // 历史搜索数据
      searchList: ['暂无数据'], // 搜索返回数据,
      history: false,
      types: ['', 'success', 'info', 'warning', 'danger'], // 搜索历史tag式样
      result: []
    }
  },
  computed: {
    isHistorySearch() {
      return this.isFocus && !this.search
    },
    isSearchList() {
      return this.isFocus && this.search
    },
    isSearch() {
      return this.isFocus
    }
  },
  methods: {
    focus() {
      this.isFocus = true
      this.historySearchList =
          Store.loadHistory() == null ? [] : Store.loadHistory()
      this.history = this.historySearchList.length !== 0
    },
    blur() {
      var self = this
      this.searchBoxTimeout = setTimeout(function() {
        self.isFocus = false
      }, 300)
    },
    enterSearchBoxHanlder() {
      clearTimeout(this.searchBoxTimeout)
    },
    searchHandler() {
      // 随机生成搜索历史tag式样
      const n = RandomUtil.getRandomNumber(0, 5)
      getAllBom({ productName: this.search }).then(response =>{
        this.result = response.data
      })
      const exist =
          this.historySearchList.filter(value => {
            return value.name === this.search
          }).length !== 0
      if (!exist) {
        this.historySearchList.push({ name: this.search, type: this.types[n] })
        Store.saveHistory(this.historySearchList)
      }
      this.history = this.historySearchList.length !== 0
    },
    closeHandler(search) {
      this.historySearchList.splice(this.historySearchList.indexOf(search), 1)
      Store.saveHistory(this.historySearchList)
      clearTimeout(this.searchBoxTimeout)
      if (this.historySearchList.length === 0) {
        this.history = false
      }
    },
    removeAllHistory() {
      Store.removeAllHistory()
    }
  }
}
</script>

  <style>
  .left {
    margin-left: 200px;
  }
  .center {
    margin-top: 15px;
    margin-left: 200px;
  }
  #search {
    background-color: #ffffffff;
    border-radius: 0%;
  }
  .search-title {
    color: #bdbaba;
    font-size: 15px;
    margin-bottom: 5px;
  }
  .remove-history {
    color: #bdbaba;
    font-size: 15px;
    float: right;
    margin-top: -22px;
  }
  #search-box {
    width: 555px;
    height: 300px;
    margin-top: 0px;
    padding-bottom: 20px;
  }
  </style>
