<template>
  <div class="fj-content_view work-mis archives">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head kaohe">
        <p class="title fj-fl">档案列表</p>
      </div>
      <div class="fj-block-body">
        <div class="fj-search-inline">
          <el-row>
            <el-form inline label-width="85px" label-position="left">
              <el-col :lg="8" :xl="7" class="time-item">
                <el-form-item label="区县分局：">
                  <el-select
                    @change="changeSupDeptId"
                    clearable
                    filterable
                    v-model="searchForm.deptBelongId"
                    size="small"
                  >
                    <el-option
                      v-for="item in supDeptIds"
                      :key="item.deptId"
                      :label="item.deptName"
                      :value="item.deptId"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="起始日期：" class="datepicker">
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
              <el-col :lg="6" :xl="6">
                <el-form-item label="派出所：">
                  <el-select
                    @change="changeDeptId"
                    clearable
                    filterable
                    v-model="searchForm.deptId"
                    size="small"
                  >
                    <el-option
                      v-for="item in deptIds"
                      :key="item.deptId"
                      :label="item.deptName"
                      :value="item.deptId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="输入查询：">
                  <el-input
                    v-model="searchForm.keyword"
                    clearable
                    placeholder="请输入姓名或电话"
                    size="small"
                    class="search-input"
                  >
                    <el-button slot="append" @click="searchAttendLeave">搜索</el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :lg="6" :xl="5">
                <el-form-item label="在职状态：">
                  <el-select
                    @change="changeState"
                    clearable
                    v-model="searchForm.state"
                    size="small"
                  >
                    <el-option
                      v-for="item in statuses"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item>
                  <form
                    style="display:none;"
                    name="exportForm"
                    :action="ajaxUrlDNN + '/exportRecruits?nowUser=' + nowUser + '&endTime=' + searchForm.endTime + '&deptId=' + searchForm.deptId + '&startTime=' + searchForm.startTime + '&page=' + currentPage + '&nameOrPhone=' + searchForm.nameOrPhone + '&rows=' + pageSize"
                    method="post"
                    enctype="multipart/form-data"
                  ></form>
                  <el-button
                    type="primary"
                    @click="exportExcl"
                  >{{multipleSelection.length>1?'批量导出':'导出'}}</el-button>
                </el-form-item> -->
              </el-col>
            </el-form>
          </el-row>
        </div>
        <el-table :data="tableDataList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="deptName" label="所在区域" width="100px" show-overflow-tooltip></el-table-column>
          <el-table-column prop="userName" label="姓名" width="80px"></el-table-column>
          <el-table-column prop="userAccount" label="警号"></el-table-column>
          <el-table-column prop="job" label="职位"></el-table-column>
          <el-table-column
            label="入职日期"
            show-overflow-tooltip
            prop="entryTime"
          ></el-table-column>
          <el-table-column label="工龄（月）" prop="month" width="120px">
            
          </el-table-column>
          <el-table-column label="在职状态" prop="leave_state" width="120px">
            <template slot-scope="scope">
              <span
                class="circle-status"
                :class="scope.row.state == 0 ? 'green' : scope.row.state == 1 ? 'grey' : 'red'"
              >
                {{parseInt( scope.row.state) === 0 ? '在职' : parseInt( scope.row.state) === 1 ?'离职'
                : '试用'}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span
                class="ope-txt"
                @click="goDetails(scope.row.id)"
              >详情</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="mj-page_wrap">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10,20,30]"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
            @current-change="currentPageChange"
            @prev-click="prevPageChange"
            @next-click="nextPageChange"
            @size-change="sizePageChange"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
import mixin from "@/scripts/mixin.js";
export default {
  name: "fjRecruitment",
  mixins: [mixin], // 使用mixins
  data: function() {
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "人事管理", path: "" },
        { name: "档案管理", path: "" }
      ],
      nowUser: $.cookie(fjPublic.loginCookieKey),
      // 分局
      supDeptIds: null,
      // 派出所
      deptIds: null,
      // 状态
      statuses: [
        {
          value: "0",
          label: "在职"
        },
        {
          value: "1",
          label: "试用"
        },
        {
          value: "2",
          label: "离职"
        }
      ],
      // 列表查询参数
      searchForm: {
        searchTime: "", // 查询时间
        keyword: "", // 警号或负责人名称
        deptId: "", // 派出所
        deptBelongId: "", // 公安局
        state: "" // 状态
      },
      searchListUrl: "/getArchivesList", //获取列表数据URL
      checkDialogTitle: "",
      checkDialogForm: {
        id: "",
        state: "",
        reason: ""
      },
      reasonDisabled: true,
      formLabelWidth: "120px",
      // 不批准弹出框校验
      checkRule: {
        reason: {
          required: true,
          message: "请输入不通过理由",
          trigger: "blur"
        }
      }
    };
  },
  mounted: function() {
    // 初始化派出所下拉列表
    this.initDeptIds();
    // 初始化派出所下拉列表
    this.initSupDeptIds();
    // 初始化列表
    this.searchList();

    return;
  },
  filters: {
    getFormatTime: function(value) {
      return value ? value.substring(0, value.length - 2) : "";
    }
  },
  methods: {
    // 初始化分局
    initSupDeptIds: function() {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/searchDepListBySearch",
        type: "POST",
        data: {},
        dataType: "json",
        success: function(data) {
          vm.supDeptIds = data.list;
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    // 初始化派出所
    initDeptIds: function() {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/searchDeptsByFenju",
        type: "POST",
        data: {
          parentDeptId: ""
        },
        dataType: "json",
        success: function(data) {
          vm.deptIds = data.list;
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    // 修改单位下拉框查询
    changeSupDeptId: function(supDeptId) {
      this.searchForm["deptBelongId"] = supDeptId;
      this.searchList();
    },
    // 修改单位下拉框查询
    changeDeptId: function(deptId) {
      this.searchForm["deptId"] = deptId;
      this.searchList();
    },
    // 修改状态下拉框查询
    changeState: function(state) {
      this.searchForm["state"] = state;
      this.searchList();
    },
    // 标题或负责人名称查询
    searchAttendLeave: function() {
      console.log(this.searchForm);
      this.searchList();
    },
    // 设置获取列表参数
    setSearchList: function() {
      this.searchForm["pageNumber"] = this.currentPage;
      this.searchForm["pageSize"] = this.pageSize;
      // 传入当前用户信息
      this.searchForm["nowUser"] = this.nowUser;

    },
    /**
     * 查看，编辑，新建
     * @param {*} state 状态0=新增，1=查看，2=编辑
     */
    goDetails(id) {
      this.$router.push({
        path: "/personnel-archives-detail",
        query: { 'id': id }
      });
      //设置缓存，到编辑回显
      // state != 0 && fjPublic.setLocalData("ybssItem", JSON.stringify(item));
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
    },
    // 弹窗关闭事件
    closeDialog() {
      this.$refs.checkDialogForm.resetFields();
    }
  },
  components: {
    fjBreadNav
  }
};
</script>
<style scope lang="less">
.archives {
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
  .textLeft {
    text-align: left;
  }
  .check-dialog {
    /deep/ .el-form-item {
      textarea {
        width: 300px;
      }
    }
  }
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
}
</style>
