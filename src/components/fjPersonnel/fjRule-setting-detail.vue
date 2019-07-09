<template>
  <div class="fj-content_view rule-detail">
    <div class="fj-content_view_mask">
      <div class="fj-block title">
        <fj-breadNav :bread-data="breadData"></fj-breadNav>
      </div>
      <div class="fj-block content">
        <div class="fj-block-head kaohe">
          <p class="title">合同规则</p>
        </div>
        <div class="fj-block-body">
          <div v-if="!ruleForm.templateFile">
            <img src="static/images/fjRule-setting-word.png" alt="导入文件" />
          </div>
          <div v-if="ruleForm.templateFile">
            <!-- <div class="rule-block-title">
              <i class="el-icon-edit"></i>
              <el-input
                :disabled="userInfo.state == 1"
                v-model="ruleForm.people"
                placeholder="请输入合同名称"
              ></el-input>
            </div> -->
            <iframe :src="iframeSrc" width="80%" height="700px">当前浏览器暂时不支持查看PDF，请更新浏览器.</iframe>
          </div>
          <div class="rule-block-btn">
            <el-button type="primary" @click="review()" v-if="!ruleForm.id">导入</el-button>
            <el-button type="primary" @click="review()" v-if="ruleForm.id">编辑</el-button>
            <el-button @click="goList()">返回列表</el-button>
            <!-- <el-button type="primary" @click="review()" v-if="!url">配置</el-button>
            <el-button type="primary" @click="review()" v-if="!url">替换</el-button>-->
            <!-- <form
              style="display:none;"
              name="exportForm"
              :action="ajaxUrlDNN + '/exportRecruits?nowUser=' + nowUser + '&endTime=' + searchForm.endTime + '&deptId=' + searchForm.deptId + '&startTime=' + searchForm.startTime + '&page=' + currentPage + '&nameOrPhone=' + searchForm.nameOrPhone + '&rows=' + pageSize"
              method="post"
              enctype="multipart/form-data"
            ></form>-->
            <!-- <el-button @click="exportExcl" v-if="!url">导出</el-button> -->
          </div>
        </div>
      </div>
    </div>
    <!-- 审核弹出框 -->
    <el-dialog
      title="配置合同规则"
      :visible.sync="checkDialogVisible"
      :modal-append-to-body="checkDialogVisibleModal"
      style="position: absolute"
      width="600px"
      :close-on-click-modal="false"
      top="25vh"
      class="check-dialog"
    >
      <div class="wage-set">
        <el-form :model="ruleForm" :rules="rules">
          <el-form-item label="合同名称：">
            <el-input v-model="ruleForm.name" placeholder="请输入合同名称"></el-input>
          </el-form-item>
          <el-form-item label="合同起始编号：">
            <el-input v-model="ruleForm.serial" placeholder="请输入合同起始编号"></el-input>
          </el-form-item>
          <el-form-item label="适用部门：">
            <el-select clearable filterable v-model="ruleForm.deptId" size="small">
              <el-option
                v-for="item in deptIds"
                :key="item.deptid"
                :label="item.deptname"
                :value="item.deptid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上传合同：">
            <!-- <input type="file" name="file" id="pic" /> -->
            <el-upload
              class="upload-demo"
              ref="upload"
              :action="ajaxUrlDNN+'/uploadContractTemplate'"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :before-remove="beforeRemove"
              :multiple="false"
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="fileList"
              accept=".docx"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传docx文件，没有修改则无需上传</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="适用岗位：">
            <el-radio v-model="ruleForm.job" label="1000">城区辅警</el-radio>
            <el-radio v-model="ruleForm.job" label="1000">乡镇辅警</el-radio>
            <el-radio v-model="ruleForm.job" label="1000">所有辅警</el-radio>
          </el-form-item>
          <el-form-item label="合同到期提醒时间：">
            <el-radio v-model="ruleForm.time" label="30">30天</el-radio>
            <el-radio v-model="ruleForm.time" label="60">60天</el-radio>
            <el-radio v-model="ruleForm.time" label="90">90天</el-radio>
          </el-form-item>
          <el-form-item label="试用期天数：">
            <el-radio v-model="ruleForm.tryTime" label="30">30天</el-radio>
            <el-radio v-model="ruleForm.tryTime" label="60">60天</el-radio>
            <el-radio v-model="ruleForm.tryTime" label="90">90天</el-radio>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="checkDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="postRuleForm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
export default {
  name: "personnel-rule-Details",
  data() {
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "人事管理", path: "" },
        { name: "规则管理", path: "/personnel-rule-setting" },
        { name: "详情", path: "" }
      ],
      ajaxUrlDNN: fjPublic.ajaxUrlDNN,
      iframeSrc: "",
      fileList: [],
      deptIds: [],
      activeList: [],
      userInfo: {},
      ruleForm: {
        id: "",
        name: "",
        deptId: "",
        userId: "",
        job: "",
        time: "",
        tryTime: "",
        templateFile: "",
        templatePdf: "",
        serial: ""
      },
      // 审核弹出框数据
      checkDialogVisible: false,
      checkDialogVisibleModal: false,
      radio: "1",
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
      rules: []
    };
  },
  mounted() {
    this.setCreated();
  },
  methods: {
    exportExcl: function() {
      // 导出
      document.forms["exportForm"].submit();
    },
    //签订
    review() {
      // this.$message({
      //   message: "请保证人员审核进度一致",
      //   type: "warning"
      // });
      this.initDeptIds();
      this.checkDialogVisible = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleSuccess(response, file, fileList) {
      let vm =this;
      if (response.errorCode == 0) {
        vm.ruleForm.templatePdf = response.data.pdfFileName;
        vm.ruleForm.templateFile = response.data.wordFileName;
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    //返回列表
    goList() {
      this.$router.push({
        path: "/personnel-rule-setting"
      });
    },
    // 初始化部门
    initDeptIds: function(id) {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getParentDeptListByDeptId",
        type: "POST",
        data: {
          deptId: $.parseJSON(fjPublic.getLocalData("userInfo")).deptId
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
    //获取详情
    getDetail() {
      let vm = this;
      let index = fjPublic.ajaxUrlDNN.indexOf("A");
      let url = fjPublic.ajaxUrlDNN.substring(0, index);
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getContractTemplateInfo",
        type: "POST",
        data: { id: this.userInfo.id },
        dataType: "json",
        success: function(data) {
          vm.ruleForm = data.data;
          vm.iframeSrc = url + "/contract/template/" + data.data.templatePdf;
        },
        error: function(err) {}
      });
    },
    // 提交或者编辑数据
    postRuleForm: function() {
      let vm = this;
      this.$refs.upload.submit();
      if (vm.userInfo.id) {
        vm.ruleForm.id = vm.userInfo.id;
      }
      // vm.ruleForm.tableName = vm.activeList[vm.userInfo.index].tableName;
      vm.ruleForm.userId = $.parseJSON(
        fjPublic.getLocalData("userInfo")
      ).userId;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/saveContractTemplate",
        type: "POST",
        data: vm.ruleForm,
        dataType: "json",
        success: function(data) {
          if (data.errorCode == 0) {
            vm.$router.push({
              path: "/personnel-rule-setting"
            });
          } else {
          }
        },
        error: function(err) {}
      });
    },
    setCreated() {
      this.userInfo = this.$route.query;
      if (this.userInfo.id) {
        this.getDetail();
      }
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
.rule-detail {
  .fj-block-body {
    // height: 800px;
    padding: 20px;
    text-align: center;
  }
  .rule-block-btn {
    margin-top: 20px;
  }
  .rule-block-title {
    margin-bottom: 20px;
    i {
      font-size: 18px;
    }
    input {
      border: none;
      font-size: 18px;
    }
  }
}
.wage-set {
  .el-form-item__label {
    width: 150px;
    text-align: left;
  }
  .el-select {
    width: 240px;
  }
  .upload-demo {
    width: 500px;
  }
  .el-upload-list {
    margin-left: 150px;
  }
  .el-upload__tip {
    margin-left: 150px;
  }
}
@media screen and (min-width: 1920px) {
  /* .fj-content_view.rule .el-form .el-form-item__content .el-select {width:60%;} */
}
</style>

