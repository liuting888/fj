<template>
  <div class="fj-content_view work-mis workLog">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head kaohe" style="border-bottom:0px;">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="考试题库" name="0"></el-tab-pane>
          <el-tab-pane label="考试试卷" name="1"></el-tab-pane>
          <el-tab-pane label="考试发布" name="2"></el-tab-pane>
          <el-tab-pane label="考试得分" name="3"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="fj-block-body">
        <div class="fj-search-inline">
          <el-row>
            <el-form inline label-width="85px" label-position="left">
              <el-col :lg="6" :xl="5">
                <el-form-item label="状态：">
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
                </el-form-item>
              </el-col>
              <el-col :xs="8" :sm="12" :md="16" :lg="6" :xl="6">
                <el-form-item label="关键字：">
                  <el-input
                    v-model="searchForm.nameOrAccount"
                    clearable
                    placeholder="请输入考试内容关键字"
                    size="small"
                    class="search-input"
                  >
                    <el-button slot="append" @click="searchAttendLeave">搜索</el-button>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div>
        <!-- 考试题库 -->
        <el-table v-if="activeName==0" :data="attendAppealData" style="width: 100%">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="userName" label="标题"></el-table-column>
          <el-table-column prop="userName" label="类型" :key="Math.random()"></el-table-column>
          <el-table-column prop="userName" label="主要内容" :key="Math.random()"></el-table-column>
          <el-table-column prop="signTime" label="建立时间" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="建库人员" :key="Math.random()"></el-table-column>
          <el-table-column label="题目数量" :key="Math.random()">
            <template slot-scope="scope">
              <p>{{scope.row.signType | getSignType}}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="适合人群"
            :formatter="timeFormatter"
            prop="exception_time"
            :key="Math.random()"
          ></el-table-column>
          <el-table-column label="状态" width="100px" :key="Math.random()">
            <template slot-scope="scope">
              <!-- <p>{{scope.row}}</p> -->
              <el-switch v-model="scope.row.signType" active-color="#13ce66" inactive-color="#ccc"></el-switch>
              <span>{{scope.row.signType==true?'开启':'关闭'}}</span>
            </template>
          </el-table-column>
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
        <!-- 考试试卷 -->
        <el-table v-if="activeName==1" :data="attendAppealData" style="width: 100%">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="userName" label="标题"></el-table-column>
          <el-table-column prop="signTime" label="建立时间" :key="Math.random()"></el-table-column>
          <el-table-column prop="userName" label="内容" :key="Math.random()"></el-table-column>
          <el-table-column prop="userName" label="考试时间(分钟)" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="适合人员" :key="Math.random()"></el-table-column>
          <el-table-column label="题目数量" :key="Math.random()">
            <template slot-scope="scope">
              <p>{{scope.row.signType | getSignType}}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="总分"
            :formatter="timeFormatter"
            prop="exception_time"
            :key="Math.random()"
          ></el-table-column>
          <el-table-column label="状态" width="100px" :key="Math.random()">
            <template slot-scope="scope">
              <!-- <p>{{scope.row}}</p> -->
              <el-switch v-model="scope.row.signType" active-color="#13ce66" inactive-color="#ccc"></el-switch>
              <span>{{scope.row.signType==true?'开启':'关闭'}}</span>
            </template>
          </el-table-column>
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
        <!-- 考试发布 -->
        <el-table v-if="activeName==2" :data="attendAppealData" style="width: 100%">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="userName" label="标题"></el-table-column>
          <el-table-column prop="signTime" label="考试时间" :key="Math.random()"></el-table-column>
          <el-table-column prop="userName" label="考试人员" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="发布时间" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="试卷标题" :key="Math.random()"></el-table-column>
          <el-table-column
            label="主要内容"
            :formatter="timeFormatter"
            prop="exception_time"
            :key="Math.random()"
          ></el-table-column>
          <el-table-column label="状态" width="100px" :key="Math.random()">
            <template slot-scope="scope">
              <!-- <p>{{scope.row}}</p> -->
              <el-switch v-model="scope.row.signType" active-color="#13ce66" inactive-color="#ccc"></el-switch>
              <span>{{scope.row.signType==true?'开启':'关闭'}}</span>
            </template>
          </el-table-column>
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
        <!-- 考试得分 -->
        <el-table v-if="activeName==3" :data="attendAppealData" style="width: 100%">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="userName" label="标题"></el-table-column>
          <el-table-column prop="signTime" label="考试时间" :key="Math.random()"></el-table-column>
          <el-table-column prop="userName" label="主要内容" :key="Math.random()"></el-table-column>
          <el-table-column prop="signTime" label="警号" :key="Math.random()"></el-table-column>
          <el-table-column prop="signTime" label="姓名" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="分数" :key="Math.random()"></el-table-column>
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
  name: "specialExamination",
  data() {
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "人事管理", path: "" },
        { name: "工资管理", path: "" }
      ],
      activeName: "0",
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
      // 列表数据
      attendAppealData: [],
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
    //获取被选中的标签 tab 实例
    handleClick(tab) {
      console.log(tab);
      this.activeName = tab.index;
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
      // 参数
      this.searchForm["page"] = this.currentPage;
      this.searchForm["rows"] = this.pageSize;
      // 传入当前用户信息
      this.searchForm["nowUser"] = $.cookie(fjPublic.loginCookieKey);
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/searchSign",
        type: "POST",
        data: vm.searchForm,
        dataType: "json",
        success: function(data) {
          vm.attendAppealData = null;
          vm.attendAppealData = data.list;
          vm.total = data.total;
          _.each(vm.attendAppealData, function(item, i) {
            vm.$set(item, "rank", i + 1);
          });
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    handleChange(file, list) {
      var vm = this;
      vm.fileList = list;
    },
    onRemove(file, list) {
      var vm = this;
      this.fileList.forEach((v, i) => {
        if (v == file.response) {
          vm.fileList.splice(i, 1);
        }
      });
    },

    clearF() {
      this.form = new FormData();
      this.dialogVisible = false;
      this.trainUsersAccount = null;
      this.dialogForm = {
        reportType: "",
        trainConext: "",
        trainAdreess: "",
        trainUsersAccount: "",
        trainTime: "",
        trainUsersId: ""
      };
      this.$refs.uploadfile.clearFiles();
    },
    // 时间格式化
    timeFormatter(row, type) {
      let dateStr = row[type.property];
      if (!dateStr) {
        return "";
      }
      return (
        dateStr.substr(5, 2) +
        "/" +
        dateStr.substr(8, 2) +
        " " +
        dateStr.substr(11, 2) +
        ":" +
        dateStr.substr(14, 2)
      );
    }
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
.workLog {
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
  .el-tables {
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
    /deep/ .textLeft {
      text-align: left;
    }
  }
  .check-dialog {
    /deep/ .el-form-item {
      textarea {
        width: 300px;
      }
    }
  }
  .detail-dialog {
    /deep/ .el-form-item {
      .el-textarea {
        textarea {
          width: 240px;
        }
      }
    }
  }
}
</style>


