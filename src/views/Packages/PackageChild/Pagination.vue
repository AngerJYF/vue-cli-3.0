<template>
  <div class="pagination-box">
    <h2>PaginationChild 分页</h2>
    <div class="pagination-child">
      <!-- 数据总数 -->
      <div class="total">
        共
        <span class="total-num">{{total}}</span>条数据
      </div>
      <!-- 每页显示的条数 -->
      <div class="page-size-box">
        <div class="page-size">
          <ul class="page-size-ul page-size-hide clearfix" :class="{pageshow:showHide}">
            <li
              v-for="(item,index) of pageSizeData"
              :key="index"
              :class="{add_actie:current == item,actived:actived == item}"
              @mouseenter="mouseenterClass($event,item,index)"
              @click="addActiveClass($event,item,index)"
            >{{item}} 条/页</li>
          </ul>
          <input
            type="text"
            readonly="readonly"
            v-model="pageSizeVal"
            autocomplete="off"
            placeholder="请选择"
            class="page-size-num"
            @click.stop="pageSizeNum($event)"
          >
        </div>
      </div>
      <!-- 上下翻页 -->
      <div class="pagination-data">
        <button
          type="button"
          class="pre-page"
          @click="prePage"
          :class="{disabled:disabledPre}"
          :disabled="disabledPre"
        >上一页</button>
        <div class="page-num-show">
          <ul class="page-num-ul clearfix">
            <!-- <li class="number" :class="{selected:firstPageShow}">{{firstNum}}</li> -->
            <!-- <li v-if="showPrevMore" @click="prePage">...</li> -->
            <li
              v-for="(item,index) of pagePager"
              :key="index"
              :class="{hover:currentStyle == item,selected:currentStyle == item}"
              @mouseenter="mouseenterClass($event,item,index)"
              @click="currentPageClass($event,item,index)"
            >{{item}}</li>
            <!-- <li v-if="showNextMore" @click="nextPage">...</li> -->
            <!-- <li class="number" :class="{selected:lastPageShow}">{{lastNum}}</li> -->
          </ul>
        </div>

        <button
          type="button"
          class="next-page"
          @click="nextPage"
          :class="{disabled:disabledNext}"
          :disabled="disabledNext"
        >下一页</button>
      </div>
      <!-- 跳转到对应页码 -->
      <div class="jump-page" @keyup.13="jumpPage" @change="jumpPage">
        前往
        <input type="text" v-model="jumpVal" class="jump-input"> 页
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PaginationChild",
  props: ["backData"],
  data() {
    return {
      showPrevMore: false, //分页之 上一页 省略号
      showNextMore: false, //分页之 下一页 省略号
      firstNum: 1, //分页之 第一页的显示的数字
      lastNum: 0, //分页之 最后一页的显示的数字
      firstPageShow: false, //分页之 第一页样式
      lastPageShow: false, //分页之 最后一页样式
      pageSizeData: [5, 15, 50, 100, 200], // 每页显示的条数
      pagePager: [], // 页码排序显示
      total: 0, // 总页数
      currentPage: 1, // 当前所在页
      pageSize: 5, // 每页显示条数
      disabledPre: false, //上一页禁止按钮
      disabledNext: false, //下一页禁止按钮
      pageSizeVal: "5 条/页",
      jumpVal: "", // 跳转页码
      showHide: false, //每页显示多少条 show OR hide
      current: 1, // pageSize 鼠标移上样式
      actived: 1, // pageSize 鼠标单击样式
      currentStyle: 1 // 当前页 样式
    };
  },
  mounted() {
    // 分页记忆功能 之 每页显示条数 ;
    //不想使用此功能 禁止即可 , 同时禁止下面代码的 Session 存值,减少缓存;
    this.getSessionPageSize();

    // 处理分页传值 不手动设置 pageSizeVal 的值,可忽略
    this.pageSizeReset();

    // 数据处理及分页展示
    this.dataRestOrPage();
    this.currentPageDisabled();

    window.addEventListener("click", this.pageSizeShow);
  },
  destroyed() {
    //离开该页面需要移除这个监听的事件
    window.removeEventListener("click", this.pageSizeShow);
  },
  methods: {
    mouseenterClass(event, val, index) {
      this.current = val;
    },
    // 控制每页显示多少条
    addActiveClass(event, val, index) {
      console.log(
        `${val}条/页  ===> 可以向后台请求数据, 传参为:   {pageSize:${val}}`
      );

      sessionStorage.setItem("pageSize", val);
      sessionStorage.setItem("pageSizeActived", val);

      this.pageSizeVal = val + " 条/页";
      this.pageSize = val;
      this.current = val;
      this.actived = val;
      this.dataRestOrPage(val);
      this.currentPageDisabled();
    },
    // 每页显示多少条
    pageSizeShow() {
      this.current = this.actived = this.pageSize;
      this.showHide = false;
    },
    // 控制 每页数据条数 的显示与隐藏
    pageSizeNum(event) {
      event.stopPropagation();
      this.current = this.actived = this.pageSize;
      this.showHide = !this.showHide;
    },
    // 上一页
    prePage() {
      let currentPageNumPre = parseInt(this.currentPage) - 1;
      this.currentStyle = this.currentPage = currentPageNumPre;
      this.jumpVal = currentPageNumPre;
      sessionStorage.setItem("currentPageNum", currentPageNumPre);
      console.log(
        `发送 ajax 请求,跳转页数,传参 ===> {currentPage: ${currentPageNumPre}}`
      );
    },
    // 下一页
    nextPage() {
      let currentPageNumNext = parseInt(this.currentPage) + 1;
      this.currentStyle = this.currentPage = currentPageNumNext;
      this.jumpVal = currentPageNumNext;
      sessionStorage.setItem("currentPageNum", currentPageNumNext);
      console.log(
        `发送 ajax 请求,跳转页数,传参 ===> {currentPage: ${currentPageNumNext}}`
      );
    },
    //上.下一页 禁止处理
    currentPageDisabled(val) {
      let PagePagerLengthVal = this.pagePager.length;
      let currentPage = val == undefined || null || "" ? this.currentPage : val;
      if (currentPage == PagePagerLengthVal) {
        // this.lastPageShow = true;
        this.disabledNext = true; // 禁用下一页功能
      } else {
        // this.lastPageShow = false;
        this.disabledNext = false;
      }
      if (currentPage == 1) {
        // this.firstPageShow = true;
        this.disabledPre = true;
      } else {
        // this.firstPageShow = false;
        this.disabledPre = false;
      }
    },
    // 当前所在页数
    currentPageClass(event, val, index) {
      console.log("val", val);
      sessionStorage.setItem("currentPageNum", val);
      this.currentPage = val;
      this.currentStyle = val;
      this.jumpVal = val;
      console.log(`发送 ajax 请求,当前页,传参 ===> {currentPage: ${val}}`);
    },
    // 根据显示页条数,调整当前所在页;
    currentPageReset() {
      let pagePagerLength = this.pagePager.length;
      let currentPage = this.currentPage;
      if (currentPage > pagePagerLength) {
        this.currentPage = this.currentStyle = pagePagerLength;
        this.jumpVal = pagePagerLength + 1;
      }
    },
    // 跳转第几页
    jumpPage() {
      let jumpVal = parseInt(this.jumpVal == "" ? 1 : this.jumpVal);
      let jumpPageNum =
        jumpVal > this.pagePager.length
          ? (this.jumpVal = this.pagePager.length)
          : jumpVal;
      this.currentPage = this.currentStyle = jumpPageNum;
      sessionStorage.setItem("currentPageNum", jumpPageNum);
      console.log(
        `发送 ajax 请求,跳转页数,传参 ===> {currentPage: ${jumpPageNum}}`
      );
    },
    // 分页条数的展示
    dataRestOrPage(val) {
      console.log('val1111',val);
      console.log('this.actived',this.actived);
      this.actived = this.current = this.pageSize;
      this.pagePager = [];
      let totleNum = this.total;
      let pageSizeNumPre = this.pageSize;
      let resultPageSize = Math.ceil(totleNum / pageSizeNumPre);
      for (let item = 1; item <= resultPageSize; item++) {
        this.pagePager.push(item);
      }
      console.log("this.pagePager", this.pagePager);
      // this.lastNum = resultPageSize;
    },
    // 分页记忆功能 之 每页显示条数
    getSessionPageSize() {
      let pageSize =
        JSON.parse(sessionStorage.getItem("pageSize")) || this.pageSize;
      let pageSizeActived =
        JSON.parse(sessionStorage.getItem("pageSizeActived")) || this.pageSize;
      let currentPageNum =
        JSON.parse(sessionStorage.getItem("currentPageNum")) ||
        this.currentPage;
      if (pageSize != "") {
        this.pageSize = pageSize;
        this.pageSizeVal = pageSize + " 条/页";
      }
      if (currentPageNum != "") {
        this.currentPage = currentPageNum - 1;
        this.currentStyle = currentPageNum - 1;
      } else {
        this.currentPage = this.currentStyle = 1;
      }
      if (pageSizeActived != "") {
        this.actived = pageSizeActived;
      }
    },
    // 处理分页传值    不手动设置 pageSizeVal 的值,可忽略
    pageSizeReset() {
      this.jumpVal = "";
      let pageSizeStyle = (this.pageSizeVal = this.pageSize + " 条/页");
      let getNum = pageSizeStyle.replace(/[^0-9]/gi, "");

      if (pageSizeStyle && pageSizeStyle != "") {
        if (!this.pageSizeData.includes(parseInt(getNum))) {
          console.error("The set pageSize value is invalid.");
        } else {
          this.currentStyle = this.currentPage;
          this.disabledPre = true;
          this.current = this.actived = this.pageSize = parseInt(getNum);
        }
      }
    }
  },
  watch: {
    currentPage(currentPage) {
      console.log("currentPage", currentPage);
      // 控制 上|下翻页 的,禁止-启用 功能;
      this.currentPageDisabled(currentPage);
    },
    pagePager() {
      // 根据显示页条数,调整当前所在页;
      this.currentPageReset();
    },
    backData: {
      handler(newName, oldName) {
        this.total = newName.total;
        this.currentPage = newName.currentPage;
        this.pageSize = newName.pageSize;

        this.getSessionPageSize();
        this.pageSizeReset();
        this.dataRestOrPage();
        this.currentPageDisabled();
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.disabled {
  cursor: not-allowed !important;
}
.disabled:hover {
  color: graytext !important;
}
.pageshow {
  display: block !important;
}
.selected {
  background: #409eff !important;
  color: #fff !important;
}
.hover {
  color: #409eff;
  cursor: default;
}
.page-size-hide {
  display: none;
}
.add_actie {
  color: #333;
  background: #f5f7fa;
}
.actived {
  color: #409eff;
  font-weight: 700;
  background: #f5f7fa;
}
.pagination-box {
  padding: 20px;
  width: 100%;
  margin: 0 auto;
}
.pagination-child {
  width: 1200px;
  margin-top: 30px;
}
.pagination-child > div,
.pagination-data > div {
  display: inline-block;
  margin: 0 5px;
  vertical-align: middle;
}
.pagination-data .pre-page,
.pagination-data .next-page {
  cursor: pointer;
  user-select: none;
  background: none;
}
.pagination-data .pre-page:hover,
.pagination-data .next-page:hover,
.pagination-data .page-num-ul li:hover {
  color: #409eff;
}
.jump-input {
  text-align: center;
  width: 80px;
  height: 30px;
  border-radius: 2px;
  border: 1px solid #ccc;
}
.jump-input:hover {
  border: 1px solid #409eff;
}
.page-num-ul li {
  background: #f4f4f5;
  color: #606266;
  text-align: center;
  min-width: 30px;
  border-radius: 2px;
  cursor: pointer;
  user-select: none;
  margin: 0 2px;
  padding: 0 4px;
  height: 28px;
  line-height: 28px;
  display: inline-block;
}
.total-num {
  color: red;
  display: inline-block;
  margin: 0 3px;
}
.page-size-num,
.page-size-ul li {
  user-select: none;
  cursor: pointer;
  text-align: center;
  width: 120px;
  height: 25px;
  line-height: 25px;
}
.page-size-ul li {
  width: 118px;
}
.page-size-ul {
  border: 1px solid #ccc;
}
.page-size-num {
  border: 1px solid #ccc;
  border-radius: 2px;
}
.page-size-num:hover {
  border: 1px solid #409eff;
}
.page-size {
  position: relative;
}
.page-size .page-size-ul {
  position: absolute;
  top: 27px;
  background: #fff;
}
</style>
