<template>
  <div class="fj-content_view work-mis workLog specialExamination">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head kaohe" style="border-bottom:0px;">
        <el-tabs v-model="activeIndex" @tab-click="handleClick">
          <el-tab-pane label="考试题库" name="0"></el-tab-pane>
          <el-tab-pane label="试卷管理" name="1"></el-tab-pane>
          <el-tab-pane label="考试得分" name="2"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="fj-block-body">
        <div class="fj-search-inline">
          <el-row>
            <el-form inline label-width="85px" label-position="left">
              <el-col :lg="6" :xl="5">
                <el-form-item label="考试类型：" v-if="activeIndex==0">
                  <el-select
                    @change="changeDeptId"
                    clearable
                    filterable
                    v-model="searchForm.deptId"
                    size="small"
                  >
                    <el-option
                      v-for="item in missionStates"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="6" :xl="5" v-if="activeIndex==1">
                <el-form-item label="试卷类型：">
                  <el-select
                    @change="changeDeptId"
                    clearable
                    filterable
                    v-model="searchForm.deptId"
                    size="small"
                  >
                    <el-option
                      v-for="item in missionStates"
                      :key="item.deptId"
                      :label="item.deptName"
                      :value="item.deptId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="6" :xl="5" v-if="activeIndex==2">
                <el-form-item label="区县分局：">
                  <el-select
                    @change="changeDeptId"
                    clearable
                    filterable
                    v-model="searchForm.deptId"
                    size="small"
                  >
                    <el-option
                      v-for="item in missionStates"
                      :key="item.deptId"
                      :label="item.deptName"
                      :value="item.deptId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="6" :xl="5" v-if="activeIndex==2">
                <el-form-item label="派出所：">
                  <el-select
                    @change="changeDeptId"
                    clearable
                    filterable
                    v-model="searchForm.deptId"
                    size="small"
                  >
                    <el-option
                      v-for="item in missionStates"
                      :key="item.deptId"
                      :label="item.deptName"
                      :value="item.deptId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="8" :xl="7" class="time-item">
                <el-form-item label="起始时间：" class="datepicker">
                  <el-date-picker
                    v-model="searchForm.searchTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changeSearchTime"
                    size="small"
                  ></el-date-picker>
                  <el-button
                    type="primary"
                    class="tj-btn"
                    @click="goQuestions(0)"
                    v-if="activeIndex==0"
                  >创建题库</el-button>
                  <el-button
                    type="primary"
                    class="tj-btn"
                    @click="goManage(0)"
                    v-if="activeIndex==1"
                  >添加试卷</el-button>
                  <el-button
                    type="primary"
                    class="tj-btn"
                    @click="goFraction(0)"
                    v-if="activeIndex==2"
                  >导出</el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>
        <!-- 考试题库 -->
        <el-table v-if="activeIndex==0" :data="tableDataList" style="width: 100%">
          <el-table-column prop="type" label="题目类型" :key="Math.random()"></el-table-column>
          <el-table-column prop="title" label="标题" :key="Math.random()"></el-table-column>
          <el-table-column prop="content" label="考试类型" :key="Math.random()"></el-table-column>
          <el-table-column prop="createUsername" label="创建人" :key="Math.random()"></el-table-column>
          <el-table-column prop="instime" label="创建时间" :key="Math.random()"></el-table-column>
          <el-table-column prop="examNumber" label="题目数量" :key="Math.random()"></el-table-column>
          <el-table-column label="状态" width="100px" :key="Math.random()">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.state"
                active-color="#13ce66"
                inactive-color="#ccc"
                active-value="0"
                inactive-value="1"
                @change="changeSwitch(scope.row.id,scope.row.state)"
              ></el-switch>
              <span>{{scope.row.state==0?'开启':'关闭'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" :key="Math.random()">
            <template slot-scope="scope">
              <span class="ope-txt" v-if="scope.row.result != 0">--</span>
              <span
                class="ope-txt"
                v-if="scope.row.result == 0"
                @click="openCheckDialog(scope.row.exceptionid, 2)"
              >管理</span>
              <span
                class="ope-txt"
                v-if="scope.row.result == 0"
                @click="openCheckDialog(scope.row.exceptionid, 2)"
              >删除</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 试卷管理 -->
        <el-table v-if="activeIndex==1" :data="tableDataList" style="width: 100%">
          <el-table-column prop="title" label="试卷标题" :key="Math.random()"></el-table-column>
          <el-table-column prop="sigtypenTime" label="试卷类型" :key="Math.random()"></el-table-column>
          <el-table-column prop="score" label="总分" :key="Math.random()"></el-table-column>
          <el-table-column prop="a" label="创建人" :key="Math.random()"></el-table-column>
          <el-table-column prop="instime" label="发布时间" :key="Math.random()"></el-table-column>
          <el-table-column label="状态" width="100px" :key="Math.random()">
            <template slot-scope="scope">
              <span
                class="circle-status"
                :class="scope.row.state == 0 ? 'grey' : scope.row.state == 1 ? 'green' : 'red'"
              >
                {{parseInt( scope.row.state) === 0 ? '待发布' : parseInt( scope.row.state) === 1 ?'已发布'
                : '被结束'}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="题目数量" prop="amount" :key="Math.random()"></el-table-column>
          <el-table-column label="操作" :key="Math.random()">
            <template slot-scope="scope">
              <span class="ope-txt" v-if="scope.row.state != 0">--</span>
              <span class="ope-txt" v-if="scope.row.state == -1">复用</span>
              <span
                class="ope-txt"
                v-if="scope.row.state != 0"
                @click="goManage(1,scope.row.exceptionid)"
              >查看</span>
              <span
                class="ope-txt"
                v-if="scope.row.state == 0"
                @click="checkUpdate(scope.row.exceptionid, 1)"
              >发布</span>
              <span
                class="ope-txt"
                v-if="scope.row.state == 0"
                @click="goManage( 2,scope.row.exceptionid)"
              >编辑</span>
              <span
                class="ope-txt"
                v-if="scope.row.state == 0"
                @click="openCheckDialog(scope.row.exceptionid, 2)"
              >删除</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 考试得分 -->
        <el-table
          v-if="activeIndex==2"
          :data="tableDataList"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="30" :key="Math.random()"></el-table-column>
          <el-table-column prop="userName" label="试卷标题" :key="Math.random()"></el-table-column>
          <el-table-column prop="userName" label="姓名" :key="Math.random()"></el-table-column>
          <el-table-column prop="signTime" label="分数" :key="Math.random()"></el-table-column>
          <el-table-column prop="userName" label="考试日期" :key="Math.random()"></el-table-column>
          <el-table-column prop="signTime" label="警号" :key="Math.random()"></el-table-column>
          <el-table-column prop="signTime" label="单位" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="用时" :key="Math.random()"></el-table-column>
          <el-table-column label="操作" :key="Math.random()">
            <template slot-scope="scope">
              <span class="ope-txt" v-if="scope.row.result != 0">--</span>
              <span
                class="ope-txt"
                v-if="scope.row.result == 0"
                @click="checkUpdate(scope.row.exceptionid, 1)"
              >详情</span>
              <span
                class="ope-txt"
                v-if="scope.row.result == 0"
                @click="openCheckDialog(scope.row.exceptionid, 2)"
              >管理</span>
              <span
                class="ope-txt"
                v-if="scope.row.result == 0"
                @click="openCheckDialog(scope.row.exceptionid, 2)"
              >删除</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="mj-page_wrap">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10,20,30]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @current-change="currentPageChange"
            @prev-click="prevPageChange"
            @next-click="nextPageChange"
            @size-change="sizePageChange"
            v-if="total > 0"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
export default {
  name: "specialExam",
  data() {
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "教培管理", path: "" },
        { name: "专题考试", path: "" }
      ],
      activeIndex: "0",
      // 状态下拉框
      missionStates: [
        {
          value: "1001",
          label: "岗前培训"
        },
        {
          value: "1002",
          label: "夜校培训"
        }
      ],
      // 列表查询参数
      searchForm: {
        searchTime: "", // 查询时间
        nameOrAccount: "", // 警号或负责人名称
        deptId: "", // 派出所
        supDeptId: "", // 公安局
        status: "" // 状态
      },
      // table列表数据
      tableDataList: [],
      multipleSelection: [],
      // 分页数据
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  mounted() {
    fjPublic.closeLoad();
    // 初始化任务列表
    this.searchSign();
    return;
  },
  beforeRouteEnter(to, from, next) {
    next(function(vm) {
      fjPublic.closeLoad();
    });
  },
  methods: {
    currentPageChange(pageNum) {
      // 点击某个分页按钮
      this.currentPage = pageNum;
      this.searchSign();
    },
    prevPageChange(pageNum) {
      // 点击分页的上一页
      this.currentPage = pageNum;
      this.searchSign();
    },
    nextPageChange(pageNum) {
      // 点击分页的下一页
      this.currentPage = pageNum;
      this.searchSign();
    },
    sizePageChange(pageSize) {
      // 改变每页条数时
      this.currentPage = 1;
      this.pageSize = pageSize;
      this.searchSign();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //获取被选中的标签 tab 实例
    handleClick(tab) {
      console.log(tab);
      this.activeIndex = tab.index;
      this.searchSign();
    },
    //获取被选中的标签 tab 实例
    changeSwitch(id, state) {
      console.log(id, state);
    },
    // 修改单位下拉框查询
    changeDeptId: function(deptId) {
      this.searchForm["deptId"] = deptId;
      this.searchSign();
    },
    // 标题或负责人名称查询
    searchAttendLeave: function() {
      this.searchSign();
    },
    // 修改查询时间
    changeSearchTime: function(searchTime) {
      if (searchTime) {
        this.searchForm["startTime"] = fjPublic.dateFormatYYMMDD(searchTime[0]);
        this.searchForm["endTime"] = fjPublic.dateFormatYYMMDD(searchTime[1]);
      } else {
        this.searchForm["startTime"] = "";
        this.searchForm["endTime"] = "";
      }
      this.searchSign();
    },
    // 获取采集列表
    searchSign: function() {
      var defer = $.Deferred();
      var vm = this;
      let url =
        vm.activeIndex == 0
          ? "/getExamWarehouseList"
          : vm.activeIndex == 1
          ? "/getExamPaperList"
          : "/getExamResultList";
      console.log(url);
      // 参数
      vm.searchForm["page"] = vm.currentPage;
      vm.searchForm["rows"] = vm.pageSize;
      // 传入当前用户信息
      vm.searchForm["nowUser"] = $.cookie(fjPublic.loginCookieKey);
      $.ajax({
        // url: fjPublic.ajaxUrlDNN + "/searchSign",
        url: fjPublic.ajaxUrlDNN + url,
        type: "POST",
        data: vm.searchForm,
        data: {},
        dataType: "json",
        success: function(data) {
          vm.tableDataList = null;
          vm.tableDataList = data.list;
          vm.total = data.total;
          // _.each(vm.attendAppealData, function(item, i) {
          //   vm.$set(item, "rank", i + 1);
          // });
        },
        error: function(err) {}
      });
    },
    /**
     * 查看，编辑，新建
     * @param {*} state 状态0=新增，1=查看，2=编辑
     */
    goQuestions(state, items) {
      let item = items;
      !item && (item = { id: "" });
      this.$router.push({
        path: "/special-exam-questions",
        query: { index: this.activeIndex, state: state, id: item.id }
      });
      //设置缓存，到编辑回显
      state != 0 && fjPublic.setLocalData("ybssItem", JSON.stringify(item));
    },
    /**
     * 查看，编辑，新建
     * @param {*} state 状态0=新增，1=查看，2=编辑
     */ goManage(state, items) {
      let item = items;
      !item && (item = { id: "" });
      this.$router.push({
        path: "/special-exam-manage",
        query: { index: this.activeIndex, state: state, id: item.id }
      });
      //设置缓存，到编辑回显
      state != 0 && fjPublic.setLocalData("ybssItem", JSON.stringify(item));
    },
    /**
     * 查看，编辑，新建
     * @param {*} state 状态0=新增，1=查看，2=编辑
     */ goFraction(state, items) {
      let item = items;
      !item && (item = { id: "" });
      this.$router.push({
        path: "/special-exam-fraction",
        query: { index: this.activeIndex, state: state, id: item.id }
      });
      //设置缓存，到编辑回显
      state != 0 && fjPublic.setLocalData("ybssItem", JSON.stringify(item));
    }
    // 时间格式化
    // timeFormatter(row, type) {
    //   let dateStr = row[type.property];
    //   if (!dateStr) {
    //     return "";
    //   }
    //   return (
    //     dateStr.substr(5, 2) +
    //     "/" +
    //     dateStr.substr(8, 2) +
    //     " " +
    //     dateStr.substr(11, 2) +
    //     ":" +
    //     dateStr.substr(14, 2)
    //   );
    // }
  },
  filters: {
    getSignType: function(value) {
      return value == "1" ? "上班未签到" : value == 2 ? "下班未签退" : "";
    }
  },
  components: {
    fjBreadNav
  }
};
</script>
<style scope lang="less">
.specialExamination {
  /deep/ .el-table {
    .circle-status {
      position: relative;
      &.red {
        &::before {
          background: #f5222d;
        }
      }
      &.green {
        &::before {
          background: #52c41a;
        }
      }
      &.grey {
        &::before {
          background: #ababab;
        }
      }
      &::before {
        display: block;
        position: absolute;
        content: "";
        width: 6px;
        height: 6px;
        background: rgba(171, 171, 171, 1);
        border-radius: 50%;
        opacity: 1;
        top: 5px;
        left: -9px;
      }
    }
  }
  .tj-btn {
    float: right;
    margin-top: -38px;
    margin-right: -150px;
    width: 98px;
  }
  .fj-search-inline {
    // 上下间距
    @media screen and (max-width: 1366px) {
      .el-form-item__label {
        line-height: 20px;
      }
    }
    /deep/ .el-row {
      .time-item {
        .el-form-item {
          .el-input {
            width: 350px;
          }
        }
      }
      .el-form-item {
        margin: 0;
        &:first-child {
          margin: 15px 0;
        }
        &:last-child {
          margin-bottom: 15px;
        }
        &.datepicker {
          .el-form-item__content {
            line-height: 43px;
          }
        }
        .search-input {
          width: 260px;
          .el-input-group__append {
            background-color: #1890ff;
            border-color: #1890ff;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>


