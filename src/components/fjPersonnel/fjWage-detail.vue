<template>
  <div class="fj-content_view work-mis wage-detail">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head kaohe"></div>
      <div class="fj-block-body">
        <div class="fj-search-inline"></div>
        <el-table :data="attendLeaveData">
          <el-table-column prop="time" label="发放日期" :formatter="timeFormatter" width="100"></el-table-column>
          <el-table-column prop="deptBelongName" label="单位"  width="120"></el-table-column>
          <el-table-column prop="deptName" label="辅警站" width="120"></el-table-column>
          <el-table-column prop="userName" label="姓名" width="80"></el-table-column>
          <el-table-column prop="basePay" label="基本工资"></el-table-column>
          <el-table-column prop="meritPay" label="绩效工资"></el-table-column>
          <el-table-column prop="tierPay" label="层级工资"></el-table-column>
          <el-table-column prop="jonPay" label="岗位工资"></el-table-column>
          <el-table-column prop="liveSubsidy" label="生活补贴"></el-table-column>
          <el-table-column prop="infoCollect" label="信息采集费" width="100"></el-table-column>
          <el-table-column prop="trafficSubsidy" label="流量补助费" width="100"></el-table-column>
          <el-table-column prop="other" label="其他"></el-table-column>
          <el-table-column prop="theorySum" label="应发合计"></el-table-column>
          <el-table-column prop="pension" label="养老保险"></el-table-column>
          <el-table-column prop="medicare" label="医疗保险"></el-table-column>
          <el-table-column prop="unemployment" label="失业保险"></el-table-column>
          <el-table-column prop="injury" label="工伤保险"></el-table-column>
          <el-table-column prop="maternity" label="生育保险"></el-table-column>
          <el-table-column prop="illness" label="大病互助保险" width="120"></el-table-column>
          <el-table-column prop="deduct" label="扣发合计"></el-table-column>
          <el-table-column prop="sum" label="实发合计"></el-table-column>
          <el-table-column prop="bankCard" label="银行卡号" width="180"></el-table-column>
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

export default {
  name: "fjAttendHistory",
  data: function() {
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "人事管理", path: "" },
        { name: "工资管理", path: "/personnel-wage" },
        { name: "详情", path: "" }
      ],
      // 列表查询参数
      searchForm: {},
      // 列表数据
      attendLeaveData: [
        // {
        //   apply_time: "",
        //   end_time: "",
        //   leader_content: "",
        //   leader_name: "",
        //   leader_time: "",
        //   leaveId: "",
        //   leave_reason: "",
        //   leave_state: "",
        //   start_time: "",
        //   userId: "",
        //   userAccount: ""
        // }
      ],
      // 分页数据
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  mounted: function() {
    // 初始列表
    this.searchUserLeave();

    return;
  },
  filters: {
    getFormatTime: function(value) {
      return value ? value.substring(0, value.length - 2) : "";
    }
  },
  methods: {
    currentPageChange: function(pageNum) {
      // 点击某个分页按钮
      this.currentPage = pageNum;
      this.searchUserLeave();
    },
    prevPageChange: function(pageNum) {
      // 点击分页的上一页
      this.currentPage = pageNum;
      this.searchUserLeave();
    },
    nextPageChange: function(pageNum) {
      // 点击分页的下一页
      this.currentPage = pageNum;
      this.searchUserLeave();
    },
    sizePageChange: function(pageSize) {
      // 改变每页条数时
      this.currentPage = 1;
      this.pageSize = pageSize;
      this.searchUserLeave();
    },
    // 获取列表
    searchUserLeave: function() {
      var defer = $.Deferred();
      var vm = this;
      // 参数
      this.searchForm["pageNumber"] = this.currentPage;
      this.searchForm["pageSize"] = this.pageSize;
      this.searchForm["userId"] = this.$route.query.id;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getPayrollList",
        type: "POST",
        data: vm.searchForm,
        dataType: "json",
        success: function(data) {
          vm.attendLeaveData = null;
          vm.attendLeaveData = data.list;
          vm.total = data.total;
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    // 时间格式化
    timeFormatter(row, type) {
      let dateStr = row[type.property];
      if (!dateStr) {
        return "";
      }
      return (
        dateStr.substr(0, 4) +
        "/" +
        dateStr.substr(4, 2) +
        "/" +
        dateStr.substr(6, 2)
      );
    }
  },
  components: {
    fjBreadNav
  }
};
</script>
<style scope lang="less">
.wage-detail {
  .fj-block-head {
    height: 50px;
    border-bottom: 0px;
    .el-tabs__header {
      padding-top: 10px;
    }
  }
  .fj-search-inline {
    // 上下间距
    @media screen and (max-width: 1366px) {
      .el-form-item__label {
        line-height: 20px;
      }
    }
    .search-btn {
      position: absolute;
      top: 0;
      right: -200px;
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
