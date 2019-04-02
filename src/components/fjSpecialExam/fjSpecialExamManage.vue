<template>
  <div class="fj-content_view YBSS">
    <div class="fj-content_view_mask">
      <div class="fj-block title">
        <fj-breadNav :bread-data="breadData"></fj-breadNav>
      </div>
      <div class="fj-block content">
        <div class="fj-block-head kaohe">
          <!-- <p class="title fj-fl">{{breadData[3].name}}</p> -->
        </div>
        <div class="fj-block-body">
          <!-- 筛选区域 -->
          <ul class="filterOpe-area">
            <li class="area-line fj-clear">
              <div class="item fj-fl">
                <span class="fj-fl title">抽查日期：</span>
                <el-date-picker
                  v-bind:disabled="userInfo.state == 1"
                  v-model="ruleForm.randomTime"
                  type="date"
                  placeholder="请选择"
                ></el-date-picker>
              </div>
              <div class="item fj-fl">
                <span class="fj-fl title">抽查地点：</span>
                <el-select
                  v-bind:disabled="userInfo.state == 1"
                  v-model="ruleForm.randomCity"
                  placeholder="县（市区）/ 派出所 / 小区（村）"
                >
                  <el-option
                    v-for="item in randomCityList"
                    :key="item.deptId"
                    :label="item.deptName"
                    :value="item.deptId"
                  ></el-option>
                </el-select>
              </div>
            </li>
          </ul>
          <!-- 表单输入区域 -->
          <div class="YBSS-form-area">
            <!-- 实有房屋信息采集表 -->
            <div v-if="userInfo.index==0">
              <el-form :model="ruleForm" ref="ruleForm" :rules="rules">
                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="city" label="市、县/区">
                      <el-select
                        v-model="ruleForm.city"
                        v-bind:disabled="userInfo.state == 1"
                        placeholder="请选择（必选）"
                      >
                        <el-option></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" prop="street" label="街道/乡镇">
                      <el-select
                        v-model="ruleForm.street"
                        v-bind:disabled="userInfo.state == 1"
                        placeholder="请选择（必选）"
                      >
                        <el-option></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="community" label="社区/村">
                      <el-select
                        v-model="ruleForm.community"
                        v-bind:disabled="userInfo.state == 1"
                        placeholder="请选择（必选）"
                      >
                        <el-option></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" prop="road" label="街路巷">
                      <el-input
                        v-model="ruleForm.road"
                        v-bind:disabled="userInfo.state == 1"
                        placeholder="请输入街路巷（必填）"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="houseNumber" label="门牌号">
                      <el-input
                        v-model="ruleForm.houseNumber"
                        v-bind:disabled="userInfo.state == 1"
                        placeholder="请输入门牌号（必填）"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" prop="plots" label="小区（组）">
                      <el-input
                        v-model="ruleForm.plots"
                        v-bind:disabled="userInfo.state == 1"
                        placeholder="请输入小区/组（必填）"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item class="noBR" prop="address" label="楼栋详址">
                      <el-input
                        v-model="ruleForm.address"
                        v-bind:disabled="userInfo.state == 1"
                        placeholder="请输入楼栋详址（必填）"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="entityName" label="实体名称">
                      <el-input
                        v-model="ruleForm.entityName"
                        v-bind:disabled="userInfo.state == 1"
                        placeholder="请输入实体名称（必填）"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="产权类型">
                      <el-select
                        v-bind:disabled="userInfo.state == 1"
                        v-model="ruleForm.type"
                        placeholder="请选择"
                      >
                        <el-option></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="房主姓名">
                      <el-input
                        v-model="ruleForm.houseName"
                        v-bind:disabled="userInfo.state == 1"
                        placeholder="请输入房主姓名"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="产权单位、法人姓名">
                      <el-input
                        v-model="ruleForm.legalName"
                        v-bind:disabled="userInfo.state == 1"
                        placeholder="请输入产权单位、法人姓名"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="证件号码">
                      <el-input
                        v-model="ruleForm.idCard"
                        v-bind:disabled="userInfo.state == 1"
                        placeholder="请输入证件号码"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="联系电话">
                      <el-input
                        v-model="ruleForm.phone"
                        v-bind:disabled="userInfo.state == 1"
                        placeholder="请输入联系电话"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="是否出租房屋">
                      <el-select
                        v-bind:disabled="userInfo.state == 1"
                        v-model="ruleForm.rent"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in whether"
                          :key="item.value"
                          :label="item.lable"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="房屋建成时间/出租时间">
                      <el-date-picker
                        v-bind:disabled="userInfo.state == 1"
                        v-model="ruleForm.time"
                        type="date"
                        placeholder="请选择"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="房屋所属分局">
                      <el-select
                        v-model="ruleForm.suboffice"
                        v-bind:disabled="userInfo.state == 1"
                        placeholder="请选择房屋所属分局"
                      >
                        <el-option
                          v-for="item in subofficeList"
                          :key="item.deptid"
                          :label="item.deptname"
                          :value="item.deptid"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="noBR" label="房屋所属派出所">
                      <el-select
                        v-model="ruleForm.police"
                        v-bind:disabled="userInfo.state == 1"
                        placeholder="请选择房屋所属分局"
                      >
                        <el-option
                          v-for="item in policeList"
                          :key="item.deptId"
                          :label="item.deptName"
                          :value="item.deptId"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item class="noBR noBB" label="备注">
                      <el-input v-bind:disabled="userInfo.state == 1" v-model="ruleForm.remark"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <ul class="YBSS-notice-list">
                <li class="list-item-title">说明</li>
                <li class="list-item">1、采集居住人员信息时，先采集房屋信息，带*的为必填项；</li>
                <li class="list-item">2、为便于比对，表中“房主姓名与证件号码”应尽量采集；对于在一层有架空层（车库、储藏室）的，在备注中说明；</li>
                <li class="list-item">3、每个县（市、区）抽查点数量房屋不少于10户。</li>
              </ul>
            </div>
          </div>
          <div class="ybss-footer-btn" v-if="userInfo.state==0||userInfo.state==2">
            <el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
            <el-button @click="routerGo">取 消</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
export default {
  name: "fjWorkManage-YiBiaoSanShi-Details",
  data() {
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "教培管理", path: "" },
        { name: "专题考试", path: "" }
      ],
      userInfo: {},
      ruleForm: {
        name: ""
      },
      randomCityList: [], //抽查地点
      subofficeList: [], //房屋所属分局
      policeList: [], //房屋所属派出所
      whether: [
        {
          value: "是",
          label: "是"
        },
        {
          value: "否",
          label: "否"
        }
      ], //是否
      rules: {}
    };
  },
  // created() {
  //   this.setCreated();
  // },
  mounted() {
    this.getTeamList();
    this.getDownDepts();
    this.setCreated();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.postRuleForm();
        } else {
          this.$message({
            message: "请填写完所有必填信息",
            type: "warning"
          });
          return false;
        }
      });
    },
    // 获取抽查地点数据
    getTeamList: function(state) {
      var vm = this;
      // 参数
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/searchDeptsByFenju",
        type: "POST",
        data: {},
        dataType: "json",
        success: function(data) {
          console.log(data);
          vm.policeList = data.list;
        },
        error: function(err) {}
      });
    },
    // 获取所属地分局
    getDownDepts: function(state) {
      var vm = this;
      // 参数
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getDownDepts",
        type: "POST",
        data: {
          deptid: $.parseJSON(fjPublic.getLocalData("userInfo")).deptId
        },
        dataType: "json",
        success: function(data) {
          console.log(data);
          vm.subofficeList = data;
        },
        error: function(err) {}
      });
    },
    // 提交或者编辑数据
    postRuleForm: function() {
      let vm = this;
      let url = vm.userInfo.state == 0 ? "/addInfo" : "/updInfo";
      if (vm.userInfo.id) {
        vm.ruleForm.id = vm.userInfo.id;
      }
      // vm.ruleForm.tableName = vm.activeList[vm.userInfo.index].tableName;
      vm.ruleForm.userId = $.parseJSON(
        fjPublic.getLocalData("userInfo")
      ).userId;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + url,
        type: "POST",
        data: vm.ruleForm,
        dataType: "json",
        success: function(data) {},
        error: function(err) {
          if (err.responseText == "success") {
            vm.$router.push({
              path: "/fjWorkManage-YiBiaoSanShi"
            });
          } else {
          }
        }
      });
    },
    setCreated() {
      this.userInfo = this.$route.query;
      // this.breadData[3].name =
      //   this.activeList[this.userInfo.index].name + "信息采集表";
      this.ruleForm = {};
      this.userInfo.state != 0 &&
        (this.ruleForm = $.parseJSON(fjPublic.getLocalData("ybssItem")));
      // this.$refs["ruleForm"].resetFields();
    },
    routerGo() {
      window.history.go(-1);
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.setCreated();
      }
    }
  },
  components: {
    fjBreadNav
  }
};
</script>
<style scope lang="less">
.ybss-footer-btn {
  margin-top: 30px;
  text-align: center;
  button {
    width: 120px;
    height: 36px;
  }
}
.YBSS-form-area {
  .el-input.is-disabled .el-input__inner {
    cursor: auto;
    background-color: #fff;
  }
  .el-form-item__error {
    display: none;
  }
  .is-required {
    .el-form-item__label:before {
      display: none;
    }
    .el-form-item__label:after {
      content: "*";
      color: #f56c6c;
      margin-left: 4px;
    }
  }
}
.fj-content_view.YBSS {
  background: #fff;
}
.fj-content_view_mask {
  background: #f0f2f5;
}
.fj-content_view.YBSS .YBSS-form-area.x-scroll {
  overflow-x: scroll;
}
.fj-content_view.YBSS .YBSS-form-area > .el-form {
  margin-bottom: 15px;
}
.fj-content_view.YBSS .el-form {
  border: 1px solid #e8e8e8;
}
.fj-content_view.YBSS .el-form.has-table {
  border: none;
}
.fj-content_view.YBSS .el-form .el-form-item {
  margin-bottom: 0px;
  border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}
.fj-content_view.YBSS .el-form .el-form-item.noBR {
  border-right: none;
}
.fj-content_view.YBSS .el-form .el-form-item.noBB {
  border-bottom: none;
}
/* 表单->表格调整 */
.YBSS-form-area .el-table th {
  text-align: left;
  color: rgba(0, 0, 0, 0.65);
}
.YBSS-form-area .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: transparent;
}
.YBSS-form-area .el-table td {
  padding: 6px 0px;
}
.YBSS-form-area .el-table td .el-input {
  width: 100%;
}
.YBSS-form-area .el-table td .el-input .el-input__inner {
  padding: 0px 4px;
  border: none;
  color: rgba(0, 0, 0, 0.65);
}
.YBSS-form-area .el-table td .el-textarea .el-textarea__inner {
  border: none;
  padding: 0px;
}
/*  */
.fj-content_view.YBSS .el-form .el-form-item__label {
  min-width: 200px;
  padding: 0px 0px 0px 20px;
  line-height: 44px;
  background-color: #fafafa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-right: 1px solid #e8e8e8;
  text-align: left;
}
.fj-content_view.YBSS .el-form .el-form-item__content {
  padding-left: 200px;
  line-height: 44px;
}
.fj-content_view.YBSS .el-form .el-form-item.NPL .el-form-item__content {
  padding-left: 0px;
}
/* el-form样式修改 */
.fj-content_view.YBSS .el-form.no-title .el-form-item__label,
.fj-content_view.YBSS .el-form.no-content .el-form-item__content {
  display: none;
}
.fj-content_view.YBSS .el-form.no-title .el-form-item__label,
.fj-content_view.YBSS .el-form.no-content .el-form-item__label {
  border-right: none;
}
.fj-content_view.YBSS .el-form.no-content .el-form-item__label {
  float: none;
  display: block;
}
.fj-content_view.YBSS .el-form.no-content + .el-form.no-title {
  border-left: none;
}
.fj-content_view.YBSS .el-form[class*="no"] {
  float: left;
}
.fj-content_view.YBSS .el-form.no-title .el-form-item__content {
  padding-left: 0px;
}
.fj-content_view.YBSS .el-form.no-content .el-form-item__label,
.fj-content_view.YBSS .el-form.no-title .el-form-item__content {
  position: relative;
  min-width: 160px;
}
.fj-content_view.YBSS
  .el-form.no-title
  .el-form-item__content
  .el-input.is-disabled
  .el-input__inner {
  background-color: #fafafa;
  color: rgba(0, 0, 0, 0.65);
}
/*  */
/* 表单调整 */
.fj-content_view.YBSS .el-form .el-form-item__content .el-select,
.fj-content_view.YBSS .el-form .el-form-item__content .el-input {
  display: block;
  width: 100%;
}
.fj-content_view.YBSS
  .el-form
  .el-form-item__content
  .el-input
  > .el-input__inner {
  height: 44px;
  line-height: 44px;
  border-color: #fff;
  border-radius: 0;
  color: rgba(0, 0, 0, 0.65);
}
.el-form-item.is-error .el-input__inner,
.el-form-item.is-error .el-input__inner:focus {
  border-color: #f56c6c !important;
}
/* 说明文字 */
.fj-content_view.YBSS .YBSS-notice-list {
  padding-left: 20px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}
.fj-content_view.YBSS .YBSS-notice-list > .list-item-title {
  line-height: 24px;
  font-size: 14px;
  margin-bottom: 10px;
}
.fj-content_view.YBSS .YBSS-notice-list > .list-item {
  line-height: 22px;
}
/* 弹层操作 */
.fj-content_view.YBSS .el-dialog .el-dialog__header {
  padding: 40px 56px;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.85);
}
.fj-content_view.YBSS .el-dialog .el-dialog__body {
  padding: 0px 56px 20px;
}
.fj-content_view.YBSS .el-dialog .el-dialog__body .columns {
  display: flex;
}
.fj-content_view.YBSS .el-dialog .el-dialog__body .fj-column,
.fj-content_view.YBSS .el-dialog .el-dialog__body .fj-column {
  flex: 1 0 auto;
}
.fj-content_view.YBSS .el-dialog .el-dialog__body .title-column {
  flex: 0 0 auto;
  width: 200px;
}
.fj-content_view.YBSS .el-dialog .el-dialog__body .title-column > .el-form {
  border-right: none;
}
.fj-content_view.YBSS .el-dialog .el-dialog__body .fj-column > .el-form {
  border-right: none;
}
.fj-content_view.YBSS .el-dialog .el-dialog__body .el-form[class*="no"] {
  float: none;
}
.fj-content_view.YBSS
  .el-dialog
  .el-dialog__body
  .title-column
  .el-form
  .el-form-item__label {
  background-color: transparent;
}
/*  */
.fj-content_view.YBSS
  .el-dialog
  .el-dialog__body
  [class*="-column"]
  .el-form:first-child {
  border-bottom: none;
}
/*  */
.fj-content_view.YBSS
  .el-dialog
  .el-dialog__body
  .title-column
  > .el-form
  .el-form-item:nth-of-type(2n),
.fj-content_view.YBSS
  .el-dialog
  .el-dialog__body
  .fj-column
  > .el-form
  .el-form-item:nth-of-type(2n)
  .el-input__inner,
.fj-content_view.YBSS
  .el-dialog
  .el-dialog__body
  .mj-column
  > .el-form
  .el-form-item:nth-of-type(2n)
  .el-input__inner {
  background-color: #f0faff;
}
@media screen and (min-width: 1920px) {
  /* .fj-content_view.YBSS .el-form .el-form-item__content .el-select {width:60%;} */
}
</style>

