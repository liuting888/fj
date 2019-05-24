<template>
  <div class="fj-content_view Exam-Manage">
    <div class="fj-content_view_mask">
      <div class="fj-block title">
        <fj-breadNav :bread-data="breadData"></fj-breadNav>
      </div>
      <div class="fj-block content">
        <div class="fj-block-head kaohe">
          <p class="title" @mouseover="isTitleDisabled=false" @mouseout="isTitleDisabled=true">
            <!-- <el-input :disabled="isTitleDisabled" type="text" v-model="ruleForm.data.title"></el-input> -->
            <el-button type="primary" @click="createPaper()" v-if="userInfo.state == 0">生成试卷</el-button>
          </p>
        </div>
        <div class="fj-block-body">
          <!-- 表单输入区域 -->
          <div class="Exam-Manage-form-area">
            <el-form :model="ruleForm" ref="ruleForm" :rules="rules">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="试卷标题">
                    <el-input
                      v-model="ruleForm.data.title"
                      :disabled="isDisabled"
                      :placeholder="isDisabled?'':'请输入试卷标题'"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item class="noBR" label="考试类型">
                    <el-select
                      @change="changeType"
                      clearable
                      filterable
                      multiple
                      v-model="examType"
                      :disabled="isDisabled"
                      :placeholder="isDisabled?'':'请选择'"
                    >
                      <el-option
                        v-for="item in typeList"
                        :key="item.itemid"
                        :label="item.itemvalue"
                        :value="item.itemid"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="题目类型">
                    <el-checkbox-group v-model="type" :disabled="isDisabled">
                      <el-checkbox label="1">单选</el-checkbox>
                      <el-checkbox label="2">多选</el-checkbox>
                      <el-checkbox label="0">其他</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="noBR" label="考试时长">
                    <el-input
                      type="number"
                      :placeholder="isDisabled?'':'请输入'"
                      :disabled="isDisabled"
                      v-model="ruleForm.data.time"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="题目数量">
                    <el-input
                      type="number"
                      v-model="ruleForm.data.amount"
                      :disabled="isDisabled"
                      :placeholder="isDisabled?'':'请输入'"
                      @blur="amountChange"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="题目分数">
                    <el-input
                      type="number"
                      v-model="ruleForm.data.oneScore"
                      :disabled="isDisabled"
                      :placeholder="isDisabled?'':'请输入'"
                      @blur="communityChange"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item class="noBR" label="试卷分数">
                    <el-input v-model="ruleForm.data.score" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="错选得分">
                    <el-input
                      type="number"
                      v-model="ruleForm.data.choiceError"
                      :disabled="isDisabled"
                      :placeholder="isDisabled?'':'请输入'"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="多选得分">
                    <el-input
                      type="number"
                      v-model="ruleForm.data.choiceMore"
                      :disabled="isDisabled"
                      :placeholder="isDisabled?'':'请输入'"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="noBR" label="少选得分">
                    <el-input
                      type="number"
                      v-model="ruleForm.data.choiceFew"
                      :disabled="isDisabled"
                      :placeholder="isDisabled?'':'请输入'"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item class="noBR" label="试卷内容">
                    <el-input
                      :placeholder="isDisabled?'':'请简单描述试卷内容'"
                      :disabled="isDisabled"
                      v-model="ruleForm.data.content"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
        <div class="fj-block-foot" v-if="isCreatePaperShow">
          <div class="fj-block-head kaohe">
            <p class="title">
              <span>试卷内容</span>
              <el-button @click="createPaper()" v-if="userInfo.state != 1">重新生成试卷</el-button>
              <el-button type="primary" @click="postRuleForm()" v-if="userInfo.state != 1">保存试卷</el-button>
            </p>
          </div>
          <div class="foot-body">
            <el-container>
              <el-aside width="300px" v-if="userInfo.state != 1">
                <div class="head">
                  <el-select clearable v-model="examTypes" @change="changeExamType">
                    <el-option label="题库" value></el-option>
                    <el-option
                      v-for="item in examTypeList"
                      :key="item.itemid"
                      :label="item.itemvalue"
                      :value="item.itemid"
                    ></el-option>
                  </el-select>
                </div>
                <div class="search">
                  <el-input
                    v-model="searchAttend"
                    clearable
                    placeholder="请输入"
                    size="small"
                    class="search-input"
                  >
                    <el-button slot="append" @click="searchAttendHistory">搜索</el-button>
                  </el-input>
                </div>
                <el-checkbox-group v-model="checkedCities" :max="ruleForm.data.amount">
                  <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                </el-checkbox-group>
              </el-aside>
              <el-main :class="isDisabled?'aside-left':''">
                <div class="head" v-if="userInfo.state != 1">
                  <span>
                    <!-- <img src="static/images/exam-manage-info.png" alt> -->
                    <i class="el-icon-info"></i>
                  </span>
                  <span>
                    已选择
                    <span class="text-blue">{{ruleForm.list.length}}</span>
                    项，单选题{{headInfo.radio}}题，多选题{{headInfo.selection}}题，本套试卷共{{ruleForm.data.amount}}题（共计{{ruleForm.data.score}}分）。
                  </span>
                  <span class="text-blue" @click="createPaper()">清空</span>
                </div>
                <div class="body">
                  <div
                    :class="['check-topic','back-pid',item.editIcon&&userInfo.state != 1?'back-hover':'back-color']"
                    v-for="(item, index) in ruleForm.list"
                    @mouseover="item.editIcon=true"
                    @mouseleave="item.editIcon=false"
                    :key="index"
                  >
                    <div class="topic">{{index+1}}. {{item.question}}</div>
                    <ul>
                      <el-radio-group v-if="item.type == '1'" v-model="item.rightOptions">
                        <el-radio
                          label="0"
                          :disabled="(item.rightOptions.indexOf('0')==-1)"
                        >A: {{item.A}}</el-radio>
                        <el-radio
                          label="1"
                          :disabled="(item.rightOptions.indexOf('1')==-1)"
                        >B: {{item.B}}</el-radio>
                        <el-radio
                          label="2"
                          :disabled="(item.rightOptions.indexOf('2')==-1)"
                        >C: {{item.C}}</el-radio>
                        <el-radio
                          label="3"
                          :disabled="(item.rightOptions.indexOf('3')==-1)"
                        >D: {{item.D}}</el-radio>
                      </el-radio-group>
                      <el-checkbox-group
                        v-else
                        v-model="item.rightOptions"
                        :min="item.rightOptions.length"
                        :max="item.rightOptions.length"
                      >
                        <el-checkbox
                          label="0"
                          :disabled="(item.rightOptions.indexOf('0')==-1)"
                        >A: {{item.A}}</el-checkbox>
                        <el-checkbox
                          label="1"
                          :disabled="(item.rightOptions.indexOf('1')==-1)"
                        >B: {{item.B}}</el-checkbox>
                        <el-checkbox
                          label="2"
                          :disabled="(item.rightOptions.indexOf('2')==-1)"
                        >C: {{item.C}}</el-checkbox>
                        <el-checkbox
                          label="3"
                          :disabled="(item.rightOptions.indexOf('3')==-1)"
                        >D: {{item.D}}</el-checkbox>
                      </el-checkbox-group>
                      <li>
                        <span style="color:#409EFF">题目解析</span>
                        : {{item.analysis?item.analysis:'无'}}
                      </li>
                      <div class="right-revise" v-if="item.editIcon&&userInfo.state != 1">
                        <img src="static/images/fj-exam-del.png" alt="删除" @click="delTopic(index)">
                      </div>
                    </ul>
                  </div>
                </div>
              </el-main>
            </el-container>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
export default {
  name: "fjSpecial-Exam-Manage",
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      currentNode: {},
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "教培管理", path: "" },
        { name: "专题考试", path: "" }
      ],
      userInfo: {},
      searchAttend: "", //题库搜索框
      isCreatePaperShow: false,
      isTitleDisabled: true,
      isDisabled: false,
      checkDialogShow: false, //控制适用人员弹框显示或者隐藏
      flag: false, //控制重复提交
      treePeople: "", //适用人员展示
      type: [], //题目类型
      typeList: [], //考试类型
      examType: [], //考试类型选中
      examTypes: "", //题库类型
      examTypeList: [], //题库类型下拉框
      ruleForm: {
        data: {
          id: "",
          title: "",
          type: [],
          score: "",
          time: "",
          oneScore: "",
          people: "",
          choiceMore: 0,
          choiceFew: 0,
          choiceError: 0,
          // state:状态，0启用，1停用，-1删除，默认1
          examList: "",
          selectRules: "",
          place: "考试地点",
          content: "",
          examType: "",
          examTime: ""
        },
        list: [
          // {
          //   question: "题目1",
          //   A: "hahaA",
          //   B: "hahaB",
          //   C: "hahaC",
          //   D: "hahaD",
          //   rightOptions: ["2"],
          //   editIcon: false //用来判断是否展示侧边栏图标
          // }
        ]
      },
      checkedCities: [],
      cities: [],
      citiesId: [],
      citiesList: [],
      headInfo: {
        //试卷题目数量信息
        radio: "10",
        selection: "10",
        choose: "0"
      },
      radio: "1",
      rules: {}
    };
  },
  mounted() {
    this.setCreated();
    this.getDetailList();
    this.userInfo.state > 1 && this.searchAttendHistory();
    this.getDictListByType("TZLX", "typeList"); //题库类型
  },
  methods: {
    // 验证规则
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.createPaper();
        } else {
          this.$message({
            message: "请填写完所有必填信息",
            type: "warning"
          });
          return false;
        }
      });
    },
    //考试类型下拉框change
    changeType(val) {
      let vm = this;
      vm.examTypeList = [];
      for (let i = 0; i < val.length; i++) {
        for (let j = 0; j < vm.typeList.length; j++) {
          if (vm.typeList[j].itemid == val[i]) {
            vm.examTypeList.push(vm.typeList[j]);
          }
        }
      }
    },
    //题库下拉框change
    changeExamType(val) {
      this.searchAttendHistory(false, val);
    },
    //题目数量变化对于改变题目分数
    amountChange(val) {
      let vm = this;
      if (parseInt(vm.ruleForm.data.amount)) {
        parseInt(vm.ruleForm.data.oneScore) &&
          (vm.ruleForm.data.score =
            parseInt(vm.ruleForm.data.oneScore) *
            parseInt(vm.ruleForm.data.amount));
      } else {
        vm.$message({
          message: "请确认题目数量是否输入正确",
          type: "warning"
        });
      }
    },
    //题目分数变化对于改变题目数量
    communityChange(val) {
      let vm = this;
      if (parseInt(vm.ruleForm.data.oneScore)) {
        parseInt(vm.ruleForm.data.amount) &&
          (vm.ruleForm.data.score =
            parseInt(vm.ruleForm.data.oneScore) *
            parseInt(vm.ruleForm.data.amount));
      } else {
        vm.$message({
          message: "请确认题目分数是否输入正确",
          type: "warning"
        });
      }
    },
    //生成试卷
    createPaper() {
      // if (!this.ruleForm.data.score || !this.type.length > 0) {
      //   return this.$message({
      //     message: "请完整填写试卷信息",
      //     type: "warning"
      //   });
      // }
      this.isCreatePaperShow = true;
      this.ruleForm.list = [];
      this.checkedCities = [];
      this.searchAttendHistory(true);
    },
    treeAudit(i) {
      let list = this.$refs.tree.getCheckedNodes();
      this.ruleForm.data.people = "";
      this.treePeople = "";
      let treeList = [];
      let peopleList = [];
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        if (element.children) {
          treeList.push(element.id);
          peopleList.push(element.label);
        }
      }
      if (peopleList.length == 0) {
        for (let index = 0; index < list.length; index++) {
          const element = list[index];
          treeList.push(element.id);
          peopleList.push(element.label);
        }
      }
      this.ruleForm.data.people = treeList.join(",");
      this.treePeople = peopleList.join(",");
    },
    //删除考题
    delTopic(index) {
      let title = this.ruleForm.list[index].question;
      this.ruleForm.list.splice(index, 1);
      this.checkedCities.forEach((item, i) => {
        if (item.slice(item.indexOf(".") + 1) == title) {
          this.checkedCities.splice(i, 1);
        }
      });
    },
    /**
     * @description: 获取题库字典
     * @param {type} type 字典类型
     * @param {list} list 数据List
     * @return:
     */
    getDictListByType: function(type, list) {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getDictListByType",
        type: "POST",
        data: {
          type: type
        },
        dataType: "json",
        success: function(data) {
          vm[list] = data.data;
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    // 获取题库详情
    getDetailList: function() {
      this.ruleForm.data.id = this.userInfo.id;
      if (!this.userInfo.id) {
        return false;
      }
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getExamPaperInfo",
        type: "POST",
        data: {
          id: this.userInfo.id
        },
        dataType: "json",
        success: function(list) {
          let data = list.data;
          vm.ruleForm.data = data.info;
          vm.type = data.info.type.split(",");
          vm.examType = data.info.examType.split(",");
          for (let i = 0; i < data.list.length; i++) {
            let tm = {
              id: data.list[i].id,
              question: data.list[i].question,
              A: data.list[i].options.split("&GXCF&")[0],
              B: data.list[i].options.split("&GXCF&")[1],
              C: data.list[i].options.split("&GXCF&")[2],
              D: data.list[i].options.split("&GXCF&")[3],
              rightOptions:
                data.list[i].type == 1
                  ? data.list[i].type
                  : data.list[i].rightOptions.split("|"),
              analysis: data.list[i].analysis,
              type: data.list[i].type,
              editIcon: false //用来判断是否展示侧边栏图标
            };
            vm.ruleForm.list.unshift(tm);
          }
        },
        error: function(err) {}
      });
    },
    // 生成试卷根据题目数量自动生成题目
    setAmountlist: function() {
      let vm = this;
      // vm.checkedCities.push("1.问题一");
      let originalArray = JSON.parse(JSON.stringify(vm.cities)); //原数组
      originalArray.sort(function() {
        return 0.5 - Math.random();
      });
      for (let i = 0; i < vm.ruleForm.data.amount; i++) {
        setTimeout(() => {
          vm.$set(vm.checkedCities, i, originalArray[i]);
        }, 1000);
      }
    },
    /**
     * @description: 获取题库列表数据
     * @param {type} 题库类型
     * @return:
     */
    searchAttendHistory: function(add, type) {
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getExamList",
        type: "POST",
        data: {
          question: vm.searchAttend,
          type: vm.type.join(","),
          examType: type ? type : vm.examType.join(",")
        },
        dataType: "json",
        success: function(list) {
          let data = list.data;
          vm.citiesList = data;
          vm.cities = [];
          vm.citiesId = [];
          for (let i = 0; i < data.length; i++) {
            vm.cities.push(i + 1 + "." + data[i].question);
            vm.citiesId.push(data[i].id);
          }
          if (add) {
            setTimeout(() => {
              vm.setAmountlist();
            }, 0);
          }
        },
        error: function(err) {}
      });
    },
    // 提交或者编辑试卷
    postRuleForm: function() {
      let vm = this;
      if (vm.ruleForm.list.length != vm.ruleForm.data.amount) {
        return this.$message({
          message: "请确认题目总数",
          type: "warning"
        });
      }
      if (vm.flag) {
        return;
      }
      vm.flag = true;
      if (vm.userInfo.id) {
        vm.ruleForm.data.id = vm.userInfo.id;
      }
      let url = "/updExamPaper";
      if (vm.userInfo.state == 0 || vm.userInfo.state == 3) {
        url = "/addExamPaper";
        vm.ruleForm.data.id = "";
        vm.ruleForm.data.state = "1"; //复用和新建的试卷状态都暂时未待发布(0已启用，1未启用)
        vm.ruleForm.data.createUserId = $.parseJSON(
          fjPublic.getLocalData("userInfo")
        ).userId; //添加人
      }
      vm.ruleForm.data.type = vm.type.join(",");
      vm.ruleForm.data.examType = vm.examType.join(",");
      let idList = [];
      for (let i = 0; i < vm.ruleForm.list.length; i++) {
        idList.push(vm.ruleForm.list[i].id);
      }
      vm.ruleForm.data.examList = idList.join(",");
      $.ajax({
        url: fjPublic.ajaxUrlDNN + url,
        type: "POST",
        data: vm.ruleForm.data,
        dataType: "json",
        success: function(data) {
          vm.flag = false;
          if (data.errorCode == 0) {
            vm.$router.push({
              path: "/special-exam"
            });
          } else {
            vm.$message({
              message: data.errorMsg,
              type: "warning"
            });
          }
        },
        error: function(err) {
          vm.flag = false;
        }
      });
    },
    setCreated() {
      this.userInfo = this.$route.query;
      this.userInfo.state != 0 && (this.isCreatePaperShow = true);
      this.userInfo.state == 1
        ? (this.isDisabled = true)
        : (this.isDisabled = false);
    }
  },
  watch: {
    checkedCities: {
      handler: function(val, oldval) {
        let vm = this;
        if (val.length >= oldval.length) {
          let index = val[val.length - 1].split(".")[0] - 1;
          let data = vm.citiesList[index];
          for (let i = 0; i < vm.ruleForm.list.length; i++) {
            if (vm.ruleForm.list[i].id == data.id) {
              return this.$message({
                message: "试题已存在",
                type: "warning"
              });
            }
          }
          let tm = {
            id: data.id,
            question: data.question,
            A: data.options.split("&GXCF&")[0],
            B: data.options.split("&GXCF&")[1],
            C: data.options.split("&GXCF&")[2],
            D: data.options.split("&GXCF&")[3],
            rightOptions:
              data.type == 1 ? data.rightOptions : data.rightOptions.split("|"),
            type: data.type,
            editIcon: false //用来判断是否展示侧边栏图标
          };
          vm.ruleForm.list.unshift(tm);
        } else {
          //对比取出2个数组之间不同的元素
          function getArrDifference(arr1, arr2) {
            return arr1.concat(arr2).filter(function(v, i, arr) {
              return arr.indexOf(v) === arr.lastIndexOf(v);
            });
          }
          let tm = getArrDifference(val, oldval)[0];
          this.ruleForm.list.forEach((item, i) => {
            for (const key in item) {
              if (item[key] == vm.citiesId[tm.split(".")[0] - 1]) {
                this.ruleForm.list.splice(i, 1);
              }
            }
          });
        }
      }
    },
    //获取单选题和多选题的数量
    "ruleForm.list": {
      handler: function(val, oldval) {
        let vm = this;
        vm.headInfo.radio = 0;
        vm.headInfo.selection = 0;
        for (let i = 0; i < val.length; i++) {
          val[i].rightOptions.length > 1
            ? (vm.headInfo.selection += 1)
            : (vm.headInfo.radio += 1);
        }
      }
    }
  },
  components: {
    fjBreadNav
  }
};
</script>
<style scope lang="less">
.fj-block-head > .title {
  button {
    float: right;
    margin: 10px;
  }
  .el-input {
    width: 500px;
    margin-top: 4px;
    font-size: 16px;
    font-weight: 500;
  }
  .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    border-color: #fff;
    color: rgba(0, 0, 0, 0.85);
    cursor: auto;
  }
}
.foot-body {
  padding: 10px 0;
  .el-container {
    width: 100%;
    .el-aside {
      border: 1px solid rgba(232, 232, 232, 1);
      .head {
        height: 60px;
        line-height: 60px;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
        color: rgba(0, 0, 0, 1);
        opacity: 1;
        border-bottom: 1px solid rgba(232, 232, 232, 1);
        .el-select {
          width: 120px;
          .el-input__inner {
            text-align: center;
            font-size: 16px;
            border: none;
          }
        }
      }
      .search {
        height: 54px;
        padding: 4px 0;
        line-height: 44px;
        text-align: center;
        border-bottom: 1px solid rgba(232, 232, 232, 1);
        .search-input {
          width: 260px;
          .el-input-group__append {
            background-color: #1890ff;
            border-color: #1890ff;
            color: #fff;
          }
        }
      }
      .el-checkbox-group {
        max-height: 800px;
      }
      .el-checkbox {
        width: 100%;
        height: 50px;
        line-height: 50px;
        padding-left: 10px;
        border-bottom: 1px solid rgba(232, 232, 232, 1);
      }
      .el-checkbox + .el-checkbox {
        margin-left: 0px;
      }
    }
    .aside-left {
      margin-left: 200px;
    }
    .el-main {
      .head {
        width: 100%;
        height: 40px;
        margin-top: -20px;
        padding-left: 16px;
        line-height: 40px;
        background: rgba(230, 247, 255, 1);
        border: 1px solid rgba(186, 231, 255, 1);
        opacity: 1;
        .el-icon-info {
          color: #1890ff;
        }
        .text-blue {
          color: #1890ff;
          cursor: pointer;
        }
      }
      .body {
        .check-topic {
          position: relative;
          overflow: hidden;
          .el-checkbox-group {
            margin-top: -16px;
            width: 20px;

            .el-checkbox {
              margin-top: 24px;
              margin-left: 0;
              cursor: auto;
            }
            .is-disabled + span.el-checkbox__label {
              cursor: auto;
              color: rgba(0, 0, 0, 0.65);
            }
            .is-checked + .el-checkbox__label {
              color: rgba(0, 0, 0, 0.65);
            }
          }
          .el-checkbox__input.is-disabled .el-checkbox__inner {
            cursor: auto;
          }
          .el-radio-group {
            margin-top: -18px;
            width: 20px;

            .el-radio {
              margin-top: 26px;
              margin-left: 0;
              cursor: auto;
            }
            .is-disabled + span.el-radio__label {
              cursor: auto;
              color: rgba(0, 0, 0, 0.65);
            }
            .is-checked + .el-radio__label {
              color: rgba(0, 0, 0, 0.65);
            }
          }
          .el-radio__input.is-disabled .el-radio__inner {
            cursor: auto;
          }
          .right-revise {
            width: 60px;
            height: 100%;
            line-height: 100%;
            position: absolute;
            top: 0;
            right: 0;
            background-color: #f0f0f0;
            border-left: 1px solid rgba(0, 0, 0, 0.2);
            img {
              width: 24px;
              height: 24px;
              margin-top: 100px;
              margin-left: 17px;
              cursor: pointer;
            }
          }
          .el-radio {
            margin-right: 4px;
          }
          .el-input.is-disabled .el-input__inner {
            background-color: #fff;
            border-color: #fff;
            color: rgba(0, 0, 0, 0.85);
            cursor: auto;
          }
          .el-radio__input.is-disabled .el-radio__inner {
            cursor: auto;
          }
          .topic {
            margin: 15px 0;
            input {
              width: 650px;
            }
          }
          li {
            margin: 10px 20px;
            .el-input {
              width: 480px;
            }
          }
        }
        .back-hover {
          background: rgba(250, 250, 250, 1);
          border: 1px solid rgba(0, 0, 0, 0.2);
        }
        .back-color {
          border: 1px solid #fff;
        }
        .back-pid {
          padding-left: 10px;
          padding-right: 70px;
        }
      }
    }
  }
}
.Exam-Manage-form-area {
  padding: 10px 0;
  .el-form {
    .el-form-item {
      position: relative;
      height: 44px;
      line-height: 44px;
      margin-bottom: 0;
      border-bottom: 1px solid #e8e8e8;
      border-right: 1px solid #e8e8e8;
      .el-form-item__label,
      .el-form-item__content {
        line-height: 44px;
        .el-checkbox-group {
          margin-left: 18px;
          .el-checkbox {
            border: none;
            position: relative;
            width: 40px;
            padding-left: 0;
          }
          .is-disabled {
            .el-checkbox__label {
              color: rgba(0, 0, 0, 0.9);
            }
          }
        }
        .el-radio {
          border: none;
          position: relative;
          width: 40px;
          padding-left: 0;
        }
      }
      label {
        position: absolute;
        width: 200px;
        text-align: left;
        padding-right: 0;
        padding-left: 20px;
        border-right: 1px solid #e8e8e8;
      }
      .el-form-item__content {
        padding-left: 200px;
      }
      .el-input {
        width: 100%;
        input {
          height: 42px;
          border: none;
        }
      }
      .el-select {
        width: 100%;
        .el-input {
          padding-left: 0;

          input {
            height: 42px !important;
          }
        }
        .is-disabled {
          span {
            display: none;
          }
        }
      }
    }
    .el-row:nth-child(1) {
      border-top: 1px solid #e8e8e8;
    }
    .el-row {
      .el-col:nth-child(1) {
        border-left: 1px solid #e8e8e8;
      }
      .el-input.is-disabled .el-input__inner {
        color: rgba(0, 0, 0, 0.9);
      }
    }
    .row-img-padding {
      .el-form-item__content {
        padding-right: 150px;
      }
    }
  }

  .el-radio {
    margin-left: 18px;
  }
  p {
    margin-left: 18px;
  }
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
.el-date-picker__editor-wrap {
  .el-input {
    width: auto;
  }
}
.el-tree {
  .el-tree-node__content {
    height: 40px;
    line-height: 40px;
    .el-tree-node__label {
      font-size: 16px;
    }
  }
  .el-tree-node__children {
    .el-tree-node__content {
      height: 36px;
      line-height: 36px;
      .el-tree-node__label {
        font-size: 14px;
      }
    }
    .el-tree-node__children {
      .el-tree-node__content {
        height: 32px;
        line-height: 32px;
        .el-tree-node__label {
          font-size: 14px;
        }
      }
    }
  }
}
@media screen and (min-width: 1920px) {
  /* .fj-content_view.Exam-Manage .el-form .el-form-item__content .el-select {width:60%;} */
}
</style>

