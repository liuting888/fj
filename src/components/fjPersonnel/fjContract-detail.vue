<template>
  <div class="fj-content_view contract">
    <div class="fj-content_view_mask">
      <div class="fj-block title">
        <fj-breadNav :bread-data="breadData"></fj-breadNav>
      </div>
      <div class="fj-block content">
        <div class="fj-block-head kaohe">
          <p class="title">合同</p>
          <!-- <div class="contract-footer-btn" v-if="userInfo.state==0||userInfo.state==2"> -->
          <div class="contract-head-btn">
            <el-button type="primary" v-if="userInfo.state==2" @click="checkDialogVisible = true">签订</el-button>
            <el-button @click="downComtract">
              <span>导出</span>
            </el-button>
          </div>
        </div>
        <div class="fj-block-body">
          <!-- <iframe
            src="http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf"
            width="100%"
            height="100%"
          >-->
          <iframe :src="iframeSrc" width="100%" height="100%">当前浏览器暂时不支持查看PDF，请更新浏览器.</iframe>
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
      <div>请选择需要签订的年数</div>
      <div>
        <el-radio v-model="radio" label="1">1年</el-radio>
        <el-radio v-model="radio" label="2">2年</el-radio>
        <el-radio v-model="radio" label="3">3年</el-radio>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="checkDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="review">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
export default {
  name: "personnel-contract-Details",
  data() {
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "人事管理", path: "" },
        { name: "合同管理", path: "/personnel-contract" },
        { name: "详情", path: "" }
      ],
      activeList: [],
      userInfo: {},
      ruleForm: {
        name: ""
      },
      iframeSrc: "",
      // 审核弹出框数据
      checkDialogVisible: false,
      checkDialogVisibleModal: false,
      radio: "2",
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
    this.getComtract();
  },
  methods: {
    //签订
    review() {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/signContract",
        type: "POST",
        data: {
          id: vm.userInfo.id,
          year: vm.radio
        },
        dataType: "json",
        success: function(data) {
          if (data.errorCode == 0) {
            vm.$message({
              type: "success",
              message: data.errorMsg
            });
            vm.userInfo.state = 1;
          } else {
            vm.$message({
              type: "error",
              message: data.errorMsg
            });
          }
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      vm.checkDialogVisible = false;
      return defer;
    },
    //获取合同路径
    getComtract() {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getContractPdf",
        type: "POST",
        data: {
          id: vm.userInfo.id
        },
        dataType: "json",
        success: function(data) {
          vm.iframeSrc = fjPublic.ajaxUrlDNN + "/" + data.data;
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    //导出合同
    downComtract() {
      window.open(
        fjPublic.ajaxUrlDNN + "/getContractWord?id=" + this.userInfo.id
      );
    },
    setCreated() {
      this.userInfo = this.$route.query;
    }
  },
  watch: {
    // $route: {
    //   handler(route) {
    //     this.setCreated();
    //   }
    // }
  },
  components: {
    fjBreadNav
  }
};
</script>
<style scope lang="less">
.contract {
  .contract-head-btn {
    position: absolute;
    top: 10px;
    right: 0px;
  }
  .fj-block-body {
    height: 860px;
    padding: 20px;
  }
  .el-dialog__body {
    div {
      margin: 20px;
    }
  }
}
@media screen and (min-width: 1920px) {
  /* .fj-content_view.contract .el-form .el-form-item__content .el-select {width:60%;} */
}
</style>

