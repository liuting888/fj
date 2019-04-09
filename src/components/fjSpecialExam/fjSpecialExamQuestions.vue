<template>
  <div class="fj-content_view exam-questions">
    <div class="fj-content_view_mask">
      <div class="fj-block title">
        <fj-breadNav :bread-data="breadData"></fj-breadNav>
      </div>
      <div class="fj-block content">
        <div
          class="fj-block-head"
          @mouseover="isTitleDisabled=false"
          @mouseout="isTitleDisabled=true"
        >
          <el-input :disabled="isTitleDisabled" type="text" v-model="ruleForm.title">{{e}}</el-input>
        </div>
        <div class="fj-block-body">
          <div class="body-header">
            <div class="search-item">
              <span class="span-title">题库类型：</span>
              <el-select v-model="ruleForm.selectedRole" clearable>
                <el-option :value="1" label="单选题"></el-option>
                <el-option :value="0" label="单选题"></el-option>
              </el-select>
            </div>
            <div class="search-item hidden-lg-and-down">
              <span class="span-title">适用岗位：</span>
              <el-select v-model="ruleForm.selectedRole">
                <el-option :value="1" label="辅警"></el-option>
                <el-option :value="0" label="民警"></el-option>
              </el-select>
            </div>
            <div @mouseover="istextareaDisabled=false" @mouseout="istextareaDisabled=true">
              <el-input
                :disabled="istextareaDisabled"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                v-model="ruleForm.textarea"
              ></el-input>
            </div>
            <div class="add-list-btn" @click="addTopicS()">+ 添加考题</div>
          </div>
          <div class="body-body">
            <ul>
              <li class="add-topic" v-if="isAddTopic">
                <div class="topic">
                  题目:
                  <el-input type="text" v-model="addTopicList.title"></el-input>
                </div>
                <ul>
                  <li>
                    A:
                    <el-input type="text" v-model="addTopicList.A"></el-input>
                    <el-radio v-model="addTopicList.daan" label="1"></el-radio>
                  </li>
                  <li>
                    B:
                    <el-input type="text" v-model="addTopicList.B"></el-input>
                    <el-radio v-model="addTopicList.daan" label="2"></el-radio>
                  </li>
                  <li>
                    C:
                    <el-input type="text" v-model="addTopicList.C"></el-input>
                    <el-radio v-model="addTopicList.daan" label="3"></el-radio>
                  </li>
                  <li>
                    D:
                    <el-input type="text" v-model="addTopicList.D"></el-input>
                    <el-radio v-model="addTopicList.daan" label="4"></el-radio>
                    <div class="add-topic-btn">
                      <el-button @click="isAddTopic=false">取消</el-button>
                      <el-button type="primary" @click="addTopic()">确认</el-button>
                    </div>
                  </li>
                </ul>
              </li>
              <li
                class="check-topic"
                v-for="(item, index) in ruleForm.content"
                @mouseover="item.editIcon=true,item.edt==true&&(item.edit=false)"
                @mouseout="item.editIcon=false,item.edit=true"
              >
                <div class="topic">
                  {{index+1}}.
                  <el-input type="text" :disabled="item.edit" v-model="item.title"></el-input>
                </div>
                <ul>
                  <li>
                    <el-radio :disabled="item.edit&&!(item.daan==1)" v-model="item.daan" label="1"></el-radio>A:
                    <el-input :disabled="item.edit" type="text" v-model="item.A"></el-input>
                  </li>
                  <li>
                    <el-radio v-model="item.daan" :disabled="item.edit&&!(item.daan==2)" label="2"></el-radio>B:
                    <el-input type="text" :disabled="item.edit" v-model="item.B"></el-input>
                  </li>
                  <li>
                    <el-radio v-model="item.daan" :disabled="item.edit&&!(item.daan==3)" label="3"></el-radio>C:
                    <el-input type="text" :disabled="item.edit" v-model="item.C"></el-input>
                  </li>
                  <li>
                    <el-radio v-model="item.daan" :disabled="item.edit&&!(item.daan==4)" label="4"></el-radio>D:
                    <el-input type="text" :disabled="item.edit" v-model="item.D"></el-input>
                  </li>
                  <div class="right-revise" v-if="item.editIcon">
                    <img src="static/images/fj-exam-edt.png" alt="修改" @click="edtTopic(index)">
                    <img src="static/images/fj-exam-up.png" alt="上移" @click="upTopic(index)">
                    <img src="static/images/fj-exam-down.png" alt="下移" @click="downTopic(index)">
                    <img src="static/images/fj-exam-del.png" alt="删除" @click="delTopic(index)">
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
      ruleForm: {
        title: "这里是题库的标题",
        selectedRole: 1,
        textarea: "请简单描述试题库内容",
        content: [
          {
            title: "题目1",
            A: "hahaA",
            B: "hahaB",
            C: "hahaC",
            D: "hahaD",
            daan: "1",
            edit: true, //用来判断是否可以编辑
            edt: false, //用来判断是否点击修改图标
            editIcon: false //用来判断是否展示侧边栏图标
          },
          {
            title: "题目2",
            A: "hahaA2",
            B: "hahaB2",
            C: "hahaC2",
            D: "hahaD2",
            daan: "2",
            edit: true, //用来判断是否可以编辑
            edt: false, //用来判断是否点击修改图标
            editIcon: false //用来判断是否展示侧边栏图标
          }
        ]
      },
      isAddTopic: false,
      isTitleDisabled: true,
      istextareaDisabled: true,
      addTopicList: {
        title: "题目",
        A: "hahaA",
        B: "hahaB",
        C: "hahaC",
        D: "hahaD",
        daan: "1",
        edit: true, //用来判断是否可以编辑
        edt: false, //用来判断是否点击修改图标
        editIcon: false //用来判断是否展示侧边栏图标
      },
      radio: "",
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
  created() {},
  mounted() {
    // this.getTeamList();
    // this.getDownDepts();
    this.setCreated();
    this.getDetailList();
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
    //新增考题
    addTopic() {
      let list = {};
      list.title = this.addTopicList.title;
      list.A = this.addTopicList.A;
      list.B = this.addTopicList.B;
      list.C = this.addTopicList.C;
      list.D = this.addTopicList.D;
      list.daan = this.addTopicList.daan;
      list.edit = this.addTopicList.edit;
      list.editIcon = this.addTopicList.editIcon;
      this.ruleForm.content.unshift(list);
    },
    //修改考题
    edtTopic(index) {
      this.ruleForm.content[index].edit = false;
      this.ruleForm.content[index].edt = true;
    },
    //上移考题
    upTopic(index) {
      let arr = this.ruleForm.content;
      if (arr.length > 1 && index !== 0) {
        let arr1 = arr[index];
        let arr2 = arr[index - 1];
        this.ruleForm.content.splice(index, 1, arr2);
        this.ruleForm.content.splice(index - 1, 1, arr1);
      }
    },
    //下移考题
    downTopic(index) {
      let arr = this.ruleForm.content;
      if (arr.length > 1 && index !== arr.length - 1) {
        let arr1 = arr[index];
        let arr2 = arr[index + 1];
        this.ruleForm.content.splice(index, 1, arr2);
        this.ruleForm.content.splice(index + 1, 1, arr1);
      }
    },
    //删除考题
    delTopic(index) {
      this.ruleForm.content.splice(index, 1);
    },
    //重置新增试题
    addTopicS() {
      this.isAddTopic = true;
      for (let x in this.addTopicList) {
        this.addTopicList[x] = "";
      }
    },
    // 获取编辑信息
    getDetailList: function() {
      console.log(this.userInfo.id);
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getExamWarehouseInfo",
        type: "POST",
        data: {
          id:this.userInfo.id
        },
        dataType: "json",
        success: function(data) {
          console.log(data)
          console.log(222)
          // vm.tableDataList = null;
          // vm.tableDataList = data.list;
          // vm.total = data.total;
          // _.each(vm.attendAppealData, function(item, i) {
          //   vm.$set(item, "rank", i + 1);
          // });
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
      // this.ruleForm = {
      //   title: "这里是题库的标题",
      //   selectedRole: 1,
      //   textarea: "请简单描述试题库内容",
      //   content: []
      // };
      // this.userInfo.state != 0 &&
      //   (this.ruleForm = $.parseJSON(fjPublic.getLocalData("ybssItem")));
      // this.$refs["ruleForm"].resetFields();
    },
    routerGo() {
      window.history.go(-1);
    }
  },
  watch: {
    $route: {
      handler(route) {
        // this.setCreated();
      }
    }
  },
  components: {
    fjBreadNav
  }
};
</script>
<style scope lang="less">
.exam-questions {
  .fj-block.content {
    padding: 10px 180px;
  }
  .fj-block-head {
    border-bottom: 0px;
    input {
      width: 800px;
      height: 50px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(0, 0, 0, 0.14901960784313725);
      opacity: 1;
      text-align: center;
      font-size: 16px;
      font-weight: 500;
      color: rgba(0, 0, 0, 1);
      opacity: 1;
    }
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
        display: inline-block;
      }
      .search-item:first-child {
        margin-right: 100px;
      }
      .el-textarea {
        margin-top: 20px;
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
          .topic {
            margin: 15px 0;
            input {
              width: 680px;
            }
          }
          li {
            margin: 15px 20px 0;
            .el-input {
              width: 480px;
            }
            .add-topic-btn {
              display: inline-block;
              margin-left: 50px;
            }
          }
        }
        .check-topic {
          position: relative;
          .right-revise {
            width: 60px;
            height: 100%;
            position: absolute;
            top: 0;
            right: 0;
            background-color: #f0f0f0;
            border: 1px solid rgba(0, 0, 0, 0.2);
            img {
              width: 24px;
              height: 24px;
              margin-top: 20px;
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
              width: 680px;
            }
          }
          li {
            margin: 10px 0;
            .el-input {
              width: 480px;
            }
          }
        }
        // .revise-topic {
        //   .topic {
        //     margin: 15px 0;
        //     input {
        //       width: 680px;
        //     }
        //   }
        //   li {
        //     margin: 15px 20px 0;
        //     .el-input {
        //       width: 480px;
        //     }
        //   }
        // }
      }
    }
  }
}
@media screen and (min-width: 1920px) {
  /* .fj-content_view.YBSS .el-form .el-form-item__content .el-select {width:60%;} */
}
</style>

