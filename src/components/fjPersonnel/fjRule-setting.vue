<template>
  <div class="fj-content_view work-mis rule">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head kaohe">
        <el-tabs v-model="activeIndex" @tab-click="handleClick">
          <el-tab-pane label="工资规则" name="0"></el-tab-pane>
          <el-tab-pane label="合同规则" name="1"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="fj-block-body">
        <div class="add-list-btn" v-if="activeIndex==0" @click="addWage()">+ 新增工资规则</div>
        <div class="add-list-btn" v-if="activeIndex==1" @click="addContract('',0)">+ 新增合同规则</div>
        <el-table :data="tableDataList" v-if="activeIndex==0">
          <el-table-column
            prop="templateName"
            label="规则名称"
            show-overflow-tooltip
            width="120"
            :key="Math.random()"
          ></el-table-column>
          <el-table-column prop="job" label="适用岗位" width="100" :key="Math.random()"></el-table-column>
          <el-table-column prop="deptName" label="适用单位" width="120" :key="Math.random()"></el-table-column>
          <el-table-column prop="basePay" label="基本工资" :key="Math.random()"></el-table-column>
          <el-table-column prop="meritPay" label="绩效工资" :key="Math.random()"></el-table-column>
          <el-table-column prop="tierPay" label="层级工资" :key="Math.random()"></el-table-column>
          <el-table-column prop="jonPay" label="岗位工资" :key="Math.random()"></el-table-column>
          <el-table-column prop="liveSubsidy" label="生活补贴" :key="Math.random()"></el-table-column>
          <el-table-column prop="infoCollect" label="信息采集费" width="100" :key="Math.random()"></el-table-column>
          <el-table-column prop="trafficSubsidy" label="流量补助费" width="100" :key="Math.random()"></el-table-column>
          <el-table-column prop="other" label="其他" :key="Math.random()"></el-table-column>
          <el-table-column prop="pension" label="养老保险" :key="Math.random()"></el-table-column>
          <el-table-column prop="medicare" label="医疗保险" :key="Math.random()"></el-table-column>
          <el-table-column prop="unemployment" label="失业保险" :key="Math.random()"></el-table-column>
          <el-table-column prop="injury" label="工伤保险" :key="Math.random()"></el-table-column>
          <el-table-column prop="maternity" label="生育保险" :key="Math.random()"></el-table-column>
          <el-table-column prop="illness" label="大病互助保险" width="120" :key="Math.random()"></el-table-column>
          <el-table-column label="状态" prop="state" width="120" :key="Math.random()">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.state"
                active-color="#13ce66"
                inactive-color="#ccc"
                active-value="0"
                inactive-value="1"
                @change="delWage(scope.row.id,scope.row.state)"
              ></el-switch>
              <span>{{scope.row.state == 0?'启用':'废弃'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px" :key="Math.random()">
            <template slot-scope="scope">
              <span class="ope-txt" v-if="scope.row.state == -1">--</span>
              <!-- <span
                class="ope-txt"
                v-if="scope.row.leave_state != 0"
                @click="openWageDialog(scope.row.leaveId,1)"
              >配置</span>-->
              <span
                class="ope-txt"
                v-if="scope.row.state != -1"
                @click="delWage(scope.row.id,-1)"
              >删除</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="tableDataList" v-if="activeIndex==1">
          <el-table-column prop="name" label="合同名称" :key="Math.random()"></el-table-column>
          <el-table-column prop="depdName" label="适用单位" :key="Math.random()"></el-table-column>
          <el-table-column prop="job" label="适用岗位" :key="Math.random()"></el-table-column>
          <el-table-column prop="userName" label="创建人" :key="Math.random()"></el-table-column>
          <el-table-column
            label="创建时间"
            show-overflow-tooltip
            prop="insTime"
            :key="Math.random()"
          ></el-table-column>
          <el-table-column label="状态" prop="state" width="120px" :key="Math.random()">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.state" active-color="#13ce66" inactive-color="#ccc"></el-switch>
              <span>{{scope.row.state == 0?'开启':'关闭'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="合同到期提醒"
            show-overflow-tooltip
            prop="time"
            class-name="textLeft"
            :key="Math.random()"
          ></el-table-column>
          <el-table-column label="操作" :key="Math.random()">
            <template slot-scope="scope">
              <!-- <span class="ope-txt" v-if="scope.row.leave_state != 0">--</span> -->
              <span
                class="ope-txt"
                v-if="scope.row.leave_state != 0"
                @click="addContract(scope.row.id,2)"
              >编辑</span>
              <!-- <span
                class="ope-txt"
                v-if="scope.row.leave_state != 0"
                @click="addContract(scope.row.leaveId,1)"
              >查看</span>
              <span
                class="ope-txt"
                v-if="scope.row.leave_state != 0"
                @click="addContract(scope.row.leaveId,2)"
              >编辑</span>
              <span
                class="ope-txt"
                v-if="scope.row.leave_state != 0"
                @click="openContractDialog(scope.row.leaveId,1)"
              >配置</span>
              <span
                class="ope-txt"
                v-if="scope.row.leave_state != 0"
                @click="delContract(scope.row.leaveId, 2)"
              >删除</span>-->
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
    <!-- 新增工资规则弹出框 -->
    <el-dialog
      title="新增工资规则"
      :visible.sync="addWageVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      style="position: absolute"
      width="600px"
      class="check-dialogs"
    >
      <div class="form-info">
        <el-form :model="ruleForm">
          <el-form-item label="模板名称">
            <el-input v-model="ruleForm.templateName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="适用单位">
            <!-- <el-input v-model="ruleForm.deptId" placeholder="请输入"></el-input> -->
            <el-select
              @change="changeDeptId"
              clearable
              filterable
              v-model="ruleForm.deptId"
              size="small"
            >
              <el-option
                v-for="item in deptIds"
                :key="item.deptid"
                :label="item.deptname"
                :value="item.deptid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="基本工资">
            <el-input v-model="ruleForm.basePay" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="绩效工资">
            <el-input v-model="ruleForm.meritPay" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="层级工资">
            <el-input v-model="ruleForm.tierPay" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="岗位工资">
            <el-input v-model="ruleForm.jonPay" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="生活补贴">
            <el-input v-model="ruleForm.liveSubsidy" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="信息采集费">
            <el-input v-model="ruleForm.infoCollect" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="流量补助费">
            <el-input v-model="ruleForm.trafficSubsidy" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="其他">
            <el-input v-model="ruleForm.other" placeholder="请输入"></el-input>
          </el-form-item>
          <!-- <el-form-item label="应发合计">
            <el-input v-model="ruleForm.road" placeholder="请输入"></el-input>
          </el-form-item>-->
          <el-form-item label="养老保险">
            <el-input v-model="ruleForm.pension" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="医疗保险">
            <el-input v-model="ruleForm.medicare" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="失业保险">
            <el-input v-model="ruleForm.unemployment" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="工伤保险">
            <el-input v-model="ruleForm.injury" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="生育保险">
            <el-input v-model="ruleForm.maternity" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="大病互助保险">
            <el-input v-model="ruleForm.illness" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAudit()">确认</el-button>
        <el-button @click="addWageVisible=false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 配置工资规则弹出框 -->
    <el-dialog
      title="配置工资规则"
      :visible.sync="setWageVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      style="position: absolute"
      width="600px"
      class="check-dialogs"
    >
      <div class="wage-set">
        <el-form :model="ruleForm">
          <el-form-item label="适用岗位：">
            <el-radio v-model="radio" label="1">城区辅警</el-radio>
            <el-radio v-model="radio" label="2">乡镇辅警</el-radio>
            <el-radio v-model="radio" label="3">所有辅警</el-radio>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAudit()">确认</el-button>
        <el-button @click="setWageVisible==false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 配置合同规则弹出框 -->
    <el-dialog
      :title="checkDialogTitle"
      :visible.sync="setContractVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      style="position: absolute"
      width="600px"
      class="check-dialogs"
    >
      <div>
        <h3>配置合同规则</h3>
        <div class="wage-set">
          <el-form :model="ruleForm">
            <el-form-item label="适用岗位：">
              <el-radio v-model="radio" label="1">城区辅警</el-radio>
              <el-radio v-model="radio" label="2">乡镇辅警</el-radio>
              <el-radio v-model="radio" label="3">所有辅警</el-radio>
            </el-form-item>
            <el-form-item label="合同到期提醒时间：">
              <el-radio v-model="radio" label="1">30天</el-radio>
              <el-radio v-model="radio" label="2">60天</el-radio>
              <el-radio v-model="radio" label="3">90天</el-radio>
            </el-form-item>
            <el-form-item label="试用期天数：">
              <el-radio v-model="radio" label="1">30天</el-radio>
              <el-radio v-model="radio" label="2">60天</el-radio>
              <el-radio v-model="radio" label="3">90天</el-radio>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAudit()">确认</el-button>
        <el-button @click="setContractVisible==false">取 消</el-button>
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
        { name: "规则管理", path: "" }
      ],
      // nowUser: $.cookie(fjPublic.loginCookieKey),
      // // 分局
      // supDeptIds: null,
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
          label: "已通过"
        },
        {
          value: "2",
          label: "被驳回"
        }
      ],
      radio: "1",
      // 列表查询参数
      searchForm: {
        searchTime: "", // 查询时间
        nameOrAccount: "", // 警号或负责人名称
        deptId: "", // 派出所
        supDeptId: "", // 公安局
        status: "" // 状态
      },
      searchListUrl: "/getPayrollTemplateList", //获取列表数据URL
      addWageVisible: false,
      setWageVisible: false,
      setContractVisible: false,
      checkDialogTitle: "",
      //审核人参数
      checkInfoForm: {
        userName: "", //提交辅警姓名
        checkName: "", // 审核民警姓名
        insTime: "" // 提交时间
      },
      //审核人参数
      userInfo: {
        status: ""
      },
      //审核人参数
      ruleForm: {
        status: ""
      },
      // 审核参数
      // checkForm: {
      //   tableName: "", //表格类型
      //   checkId: "", // 审核民警id
      //   ids: "", // 信息采集表id
      //   state: "" // 状态（1：审核通过，2：作废）
      // },
      checkDialogForm: {
        id: "",
        status: "",
        reason: ""
      },
      reasonDisabled: true,
      formLabelWidth: "120px"
    };
  },
  mounted: function() {
    // 初始化列表
    this.searchList();

    return;
  },
  filters: {
    // 状态处理
    getLeaveStatus: function(value) {
      return value == "0"
        ? "待批"
        : value == 1
        ? "已批准"
        : value == 2
        ? "未批准"
        : "";
    },
    getFormatTime: function(value) {
      return value ? value.substring(0, value.length - 2) : "";
    }
  },
  methods: {
    //获取被选中的标签 tab 实例
    handleClick(tab) {
      this.activeIndex = tab.index;
      this.activeIndex == 0
        ? (this.searchListUrl = "/getPayrollTemplateList")
        : (this.searchListUrl = "/getContractTemplateList");
      this.currentPage = 1;
      this.searchList();
    },
    // 设置获取列表参数
    setSearchList: function() {
      this.searchForm["pageNumber"] = this.currentPage;
      this.searchForm["pageSize"] = this.pageSize;
      this.searchForm["userId"] = $.parseJSON(
        fjPublic.getLocalData("userInfo")
      ).userId;
    },
    // 打开工资配置弹框
    openWageDialog: function(id, status) {
      this.setWageVisible = true;
    },
    // 打开合同配置弹框
    openContractDialog: function(id, status) {
      this.setContractVisible = true;
    },
    // 打开合同详情页
    addContract: function(id, status) {
      this.$router.push({
        path: "/personnel-rule-setting-detail",
        query: { state: status, id: id }
      });
    },
    // 打开工资编辑弹框
    addWage: function() {
      this.ruleForm = {};
      this.addWageVisible = true;
      this.initDeptIds();
    },
    // 修改工资状态
    delWage: function(id, state) {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/updPayrollTemplate",
        type: "POST",
        data: {
          nowUser: $.cookie(fjPublic.loginCookieKey),
          id: id,
          state: state
        },
        dataType: "json",
        success: function(data) {
          vm.searchList();
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    // 删除合同规则
    delContract: function(id, state) {
      // console.log(id);
      // this.addWageVisible = true;
    },
    // 初始化派出所
    initDeptIds: function() {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getDeptAllList",
        type: "POST",
        data: {
          parentDeptId: ""
        },
        dataType: "json",
        success: function(data) {
          vm.deptIds = data.data;
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    // 工资编辑弹框操作
    submitAudit: function() {
      var defer = $.Deferred();
      var vm = this;
      vm.ruleForm["nowUser"] = $.cookie(fjPublic.loginCookieKey);
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/addPayrollTemplate",
        type: "POST",
        data: vm.ruleForm,
        dataType: "json",
        success: function(data) {
          // vm.deptIds = data.list;
          defer.resolve();
        },
        error: function(err) {
          err.responseText == "success" && vm.searchList();
          defer.reject();
        }
      });
      vm.addWageVisible = false;
      return defer;
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
.rule {
  .fj-block-head {
    border-bottom: none;
    .el-tabs__item {
      height: 50px;
      line-height: 46px;
      font-size: 16px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.85);
      letter-spacing: 1px;
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
  .add-list-btn {
    height: 32px;
    margin-top: 20px;
    text-align: center;
    line-height: 32px;
    color: #1890ff;
    border: 1px dashed #3aa0ff;
    cursor: pointer;
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
    }
  }
  .wage-set {
    margin: 20px;
    .el-form-item__label {
      width: 150px;
      text-align: left;
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
