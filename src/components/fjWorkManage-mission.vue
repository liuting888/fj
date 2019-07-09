<template>
  <div class="fj-content_view work-mis mission">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head kaohe">
        <el-tabs
          v-model="searchForm.tabState"
          @tab-click="changeMissState"
        >
          <el-tab-pane
            :label="'待处理' + '(' + tabData.dealNum + ')'"
            name="0"
          >待处理111</el-tab-pane>
          <el-tab-pane
            :label="'进行中' + '(' + tabData.conductNum + ')'"
            name="1"
          >进行中</el-tab-pane>
          <el-tab-pane
            :label="'待审核' + '('  + tabData.checkNum + ')'"
            name="2"
          >待审核</el-tab-pane>
          <el-tab-pane
            :label="'已完成' + '(' + tabData.checkedNum + ')'"
            name="3"
          >已完成</el-tab-pane>
          <el-tab-pane
            label="全部"
            name="4"
          >全部</el-tab-pane>
        </el-tabs>
      </div>
      <div class="fj-block-body">
        <ul class="filterOpe-area fj-clear">
          <li class="area-line fj-fl">
            <div class="item fj-fl">
              <span class="title fj-fl">任务类型：</span>
              <el-select
                @change="changeMissionType"
                clearable
                v-model="searchForm.missionType"
                size="small"
              >
                <el-option
                  v-for="item in missionTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="item fj-fl">
              <span class="title fj-fl">起止日期：</span>
              <el-date-picker
                v-model="searchForm.searchTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeSearchTime"
                size="small"
              ></el-date-picker>
            </div>
          </li>
          <li class="area-line fj-fl">
            <div class="item fj-fl">
              <el-input
                v-model="searchForm.titleOrName"
                clearable
                placeholder="请输入标题"
                size="small"
                class="search-input"
              >
                <el-button
                  slot="append"
                  @click="searchMission"
                >搜索</el-button>
              </el-input>
            </div>
            <div class="item fj-fl">
              <el-button
                type="primary"
                @click="openAddOrDetailDialog()"
                size="small"
              >
                <i class="el-icon-plus"></i>
                <span>派发任务</span>
              </el-button>
            </div>
          </li>
        </ul>
        <!-- <div class="fj-search-inline">
          <el-row>
            <el-form inline>
              <el-col
                :xs="8"
                :sm="12"
                :md="16"
                :lg="24"
                :xl="18"
              >

                <el-form-item label="任务类型：">
                  <el-select
                    @change="changeMissionType"
                    clearable
                    v-model="searchForm.missionType"
                    size="small"
                  >
                    <el-option
                      v-for="item in missionTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="起止日期："
                  class="datepicker"
                >
                  <el-date-picker
                    v-model="searchForm.searchTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="changeSearchTime"
                    size="small"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-input
                    v-model="searchForm.titleOrName"
                    clearable
                    placeholder="请输入标题"
                    size="small"
                    class="search-input"
                  >
                    <el-button
                      slot="append"
                      @click="searchMission"
                    >搜索</el-button>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="openAddOrDetailDialog()"
                    size="small"
                  >
                    <i class="el-icon-plus"></i>
                    <span>派发任务</span>
                  </el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </div> -->
        <el-table :data="misData">
          <el-table-column
            prop="title"
            label="任务标题"
            show-overflow-tooltip
            class-name="textLeft"
            width="300px"
          ></el-table-column>
          <el-table-column label="任务类型">
            <template slot-scope="scope">
              <p>{{scope.row.missionType | getMissionType}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="userName"
            label="负责人"
          ></el-table-column>
          <!-- <el-table-column prop="acceptUserName" label="执行人" show-overflow-tooltip></el-table-column> -->
          <el-table-column
            prop="createTime"
            label="创建时间"
            show-overflow-tooltip
            :formatter="timeFormatter"
          ></el-table-column>
          <el-table-column
            prop="planStartTime"
            label="计划时间"
            show-overflow-tooltip
            :formatter="timeFormatter"
          ></el-table-column>

          <el-table-column
            prop="startTime"
            label="执行时间"
            show-overflow-tooltip
            :formatter="timeFormatter"
          ></el-table-column>
          <el-table-column
            label="任务状态"
            class-name="textLeft"
          >
            <template slot-scope="scope">
              <div
                class="circle-status"
                :class="
                parseInt( scope.row.status) === 0 ? 'grey' : parseInt( scope.row.status) === 1 ?'blue'
                  : parseInt( scope.row.status) === 2 ?'orange':'green'
              "
              >
                <p v-html="parseInt( scope.row.status) === 0 ? '待处理' : parseInt( scope.row.status) === 1 ?'进行中'
                  : parseInt( scope.row.status) === 2 ?('待审核（'+scope.row.terminationName+'）'):'已完成'"></p>

              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span
                class="ope-txt"
                @click="openAddOrDetailDialog(scope.row)"
              >详情</span>
              <span
                class="ope-txt"
                v-if="(scope.row.publishUserid==userInfo.userId)&&(scope.row.status==0||scope.row.status==1)"
                @click="isDeleteMission(scope.row)"
              >删除</span>
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
    <!-- 添加、详情弹出框，这里的样式在reset.css改 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      style="position: absolute"
      @close="closeDialog"
      width="1080px"
      top="8vh"
      class="mission-dialogs"
    >
      <el-form
        :model="dialogForm"
        :rules="rules"
        ref="dialogForm"
      >
        <el-row>
          <el-col>
            <el-form-item
              label="任务类型"
              :label-width="formLabelWidth"
              prop="missionType"
            >
              <template>
                <el-radio
                  v-model="dialogForm.missionType"
                  :disabled="chooseButtonDisabled"
                  label="0"
                >普通任务</el-radio>
                <el-radio
                  v-model="dialogForm.missionType"
                  :disabled="chooseButtonDisabled"
                  label="1"
                >紧急任务</el-radio>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="任务标题"
              :label-width="formLabelWidth"
              prop="missionTitle"
            >
              <el-input
                autocomplete="off"
                placeholder="请输入任务标题"
                :disabled="chooseButtonDisabled"
                v-model="dialogForm.missionTitle"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" 
              >
            <el-form-item
              label="任务负责人"
              :label-width="formLabelWidth"
              prop="leadPerson_id"
            >

              <!--<el-button
                type="primary"
                @click="openChooseDialog"
                :disabled="chooseButtonDisabled"

                v-if=" dialogForm.missionState == 0 || dialogForm.missionState == 1 "
                v-if=" dialogForm.missionState == 2 || dialogForm.missionState == 3"
                :disable-branch-nodes="true"
              >选择</el-button>-->
              <treeselect
                v-if="loadTreeSelect"
                placeholder="请选择任务负责人"
                :disabled="chooseButtonDisabled"
                :multiple="isMultiple"
                no-children-text="暂无"
                loading-text="加载中..."
                v-model="selectedMisUserIds"
                :options="fromData"
                size="small"
                @input="filterDeptIds"
                @select="selectLeadPerson"
                :load-options="loadOptions"
                value-consists-of="LEAF_PRIORITY"
                :disable-branch-nodes="true"
              >
                <div
                  slot="value-label"
                  slot-scope="{ node,labelClassName }"
                  :class="labelClassName"
                >{{ node.raw.label || '请选择' }}</div>
              </treeselect>
              <el-input
                v-else
                autocomplete="off"
                placeholder="请选择任务负责人"
                :readonly="true"
                :disabled="chooseButtonDisabled"
                v-model="dialogForm.leadPerson_name"
                @click.native="reSelectMisUserSingle"
              >
                ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
        </el-row>
        <!-- <el-row>
          <el-col>
            <el-form-item label="任务执行人" :label-width="formLabelWidth" prop="createPerson_name">


              <el-tooltip class="item" effect="dark" :content="dialogForm.createPerson_name" placement="right-start"
              v-if=" dialogForm.missionState == 1 || dialogForm.missionState == 2 || dialogForm.missionState == 3">
                <el-input

                  autocomplete="off"
                  placeholder="请选择任务执行人"
                  :disabled="chooseButtonDisabled"
                  v-model="dialogForm.createPerson_name"
                ></el-input>
              </el-tooltip>
              <treeselect
                placeholder="请选择任务执行人"
                :defaultOptions="defaultOptions"
                v-model="dialogForm.createPerson_name"
                value-consists-of="LEAF_PRIORITY"
                :multiple="true"
                :options="fromData1"
                sortValueBy="ORDER_SELECTED"
                size="small"
                v-if="dialogForm.missionState == 0 || !dialogForm.missionState"
                >
                <div slot="value-label" slot-scope="{ node,labelClassName }"  :class="labelClassName">{{ node.raw.label  || '无数据' }}</div>
              </treeselect>


            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="计划开始时间"
              :label-width="formLabelWidth"
              prop="planStart"
            >
              <el-date-picker
                v-model="dialogForm.planStart"
                type="date"
                :disabled="chooseButtonDisabled"
                :picker-options="{
                  disabledDate(time) {
                      return time.getTime() < Date.now() - 8.64e7;//如果没有后面的-8.64e7就是不可以选择今天的
                  }
                }"
                placeholder="选择开始日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="计划完成时间"
              :label-width="formLabelWidth"
              prop="planEnd"
            >
              <el-date-picker
                v-model="dialogForm.planEnd"
                :disabled="chooseButtonDisabled"
                :picker-options="{
                  disabledDate(time) {
                      return time.getTime() < Date.now() - 8.64e7;//如果没有后面的-8.64e7就是不可以选择今天的
                  }
                }"
                type="date"
                placeholder="选择完成日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              :hidden="auditInputHidden"
              label="执行开始时间"
              :label-width="formLabelWidth"
              prop="startTime"
            >
              <el-date-picker
                v-model="dialogForm.startTime"
                type="date"
                :disabled="chooseButtonDisabled"
                placeholder="选择开始日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :hidden="auditInputHidden"
              label="执行完成时间"
              :label-width="formLabelWidth"
              prop="finishTime"
            >
              <el-date-picker
                v-model="dialogForm.finishTime"
                :disabled="chooseButtonDisabled"
                type="date"
                placeholder="选择完成日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="任务描述"
              :label-width="formLabelWidth"
              prop="description"
            >
              <el-input
                type="textarea"
                :rows="3"
                :disabled="chooseButtonDisabled"
                placeholder="请输入任务描述"
                v-model="dialogForm.description"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :hidden="auditInputHidden"
              label="执行情况"
              :label-width="formLabelWidth"
              prop="execResult"
            >
              <el-input
                type="textarea"
                :rows="3"
                :disabled="chooseButtonDisabled"
                placeholder
                v-model="dialogForm.execResult"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 展示上传 -->
        <el-row v-show="dialogForm.pictureList.length>0">
          <el-col>
            <el-form-item
              label="图片："
              :label-width="formLabelWidth"
            >
              <ul
                class="fj-mis-imgWrap"
                id="fj-mis-imgWrap"
              >
                <li
                  class="item"
                  v-for="(item1, index) in dialogForm.pictureList"
                  :key="index"
                >
                  <img
                    alt="图片"
                    :data-original="ajaxUrlDNN + '/appgetmedia?fn=' + item1.fileName"
                    :src="ajaxUrlDNN + '/appgetmedia?fn=' + item1.fileName"
                  >
                  <i class="el-icon-error" v-show="isLeadPerson" @click="deleteLPuploadFile(item1)"></i>
                </li>
              </ul>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="1"></el-col> -->
        </el-row>
        <el-row v-if="dialogForm.videoList.length>0">
          <el-col>
            <el-form-item
              label="视频："
              :label-width="formLabelWidth"
            >
              <ul class="fj-mis-videoWrap">
                <li
                  class="item"
                  v-for="(item2, index) in dialogForm.videoList"
                  :key="index"
                >
                  <video
                    :src="ajaxUrlDNN + '/appgetmedia?fn=' + item2.fileName"
                    :poster="ajaxUrlDNN + '/appgetmedia?fn=' + item2.frameName"
                    controls
                  />
                  <i class="el-icon-error" v-show="isLeadPerson" @click="deleteLPuploadFile(item2)"></i>
                </li>
              </ul>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="1"></el-col> -->
        </el-row>
        <!-- 展示上传 -->
        <el-row>
        </el-row>
        <el-row>
          <el-col :span="21">
            <el-form-item
              :hidden="auditInputHidden"
              label="审核意见"
              :label-width="formLabelWidth"
              prop="auditor_opinion"
            >
              <el-input
                type="textarea"
                :rows="3"
                :disabled="auditInputDisabled"
                placeholder
                v-model="dialogForm.auditor_opinion"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 负责人上传图片视频以及完成描述 -->
        <el-row v-if="isLeadPerson">
          <el-col>
            <el-form-item
              label="上传图片"
              :label-width="formLabelWidth"
              class="fj-mis-upload0508"
            >
              <!-- 
                multiple
               -->
              <el-upload
                :action="LPuploadUrl"
                :before-upload="LPuploadImgBefore"
                :on-change="LPuploadImgAjax"
                >
                <el-button size="small" type="primary">点击上传图片</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item
              label="上传视频"
              :label-width="formLabelWidth"
              class="fj-mis-upload0508"
            >
              <el-upload
                :action="LPuploadUrl"
                :before-upload="LPuploadVideoBefore"
                :on-change="LPuploadVideoAjax">
                <el-button size="small" type="primary">点击上传视频</el-button>
                <div slot="tip" class="el-upload__tip">只能上传mp4文件</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item
              label="完成情况"
              :label-width="formLabelWidth"
            >
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请填写"
                v-model="dialogForm.execResult"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
        v-show="hiddenButton"
      >
        <el-button @click="dialogVisible = false;clearViewer()">取 消</el-button>
        <el-button
          type="primary"
          @click="saveMission('dialogForm')"
          :value="submitButtonValue"
          v-show="submitButtonValue!=''"
        >{{ submitButtonValue }}</el-button>
        <el-button
          type="primary"
          @click="performMission('dialogForm')"
          v-show="performButtonValue!=''"
          :value="performButtonValue"
        >{{ performButtonValue }}</el-button>
        <el-button
          type="primary"
          @click="completeMission('dialogForm')"
          v-show="completeButtonValue!=''"
          :value="completeButtonValue"
        >{{ completeButtonValue }}</el-button>
        <el-button
          type="primary"
          @click="throughMission('dialogForm')"
          v-show="throughButtonValue!=''"
          :value="throughButtonValue"
        >{{ throughButtonValue }}</el-button>
        <el-button
          type="primary"
          @click="returnMission('dialogForm')"
          v-show="returnButtonValue!=''"
          :value="returnButtonValue"
        >{{ returnButtonValue }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import "element-ui/lib/theme-chalk/display.css";
import fjBreadNav from "@/components/fjBreadNav";
import Treeselect from "@riophae/vue-treeselect";
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect';
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "fjWorkManageMis",
  data: function() {
    const timeValidate = (rule, value, callback) => {
      if (!this.dialogForm.planStart) {
        this.dialogForm.planEnd = "";
        callback(new Error("请先选择计划开始时间"));
      } else {
        let timeStart = new Date(this.dialogForm.planStart);
        let yearStart = timeStart.getFullYear();
        let monthStart = timeStart.getMonth() + 1;
        let dayStart = timeStart.getDate();
        let timeEnd = new Date(value);
        let yearEnd = timeEnd.getFullYear();
        let monthEnd = timeEnd.getMonth() + 1;
        let dayEnd = timeEnd.getDate();
        let fullStart = yearStart + "-" + monthStart + "-" + dayStart;
        let fullEnd = yearEnd + "-" + monthEnd + "-" + dayEnd;
        if (new Date(fullStart) - new Date(fullEnd) > 0) {
          callback(new Error("计划开始时间必须小于计划完成时间"));
        } else {
          callback();
        }
      }
    };
    return {
      //------------------0508
      userInfo:null, //用户信息
      LPuploadUrl:fjPublic.ajaxUrlDNN + "/webUpdmedia", //上传图片和视频的地址
      LPuploadData:null, //要上传的数据
      isLeadPerson:false,  //是不是任务负责人
      loadTreeSelect:false,  //是否渲染任务负责人下拉选择框
      isMultiple:true,  //下拉框是否多选
      isPublisher:false, //是不是任务发布人
      selectedMisUserIds:[], //所选的任务负责人id
      misUserData:[], //加载出来任务负责人数据  
      //------------------
      iv: null, //viewer
      ajaxUrlDNN: fjPublic.ajaxUrlDNN,
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "工作管理", path: "" },
        { name: "工作任务", path: "" }
      ],
      // 状态下拉框
      missionStates: [
        {
          value: "0",
          label: "待处理"
        },
        {
          value: "1",
          label: "进行中"
        },
        {
          value: "2",
          label: "待审核"
        },
        {
          value: "3",
          label: "已完成"
        }
      ],
      // 类型下拉框
      missionTypes: [
        {
          value: "0",
          label: "普通任务"
        },
        {
          value: "1",
          label: "紧急任务"
        }
      ],
      // 列表查询参数
      searchForm: {
        missionState: "0", // 状态 默认0
        searchTime: "", // 查询时间
        titleOrName: "", // 标题或负责人名称
        missionType: "", // 类型
        tabState: 0
      },
      // 列表数据
      misData: [
        // {
        //   acceptUserName: "",
        //   createTime: "",
        //   description: "",
        //   id: "",
        //   planEndTime: "",
        //   planStartTime: "",
        //   startTime: "",
        //   status: "",
        //   title: "",
        //   userName: ""
        // }
      ],
      // 分页数据
      currentPage: 1,
      pageSize: 10,
      total: 0,
      // 顶部标签栏数据
      tabData: {
        dealNum: 0, // 待处理
        conductNum: 0, //进行中
        checkNum: 0, //待审核
        checkedNum: 0 //已完成
      },
      // 弹出框数据
      dialogVisible: false,
      dialogVisibleModal: false,
      dialogTitle: "",
      dialogForm: {
        id: "",
        missionTitle: "",
        leadPerson_id: "",
        leadPerson_name: null,
        createPerson_id: "",
        createPerson_name: null,
        planStart: "",
        planEnd: "",
        description: "",
        missionType: "0",
        finishTime: "",
        startTime: "",
        auditor_opinion: "",
        execResult: "",
        value: null,
        userId: "",
        pictureList: [],
        videoList: [],
        
      },
      currentWorkFlow: null,

      formLabelWidth: "120px",
      hiddenButton: true, // 提交保存按钮div隐藏
      chooseButtonDisabled: false, // 选择按钮禁用
      auditInputHidden: true, // 审核隐藏
      auditInputDisabled: false, // 审核禁用
      submitButtonValue: "派发",
      performButtonValue: "",
      completeButtonValue: "",
      throughButtonValue: "",
      returnButtonValue: "",

      // 树形选择框数据
      chooseDialogVisible: false,
      chooseDialogVisibleModal: false,
      chooseDialogVisible1: false,
      chooseDialogVisibleModal1: false,
      filterText: "",
      filterText1: "",
      chooseForm: {
        data: null
      },
      chooseForm1: {
        data: null
      },
      isExpandAll: false,
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验规则
      // 校验规则
      rules: {
        missionTitle: [
          {
            required: true, // 是否必填
            message: "标题不能为空！", //规则
            trigger: "blur" //何事件触发
          }
        ],
        leadPerson_id: [
          {
            required: true, // 是否必填
            message: "负责人员不能为空！", //规则
            trigger: "blur" //何事件触发
          }
        ],
        // createPerson_name: [
        //   {
        //     required: true, // 是否必填
        //     message: "执行人员不能为空！", //规则
        //     trigger: "blur" //何事件触发
        //   }
        // ],
        planStart: [
          {
            required: true, // 是否必填
            message: "开始时间不能为空！", //规则
            trigger: "blur" //何事件触发
          }
        ],
        planEnd: [
          {
            required: true, // 是否必填
            message: "计划完成时间不能为空！", //规则
            trigger: "blur" //何事件触发
          },
          {
            validator: timeValidate,
            trigger: "blur" //何事件触发
          }
        ],
        description: [
          {
            required: true, // 是否必填
            message: "描述不能为空！", //规则
            trigger: "blur" //何事件触发
          }
        ],
        missionType: [
          {
            required: true, // 是否必填
            message: "类型不能为空！", //规则
            trigger: "blur" //何事件触发
          }
        ]
      },
      // 穿梭框
      fromData: [],
      fromData1: [],
      toData: [],
      defaultOptions: []
    };
  },
  watch: {
    // 监听过滤
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    // 监听过滤1
    filterText1(val) {
      this.$refs.tree1.filter(val);
    }
  },
  created(){
    this.userInfo = $.parseJSON(fjPublic.getLocalData("userInfo")) || {};
  },
  mounted: function() {
    // 初始化任务列表
    this.searchMissionListByCnd();
    //
    //this.getFLdeptDataBySearch();
    return;
  },
  filters: {
    // 状态处理
    getMissionStateName: function(value) {
      return value == 0
        ? "待处理"
        : value == 1
        ? "进行中"
        : value == 2
        ? "待审核"
        : value == 3
        ? "已完成"
        : "";
    },
    getMissionType: function(value) {
      return value == "0" ? "普通任务" : value == 1 ? "紧急任务" : "";
    }
  },
  methods: {
    getFileType(fileName, symbol) { //获取文件后缀
      return fileName.substring(fileName.lastIndexOf(symbol) + 1).toLowerCase();
    },
    LPsendFile(file){ //发送文件到后台
      this.LPuploadData = null;
      this.LPuploadData = new FormData();
      this.LPuploadData.append("nowUser",$.cookie(fjPublic.loginCookieKey));
      this.LPuploadData.append("missionId",this.dialogForm.missionId);
      this.LPuploadData.append("file",file);
      var vm = this;
      return $.Deferred((defer)=>{
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/webUpdmedia",
          type: "POST",
          contentType:false,
          processData:false,
          data:this.LPuploadData,
          success(data){
            defer.resolve(data);
          },
          error(err){
            vm.$message({type:"warning",message:data.errorMsg});
          }
        });
      }).promise();
    },
    deleteLPuploadFile(info){ //删除已上传的文件
      this.LPuploadData = null;
      this.LPuploadData = {};
      this.LPuploadData["nowUser"] = $.cookie(fjPublic.loginCookieKey);
      this.LPuploadData["missionId"] = this.dialogForm.missionId;
      this.LPuploadData["fileName"] = info.fileName;
      var vm = this;
      //console.log(this.LPuploadData);
      //return;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/webDeldmedia",
        type: "POST",
        data:this.LPuploadData,
        success(data){
          //console.log(data);
          if(data.errorCode==0){
            var tmpIndex;
            if(info.hasOwnProperty("frameName")){
              _.find(vm.dialogForm.videoList,(item,i)=>{
                if(item.fileName==info.fileName){
                  tmpIndex = i;
                  return true;
                }
              });
              if(_.isNumber(tmpIndex)){
                vm.dialogForm.videoList.splice(tmpIndex,1);
                vm.$message({type:"success",message:data.errorMsg});
              }else{
                vm.$message({type:"warning",message:"删除视频失败"});
              }
            }else{
              _.find(vm.dialogForm.pictureList,(item,i)=>{
                if(item.fileName==info.fileName){
                  tmpIndex = i;
                  return true;
                }
              });
              if(_.isNumber(tmpIndex)){
                vm.dialogForm.pictureList.splice(tmpIndex,1);
                vm.$message({type:"success",message:data.errorMsg});
              }else{
                vm.$message({type:"warning",message:"删除图片失败"});
              }
            }
            
          }else{
            vm.$message({type:"warning",message:data.errorMsg});
          }
        },
        error(err){
          vm.$message({type:"warning",message:data.errorMsg});
        }
      });
    },
    //------------责任人上传图片-------
    LPuploadImgBefore(){
      return false;
    },
    LPuploadImgAjax(file){ //向后台上传图片
      //console.log(file.raw);
      //fjPublic.openLoad("正在上传图片...");
      var imgType = this.getFileType(file.raw.name,".");
      var imgTypes = ["jpg","jpeg","png"];
      if(!_.contains(imgTypes,imgType)){
        this.$message({type:"warning",message:"请上传对应格式的图片"});
        return;
      }
      //size 500K
      if(Math.round(file.raw.size/1024)>500){
        this.$message({type:"warning",message:"上传的图片不能大于500KB"});
        return;
      }
      fjPublic.openLoad("正在上传图片...","body",true);
      this.LPsendFile(file.raw).then((data)=>{
        fjPublic.closeLoad();
        if(data.errorCode==0){
          this.$message({type:"success",message:data.errorMsg});
          this.dialogForm.pictureList.push({
            fileName:data.fileName
          });
          //
          this.clearViewer();
          this.setViewer(".el-dialog__wrapper.mission-dialogs #fj-mis-imgWrap");
        }else{
          this.$message({type:"warning",message:data.errorMsg});
        }
      },()=>{
        fjPublic.closeLoad();
      });
    },
    //------------责任人上传视频----------------
    LPuploadVideoBefore(){
      return false;
    },
    LPuploadVideoAjax(file){ //向后台上传视频
      var videoType = this.getFileType(file.raw.name,".");
      var videoTypes = ["mp4","mov"];
      if(!_.contains(videoTypes,videoType)){
        this.$message({type:"warning",message:"请上传对应格式的视频(mp4,mov)"});
        return;
      }
      //size 50M
      if(Math.round(file.raw.size/(Math.pow(1024,2)))>50){
        this.$message({type:"warning",message:"上传的视频不能大于50M"});
        return;
      }
      fjPublic.openLoad("正在上传视频...","body",true);
      this.LPsendFile(file.raw).then((data)=>{
        console.log(data);
        fjPublic.closeLoad();
        if(data.errorCode==0){
          this.$message({type:"success",message:data.errorMsg});
          this.dialogForm.videoList.push({
            fileName:data.fileName,
            frameName:data.frameName
          });
        }else{
          this.$message({type:"warning",message:data.errorMsg});
        }
      },()=>{
        fjPublic.closeLoad();
      });
    },
    //--------延迟加载任务负责人数据---------0507 
    reSelectMisUserSingle(){ //重新选择任务负责人->单选
      if(!this.isPublisher)return;
      this.selectedMisUserIds = null;
      this.selectedMisUserIds = "";
      this.isMultiple = false;
      this.loadTreeSelect = true;
    },
    filterDeptIds(value){
      console.log(value);
      //console.log(this.selectedMisUserIds);
      if(this.isMultiple){
        //多选
        var tmpNamesArr = [];
        _.each(this.selectedMisUserIds,(v)=>{
          var tmpObj = _.find(this.misUserData,(item)=>{
            return item.id == v;
          });
          if(tmpObj){
            tmpNamesArr.push(tmpObj.label);
          }
        },this);
        //leadPerson_id赋值
        this.$set(this.dialogForm,"leadPerson_id",this.selectedMisUserIds.join(","));
        //leadPerson_name赋值
        this.$set(this.dialogForm,"leadPerson_name",tmpNamesArr.join(","));
        console.log(this.dialogForm.leadPerson_id);
        console.log(this.dialogForm.leadPerson_name);
      }else{
        //单选
        var tmpObj = _.find(this.misUserData,(item)=>{
          return this.selectedMisUserIds == item.id
        },this);
        //leadPerson_id赋值
        this.$set(this.dialogForm,"leadPerson_id",this.selectedMisUserIds);
        //leadPerson_name赋值
        this.$set(this.dialogForm,"leadPerson_name",tmpObj.label);
        console.log(this.dialogForm.leadPerson_id);
        console.log(this.dialogForm.leadPerson_name);
      }
    },
    clearMisUserIds(){ //清空组件已选择的任务负责人id
      if(_.isArray(this.selectedMisUserIds)){
        this.selectedMisUserIds.splice(0,this.selectedMisUserIds.length);
      }else{
        this.selectedMisUserIds = "";
      }
    },
    loadOptions({ action,parentNode,callback }){
      if(action===LOAD_CHILDREN_OPTIONS){
        //console.log(parentNode.id);
        //为人员时，不请求数据
        if(parentNode.isUser=="1")return;
        this.getMisDeptMacthedData(parentNode.isUser,parentNode.id).then((data)=>{
          //处理返回的数据
          this.operateChildren(data[0].children);
          //节点赋值
          parentNode.children = data[0].children;
          callback();
        });
      }
    },
    operateChildren(data){ //处理data[0].children
      if(!data.length)return;
      //存数据
      _.each(data,(item)=>{
        if(item.isUser=="1"){
          var tmpObj= {};
          tmpObj.id=item.id;
          tmpObj.label = item.label
          this.misUserData.push(tmpObj);
        }
      },this);
      if(this.isAllDept(data)){ //全为部门
        this.initLoadOptionDeptData(data);
      }else if(this.isAllUser(data)){ //全为用户
        //
      }else{ //有用户又有部门
        _.each(data,(item)=>{
          if(item.isUser=="0"){
            item.children = null;
          }
        });
        // //部门
        // var tmpDeptData = {};
        // tmpDeptData.id="depts"+this.loadCount;
        // tmpDeptData.label="所辖单位";
        // tmpDeptData.children = [];
        // //人员
        // var tmpPersonData = {};
        // tmpPersonData.id="users"+this.loadCount;
        // tmpPersonData.label="人员";
        // tmpPersonData.children = [];
        // _.each(data,(item)=>{
        //   var tmpObj = _.extend({},item,true);
        //   if(item.isUser=="0"){
        //     tmpDeptData.children.push(tmpObj);
        //   }else if(item.isUser=="1"){
        //     tmpPersonData.children.push(tmpObj);
        //   }
        // });
        // //部门数据的children=null->加载数据
        // this.initLoadOptionDeptData(tmpDeptData.children);
        // //
        // data.splice(0,data.length);
        // data.push(tmpDeptData);
        // data.push(tmpPersonData);
      }
      this.loadCount++;
    },
    isAllDept(data){ //全为部门的时候
      return _.every(data,(item)=>{
        return item.isUser=="0";
      });
    },
    isAllUser(data){ //是否全为user
      return _.every(data,(item)=>{
        return item.isUser=="1";
      });
    },
    initLoadOptionDeptData(arr){ //初始化部门的children=null
      _.each(arr,(item)=>{
        item.children = null;
      });
    },
    getMisDeptMacthedData(type,deptId){  //点击树节点加载对应部门数据
      var url =fjPublic.ajaxUrlDNN +  "/getMissionDeptUserSelect";
      // 初始化下拉列表
      return $.Deferred((defer)=>{
        $.ajax({
          url: url,
          type: "POST",
          data: {
            type:type,
            deptId:deptId||"",
            nowUser: $.cookie(fjPublic.loginCookieKey)
          },
          dataType: "json",
          success: function(data) {
            fjPublic.closeLoad();
            console.log(data);
            //
            defer.resolve(data);
          },
          error: function(err) {
            fjPublic.closeLoad();
            defer.reject();
          }
        });
      }).promise();
      
    },
    //-----------------
    clearViewer() {
      //清空viewer
      if (this.iv) {
        this.iv.destroy();
        this.iv = null;
      }
    },
    setViewer(str) {
      //设置viewer
      this.$nextTick(() => {
        if (!this.iv) {
          this.iv = new viewer($(str).get(0), {
            url: "data-original",
            title: false,
            navbar: true,
            toolbar: false
          });
        }
      });
    },
    selectLeadPerson: function(node) {
      //console.log(node);
      //选择任务负责人---单选  0316
      //console.log(node);
      //this.$set(this.dialogForm, "leadPerson_id", node.id);
      //this.$set(this.dialogForm, "leadPerson_name", node.label);
      //console.log(this.dialogForm);
    },
    currentPageChange: function(pageNum) {
      // 点击某个分页按钮
      this.currentPage = pageNum;
      this.searchMissionListByCnd();
    },
    prevPageChange: function(pageNum) {
      // 点击分页的上一页
      this.currentPage = pageNum;
      this.searchMissionListByCnd();
    },
    nextPageChange: function(pageNum) {
      // 点击分页的下一页
      this.currentPage = pageNum;
      this.searchMissionListByCnd();
    },
    sizePageChange: function(pageSize) {
      // 改变每页条数时
      this.currentPage = 1;
      this.pageSize = pageSize;
      this.searchMissionListByCnd();
    },
    // 修改状态下拉框查询
    changeMissState: function(tab) {
      let state = parseInt(tab.name) === 4 ? "" : parseInt(tab.name);
      this.currentPage = 1;
      this.searchForm["missionState"] = state;
      this.searchMissionListByCnd();
    },
    // 修改类型下拉框查询
    changeMissionType: function(missionType) {
      this.searchForm["missionType"] = missionType;
      this.searchMissionListByCnd();
    },
    // 标题或负责人名称查询
    searchMission: function(missionState) {
      this.searchMissionListByCnd();
    },
    // 修改查询时间
    changeSearchTime: function(searchTime) {
      if (searchTime) {
        this.searchForm["startTime"] = fjPublic.dateFormatYYMMDD(searchTime[0]);
        this.searchForm["endTime"] = fjPublic.dateFormatYYMMDD(searchTime[1]);
      } else {
        this.searchForm["startTime"] = "";
        this.searchForm["endTime"] = "";
      }
      this.searchMissionListByCnd();
    },
    // 获取任务列表
    searchMissionListByCnd: function() {
      var defer = $.Deferred();
      var vm = this;
      // 参数
      this.searchForm["page"] = this.currentPage;
      this.searchForm["rows"] = this.pageSize;
      // 传入当前用户信息
      this.searchForm["nowUser"] = $.cookie(fjPublic.loginCookieKey);
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/searchMissionListByCnd",
        type: "POST",
        data: vm.searchForm,
        dataType: "json",
        success: function(data) {
          if (data) {
            vm.misData = null;
            vm.misData = data.list;
            vm.total = data.total;
            if (data.mission_num) {
              vm.tabData = data.mission_num;
            } else {
              vm.tabData = {
                dealNum: 0,
                conductNum: 0,
                checkNum: 0,
                checkedNum: 0
              };
            }
            _.each(vm.misData, function(item, i) {
              vm.$set(item, "rank", i + 1);
            });
          }
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    // 是否删除
    isDeleteMission: function(info) {
      //console.log(this.userInfo.userId);
      //console.log(info);
      this.$confirm("此操作将删除该纪录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        this.deleteMission(info.id);
      });
    },
    // 删除任务
    deleteMission: function(id) {
      var defer = $.Deferred();
      var vm = this;
      fjPublic.openLoad("删除中...","body");
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/deleteMission",
        type: "POST",
        data: {
          nowUser:$.cookie(fjPublic.loginCookieKey),
          missionId: id
        },
        dataType: "json",
        success: function(data) {
          console.log(data);
          if (data.errorCode == 0) {
            vm.$message({
              message: "删除成功",
              type: "success"
            });
            vm.searchMissionListByCnd();
          } else {
            vm.$message.error(data.errorMsg);
          }
          defer.resolve();
          fjPublic.closeLoad();
        },
        error: function(err) {
          defer.reject();
          fjPublic.closeLoad();
        }
      });
    },
    // 打开添加或详情弹出框
    openAddOrDetailDialog: function(mission) {
      // 请求下拉框数据
      if (
        !(this.fromData && this.fromData.length) ||
        !(this.fromData1 && this.fromData1.length)
      ) {
        this.openChooseDialog();
        //this.openChooseDialog1()
      } else {
        this.dialogVisible = true;
      }
      //清空预置数据
      this.submitButtonValue = "";
      this.performButtonValue = "";
      this.completeButtonValue = "";
      this.throughButtonValue = "";
      this.returnButtonValue = "";
      this.currentWorkFlow = null;
      //
      this.clearMisUserIds();
      if (mission) { //点击详情
        //禁用下拉选择框
        this.isLeadPerson = false; //是否任务执行人
        this.isPublisher = false; //是否任务发布人
        this.loadTreeSelect = false;
        var vm = this;
        fjPublic.openLoad("获取详情...");
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/searchMissionByMissionId",
          type: "POST",
          async: false,
          data: {
            missionId: mission.id,
            nowUser: $.cookie(fjPublic.loginCookieKey)
          },
          dataType: "json",
          success: function(data) {
            if (data.errorCode == 0) {
              vm.dialogForm["userId"] = data.userId;
              mission = data.missions;
              vm.currentWorkFlow = mission.workFlow;
              fjPublic.closeLoad();
              //console.log(mission);
            } else {
            }
          },
          error: function(err) {
            fjPublic.closeLoad();
            defer.reject();
          }
        });
        //------------------------0508
        this.dialogForm["leadPerson_name"] = mission.leadPerson_name;
        mission.leadPerson_id&&(this.dialogForm["leadPerson_id"] = mission.leadPerson_id);
        /* if (
          this.dialogForm["userId"] &&
          this.dialogForm["userId"] != mission.publishUserId
        ) {
          this.openChooseDialog(2);
        } */
        //-------------------------
        // this.dialogForm["missionType"] = mission.missionType;
        // this.dialogForm["missionTitle"] = mission.title;
        // mission.userId  && (this.dialogForm["leadPerson_id"] = mission.userId.split(','))
        // mission.acceptUserId && (this.dialogForm["createPerson_name"] = mission.acceptUserId.split(','))
        // this.dialogForm["planStart"] = mission.planStartTime;
        // this.dialogForm["planEnd"] = mission.planEndTime;
        // this.dialogForm["description"] = mission.description;
        // this.dialogForm["missionState"] = mission.status;
        this.dialogForm["missionType"] = mission.missionType;
        this.dialogForm["missionTitle"] = mission.missionTitle;
        // mission.leadPerson_id &&
        //   (this.dialogForm["leadPerson_id"] = mission.leadPerson_id.split(","));
        // mission.acceptUserId && (this.dialogForm["createPerson_name"] = mission.acceptUserId.split(','))
        this.dialogForm["planStart"] = mission.planStart;
        this.dialogForm["planEnd"] = mission.planEnd;
        this.dialogForm["description"] = mission.description;
        this.dialogForm["missionState"] = mission.missionState;
        this.dialogForm["pictureList"] = mission.pictureList;
        this.dialogForm["videoList"] = mission.videoList;
        // 待处理和进行中
        if (mission.missionState == 0) {
          this.dialogForm["missionId"] = mission.missionId;
          this.dialogForm["missionState"] = mission.missionState;
          this.dialogTitle = "详情（任务待处理）";
          this.hiddenButton = true;
          this.chooseButtonDisabled = false;
          this.auditInputHidden = true;
          if (
            this.dialogForm["userId"] &&
            this.dialogForm["userId"] == mission.publishUserId
          ) {
            //发起人可修改
            this.submitButtonValue = "修 改";
            this.isPublisher = true;
          } else if (
            this.dialogForm["userId"] &&
            this.dialogForm["userId"] == mission.leadPerson_id
          ) {
            //责任人执行
            this.performButtonValue = "执 行";
          }
          // 进行中，不可修改
        } else if (mission.missionState == 1) {
          this.dialogForm["missionId"] = mission.missionId;
          this.dialogForm["leadPerson_id"] = mission.leadPerson_id;
          // this.dialogForm["createPerson_name"] = mission.createPerson_name
          this.dialogTitle = "详情（任务进行中）";
          this.dialogForm["missionState"] = mission.missionState;
          this.auditInputHidden = true;
          if (
            this.dialogForm["userId"] &&
            this.dialogForm["userId"] == mission.publishUserId
          ) {
            //发起人可修改
            this.chooseButtonDisabled = false;
            this.hiddenButton = true;
            this.submitButtonValue = "修 改";
            this.isPublisher = true;
          } else if (
            this.dialogForm["userId"] &&
            this.dialogForm["userId"] == mission.leadPerson_id
          ) {
            //责任人完成
            this.hiddenButton = true;
            this.completeButtonValue = "完 成";
            //是责任人
            this.isLeadPerson = true;
          } else {
            this.hiddenButton = false;
          }
          // 待审核，审核
        } else if (mission.missionState == 2) {
          this.dialogForm["missionId"] = mission.missionId;
          this.dialogForm["startTime"] = mission.startTime;
          this.dialogForm["finishTime"] = mission.finishTime;
          this.dialogForm["leadPerson_id"] = mission.leadPerson_id;
          // this.dialogForm["createPerson_name"] = mission.createPerson_name
          this.dialogForm["execResult"] = mission.execResult;
          this.dialogTitle = "详情（任务待审核）";
          this.hiddenButton = true;
          this.chooseButtonDisabled = true;
          this.auditInputHidden = false;
          this.auditInputDisabled = false;
          // this.submitButtonValue = "已完成";
          if (
            this.dialogForm["userId"] &&
            mission &&
            mission.workFlow &&
            this.dialogForm["userId"] == mission.workFlow.terminationId
          ) {
            //当前流程处理人可审核
            this.throughButtonValue = "通 过";
            this.returnButtonValue = "打 回";
          }
        } else {
          this.dialogForm["leadPerson_id"] = mission.leadPerson_id;
          this.dialogForm["createPerson_name"] = mission.createPerson_name;
          this.dialogForm["startTime"] = mission.startTime;
          this.dialogForm["finishTime"] = mission.finishTime;
          this.dialogForm["execResult"] = mission.execResult;
          this.dialogForm["auditor_opinion"] = mission.auditor_opinion;
          this.dialogTitle = "详情（任务审核完成）";
          this.hiddenButton = false;
          this.chooseButtonDisabled = true;
          this.auditInputHidden = false;
          this.auditInputDisabled = true;
        }
      } else { //点击派发任务
        //启用下拉选择框
        this.selectedMisUserIds = [];
        this.isMultiple = true; //多选
        this.loadTreeSelect = true;
        //
        this.dialogForm["missionType"] = "0";
        this.dialogForm["missionTitle"] = "";
        this.dialogForm["leadPerson_id"] = null;
        this.dialogForm["createPerson_name"] = null;
        this.dialogForm["planStart"] = "";
        this.dialogForm["planEnd"] = "";
        this.dialogForm["description"] = "";
        this.dialogForm["pictureList"] = [];
        this.dialogForm["videoList"] = [];
        this.dialogForm.missionState = "";
        this.dialogTitle = "派发任务";
        this.dialogForm.missionId = "";
        this.submitButtonValue = "派发";
        this.hiddenButton = true;
        this.auditInputHidden = true;
        this.chooseButtonDisabled = false;
      }
    },
    openChooseDialog: function(type) {
      var defer = $.Deferred();
      var vm = this;
      vm.filterText = "";
      fjPublic.openLoad("正在加载数据请稍后");
      // var url = fjPublic.ajaxUrlDNN + "/getTreeDeptPersonUserData"; //获取部门树数据
      // if (type == 2) {
      //   //查看他人发起任务获取所有的
      //   url = fjPublic.ajaxUrlDNN + "/getTreeDeptPersonData";
      // }
      var url =fjPublic.ajaxUrlDNN +  "/getMissionDeptUserSelect";
      // 初始化下拉列表
      $.ajax({
        url: url,
        type: "POST",
        data: {
          type: 0,
          nowUser: $.cookie(fjPublic.loginCookieKey)
        },
        dataType: "json",
        success: function(data) {
          fjPublic.closeLoad();
          console.log(data);
          //每次初始化treeselect先清空之前存的人员数据
          vm.misUserData.splice(0,vm.misUserData.length);
          vm.operateChildren(data[0].children);
          vm.chooseForm.data = data;
          vm.fromData = data;
          vm.dialogVisible = true;
          //
          vm.setViewer(".el-dialog__wrapper.mission-dialogs #fj-mis-imgWrap");
          defer.resolve();
        },
        error: function(err) {
          fjPublic.closeLoad();
          defer.reject();
        }
      });

      // this.chooseDialogVisible = true;
    },
    // 打开选择人员弹出框
    openChooseDialog1: function() {
      var defer = $.Deferred();
      var vm = this;
      vm.filterText1 = "";
      const loading = this.$loading({
        lock: true,
        text: "正在加载数据请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      // 初始化下拉列表
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/getTreeDeptPersonData",
        type: "POST",
        data: {
          type: 1,
          nowUser: $.cookie(fjPublic.loginCookieKey)
        },
        dataType: "json",
        success: function(data) {
          vm.chooseForm1.data = data;
          vm.fromData1 = data;
          vm.dialogVisible = true;
          loading.close();
          defer.resolve();
        },
        error: function(err) {
          loading.close();
          defer.reject();
        }
      });
    },
    // 保存工作任务
    saveMission: function(formName) {
      // 传入当前用户信息
      this.dialogForm["nowUser"] = $.cookie(fjPublic.loginCookieKey);
      this.$refs[formName].validate(valid => {
        if (valid) {
          var defer = $.Deferred();
          var vm = this;
          // 如果是时间对象，则格式化
          if (typeof vm.dialogForm.planStart == "object") {
            vm.dialogForm["planStart"] = fjPublic.dateFormatYYMMDDHMS(
              vm.dialogForm.planStart
            );
          }
          if (typeof vm.dialogForm.planEnd == "object") {
            vm.dialogForm["planEnd"] = fjPublic.dateFormatYYMMDDHMS(
              vm.dialogForm.planEnd
            );
          }
          //vm.dialogForm.leadPerson_name = vm.dialogForm.leadPerson_id
          if (
            Object.prototype.toString.call(vm.dialogForm.createPerson_name) ===
            "[object Array]"
          ) {
            vm.dialogForm.createPerson_id = vm.dialogForm.createPerson_name.join(
              ","
            );
          }
          //console.log(vm.dialogForm);
          //return;
          fjPublic.openLoad("处理中...","body");
          if (vm.dialogForm.missionId) {
            $.ajax({
              url: fjPublic.ajaxUrlDNN + "/updateMission",
              type: "POST",
              data: vm.dialogForm,
              dataType: "json",
              success: function(data) {
                if (data.errorCode == 0) {
                  vm.dialogVisible = false;
                  vm.$message({
                    message: "操作成功",
                    type: "success"
                  });
                  vm.searchMissionListByCnd();
                } else {
                  vm.$message.error(data.errorMsg);
                }
                defer.resolve();
                fjPublic.closeLoad();
              },
              error: function(err) {
                defer.reject();
                fjPublic.closeLoad();
              }
            });
          } else {
            $.ajax({
              url: fjPublic.ajaxUrlDNN + "/saveMission",
              type: "POST",
              data: vm.dialogForm,
              dataType: "json",
              success: function(data) {
                if (data.errorCode == 0) {
                  vm.dialogVisible = false;
                  vm.$message({
                    message: "操作成功",
                    type: "success"
                  });
                  vm.searchMissionListByCnd();
                } else {
                  vm.$message.error(data.errorMsg);
                }
                defer.resolve();
                fjPublic.closeLoad();
              },
              error: function(err) {
                vm.$message.error("网络错误");
                defer.reject();
                fjPublic.closeLoad();
              }
            });
          }
        } else {
          this.$message({
            message: "请完善输入框！",
            type: "error"
          });
          return false;
        }
      });
    },
    // 执行工作任务
    performMission: function(formName) {
      this.operationMission("0", "");
    },
    // 完成工作任务
    completeMission: function(formName) {
      if(!this.dialogForm.execResult){
        this.$message({type:"warning",message:"请填写任务完成情况"});
        return;
      }
      this.operationMission("1", "");
    },
    // 通过工作任务
    throughMission: function(formName) {
      this.operationMission("2", "1");
    },
    // 打回工作任务
    returnMission: function(formName) {
      this.operationMission("2", "0");
    },
    operationMission: function(operationType, auditor_state) {
      var defer = $.Deferred();
      var vm = this;
      fjPublic.openLoad("处理中...","body");
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/operationMission",
        type: "POST",
        async: false,
        data: {
          operationType: operationType,
          auditor_opinion: this.dialogForm["auditor_opinion"],
          execResult: this.dialogForm["execResult"],
          auditor_state: auditor_state,
          workFlowId: this.currentWorkFlow.workFlowId,
          nowUser: $.cookie(fjPublic.loginCookieKey) // 传入当前用户信息
        },
        dataType: "json",
        success: function(data) {
          if (data.errorCode == 0) {
            vm.dialogVisible = false;
            vm.$message({
              message: data.errorMsg,
              type: "success"
            });
            vm.searchMissionListByCnd();
          } else {
            vm.$message({
              message: data.errorMsg,
              type: "error"
            });
          }
          defer.resolve();
          fjPublic.closeLoad();
        },
        error: function(err) {
          defer.reject();
          fjPublic.closeLoad();
        }
      });
    },
    // 下拉过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 下拉过滤1
    filterNode1(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
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
      this.$refs.dialogForm.resetFields();
      //
      this.clearViewer();
    }
  },
  components: {
    fjBreadNav,
    Treeselect
  }
};
</script>
<style scope lang="less">
.mission {
  .fj-block-head {
    .el-tabs__item {
      font-size:14px;
    }
  }
  .el-table {
    /* .ope-txt {
      &:first-child {
        border-right: 1px solid #e9e9e9;
        padding-right: 12px;
      }
    } */
    .textLeft {
      text-align: left;
    }
    .circle-status {
      display: flex;
      position: relative;
      align-items: center;
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
      &.orange {
        &::before {
          background: #facc14;
        }
      }
      &.blue {
        &::before {
          background: #1890ff;
        }
      }
      &::before {
        display: block;
        margin-right: 5px;
        content: "";
        width: 6px;
        height: 6px;
        background: rgba(171, 171, 171, 1);
        border-radius: 50%;
        opacity: 1;
        top: 8px;
        left: -10px;
      }
    }
  }
  .fj-search-inline {
    /deep/ .el-row {
      .el-form-item {
        margin: 15px 10px;
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
      .time-item {
        .el-input {
          width: 350px;
        }
      }
    }
  }
  /* 分页器位置*/
  .fj-content_view {
    .mj-page_wrap {
      /deep/ .el-pagination {
        text-align: right;
      }
    }
    // 任务标题居中
    .el-table td:first-child,
    .el-table th:first-child {
      text-align: left;
    }

    .el-input.is-disabled .el-input__inner,
    .el-textarea.is-disabled .el-textarea__inner {
      color: rgba(0, 0, 0, 0.15);
    }
    .el-radio__input.is-disabled {
      color: #000;
    }
  }
}
/* 0419修改 */
.fj-content_view.work-mis {
  .fj-search-inline {
    .el-date-editor.el-range-separator {
      padding: 0px 2px;
    }
  }
}
.fj-mis-imgWrap,
.fj-mis-videoWrap {
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  margin-bottom: -11px;
  & > .item {
    position: relative;
    flex: 0 0 auto;
    margin-right: 11px;
    margin-bottom: 11px;
    background: rgba(0, 0, 0, 0.5);
  }
}
.fj-mis-imgWrap {
  & > .item {
    width: 141px;
    height: 179px;
    /* overflow: hidden; */
    &:nth-child(6n) {
      margin-right: 0px;
    }
    &:nth-child(6n) ~ .item {
      margin-bottom: 0px;
    }
    & > img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: 100%;
      max-height: 100%;
    }
    
  }
}

.fj-mis-videoWrap {
  & > .item {
    width: 293px;
    height: 200px;
    &:nth-child(3n) {
      margin-right: 0px;
    }
    &:nth-child(3n) ~ .item {
      margin-bottom: 0px;
    }
    & > video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
}
.fj-mis-imgWrap,.fj-mis-videoWrap {
  & > .item {
    &>.el-icon-error {
      position:absolute;top:-10px;right:-10px;font-size:22px;
      background:rgba(255,255,255,0.6);border-radius:50%;cursor:pointer;
    }
  }
}
/* 0508修改 */
//.fj-content_view.work-mis {
.fj-mis-upload0508 {
  .el-form-item__content {
    position:relative;
  }
  .el-upload__tip {
    position:absolute;left:138px;top:0px;
    margin-top:0px;font-size:14px;
    color:rgba(0,0,0,.85);
  }
  .el-upload-list {
    width:600px;
  }
  .el-upload-list__item {
    color:rgba(0,0,0,.65);
  }
  .el-upload-list__item-name {
    max-width:460px;
  }
}
//}
/* 0507修改 */
.fj-content_view.work-mis {
  .el-date-editor .el-range-separator {padding:0px;}
  .fj-block-body > .filterOpe-area {
    .el-input-group__append {
      background-color: #1890ff;
      border-color: #1890ff;
      color: #fff;
    }
  }
  @media screen and (max-width:1366px) {
    .fj-block-body > .filterOpe-area {
      .area-line {margin-bottom:0px;}
      .item {margin-right:20px;}
      .el-select {width:200px;}
      .el-date-editor--daterange.el-input__inner {width:320px;}
    }
  }
}
/* 0506修改 */
.misOwnerPop20190506 {
  &.el-dialog__wrapper {
    .el-checkbox {width:20%;line-height:40px;}
    .el-checkbox+.el-checkbox {margin-left:0px;}
  }
}
</style>


