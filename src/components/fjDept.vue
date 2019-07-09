<template>
  <div class="item fj-fl fj-dept0524">
    <div
      class="item fj-fl"
      v-show="fenjvData.isFenjv"
    >
      <span class="title fj-fl">区县分局：</span>
      <el-select
        class="fj-fl"
        @change="changeFenjvDeptId"
        clearable
        filterable
        v-model="fenjvData.deptId"
      >
        <el-option
          v-for="item in fenjvData.deptData"
          :key="item.deptId"
          :label="item.deptName"
          :value="item.deptId"
        ></el-option>
      </el-select>
    </div>
    <div class="item fj-fl">
      <span class="title fj-fl">派出所：</span>
      <el-select
        class="fj-fl"
        @change="changePcsDeptId"
        :disabled="pcsData.isPcs"
        clearable
        filterable
        v-model="pcsData.deptId"
      >
        <el-option
          v-for="item in pcsData.deptData"
          :key="item.deptId"
          :label="item.deptName"
          :value="item.deptId"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
export default {
  name: "fj-dept",
  data() {
    return {
      userInfo: null, //用户信息
      fenjvData: {
        //分局数据
        isFenjv: true,
        deptData: [],
        deptId: ""
      },
      pcsData: {
        //派出所数据
        isPcs: false,
        deptData: [],
        deptId: ""
      },
      userControl: {
        //根据登录用户控制
        [fjPublic.userRoles.pcs]() {
          this.pcsData["deptId"] = this.userInfo.deptId;
          this.pcsData["isPcs"] = true;
          this.userControl[fjPublic.userRoles.qj].call(this);
        },
        [fjPublic.userRoles.qj]() {
          this.fenjvData["isFenjv"] = false;
          this.fenjvData["deptId"] = this.userInfo.deptId;
          this.getPcsDeptData();
        },
        [fjPublic.userRoles.sj]() {
          this.getFenjvDeptData();
        },
        [fjPublic.userRoles.cg]() {
          this.userControl[fjPublic.userRoles.sj].call(this);
        }
      }
    };
  },
  props: {},
  created() {
    this.userInfo = $.parseJSON(fjPublic.getLocalData("userInfo")) || {};
    //
    this.userControl[this.userInfo.userRole].call(this);
  },
  methods: {
    getFenjvDeptData() {
      //获取分局部门数据
      //获取部门信息
      return $.Deferred(defer => {
        var vm = this;
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/searchGajByUserRole",
          type: "POST",
          data: {
            nowUser: $.cookie(fjPublic.loginCookieKey), //当前登录用户对象（必传）
            userId: "" //用户id（必传）
          },
          dataType: "json",
          success: function(data) {
            //console.log(data);
            if (data.errorCode == 0) {
              vm.$set(vm.fenjvData, "deptData", data.rows);
            } else {
              vm.$message({
                type: "warning",
                message: "获取区县分局部门数据失败"
              });
            }
            defer.resolve();
          },
          error: function(err) {
            vm.$message({
              type: "warning",
              message: "获取区县分局部门数据失败"
            });
            defer.reject();
          }
        });
      }).promise();
    },
    changeFenjvDeptId(id) {
        if(!id){
            this.pcsData["deptId"] = "";
            this.pcsData.deptData.splice(0,this.pcsData.deptData.length);
            return;
        };
        this.pcsData["deptId"] = "";
        this.fenjvData["deptId"] = id;
        this.getPcsDeptData();
        //
        this.$emit("change-fenjv",id);
    },
    getPcsDeptData() {
      //获取派出所部门数据
      //获取部门信息
      return $.Deferred(defer => {
        var vm = this;
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/searchPcsByByUserRole",
          type: "POST",
          data: {
            nowUser: $.cookie(fjPublic.loginCookieKey), //当前登录用户对象（必传）
            userId: "", //用户id（必传）
            deptId: this.fenjvData.deptId
          },
          dataType: "json",
          success: function(data) {
            //console.log(data);
            if (data.errorCode == 0) {
              vm.$set(vm.pcsData, "deptData", data.rows);
            } else {
              vm.$message({
                type: "warning",
                message: "获取派出所部门数据失败"
              });
            }
            defer.resolve();
          },
          error: function(err) {
            vm.$message({ type: "warning", message: "获取派出所部门数据失败" });
            defer.reject();
          }
        });
      }).promise();
    },
    changePcsDeptId(id) {
      if(!id)return;
      //切换派出所id的时候
      //触发父组件事件
      this.$emit("change-pcs", id);
    }
  }
};
</script>
<style lang="less">
.fj-dept0524 {
  margin-right: 0px !important;
}
</style>


