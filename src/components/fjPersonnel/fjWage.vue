<template>
  <div class="fj-content_view work-mis wage">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head kaohe">
        <el-tabs v-model="activeIndex" @tab-click="handleClick">
          <el-tab-pane label="工资列表" name="0"></el-tab-pane>
          <el-tab-pane label="工资申诉" name="1"></el-tab-pane>
        </el-tabs>
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
                    v-model="searchTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changeSearchTime"
                    size="small"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :lg="6" :xl="5">
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
                    placeholder="请输入名称或警号"
                    size="small"
                    class="search-input"
                  >
                    <el-button slot="append" @click="searchAttendLeave">搜索</el-button>
                  </el-input>
                  <div class="search-btn">
                    <el-upload
                      v-if="activeIndex==0"
                      class="upload-demo"
                      :action="ajaxUrlDNN + '/importPayrollExcel'"
                      :multiple="false"
                      :show-file-list="false"
                    >
                      <el-button size="small" type="primary">导入</el-button>
                    </el-upload>
                    <el-button v-if="activeIndex==0" @click="exportExcl">导出</el-button>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :lg="6" :xl="6" v-if="activeIndex==1">
                <el-form-item label="处理结果：">
                  <el-select
                    @change="changeStatus"
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
              </el-col>
            </el-form>
          </el-row>
        </div>
        <el-table :data="tableDataList" v-if="activeIndex==0">
          <el-table-column
            prop="time"
            label="发放日期"
            :formatter="timeFormatter"
            width="100"
            :key="Math.random()"
          ></el-table-column>
          <el-table-column prop="deptBelongName" label="单位" width="120" :key="Math.random()"></el-table-column>
          <el-table-column prop="deptName" label="辅警站" width="120" :key="Math.random()"></el-table-column>
          <el-table-column prop="userName" label="姓名" width="80" :key="Math.random()"></el-table-column>
          <el-table-column
            label="入职时间"
            width="100"
            :formatter="timeFormatter"
            prop="entryTime"
            :key="Math.random()"
          ></el-table-column>
          <el-table-column prop="basePay" label="基本工资" :key="Math.random()"></el-table-column>
          <el-table-column prop="meritPay" label="绩效工资" :key="Math.random()"></el-table-column>
          <el-table-column prop="tierPay" label="层级工资" :key="Math.random()"></el-table-column>
          <el-table-column prop="jonPay" label="岗位工资" :key="Math.random()"></el-table-column>
          <el-table-column prop="liveSubsidy" label="生活补贴" :key="Math.random()"></el-table-column>
          <el-table-column prop="infoCollect" label="信息采集费" width="100" :key="Math.random()"></el-table-column>
          <el-table-column prop="trafficSubsidy" label="流量补助费" width="100" :key="Math.random()"></el-table-column>
          <el-table-column prop="other" label="其他" :key="Math.random()"></el-table-column>
          <el-table-column prop="theorySum" label="应发合计" :key="Math.random()"></el-table-column>
          <el-table-column prop="pension" label="养老保险" :key="Math.random()"></el-table-column>
          <el-table-column prop="medicare" label="医疗保险" :key="Math.random()"></el-table-column>
          <el-table-column prop="unemployment" label="失业保险" :key="Math.random()"></el-table-column>
          <el-table-column prop="injury" label="工伤保险" :key="Math.random()"></el-table-column>
          <el-table-column prop="maternity" label="生育保险" :key="Math.random()"></el-table-column>
          <el-table-column prop="illness" label="大病互助保险" width="120" :key="Math.random()" ></el-table-column>
          <el-table-column prop="deduct" label="扣发合计" :key="Math.random()"></el-table-column>
          <el-table-column prop="sum" label="实发合计" :key="Math.random()"></el-table-column>
          <el-table-column prop="bankCard" label="银行卡号" width="180" :key="Math.random()" ></el-table-column>
          <el-table-column label="操作" :key="Math.random()">
            <template slot-scope="scope">
              <span class="ope-txt" @click="openDetail(scope.row.userId,1)">详情</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="tableDataList" v-if="activeIndex==1">
          <el-table-column prop="userName" label="姓名" :key="Math.random()"></el-table-column>
          <el-table-column prop="userAccount" label="警号" :key="Math.random()"></el-table-column>
          <el-table-column
            label="申诉时间"
            width="100"
            :formatter="timeFormatter"
            prop="insTime"
            :key="Math.random()"
          ></el-table-column>
          <el-table-column prop="complain" show-overflow-tooltip label="情况说明" :key="Math.random()"></el-table-column>
          <el-table-column label="状态" prop="state" width="120px" :key="Math.random()">
            <template slot-scope="scope">
              <span
                class="circle-status"
                :class="scope.row.state == 0 ? 'grey' : scope.row.state == 1 ? 'green' : 'red'"
              >
                {{parseInt( scope.row.state) === 0 ? '待审核' : parseInt( scope.row.state) === 1 ?'已同意'
                : '不同意'}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="处理意见" show-overflow-tooltip prop="response" :key="Math.random()"></el-table-column>
          <el-table-column label="操作" :key="Math.random()">
            <template slot-scope="scope">
              <span class="ope-txt" v-if="scope.row.state != 0" @click="editDialog(scope.row,1)">查看</span>
              <span class="ope-txt" v-if="scope.row.state == 0" @click="editDialog(scope.row,2)">审核</span>
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
    <!-- 审核弹出框 -->
    <el-dialog
      :title="checkDialogTitle"
      :visible.sync="checkDialogVisible"
      :modal-append-to-body="checkDialogVisibleModal"
      style="position: absolute"
      width="450px"
      @close="closeDialog"
      :close-on-click-modal="false"
      top="25vh"
      class="check-dialog"
    >
      <el-form :model="checkDialogForm" ref="checkDialogForm" inline :rules="checkRule">
        <el-form-item
          label="不通过理由"
          label-width="100px"
          prop="reason"
          v-if="checkDialogForm.status==2"
        >
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入不通过理由"
            v-model="checkDialogForm.reason"
            :disabled="reasonDisabled"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="通过理由"
          label-width="100px"
          prop="reasons"
          v-if="checkDialogForm.status==1"
        >
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入通过理由"
            v-model="checkDialogForm.reason"
            :disabled="!reasonDisabled"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="checkDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAudit(2)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑弹出框 -->
    <el-dialog
      :visible.sync="editDialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      style="position: absolute"
      width="600px"
      class="check-dialogs"
    >
      <div>
        <h3>{{ruleForm.userName}}--{{ruleForm.complainTime|getComplainTime}}工资明细</h3>
        <p>申诉内容：{{ruleForm.complain}}</p>
        <div class="form-info">
          <el-form :model="ruleForm">
            <el-form-item label="入职时间">
              <el-input v-model="ruleForm.entryTime" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="基本工资">
              <el-input
                v-model="ruleForm.basePay"
                :disabled="!isDisabled"
                :placeholder="isDisabled?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="绩效工资">
              <el-input
                v-model="ruleForm.meritPay"
                :disabled="!isDisabled"
                :placeholder="isDisabled?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="层级工资">
              <el-input
                v-model="ruleForm.tierPay"
                :disabled="!isDisabled"
                :placeholder="isDisabled?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="岗位工资">
              <el-input
                v-model="ruleForm.jonPay"
                :disabled="!isDisabled"
                :placeholder="isDisabled?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="生活补贴">
              <el-input
                v-model="ruleForm.liveSubsidy"
                :disabled="!isDisabled"
                :placeholder="isDisabled?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="信息采集费">
              <el-input
                v-model="ruleForm.infoCollect"
                :disabled="!isDisabled"
                :placeholder="isDisabled?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="流量补助费">
              <el-input
                v-model="ruleForm.trafficSubsidy"
                :disabled="!isDisabled"
                :placeholder="isDisabled?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="其他">
              <el-input
                v-model="ruleForm.other"
                :disabled="!isDisabled"
                :placeholder="isDisabled?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="应发合计">
              <el-input
                v-model="ruleForm.theorySum"
                :disabled="!isDisabled"
                :placeholder="isDisabled?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="养老保险">
              <el-input
                v-model="ruleForm.pension"
                :disabled="!isDisabled"
                :placeholder="isDisabled?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="医疗保险">
              <el-input
                v-model="ruleForm.medicare"
                :disabled="!isDisabled"
                :placeholder="isDisabled?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="失业保险">
              <el-input
                v-model="ruleForm.unemployment"
                :disabled="!isDisabled"
                :placeholder="isDisabled?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="工伤保险">
              <el-input
                v-model="ruleForm.injury"
                :disabled="!isDisabled"
                :placeholder="isDisabled?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="生育保险">
              <el-input
                v-model="ruleForm.maternity"
                :disabled="!isDisabled"
                :placeholder="isDisabled?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="大病互助保险">
              <el-input
                v-model="ruleForm.illness"
                :disabled="!isDisabled"
                :placeholder="isDisabled?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="扣发合计">
              <el-input
                v-model="ruleForm.deduct"
                :disabled="!isDisabled"
                :placeholder="isDisabled?'':'请输入'"
              ></el-input>
            </el-form-item>
            <el-form-item label="实发合计">
              <el-input
                v-model="ruleForm.sum"
                :disabled="!isDisabled"
                :placeholder="isDisabled?'':'请输入'"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="footer-info">
        <span>审批人: {{ruleForm.checkName}}</span>
        <span>审批时间: {{ruleForm.checkTime}}</span>
      </div>
      <div slot="footer" class="dialog-footer" v-if="isDisabled">
        <el-button type="primary" @click="submitAudit(1)">同 意</el-button>
        <el-button @click="openCheckDialog(2)">不 同 意</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
import mixin from "@/scripts/mixin.js";
export default {
  name: "fjAttendHistory",
  mixins: [mixin], // 使用mixins
  data: function() {
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "人事管理", path: "" },
        { name: "工资管理", path: "" }
      ],
      nowUser: $.cookie(fjPublic.loginCookieKey),
      ajaxUrlDNN: fjPublic.ajaxUrlDNN,
      // 分局
      supDeptIds: null,
      // 派出所
      deptIds: null,
      // 状态
      activeIndex: "0",
      statuses: [
        {
          value: "0",
          label: "待审核"
        },
        {
          value: "1",
          label: "已同意"
        },
        {
          value: "2",
          label: "不同意"
        }
      ],
      searchTime: "", // 查询时间
      // 列表查询参数
      searchForm: {
        keyword: "", // 警号或负责人名称
        deptId: "", // 派出所
        supDeptId: "", // 公安局
        status: "", // 状态
        endTime: "",
        startTime: ""
      },
      searchListUrl: "/getPayrollList", //获取列表数据URL
      // 审核弹出框数据
      checkDialogVisible: false,
      checkDialogVisibleModal: false,
      editDialogVisible: false,
      isDisabled: false, //判断审核弹框是否编辑
      checkDialogTitle: "",
      //审核人参数
      ruleForm: {
        status: ""
      },
      checkDialogForm: {
        id: "",
        status: "",
        reason: ""
      },
      reasonDisabled: true,
      // 不批准弹出框校验
      checkRule: {
        reason: {
          required: true,
          message: "请输入不通过理由",
          trigger: "blur"
        },
        reasons: {
          required: true,
          message: "请输入通过理由",
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
    // 初始化请假休假列表
    this.searchList();

    return;
  },
  methods: {
    //导出工资列表
    exportExcl() {
      // console.log(fjPublic.ajaxUrlDNN + '/exportPayrollExcel?endTime=' + this.searchForm.endTime + '&userId=' + $.parseJSON(fjPublic.getLocalData('userInfo')).userId + '&startTime=' + this.searchForm.startTime + '&pageNumber=' + this.currentPage  + '&pageSize=' + this.pageSize);
      window.open(
        fjPublic.ajaxUrlDNN +
          "/exportPayrollExcel?endTime=" +
          this.searchForm.endTime +
          "&userId=" +
          $.parseJSON(fjPublic.getLocalData("userInfo")).userId +
          "&startTime=" +
          this.searchForm.startTime +
          "&pageNumber=" +
          this.currentPage +
          "&pageSize=" +
          this.pageSize +
          "&keyword=" +
          this.searchForm.keyword
      );
    },
    //获取被选中的标签 tab 实例
    handleClick(tab) {
      this.activeIndex = tab.index;
      this.activeIndex == 0
        ? (this.searchListUrl = "/getPayrollList")
        : (this.searchListUrl = "/getComplainList");
      for (var i in this.searchForm) {
        this.searchForm[i] = "";
      }
      this.searchTime = "";
      this.currentPage = 1;
      this.searchList();
    },
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
      this.searchForm["supDeptId"] = supDeptId;
      this.searchList();
    },
    // 修改单位下拉框查询
    changeDeptId: function(deptId) {
      this.searchForm["deptId"] = deptId;
      this.searchList();
    },
    // 修改状态下拉框查询
    changeStatus: function(state) {
      this.searchForm["state"] = state;
      this.searchList();
    },
    // 名称或警号查询
    searchAttendLeave: function() {
      this.searchList();
    },
    // 设置获取列表参数
    setSearchList: function() {
      this.searchForm["pageNumber"] = this.currentPage;
      this.searchForm["pageSize"] = this.pageSize;
    },
    // 打开工资列表详情页
    openDetail: function(id, status) {
      this.$router.push({
        path: "/personnel-wage-detail",
        query: { state: status, id: id }
      });
    },
    // 打开工资编辑弹框
    editDialog: function(item, state) {
      var defer = $.Deferred();
      var vm = this;
      vm.checkDialogForm.id = item.id;
      vm.editDialogVisible = true;
      vm.isDisabled = state == 1 ? false : true;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getPayrollByComplainId",
        type: "POST",
        data: { complainId: item.id },
        dataType: "json",
        success: function(data) {
          if (data.errorCode == 0) {
            vm.ruleForm = data.data;
          } else {
          }
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    // 工资编辑弹框确认操作
    submitAudit: function(state) {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/processComplain",
        type: "POST",
        data: {
          id: vm.checkDialogForm.id,
          response: vm.checkDialogForm.reason,
          checkId: $.parseJSON(fjPublic.getLocalData("userInfo")).userId,
          state: state, //状态，1同意，2不同意
          list: state == 1 ? JSON.stringify(vm.ruleForm) : "" //工资条信息
        },
        dataType: "json",
        success: function(data) {
          if (data.errorCode == 0) {
            vm.$message({
              type: "success",
              message: data.errorMsg
            });
            vm.editDialogVisible = false;
            vm.checkDialogVisible = false;
            vm.searchList();
          } else {
            vm.$message({
              type: "error",
              message: data.errorMsg
            });
          }
          defer.resolve();
        },
        error: function(err) {
          vm.editDialogVisible = false;
          vm.checkDialogVisible = false;
          defer.reject();
        }
      });
      return defer;
    },
    // 打开审核弹出框
    openCheckDialog: function(status) {
      this.editDialogVisible = false;
      this.checkDialogForm["status"] = status;
      this.checkDialogTitle = status == 1 ? "同意？" : "不同意？";
      this.reasonDisabled = status == 1 ? true : false;
      this.checkDialogVisible = true;
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
    },
    // 弹窗关闭事件
    closeDialog() {
      this.$refs.checkDialogForm.resetFields();
    }
  },
  filters: {
    getComplainTime: function(value) {
      if (!value) {
        return "";
      }
      return value.substr(0, 4) + "年" + value.substr(4, 2) + "月";
    }
  },
  watch: {
    ruleForm: {
      handler: function(val, oldval) {
        let list = this.ruleForm;
        list.theorySum =
          parseFloat(list.basePay) +
          parseFloat(list.meritPay) +
          parseFloat(list.tierPay) +
          parseFloat(list.jonPay) +
          parseFloat(list.liveSubsidy) +
          parseFloat(list.infoCollect) +
          parseFloat(list.trafficSubsidy) +
          parseFloat(list.other);
        list.deduct =
          parseFloat(list.pension) +
          parseFloat(list.medicare) +
          parseFloat(list.unemployment) +
          parseFloat(list.injury) +
          parseFloat(list.maternity) +
          parseFloat(list.illness);
        list.sum = parseFloat(list.theorySum) - parseFloat(list.deduct);
      },
      deep: true
    }
  },
  components: {
    fjBreadNav
  }
};
</script>
<style scope lang="less">
.wage {
  .fj-block-head {
    height: 50px;
    border-bottom: 0px;
    .el-tabs__header {
      padding-top: 10px;
    }
  }
  .upload-demo {
    float: left;
    margin-right: 20px;
    margin-top: -1px;
  }
  .el-upload-list {
    display: none;
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
      button {
        height: 32px;
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
.check-dialogs {
  .form-info {
    margin: 10px 0;
    .el-form {
      .el-form-item {
        border: 1px solid #e8e8e8;
        border-bottom: none;
        margin-bottom: 0;

        .el-form-item__label {
          width: 250px;
          text-align: left;
          padding-left: 20px;
          border-right: 1px solid #e8e8e8;
        }
        .el-input {
          width: 300px;
          input {
            border: none;
          }
        }
      }
      .el-form-item:nth-of-type(even) {
        background: #f0faff;
        input {
          background: #f0faff;
        }
      }
      .el-form-item:last-child {
        border-bottom: 1px solid #e8e8e8;
      }
      .is-disabled {
        input {
          cursor: auto;
          background-color: #fff;
          color: #606266;
        }
      }
    }
  }
  .footer-info {
    span {
      display: inline-block;
      width: 240px;
      padding-left: 20px;
    }
  }
}
</style>
