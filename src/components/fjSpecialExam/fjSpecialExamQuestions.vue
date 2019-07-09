<template>
  <div class="fj-content_view exam-questions">
    <div class="fj-content_view_mask">
      <div class="fj-block title">
        <fj-breadNav :bread-data="breadData"></fj-breadNav>
      </div>
      <div class="fj-block content">
        <div
          @mouseover="isTitleDisabled=false"
          @mouseout="isTitleDisabled=true"
          :class="['fj-block-header',isTitleDisabled?'back-color':'back-hover']"
        >
          <el-input
            :disabled="isTitleDisabled&&userInfo.state!=0"
            ref="mark"
            placeholder="请输入题库标题"
            type="text"
            v-model="ruleForm.data.title"
          ></el-input>
        </div>
        <div class="fj-block-body">
          <div class="body-header">
            <div class="search-item">
              <span class="span-title">题库类型：</span>
              <el-select
                v-model="ruleForm.data.examType"
                :placeholder="userInfo.state!=0?'':'请选择'"
                :disabled="userInfo.state!=0"
                clearable
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.itemid"
                  :label="item.itemvalue"
                  :value="item.itemid"
                ></el-option>
              </el-select>
            </div>
            <div
              @mouseover="istextareaDisabled=false"
              @mouseout="istextareaDisabled=true"
              :class="['back-pid',istextareaDisabled?'back-color':'back-hover']"
            >
              <el-input
                :disabled="istextareaDisabled&&userInfo.state!=0"
                placeholder="请简单描述试题库内容"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                v-model="ruleForm.data.content"
              ></el-input>
            </div>
            <div class="add-type-button">
              <el-tooltip placement="top">
                <div slot="content">请选择一个选项</div>
                <el-button plain @click="addType(1)" :autofocus="userInfo.state==0">单选题</el-button>
              </el-tooltip>
              <el-tooltip placement="top">
                <div slot="content">请选择多个选项</div>
                <el-button plain @click="addType(2)">多选题</el-button>
              </el-tooltip>
              <!-- <el-tooltip placement="top">
                <div slot="content">请填写内容</div>
                <el-button plain @click="addType(3)">填空题</el-button>
              </el-tooltip>-->
            </div>
            <!-- <div class="add-list-btn" @click="addTopicS()">+ 添加考题</div> -->
          </div>
          <div class="body-body">
            <ul>
              <li class="add-topic back-hover" v-if="isAddTopic">
                <div class="topic">
                  题目:
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 1, maxRows: 3}"
                    v-model="addTopicList.question"
                  ></el-input>
                </div>
                <ul>
                  <el-checkbox-group
                    v-if="ruleForm.data.type!='1'"
                    v-model="addTopicList.rightOptions"
                    :min="1"
                  >
                    <el-checkbox label="0"></el-checkbox>
                    <el-checkbox label="1"></el-checkbox>
                    <el-checkbox label="2"></el-checkbox>
                    <el-checkbox label="3"></el-checkbox>
                  </el-checkbox-group>
                  <el-radio-group
                    v-if="ruleForm.data.type=='1'"
                    v-model="addTopicList.rightOptions"
                  >
                    <el-radio label="0"></el-radio>
                    <el-radio label="1"></el-radio>
                    <el-radio label="2"></el-radio>
                    <el-radio label="3"></el-radio>
                  </el-radio-group>
                  <li>
                    A:
                    <el-input type="text" v-model="addTopicList.A"></el-input>
                  </li>
                  <li>
                    B:
                    <el-input type="text" v-model="addTopicList.B"></el-input>
                  </li>
                  <li>
                    C:
                    <el-input type="text" v-model="addTopicList.C"></el-input>
                  </li>
                  <li>
                    D:
                    <el-input type="text" v-model="addTopicList.D"></el-input>
                    <div class="add-topic-btn">
                      <el-button @click="isAddTopic=false">取消</el-button>
                      <el-button type="primary" @click="addTopic()">确认</el-button>
                    </div>
                  </li>
                  <li>
                    题目解析:
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      placeholder="请输入解析"
                      v-model="addTopicList.analysis"
                      maxlength="200"
                    ></el-input>
                  </li>
                </ul>
              </li>
              <li
                v-for="(item, index) in ruleForm.list"
                @mouseover="item.editIcon=true,item.edt==true&&(item.edit=false)"
                @mouseleave="item.editIcon=false,item.edit=true"
                :key="index"
                :class="['check-topic',item.editIcon?'back-hover':'back-color']"
              >
                <div class="topic">
                  {{ruleForm.list.length-index}}.
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 1, maxRows: 3}"
                    :disabled="item.edit"
                    v-model="item.question"
                  ></el-input>
                </div>
                <ul>
                  <el-radio-group v-if="item.type == '1'" v-model="item.rightOptions">
                    <el-radio label="0" :disabled="(item.rightOptions.indexOf('0')==-1)&&item.edit"></el-radio>
                    <el-radio label="1" :disabled="(item.rightOptions.indexOf('1')==-1)&&item.edit"></el-radio>
                    <el-radio label="2" :disabled="(item.rightOptions.indexOf('2')==-1)&&item.edit"></el-radio>
                    <el-radio label="3" :disabled="(item.rightOptions.indexOf('3')==-1)&&item.edit"></el-radio>
                  </el-radio-group>
                  <el-checkbox-group v-else v-model="item.rightOptions" :min="1">
                    <el-checkbox
                      label="0"
                      :disabled="(item.rightOptions.indexOf('0')==-1)&&item.edit"
                    ></el-checkbox>
                    <el-checkbox
                      label="1"
                      :disabled="(item.rightOptions.indexOf('1')==-1)&&item.edit"
                    ></el-checkbox>
                    <el-checkbox
                      label="2"
                      :disabled="(item.rightOptions.indexOf('2')==-1)&&item.edit"
                    ></el-checkbox>
                    <el-checkbox
                      label="3"
                      :disabled="(item.rightOptions.indexOf('3')==-1)&&item.edit"
                    ></el-checkbox>
                  </el-checkbox-group>
                  <li>
                    A:
                    <el-input type="text" :disabled="item.edit" v-model="item.A"></el-input>
                  </li>
                  <li>
                    B:
                    <el-input type="text" :disabled="item.edit" v-model="item.B"></el-input>
                  </li>
                  <li>
                    C:
                    <el-input type="text" :disabled="item.edit" v-model="item.C"></el-input>
                  </li>
                  <li>
                    D:
                    <el-input type="text" :disabled="item.edit" v-model="item.D"></el-input>
                  </li>
                  <li>
                    题目解析:
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      :disabled="item.edit"
                      v-model="item.analysis"
                      maxlength="200"
                    ></el-input>
                  </li>
                  <div class="edt-topic-btn" v-if="!item.edit">
                    <el-button @click="postEdtTopic(index,0)">取消</el-button>
                    <el-button type="primary" @click="postEdtTopic(index,1)">修改</el-button>
                  </div>
                  <div class="right-revise" v-if="item.editIcon">
                    <img src="static/images/fj-exam-edt.png" alt="修改" @click="edtTopic(index)">
                    <img src="static/images/fj-exam-up.png" alt="上移" @click="upTopic(index)">
                    <img src="static/images/fj-exam-down.png" alt="下移" @click="downTopic(index)">
                    <img
                      src="static/images/fj-exam-del.png"
                      alt="删除"
                      @click="delTopic(index,item.id)"
                    >
                  </div>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
export default {
  name: "special-exam-questions",
  data() {
    return {
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "教培管理", path: "" },
        { name: "专题考试", path: "" }
      ],
      userInfo: {},
      typeList: [],
      examPeopleList: [],
      // isEditData: false, //是否触发更新题库
      ruleForm: {
        data: {
          id: "",
          title: "",
          type: "1",
          examPeople: "1",
          content: ""
        },
        list: []
      },
      isAddTopic: false,
      isTitleDisabled: true,
      istextareaDisabled: true,
      addTopicList: {
        question: "",
        A: "",
        B: "",
        C: "",
        D: "",
        rightOptions: [],
        edit: true, //用来判断是否可以编辑
        edt: false, //用来判断是否点击修改图标
        editIcon: false //用来判断是否展示侧边栏图标
      },
      radio: "",
      randomCityList: [], //抽查地点
      subofficeList: [], //房屋所属分局
      policeList: [], //房屋所属派出所
      rules: {}
    };
  },
  created() {},
  mounted() {
    this.setCreated();
    this.getDetailList();
    this.getDictListByType("TZLX", "typeList"); //题库类型
    this.getDictListByType("SJ_TMLX", "examPeopleList"); //题目类型
  },
  methods: {
    /**
     * @description: 获取化题库字典
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
    //新增考题
    addTopic() {
      let vm = this;
      if (vm.ruleForm.data.title == "" || vm.ruleForm.data.examType == "") {
        return this.$message({
          message: "请填写题库标题和题库类型",
          type: "warning"
        });
      }
      for (const key in vm.addTopicList) {
        if (key[0] != "e" && vm.addTopicList[key].toString() == "") {
          return this.$message({
            message: "请将考题添加完整",
            type: "warning"
          });
        }
      }
      let list = {};
      let rightOptions = vm.addTopicList.rightOptions;
      let addlist = {
        question: vm.addTopicList.question,
        options:
          vm.addTopicList.A +
          "&GXCF&" +
          vm.addTopicList.B +
          "&GXCF&" +
          vm.addTopicList.C +
          "&GXCF&" +
          vm.addTopicList.D,
        rightOptions:
          typeof rightOptions == "string"
            ? rightOptions
            : rightOptions
                .sort((a, b) => {
                  return a - b;
                })
                .join("|"),
        warehouseId: vm.ruleForm.data.id,
        type: vm.ruleForm.data.type,
        analysis: vm.addTopicList.analysis
      };
      list.question = vm.addTopicList.question;
      list.A = vm.addTopicList.A;
      list.B = vm.addTopicList.B;
      list.C = vm.addTopicList.C;
      list.D = vm.addTopicList.D;
      list.rightOptions = rightOptions;
      list.analysis = vm.addTopicList.analysis;
      list.type = vm.ruleForm.data.type;
      list.edit = vm.addTopicList.edit;
      list.editIcon = vm.addTopicList.editIcon;
      vm.ruleForm.list.unshift(list);
      if (!vm.ruleForm.data.id) {
        vm.addExam().then(res => {
          //这里可以执行下一步操作
          addlist.warehouseId = res.data.id;
          vm.addExamToWarehouse(addlist);
        });
      } else {
        vm.addExamToWarehouse(addlist);
        // if (vm.isEditData) {
        //   vm.updExam();
        //   vm.isEditData = false;
        // }
      }
    },
    //修改考题
    edtTopic(index) {
      this.ruleForm.list[index].edit = false;
      this.ruleForm.list[index].edt = true;
    },
    //提交修改考题
    postEdtTopic(index, state) {
      let vm = this;
      if (state == 1) {
        let rightOptions = vm.ruleForm.list[index].rightOptions;
        let edtlist = {
          question: vm.ruleForm.list[index].question,
          options:
            vm.ruleForm.list[index].A +
            "&GXCF&" +
            vm.ruleForm.list[index].B +
            "&GXCF&" +
            vm.ruleForm.list[index].C +
            "&GXCF&" +
            vm.ruleForm.list[index].D,
          rightOptions:
            typeof rightOptions == "string"
              ? rightOptions
              : rightOptions
                  .sort((a, b) => {
                    return a - b;
                  })
                  .join("|"),
          id: vm.ruleForm.list[index].id,
          type: vm.ruleForm.list[index].type,
          analysis: vm.ruleForm.list[index].analysis
        };
        edtlist["nowUser"] = $.cookie(fjPublic.loginCookieKey);
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/updExamInfo",
          type: "POST",
          data: edtlist,
          dataType: "json",
          success: function(data) {},
          error: function(err) {}
        });
      }
      vm.ruleForm.list[index].edit = true;
      vm.ruleForm.list[index].edt = false;
    },
    //上移考题
    upTopic(index) {
      let arr = this.ruleForm.list;
      if (arr.length > 1 && index !== 0) {
        let arr1 = arr[index];
        let arr2 = arr[index - 1];
        this.ruleForm.list.splice(index, 1, arr2);
        this.ruleForm.list.splice(index - 1, 1, arr1);
      }
    },
    //下移考题
    downTopic(index) {
      let arr = this.ruleForm.list;
      if (arr.length > 1 && index !== arr.length - 1) {
        let arr1 = arr[index];
        let arr2 = arr[index + 1];
        this.ruleForm.list.splice(index, 1, arr2);
        this.ruleForm.list.splice(index + 1, 1, arr1);
      }
    },
    //删除考题
    delTopic(index, id) {
      this.ruleForm.list.splice(index, 1);
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/removeExamFromWarehouse",
        type: "POST",
        data: {
          nowUser: $.cookie(fjPublic.loginCookieKey),
          id: id
        },
        dataType: "json",
        success: function(data) {
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    //根据类型添加试题
    addType(type) {
      this.ruleForm.data.type = type;
      this.addTopicS();
    },
    //重置新增试题
    addTopicS() {
      this.isAddTopic = true;
      for (let x in this.addTopicList) {
        this.addTopicList[x] = "";
      }
      this.addTopicList.rightOptions = [];
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
        url: fjPublic.ajaxUrlDNN + "/getExamWarehouseInfo",
        type: "POST",
        data: {
          id: this.userInfo.id
        },
        dataType: "json",
        success: function(list) {
          let data = list.data;
          vm.ruleForm.data = data.info;
          for (let i = 0; i < data.list.length; i++) {
            let tm = {
              id: data.list[i].id,
              question: data.list[i].question,
              A: data.list[i].options.split("&GXCF&")[0],
              B: data.list[i].options.split("&GXCF&")[1],
              C: data.list[i].options.split("&GXCF&")[2],
              D: data.list[i].options.split("&GXCF&")[3],
              rightOptions:
                data.list[i].rightOptions.indexOf("|") == -1
                  ? data.list[i].rightOptions
                  : data.list[i].rightOptions.split("|"),
              analysis: data.list[i].analysis,
              type: data.list[i].type,
              edit: true, //用来判断是否可以编辑
              edt: false, //用来判断是否点击修改图标
              editIcon: false //用来判断是否展示侧边栏图标
            };
            vm.ruleForm.list.push(tm);
          }
        },
        error: function(err) {}
      });
    },
    // 新增题库
    addExam: function() {
      var defer = $.Deferred();
      var vm = this;
      return new Promise((resolve, reject) => {
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/addExamWarehouse",
          type: "POST",
          data: {
            nowUser: $.cookie(fjPublic.loginCookieKey),
            title: vm.ruleForm.data.title,
            type: vm.ruleForm.data.type,
            examType: vm.ruleForm.data.examType,
            content: vm.ruleForm.data.content,
            createUserid: $.parseJSON(fjPublic.getLocalData("userInfo")).userId,
            createUsername: $.parseJSON(fjPublic.getLocalData("userInfo"))
              .userName,
            // state:状态，0启用，1停用，-1删除，默认1
            state: "",
            examPeople: vm.ruleForm.data.examPeople
          },
          dataType: "json",
          success: function(data) {
            vm.ruleForm.data.id = data.data.id;
            resolve(data);
          },
          error: function(err) {}
        });
      });
    },
    // 更新题库
    updExam: function() {
      let defer = $.Deferred();
      let vm = this;
      // let arrList = [];
      // for (let i = 0; i < vm.ruleForm.list.length; i++) {
      //   vm.ruleForm.list[i].id && arrList.push(vm.ruleForm.list[i].id);
      // }
      // arrList = arrList.join(",");
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/updExamWarehouse",
        type: "POST",
        data: {
          nowUser: $.cookie(fjPublic.loginCookieKey),
          id: vm.ruleForm.data.id,
          title: vm.ruleForm.data.title,
          type: vm.ruleForm.data.type,
          examType: vm.ruleForm.data.examType,
          content: vm.ruleForm.data.content,
          examPeople: vm.ruleForm.data.examPeople
          // examList: arrList
        },
        dataType: "json",
        success: function(data) {
          // console.log(data);
        },
        error: function(err) {}
      });
    },
    // 添加试题到题库
    addExamToWarehouse: function(list) {
      var defer = $.Deferred();
      var vm = this;
      list["nowUser"] = $.cookie(fjPublic.loginCookieKey);
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/addExamToWarehouse",
        type: "POST",
        data: list,
        dataType: "json",
        success: function(data) {
          vm.ruleForm.list[0].id = data.data.id;
        },
        error: function(err) {}
      });
      vm.addTopicS();
      vm.isAddTopic = false;
    },
    setCreated() {
      this.userInfo = this.$route.query;
      if (this.userInfo.state == 0) {
        this.isTitleDisabled = false;
        this.isAddTopic = true;
        setTimeout(() => {
          this.$refs.mark.$el.querySelector("input").focus();
        }, 500);
      }
    }
  },
  beforeRouteLeave: function(to, from, next) {
    this.updExam(); //离开页面保存修改
    next();
  },
  watch: {
    // $route: {
    //   handler(route) {
    //     // this.setCreated();
    //     // this.getDetailList();
    //   }
    // }
    // "ruleForm.data": {
    //   //监控题库是否修改，修改触发更新接口，在点击提交试题的时候
    //   handler(val) {
    //     this.isEditData = true;
    //   },
    //   deep: true
    // }
  },
  components: {
    fjBreadNav
  }
};
</script>
<style scope lang="less">
.exam-questions {
  .fj-block.content {
    padding: 0;
  }
  .fj-block-header {
    padding: 10px 180px;
    .el-input {
      width: 100%;
    }
    input {
      height: 50px;
      background: rgba(255, 255, 255, 1);
      // border: 1px solid rgba(0, 0, 0, 0.15);
      opacity: 1;
      text-align: center;
      font-size: 16px;
      font-weight: 500;
      color: rgba(0, 0, 0, 1);
      opacity: 1;
    }
    // input::-webkit-input-placeholder {
    //   color: rgba(0, 0, 0, 1);
    // }
    // input:-moz-placeholder {
    //   color: rgba(0, 0, 0, 1);
    // }
    // input:-ms-input-placeholder {
    //   color: rgba(0, 0, 0, 1);
    // }

    .is-disabled {
      .el-input__inner {
        background-color: #fff;
        border: none;
        cursor: pointer;
        color: rgba(0, 0, 0, 1);
      }
      .el-textarea__inner {
        background-color: #fff;
        border: none;
        cursor: pointer;
        color: rgba(0, 0, 0, 1);
      }
    }
  }
  .fj-block-body {
    margin-top: 10px;
    .body-header {
      text-align: center;
      .is-disabled {
        .el-textarea__inner {
          background-color: #fff;
          border: none;
          cursor: pointer;
          color: rgba(0, 0, 0, 1);
        }
      }
      .search-item {
        text-align: left;
        .is-disabled {
          .el-input__inner {
            background-color: #fff;
            border: none;
            cursor: auto;
            color: rgba(0, 0, 0, 0.65);
          }
          .el-input__suffix {
            display: none;
          }
        }
      }
      .search-item:first-child {
        margin-left: 180px;
      }
      .el-textarea {
        margin: 10px 0;
      }
      .add-list-btn {
        margin-top: 26px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        color: #1890ff;
        border: 1px dashed #3aa0ff;
        cursor: pointer;
      }
    }
    .body-body {
      ul {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
        .el-radio__label {
          display: none;
        }
        .add-topic {
          padding: 10px 180px;
          .el-checkbox-group {
            position: absolute;
            margin-left: 500px;
            margin-top: -14px;
            width: 20px;
            .el-checkbox {
              margin-top: 24px;
              margin-left: 0;
            }
            .el-checkbox__label {
              display: none;
            }
          }
          .el-radio-group {
            position: absolute;
            margin-left: 500px;
            margin-top: -14px;
            width: 20px;
            .el-radio {
              margin-top: 25px;
              margin-left: 0;
            }
            .el-checkbox__label {
              display: none;
            }
          }
          .topic {
            margin: 15px 0;
            .el-textarea {
              display: inline-block;
              width: 650px;
              vertical-align: middle;
              textarea {
                min-height: 32px !important;
                // height: 32px !important;
                padding: 4px 15px;
              }
            }
          }
          li {
            margin: 10px 20px 0;
            .el-input {
              width: 450px;
            }
            .add-topic-btn {
              display: inline-block;
              margin-left: 34px;
            }
          }
        }
        .check-topic {
          position: relative;
          padding: 0 180px;
          .el-checkbox-group {
            position: absolute;
            margin-top: -8px;
            width: 20px;
            .el-checkbox {
              margin-top: 16px;
              margin-left: 0;
            }
            .el-checkbox__label {
              display: none;
            }
          }
          .el-radio-group {
            position: absolute;
            margin-top: -10px;
            width: 20px;
            .el-radio {
              margin-top: 18px;
              margin-left: 0;
            }
            .el-radio__label {
              display: none;
            }
          }
          .is-disabled {
            .el-textarea__inner {
              background-color: #fff;
              border: none;
              cursor: auto;
              color: rgba(0, 0, 0, 1);
            }
          }
          .right-revise {
            width: 60px;
            height: 100%;
            position: absolute;
            top: 0;
            right: 0;
            background-color: #f0f0f0;
            border-left: 1px solid rgba(0, 0, 0, 0.2);
            img {
              width: 24px;
              height: 24px;
              margin-top: 30px;
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
          .el-checkbox__input.is-disabled .el-checkbox__inner {
            cursor: auto;
          }
          .el-radio__input.is-disabled .el-radio__inner {
            cursor: auto;
          }
          .topic {
            margin: 15px 0;
            .el-textarea {
              display: inline-block;
              width: 95%;
              vertical-align: middle;
              textarea {
                min-height: 32px !important;
                padding: 5px 15px;
              }
            }
          }
          li {
            margin: 2px 20px;
            .el-input {
              width: 480px;
            }
          }
          .edt-topic-btn {
            position: absolute;
            top: 172px;
            right: 80px;
          }
        }
      }
    }
  }
  ::-webkit-scrollbar-track-piece {
    //滚动条凹槽的颜色，还可以设置边框属性
    background-color: #f8f8f8;
  }

  ::-webkit-scrollbar {
    //滚动条的宽度
    width: 6px;
    height: 9px;
  }
  ::-webkit-scrollbar-thumb {
    //滚动条的设置
    background-color: #dddddd;
    background-clip: padding-box;
    min-height: 28px;
    border-radius: 6px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #bbb;
  }
}
.add-type-button {
  padding: 10px 180px;
  text-align: left;
}
.el-textarea__inner {
  padding: 2px 15px;
}
.back-hover {
  background: rgba(250, 250, 250, 1);
  border: 1px solid rgba(0, 0, 0, 0.2);
}
.back-color {
  border: 1px solid #fff;
}
.back-pid {
  padding: 0 180px;
}
@media screen and (min-width: 1920px) {
  /* .fj-content_view.YBSS .el-form .el-form-item__content .el-select {width:60%;} */
}
</style>