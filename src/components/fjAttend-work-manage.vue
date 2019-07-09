<template>
  <!-- 排班管理 -->
  <div class="fj-content_view work-manage">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head kaohe">
        <el-tabs
          v-model="activeIndex"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="班次配置"
            name="0"
          ></el-tab-pane>
          <el-tab-pane
            label="排班设置"
            name="1"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <!-- 内容 -->
      <div
        class="fj-block-body"
        v-show="activeIndex==0"
      >
        <!-- 筛选 -->
        <ul class="filterOpe-area">
          <li class="area-line fj-clear">
            <div class="item fj-fl">
              <span class="title fj-fl">区县分局：</span>
              <el-select
                class="fj-fl"
                v-model="workConArgs.fenjvId"
                @change="getPCSdataById"
                :disabled="workConArgs.isFenjv"
                clearable
                placeholder="请选择区县分局"
              >
                <el-option
                  v-for="item in FLdeptsData"
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
                v-model="workConArgs.pcsId"
                @change="getListDataByPcsId"
                :disabled="workConArgs.isPcs"
                clearable
                placeholder="请选择派出所"
              >
                <el-option
                  v-for="item in workConArgs.SLdeptsData"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptId"
                ></el-option>
              </el-select>
            </div>
            <div class="item sc1920 fj-fl">
              <el-button type="primary" @click="addWorkCon">新增班次</el-button>
            </div>
          </li>
        </ul>
        <el-table :data="workConListData">
          <el-table-column class-name="align-left" label="单位" prop="deptName"></el-table-column>
          <el-table-column class-name="align-left" label="班次名称" prop="className"></el-table-column>
          <el-table-column class-name="align-left" label="班次时间" prop="workTime"></el-table-column>
          <!-- <el-table-column class-name="align-left" label="参与人员" prop="insUserId"></el-table-column>
          <el-table-column label="人数" prop=""></el-table-column> -->
          <el-table-column label="操作">
            <template slot-scope="slot">
              <!-- <span class="ope-txt" @click="showWorkConDetail(slot.row)">详情</span> -->
              <span class="ope-txt" @click="modifyWorkCon(slot.row)">编辑</span>
              <span class="ope-txt" @click="deleteWorkCon(slot.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="mj-page_wrap">
          <el-pagination
            :current-page="workConCurrentPage"
            :page-sizes="[10,20,30]"
            :page-size="workConPageSize"
            layout="total,prev,pager,next,jumper"
            :total="workConTotal"
            @current-change="workConCurrentPageChange"
            @prev-click="workConPrevPageChange"
            @next-click="workConNextPageChange"
            @size-change="workConSizePageChange"
          >
          </el-pagination>
        </div>
      </div>
      <div
        class="fj-block-body intel-sche"
        v-show="activeIndex==1"
      >
        <!-- 筛选 -->
        <ul class="filterOpe-area">
          <li class="area-line fj-clear">
            <div class="item fj-fl">
              <span class="title fj-fl">区县分局：</span>
              <el-select
                class="fj-fl"
                v-model="intelScheArgs.fenjvId"
                @change="getPCSdataById"
                :disabled="intelScheArgs.isFenjv"
                clearable
                placeholder="请选择区县分局"
              >
                <el-option
                  v-for="item in FLdeptsData"
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
                v-model="intelScheArgs.pcsId"
                @change="getListDataByPcsId"
                :disabled="intelScheArgs.isPcs"
                clearable
                placeholder="请选择派出所"
              >
                <el-option
                  v-for="item in intelScheArgs.SLdeptsData"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptId"
                ></el-option>
              </el-select>
            </div>
          </li>
          <li class="area-line fj-clear">
            <div class="item fj-fl">
              <span class="title fj-fl">选择月份：</span>
              <el-date-picker
                v-model="intelScheArgs.yyyy_mm"
                @change="changeMonthOfIS"
                type="month"
                value-format="yyyy-MM"
                placeholder="选择月份"
              >
              </el-date-picker>
            </div>
            <div class="item fj-fl">
              <span class="title fj-fl">选择周：</span>
              <el-select
                class="fj-fl"
                v-model="intelScheArgs.weekNum"
                @change="changeWeekOfIS"
                clearable
                placeholder="请选择周"
              >
                <el-option
                  v-for="item in intelScheArgs.weeksData"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
            <div class="item fj-fl">
              <el-button type="primary" @click="mutipleIntelScheOpe">批量排班</el-button>
              <el-button type="default" @click="exportIntelSche">导&nbsp;出</el-button>
              <el-button type="default" @click="resetIntelScheOpe">重&nbsp;置</el-button>
            </div>
          </li>
        </ul>
        <el-table :data="intelScheListData" @selection-change="handleSelectionChange" v-if="intelScheArgs.refresh">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="姓名" prop="userName"></el-table-column>
          <el-table-column v-for="(item,index) in intelScheArgs.dateList" :key="index">
            <template
              slot="header"
              slot-scope="slot"
            >
              <p>{{item.week}}</p>
              <p v-text="'（'+item.date2+'）'"></p>
            </template>
            <template 
              slot
              slot-scope="slot">
              <div class="content" v-if="slot.row.dataList[index].workState==0">
                <p>{{slot.row.dataList[index].className}}</p>
                <p>{{slot.row.dataList[index].inWorkTime+"-"+slot.row.dataList[index].outWorkTime}}</p>
              </div>
              <p v-else>{{slot.row.dataList[index].className1}}</p>
            </template>
          </el-table-column>
        </el-table>
        <div class="mj-page_wrap">
          <el-pagination
            :current-page="intelScheCurrentPage"
            :page-sizes="[10,20,30]"
            :page-size="intelSchePageSize"
            layout="total,prev,pager,next,jumper"
            :total="intelScheTotal"
            @current-change="intelScheCurrentPageChange"
            @prev-click="intelSchePrevPageChange"
            @next-click="intelScheNextPageChange"
            @size-change="intelScheSizePageChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 班次弹层 -->
    <el-dialog
      id="addWorkConPop"
      :title="addWorkConData.title"
      :visible.sync="addWorkConPop"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="682px"
      @close="closeAddWorkConPop">
      <div class="fj-block-body">
        <el-form :model="addWorkConData" :rules="addWorkConRules" ref="addWorkConForm">
          <el-row>
            <el-col :span="24">
              <el-form-item label="班次名称：" prop="className">
                <el-input 
                  clearable 
                  v-model="addWorkConData.className"
                  :disabled="addWorkConData.isDetail"
                  placeholder="请输入需要添加的班次名称" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="班次部门：" prop="deptInfo">
                <div class="treeSelect-box">
                  <treeselect
                    placeholder="请选择部门"
                    :disabled="addWorkConData.isDetail"
                    v-model="addWorkConData.deptInfo"
                    :options="addWorkConData.deptData"
                    size="small"
                    value-consists-of="LEAF_PRIORITY"
                    :disable-branch-nodes="true"
                    @select="selectDeptOfAWC"
                  >
                  <div
                    slot="value-label"
                    slot-scope="{ node,labelClassName }"
                    :class="labelClassName"
                  >{{ node.raw.label || '请选择' }}</div>
                </treeselect>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="班次时间：" prop="workConTime">
                <el-time-select
                  class="fj-fl"
                  @change="selectInworkTime"
                  v-model="addWorkConData.inWorkTime1"
                  :picker-options="{
                    'start':'01:00',
                    'step':'00:10',
                    'end':'23:00',
                  }"
                  placeholder="开始时间">
                </el-time-select>
                <span class="separator fj-fl">至</span>
                <el-time-select
                  class="fj-fl"
                  @change="selectOutworkTime"
                  v-model="addWorkConData.outWorkTime1"
                  :picker-options="{
                    'start':'01:00',
                    'step':'00:10',
                    'end':'23:00',
                  }"
                  placeholder="结束时间">
                </el-time-select>
                <!-- <el-time-picker
                  is-range
                  v-model="addWorkConData.workConTime"
                  :disabled="addWorkConData.isDetail"
                  :picker-options="{
                    start:'09:00',
                    end:'18:00'
                  }"
                  value-format="HH:mm:ss"
                  range-separator="至"
                  start-placeholder="上班时间"
                  end-placeholder="下班时间"
                  placeholder="选择班次时间范围">
                </el-time-picker> -->
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="fj-block-body footer" slot="footer" v-show="!addWorkConData.isDetail">
        <el-button type="primary" @click="addWorkConClass">确定</el-button>
        <el-button type="default" @click="closeAddWorkConPop">取消</el-button>
      </div>
    </el-dialog>
    <!-- 排班弹层 -->
    <el-dialog
      id="intelSchePop"
      title="批量排班"
      :visible.sync="intelSchePop"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="720px"
      top="8vh"
      @close="closeIntelSchePop">
      <div class="fj-block-body">
        <el-row>
          <el-col :span="24">
            <div class="users-box">
              <p class="title">已选择<span>{{intelScheUsers.length}}</span>人：</p>
              <div class="users-box-list">
                <span class="item" 
                  v-for="(item,index) in intelScheUsers" 
                  :key="index" 
                  :class="{'isShow':item.isShow}"
                  @click="tabSelectedUsersClassId(index)">
                  {{item.userName}}<span v-show="index!=intelScheUsers.length-1">、</span>
                </span>
              </div>
            </div>
            <el-tooltip class="users-notice" effect="dark" content="点击人员姓名，可切换显示与该人员对应的当前班次。" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form>
              <el-form-item v-for="(item,index) in intelScheArgs.dateList" :key="index" :label="'（'+item.date2+'）'+item.week+'：'">
                <el-select
                  clearable
                  v-model="intelScheArgs.curClassInfos[index].classId"
                  :disabled="intelScheArgs.curClassInfos[index].disabled"      
                  placeholder="请选择班次"
                >
                  <el-option
                    v-for="item2 in intelScheArgs.classData"
                    :key="item2.id"
                    :label="item2.label"
                    :value="item2.id"
                  ></el-option>
                </el-select>
                <el-tooltip v-if="intelScheArgs.curClassInfos[index].disabled" class="item" effect="dark" content="只能设置今天以后的班次" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <div class="fj-block-body footer" slot="footer" v-show="!addWorkConData.isDetail">
        <el-button type="primary" @click="confirmIntelSche">确定</el-button>
        <el-button type="default" @click="closeIntelSchePop">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
//班次时间-默认
window.fjWorkConTime = function(h,m,s){
  var oDate = new Date();
  return new Date(oDate.getFullYear(),oDate.getMonth(),oDate.getDate(),h,m,s);
};
export default {
  name: "fjAttend-work-manage",
  data() {
    //验证班次的开始结束时间
    var testWorkConTime = (rule, value, callback)=>{
      var hasEmpty = _.some(value,(v)=>{
        return v=="";
      });
      if(hasEmpty){
        callback(new Error("请选择班次的开始和结束时间"));
      }else if(value[0]==value[1]){
        callback(new Error("班次的开始和结束时间不能一样"));
      }else if(!hasEmpty){
        callback();
      }
    };
    return {
      userInfo:null, //用户信息
      nowUser:$.cookie(fjPublic.loginCookieKey), //当前登录cookie
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "考勤管理", path: "" },
        { name: "排班管理", path: "" }
      ],
      activeIndex:fjPublic.getLocalData("wmActiveIndex")||0,
      addBreadItems:{
        "0":{name: "班次配置", path: ""},
        "1":{name: "排班设置", path: ""}
      },
      //------------------
      workConCurrentPage: 1, //页码->班次配置
      workConPageSize: 10, //每页条数->班次配置
      workConTotal: 0, //分页总数->班次配置
      //------------------
      intelScheCurrentPage: 1, //页码->智能排班
      intelSchePageSize: 10, //每页条数->智能排班
      intelScheTotal: 0, //分页总数->智能排班
      //------------------
      FLdeptsData: [], //分局数据
      //------------------
      workConArgs:{  //班次配置参数
        fenjvId:"", //分局部门id->班次配置
        pcsId:"",   //派出所部门id ->班次配置
        deptId:"",
        SLdeptsData: [], //派出所数据
        isFenjv:false,
        isPcs:false
      },
      addWorkConPop:false, //新增班次->弹层
      addWorkConData:{ //新增班次-> 数据
        nowUser:$.cookie(fjPublic.loginCookieKey),
        title:"新增班次",
        type:"",
        className:"", //班次名
        workConTime:["",""], //上下班时间-验证
        inWorkTime:"",
        inWorkTime1:"08:00", //上班时间 
        outWorkTime:"",
        outWorkTime1:"17:30", //下班时间 
        deptId:"", //部门id
        deptName:"", //部门名
        deptInfo:"",
        deptData:[],  //部门树形数据
        isDetail:false, //查看详情
        tmpWorkInfo:null //编辑班次用
      },
      addWorkConRules:{ //新增班次->验证
        className:[
          {
            required: true, // 是否必填
            message: "请填写班次名称", //规则
            trigger: "blur" 
          }
        ],
        deptInfo:[
          {
            required: true, // 是否必填
            message: "请选择部门", //
            trigger: "blur" 
          }
        ],
        workConTime:[
          {
            required: true, // 是否必填
            message: "请选择班次的开始和结束时间", //
            trigger: "blur" 
          },
          {
            required: true, // 是否必填
            validator:testWorkConTime,
            trigger:"blur"
          }
        ]
      },
      //------------------
      intelScheArgs:{ //排班配置参数
        isFenjv:false,
        isPcs:false,
        exportUrl:fjPublic.ajaxUrlDNN, //导出地址
        fenjvId:"", //分局部门id->排班
        pcsId:"",   //派出所部门id ->排班
        month:"", //班次配置->月份选择
        week:"",  //班次配置->周选择
        deptId:"", //部门id
        deptName:"",  //部门名称
        yyyy_mm:fjPublic.date2Month(new Date()),   //月份-默认当月
        weekNum:"",   //第几周->默认第一周
        weeksData:[], //周的数据
        startTime:"", //开始时间
        endTime:"",   //结束时间
        SLdeptsData: [], //派出所数据
        dateList:[],  //表头数据
        refresh:true,
        hasDateReg:/\d{4}-\d{2}-\d{2}/, //验证是不是日期信息
        classData:[],  //批量排班时的班次信息
        curClassInfos:[], //选中人员当前的班次信息 
        curTimeStr:fjPublic.dateFormatYYMMDD(new Date()), //当前日期值
        initClass:"1314520",  //默认的班次id 
        workState:{ //上班状态
          "0":{
            workName:"上班",
            classId:""
          },
          "1":{
            workName:"休息",
            classId:"1"
          },
          "2":{
            workName:"请假",
            classId:""
          },
          "3":{
            workName:"未入职",
            classId:""
          },
        }
      },
      selectedClassInfo:{ //批量排班要提交到后台的信息
        nowUser:"",
        userIdArr:"",
        dateArr:"",
        idArr:""
      },
      intelSchePop:false, //排班弹层
      intelScheUsers:[],  //批量排班的人员
      //-------------------
      workConListData: [], //班次配置-列表数据
      intelScheListData: [], //智能排班-列表数据
      //-------------------
      tabFnsOfClearPcs:{ //清空分局id的时候
        "0"(){
          this.clearPcsData("workConArgs");
          this.workConArgs["pcsId"] = "";
          this.workConArgs["deptId"] = "";
        },
        "1"(){
          this.clearPcsData("intelScheArgs");
          this.intelScheArgs["pcsId"] = "";
          this.intelScheArgs["deptId"] = "";
        }
      },
      tabFnsOfCleadPcsId:{ //清空派出所id
        "0"(){
          this.workConArgs["pcsId"] = "";
        },
        "1"(){
          this.intelScheArgs["pcsId"] = "";
        }
      },
      tabFnsOfGetPcsData:{ //派出所数据赋值
        "0"(data){
          this.workConArgs.SLdeptsData = null;
          this.workConArgs.SLdeptsData = data;
        },
        "1"(data){
          this.intelScheArgs.SLdeptsData = null;
          data.shift();
          this.intelScheArgs.SLdeptsData = data;
        }
      },
      tabFnsOfGetListData:{ //切换分局部门时获取对应分局列表数据
        "0"(id){
          this.workConArgs["deptId"] = id;
          this.workConCurrentPage = 1;
          return this.getWorkConListData();
        },
        "1"(id){
          if(!id){ //清空表格数据
            this.intelScheListData.splice(0,this.intelScheListData.length);
            return;
          }
          this.intelScheCurrentPage = 1;
          return this.getTntelScheListData();
        }
      },
      tabFnsOfClearPcsSelect:{
        "0"(){
          this.workConArgs["deptId"] = "";
        },
        "1"(){
          this.intelScheArgs["deptId"] = "";
        }
      },
      userControl:{ //登录用户控制
        [fjPublic.userRoles.fj](){},
        [fjPublic.userRoles.pcs](){ //派出所
          return $.Deferred((defer)=>{
            var vm = this;
            //设置分局
            var tmpObj = _.find(this.FLdeptsData,(item)=>{
              return this.userInfo.deptId.substr(0,6)==item.deptId.substr(0,6);
            },this);
            //
            this.workConArgs["fenjvId"] = tmpObj.deptId;
            this.workConArgs["isFenjv"] = true;
            this.intelScheArgs["fenjvId"] = tmpObj.deptId;
            this.intelScheArgs["isFenjv"] = true;
            //
            this.workConArgs["isPcs"] = true;
            this.intelScheArgs["isPcs"] = true;
            this.getPCSdataById(tmpObj.deptId,true).then(()=>{
              this.workConArgs["pcsId"] = this.userInfo.deptId;
              this.intelScheArgs["pcsId"] = this.userInfo.deptId;
              this.workConArgs["deptId"] = this.userInfo.deptId;
              this.intelScheArgs["deptId"] = this.userInfo.deptId;
              this.$nextTick(()=>{
                this.removeEleStyle(".filterOpe-area");
              });
              defer.resolve();
            });
          }).promise();
        },
        [fjPublic.userRoles.qj](){ //区级
          return $.Deferred((defer)=>{
            var vm = this;
            //设置分局
            this.workConArgs["fenjvId"] = this.userInfo.deptId;
              this.workConArgs["deptId"] = this.userInfo.deptId;
            this.workConArgs["isFenjv"] = true;
            this.intelScheArgs["fenjvId"] = this.userInfo.deptId;
            this.intelScheArgs["isFenjv"] = true;
            this.getPCSdataById(this.userInfo.deptId,true).then(()=>{
              this.intelScheArgs["pcsId"] = this.intelScheArgs.SLdeptsData[0].deptId;
              this.intelScheArgs["deptId"] = this.intelScheArgs.SLdeptsData[0].deptId;
              this.$nextTick(()=>{
                this.removeEleStyle();
              });
              defer.resolve();
            });
          }).promise();
        },
        [fjPublic.userRoles.sj](){  //市局
          return $.Deferred((defer)=>{
            var vm = this;
            var fenjvId = this.FLdeptsData[0].deptId;
            this.intelScheArgs["fenjvId"] = fenjvId;
            this.getPCSdataById(fenjvId,true).then(()=>{
              this.intelScheArgs["pcsId"] = this.intelScheArgs.SLdeptsData[0].deptId;
              this.intelScheArgs["deptId"] = this.intelScheArgs.SLdeptsData[0].deptId;
              defer.resolve();
            });
          }).promise();
        },
        [fjPublic.userRoles.cg](){ //超管
          return this.userControl[fjPublic.userRoles.sj].call(this);
        },
      }
    };
  },
  created(){
    this.userInfo = $.parseJSON(fjPublic.getLocalData("userInfo")) || {};
    //设置路径导航
    this.breadData.push(this.addBreadItems[fjPublic.getLocalData("wmActiveIndex")+""]);
    //批量排班添加默认classId
    for(var i = 0;i<7;i++){
      this.intelScheArgs.curClassInfos.push({
        classId:""
      });
    }
  },
  mounted() {
    //获取数据
    var vm = this;
    this.getDepListBySearch().then(()=>{
      return ()=>{
        return $.Deferred((defer)=>{
          vm.userControl[vm.userInfo.userRole].call(this).then(()=>{
            defer.resolve();
          });
        });
      };
    },()=>{
    }).then((next)=>{
      return ()=>{
        return $.Deferred((defer)=>{
          next().then(()=>{
            vm.requestDatas().then(()=>{
              defer.resolve();
            });
          });
        }).promise();
      };
    }).then((next)=>{
      return ()=>{
        return $.Deferred((defer)=>{
          next().then(()=>{
            defer.resolve();
          });
        });
      };
    }).then((next)=>{
      next().then(()=>{
        vm.getWorkConListData();
        vm.getTntelScheListData();
      });
    });
  },
  methods: {
    handleClick(tab, event) {
      //console.log(tab);
      //console.log(event);
    },
    removeEleStyle(box){ //被禁用的element表单元素去掉style属性 
      $(box+" .el-input__inner[disabled]",this.$el).removeAttr("style");
    },
    getPCSdataById(id,isAll) {
      if (!id) {
        //清空的时候，清除对应派出所数据
        this.tabFnsOfClearPcs[this.activeIndex].call(this);
        this.tabFnsOfGetListData[this.activeIndex].call(this,"",isAll);
        return;
      }
      fjPublic.openLoad("获取数据...");
      var vm = this;
      this.tabFnsOfCleadPcsId[this.activeIndex].call(this);
      //获取派出所数据和列表数据
      return $.Deferred((defer)=>{
        $.when(
          $.ajax({
            url: fjPublic.ajaxUrlDNN + "/searchDeptsByFenju",
            type: "POST",
            data: {
              flag: "1",
              parentDeptId:id //根据分局id
            },
            dataType: "json",
            success: function(data){
              //console.log(data);
              if(!vm.workConArgs.SLdeptsData.length&&!vm.intelScheArgs.SLdeptsData.length){
                _.each(data.list,(item,i)=>{
                  vm.workConArgs.SLdeptsData.push(item);
                  if(i!=0){
                    vm.intelScheArgs.SLdeptsData.push(_.extend({},item));
                  }
                });
              }
              //派出所部门数据赋值
              vm.tabFnsOfGetPcsData[vm.activeIndex].call(vm,data.list);
            },
            error: function(err) {}
          })
        ).then(()=>{
          if(isAll){
            defer.resolve();
            return;
          }
          return ()=>{
            return $.Deferred((defer)=>{
              if(vm.activeIndex==1){ //排班->默认加载第一个派出所的数据
                var tmpDeptId = vm.intelScheArgs.SLdeptsData[0].deptId;
                vm.intelScheArgs["deptId"] = tmpDeptId;
                vm.intelScheArgs["pcsId"] = tmpDeptId;
              }
              vm.tabFnsOfGetListData[vm.activeIndex].call(vm,id,isAll).then(()=>{
                defer.resolve();
              });
            }).promise();
          };
        }).then((next)=>{
          if(!$.isFunction(next))return;
          next().then(()=>{
            fjPublic.closeLoad();
            defer.resolve();
          },()=>{
            fjPublic.closeLoad();
            defer.reject();
          });
        });
      }).promise();
    },
    getListDataByPcsId(id){
      if(!id){
        this.tabFnsOfClearPcsSelect[this.activeIndex].call(this);
        return;
      }
      if(this.activeIndex==1){ //排班
        this.intelScheArgs["deptId"] = id;
      }
      //获取列表数据
      this.tabFnsOfGetListData[this.activeIndex].call(this,id);
    },
    getDepListBySearch() {
      //获取区县分局数据--联动选择用
      return $.Deferred((defer)=>{
        var vm = this;
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/searchDepListBySearch",
          type: "POST",
          data: {},
          dataType: "json",
          success: function(data) {
            //console.log(data);
            vm.FLdeptsData = _.filter(data.list, function(item) {
              return item.deptId != fjPublic.cityInfos.deptId;
            });
            defer.resolve();
          },
          error: function(err){
            defer.reject();
          }
        });
      }).promise();
    },
    clearPcsData(type){ //清空派出所数据
      this[type].SLdeptsData.splice(0,this[type].SLdeptsData.length);
    },
    getDeptTreeByUserRole(userId){ //获取部门树形数据
      return $.Deferred((defer)=>{
        var vm = this;
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/getDeptTreeByUserRole",
          type: "POST",
          data: {
            nowUser:this.nowUser,
            userId:userId
          },
          dataType: "json",
          success: function(data) {
            console.log(data);
            if(data.errorCode==0){
              //
              vm.deleteDeptDataChildren(data.rows);
              vm.addWorkConData["deptData"] = null;
              vm.addWorkConData["deptData"] = data.rows;
            }else{
              vm.$message({type:"warning",message:"获取部门树形数据失败"});
            }
            defer.resolve();
          },
          error: function(err) {
            vm.$message({type:"warning",message:"获取部门树形数据失败"});
            defer.reject();
          }
        });
      }).promise();
    },
    deleteDeptDataChildren(data){  //children长度为0删除
      if(!data.length)return;
      _.each(data,(item)=>{
        if(_.isArray(item.children)&&item.children.length){
          this.deleteDeptDataChildren(item.children);
        }else{
          delete item.children;
        }
      },this);
    },
    //---班次
    getWorkConListData(isAll) {
      if(isAll)return;
      //获取班次配置列表数据 
      return $.Deferred(defer => {
        var vm = this;
        $.ajax({
          url:
            fjPublic.ajaxUrlDNN +
            "/class/searchClassByPage",
          type: "POST",
          data: {
            nowUser:this.nowUser,
            deptId:this.workConArgs.deptId, //部门id
            page: this.workConCurrentPage, //页码
            rows: this.workConPageSize //每页条数
          },
          dataType: "json",
          success: function(data) {
            //console.log(data);
            if (data.errorCode == 0) {
              vm.workConTotal = data.total;
              //
              _.each(data.rows,(item)=>{
                //班次时间
                vm.$set(item,"workTime",vm.str2HHMM(item.inWorkTime)+"-"+vm.str2HHMM(item.outWorkTime));
              });
              //
              vm.workConListData = null;
              vm.workConListData = data.rows;
            } else {
              vm.$message({ type: "warning", message: "获取班次配置列表数据失败" });
            }
            defer.resolve();
          },
          error: function(err) {
            vm.$message({ type: "warning", message: "获取班次配置列表数据失败" });
            defer.reject();
          }
        });
      }).promise();
    },
    closeAddWorkConPop(){ //关闭班次弹层
      //this.$refs["addWorkConForm"].resetFields();
      this.addWorkConPop = false;
      fjPublic.removeModalMask();
    },
    clearWorkCon(){ //清空要提交的班次信息
      this.addWorkConData["title"] = "新增班次";
      this.addWorkConData["type"] = "";
      this.addWorkConData["isDetail"] = false;
      this.addWorkConData["className"] = "";
      this.addWorkConData["deptInfo"] = "";
      this.addWorkConData["deptId"] = "";
      this.addWorkConData["deptName"] = "";
      this.$set(this.addWorkConData,"inWorkTime1","08:00");
      this.$set(this.addWorkConData,"outWorkTime1","17:30");
      this.addWorkConData.workConTime.splice(0,1,"08:00");
      this.addWorkConData.workConTime.splice(1,1,"17:30");
    },
    addWorkCon(){ //新增班次
      //先清空
      this.clearWorkCon();
      this.addWorkConData["deptInfo"] = this.userInfo.deptId;
      this.addWorkConData["deptId"] = this.userInfo.deptId;
      this.addWorkConData["type"] = "add";
      //
      this.addWorkConPop = true;
    },
    selectDeptOfAWC(data){ //选择部门->新增/编辑
      //console.log(data);
      this.addWorkConData["deptId"] = data.id;
      this.addWorkConData["deptName"] = data.label;
      //console.log(this.addWorkConData);
    },
    selectInworkTime(val){ //选择上班时间
      val?this.addWorkConData.workConTime.splice(0,1,val):this.addWorkConData.workConTime.splice(0,1,"");
    },
    selectOutworkTime(val){ //选择下班时间
      val?this.addWorkConData.workConTime.splice(1,1,val):this.addWorkConData.workConTime.splice(1,1,"");
      //console.log(this.addWorkConData.workConTime);
    },
    setWorkInOutTime(){ //提交的时候，设置班次开始结束时间
      var tmpInWorkTime = this.addWorkConData["inWorkTime1"];
      var tmpOutWorkTime = this.addWorkConData["outWorkTime1"];
      //
      this.$set(this.addWorkConData,"inWorkTime",this.str2HHMMSS(tmpInWorkTime+":00"));
      this.$set(this.addWorkConData,"outWorkTime",this.str2HHMMSS(tmpOutWorkTime+":00"));
    },
    str2HHMMSS(str){ //日期转换1
      return str.split(":").join("");
    },
    str2HHMMSS2(str){  //日期转换2
      return str.substr(0,2)+":"+str.substr(2,2)+":"+str.substr(4,2);
    },
    str2HHMM(str){ //日期转换2
      return str.substr(0,2)+":"+str.substr(2,2);
    },
    addZero(n){
      return n<10?"0"+n:""+n;
    },
    addWorkConClass(){ //确定-> 新增/编辑班次
      var vm = this;
      this.$refs["addWorkConForm"].validate(validate=>{
        if(validate){
          this.setWorkInOutTime();
          //console.log(this.addWorkConData);
          //新增或编辑
          var url,txt,isSame=true;
          switch(this.addWorkConData.type){
            case "add":
              url = "/class/addClass";
              txt = "新增班次";
              break;
            case "modify":
              url = "/class/amendClass";
              txt = "编辑班次";
              //判断要提交的字段是否变化
              $.each(this.addWorkConData,(k,v)=>{
                if(this.addWorkConData["tmpWorkInfo"].hasOwnProperty(k)&&this.addWorkConData["tmpWorkInfo"][k]!=v){
                  isSame = false;
                  return false;
                }
              },this);
              break;
          }
          if(this.addWorkConData.type=="modify"&&isSame){
            this.$message({type:"warning",message:"未编辑班次信息，无需提交"});
            return;
          }
          //提交请求
          fjPublic.openLoad("新增中...","body");
          $.ajax({
            url: fjPublic.ajaxUrlDNN + url,
            type: "POST",
            data:this.addWorkConData,
            dataType: "json",
            success: function(data) {
              console.log(data);
              if(data.errorCode==0){
                vm.$message({type:"success",message:txt+"成功"});
                //刷新列表数据
                vm.getWorkConListData().then(()=>{
                  vm.closeAddWorkConPop();
                });
              }else{
                vm.$message({type:"warning",message:txt+"失败"});
              }
              fjPublic.closeLoad();
            },
            error: function(err) {
              vm.$message({type:"warning",message:txt+"失败"});
              fjPublic.closeLoad();
            }
          });
        }
      });
    },
    showWorkConDetail(data){ //详情 -> 班次
      console.log(data);
      this.clearWorkCon();
      //
      this.addWorkConData["title"] = "班次详情";
      this.addWorkConData["isDetail"] = true;
      this.addWorkConData["className"] = data.className;
      this.addWorkConData["deptInfo"] = data.deptId;
      //
      this.addWorkConPop = true;
    },
    modifyWorkCon(data){ //编辑 -> 班次
      if(data.classId==this.intelScheArgs.initClass){
        this.$message({type:"warning",message:"系统默认班次不能编辑"});
        return;
      }
      this.clearWorkCon();
      this.addWorkConData["title"] = "编辑班次";
      this.addWorkConData["type"] = "modify";
      this.addWorkConData["className"] = data.className;
      this.addWorkConData["deptInfo"] = data.deptId;
      this.addWorkConData["deptId"] = data.deptId;
      this.addWorkConData["deptName"] = data.deptName;
      var inworkTime = this.str2HHMM(data.inWorkTime);
      var outworkTime = this.str2HHMM(data.outWorkTime);
      this.$set(this.addWorkConData,"inWorkTime1",inworkTime);
      this.$set(this.addWorkConData,"outWorkTime1",outworkTime);
      this.addWorkConData.workConTime.splice(0,1,inworkTime);
      this.addWorkConData.workConTime.splice(1,1,outworkTime);
      this.addWorkConData["classId"] = data.classId;
      //
      this.addWorkConData["tmpWorkInfo"] = null;
      this.addWorkConData["tmpWorkInfo"] = {
        className:this.addWorkConData["className"],
        deptId:this.addWorkConData["deptId"],
        deptName:this.addWorkConData["deptName"],
        inWorkTime:data.inWorkTime,
        outWorkTime:data.outWorkTime
      };
      //console.log(this.addWorkConData["tmpWorkInfo"]);
      //
      this.addWorkConPop = true;
    },
    deleteWorkCon(data){ //删除->班次
      if(data.classId==this.intelScheArgs.initClass){
        this.$message({type:"warning",message:"系统默认班次不能删除"});
        return;
      }
      this.$confirm("此操作将删除该班次，确定要删除吗？","提示",{
        type:"warning"
      }).then(()=>{
        var vm = this;
        fjPublic.openLoad("删除中...","body");
        $.ajax({
            url: fjPublic.ajaxUrlDNN + "/class/delClass",
            type: "POST",
            data:{
              nowUser:this.nowUser,
              classId:data.classId
            },
            dataType: "json",
            success: function(data) {
              console.log(data);
              if(data.errorCode==0){
                vm.$message({type:"success",message:"删除班次成功"});
                //刷新列表数据
                vm.getWorkConListData().then(()=>{
                  vm.closeAddWorkConPop();
                });
              }else{
                vm.$message({type:"warning",message:"删除班次失败"});
              }
              fjPublic.closeLoad();
            },
            error: function(err) {
              vm.$message({type:"warning",message:"删除班次失败"});
              fjPublic.closeLoad();
            }
          });
      }).catch(()=>{
        fjPublic.removeModalMask();
      });
    },
    workConCurrentPageChange: function(pageNum) {
      //点击某个分页按钮
      // pageNum  当前的页码值
      this.workConCurrentPage = pageNum;
      this.getWorkConListData();
    },
    workConPrevPageChange: function(pageNum) {
      //点击分页的上一页
      // pageNum  当前页--后的值
      this.workConCurrentPage = pageNum;
      this.getWorkConListData();
    },
    workConNextPageChange: function(pageNum) {
      //点击分页的下一页
      // pageNum  当前页++后的值
      this.workConCurrentPage = pageNum;
      this.getWorkConListData();
    },
    workConSizePageChange: function(pageSize) {
      //改变每页条数时
      // pageSize 每页条数
    },
    //----排班
    getTntelScheListData(isAll) { //获取排班列表数据
      if(isAll)return;
      //设置deptName
      this.getDeptNameIS();
      this.intelScheArgs.refresh = false;
      this.clearSelectionUsers();
      return $.Deferred((defer)=>{
        var vm = this;
        //console.log(this.intelScheArgs);
        //return;
        $.ajax({
          url:
            fjPublic.ajaxUrlDNN +
            "/class/searchClassDetailByPage",
          type: "POST",
          data: {
            	"nowUser":this.nowUser,  //当前登录用户对象（必传）
	            "deptId":this.intelScheArgs.deptId, //部门id（必传）
	            "deptName":this.intelScheArgs.deptName, //部门名称（必传）
	            "yyyy_mm":this.intelScheArgs.yyyy_mm, //所选年月 格式如：2019-05（必传）
	            "weekNum":this.intelScheArgs.weekNum, //第几周（必传）
	            //"startTime":this.intelScheArgs.startTime, //开始时间 格式如：2019-05-06（必传）
	            //"endTime":this.intelScheArgs.endTime, //结束时间 格式如：2019-05-12（必传）
	            "page":this.intelScheCurrentPage, //当前页（必传）
	            "rows":this.intelSchePageSize, //显示条数（必传）
          },
          dataType: "json",
          success: function(data) {
            //console.log(data);
            if (data.errorCode == 0) {
              //
              vm.intelScheTotal = data.total;
              //清空user数据
              vm.intelScheListData.splice(0,vm.intelScheListData.length);
              //设置列表内容信息
              _.each(data.dataList,(item,i)=>{
                  var tmpObj = {},index;
                  tmpObj.dataList = [];
                  //占位->和dateList匹配
                  _.each(data.dateList,()=>{ 
                    tmpObj.dataList.push({
                      classId: "",
                      className: "",
                      detailId: "",
                      inWorkTime: "",
                      outWorkTime: "",
                      userId: "",
                      weekNum: "",
                      workDate: "",
                      workState: "",
                    });
                  });
                  //添加数据
                  _.each(item,(info,k)=>{
                    if(vm.intelScheArgs.hasDateReg.test(k)){ //是日期信息
                      _.find(data.dateList,(item,i)=>{
                        if(k==item.date){
                          index = i;
                          return true;
                        }
                      });
                      tmpObj["date"] = k;
                      //设置休息状态
                      if(info.workState!=0){
                        info.className1 = vm.intelScheArgs.workState[info.workState].workName;
                        info.classId = vm.intelScheArgs.workState[info.workState].classId;
                      }
                      //排班弹层上点击某个人员时的样式
                      info.isShow = false;
                      tmpObj.dataList.splice(index,1,info);
                    }else{
                      tmpObj[k] = info;  //userName和userId
                    }
                  });
                  //
                  vm.intelScheListData.push(tmpObj);
              },vm);
              //console.log(vm.intelScheListData);
              //日期转换
              _.each(data.dateList,(item)=>{
                var date2Str;
                var tmpArr = item.date.split("-");
                var month = tmpArr[1].charAt(0)==0?tmpArr[1][1]:tmpArr[1];
                var day = tmpArr[2].charAt(0)==0?tmpArr[2][1]:tmpArr[2];
                date2Str = month+"月"+day+"日";
                vm.$set(item,"date2",date2Str);
              },vm);
              vm.intelScheArgs.dateList = null;
              vm.intelScheArgs.dateList = data.dateList;
              //
              //console.log(vm.intelScheArgs.dateList);
              //重新渲染表格
              vm.intelScheArgs.refresh = true;
            } else {
              vm.$message({ type: "warning", message: "获取排班列表数据失败" });
            }
            defer.resolve();
          },
          error: function(err) {
            vm.$message({ type: "warning", message: "获取排班列表数据失败" });
            defer.reject();
          }
        });
      }).promise();
    },
    tabSelectedUsersClassId(index){ //排班弹层-点击切换显示选中人员的当前班次
      if(this.intelScheUsers[index].isShow)return;
      _.each(this.intelScheUsers,(item)=>{
        this.$set(item,"isShow",false);
      },this);
      this.intelScheUsers[index].isShow = true;
      _.each(this.intelScheUsers[index].dataList,(item,i)=>{
        this.intelScheArgs.curClassInfos[i]["classId"] = item.classId;
      },this);
    },
    getMonthWeek(a,b,c){ //每月第几周
      var date = new Date(a, parseInt(b) - 1, c),
          w = date.getDay(),
          d = date.getDate();
      if(w==0){
          w=7;
      }
      var config={
          getMonth:date.getMonth()+1,
          getYear:date.getFullYear(),
          getWeek:Math.ceil((d + 6 - w) / 7),
      }
      return config;
    },
    resetIntelScheOpe(){ //重置班次信息
      if(!this.intelScheUsers.length){
        this.$message({type:"warning",message:"请选择要重置排班的人员"});
        return;
      }
      //userIds
      this.selectedClassInfo["userIdArr"] = _.pluck(this.intelScheUsers,"userId").join(",");
      //date -> 存对应日期和默认班次id
      _.each(this.intelScheArgs.dateList,(item,i)=>{
        var curTime = new Date(this.intelScheArgs.curTimeStr).getTime();
        var setedTime = new Date(item.date).getTime();
        this.intelScheArgs.curClassInfos[i]["disabled"] = setedTime>curTime?false:true;
        this.intelScheArgs.curClassInfos[i]["classId"]=this.intelScheArgs.initClass;
        this.intelScheArgs.curClassInfos[i]["date"]=item.date;
      },this);
      //判断是否全为以前的日期
      var isAllDisabled = _.every(this.intelScheArgs.curClassInfos,(item)=>{
        return item.disabled === true;
      },this);
      if(isAllDisabled){
        this.$message({type:"warning",message:"只能重置今天以后的班次，请切换到今天以后的日期！"});
        return;
      }
      //复核日期限制的班次
      var tmpArr = [];
      _.each(this.intelScheArgs.curClassInfos,(item)=>{
        if(!item.disabled){
          tmpArr.push({
            classId:item.classId,
            date:item.date
          });
        }
      },this);
      this.$confirm("确定要重置所选人员的班次信息吗（恢复为系统默认班次）？","提示",{type:"warning"}).then(()=>{
        fjPublic.openLoad("重置班次...","body");
        this.selectedClassInfo["nowUser"] = this.nowUser;
        this.selectedClassInfo["dateArr"] = _.pluck(tmpArr,"date").join(",");  //日期
        this.selectedClassInfo["idArr"] = _.pluck(tmpArr,"classId").join(","); //班次id
        console.log(this.selectedClassInfo);
        this.sendScheAjax().always(()=>{
          fjPublic.closeLoad();
        });
      }).catch(()=>{

      });
    },
    exportIntelSche(){ //导出排班信息
      var url = this.intelScheArgs.exportUrl+'/class/exportClassDetail?deptId='+this.intelScheArgs.deptId+'&deptName='+this.intelScheArgs.deptName+'&yyyy_mm='+this.intelScheArgs.yyyy_mm+'&weekNum='+this.intelScheArgs.weekNum;
      //console.log(url);
      window.open(url,"_blank");
    },
    confirmIntelSche(){ //确定排班
      var isAllEmpty = _.every(this.intelScheArgs.curClassInfos,(item)=>{
        return item.classId =="";
      },this);
      //console.log(isAllEmpty);
      //console.log(this.intelScheArgs.curClassInfos);
      if(isAllEmpty){
        this.$message({type:"warning",message:"请对所选人员进行排班"});
        return;
      }
      //已设置的班次
      var tmpArr = [];
      _.each(this.intelScheArgs.curClassInfos,(item)=>{
        if(item.classId){
          tmpArr.push({
            classId:item.classId,
            date:item.date
          });
        }
      },this);
      //console.log(tmpArr);
      //提交请求
      fjPublic.openLoad("提交班次...","body");
      this.selectedClassInfo["nowUser"] = this.nowUser;
      this.selectedClassInfo["dateArr"] = _.pluck(tmpArr,"date").join(",");  //日期
      this.selectedClassInfo["idArr"] = _.pluck(tmpArr,"classId").join(","); //班次id
      console.log(this.selectedClassInfo);
      //return;
      this.sendScheAjax().always(()=>{
        fjPublic.closeLoad();
      });
    },
    sendScheAjax(){ //发送班次修改请求
      return $.Deferred((defer)=>{
        var vm = this; 
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/class/editorClassDetail",
          type: "POST",
          data:this.selectedClassInfo,
          dataType: "json",
          success: function(data) {
            console.log(data);
            if(data.errorCode==0){
              vm.$message({type:"success",message:data.errorMsg});
              vm.getTntelScheListData().then(()=>{
                vm.closeIntelSchePop();
              });
            }else{
              vm.$message({type:"warning",message:data.errorMsg});
            }
            defer.resolve();
          },
          error: function(err) {
            vm.$message({type:"warning",message:"修改班次失败"});
            defer.reject();
          }
        });
      }).promise();
    },
    getClassSelect(){ //获取下拉选择的班次数据
      return $.Deferred((defer)=>{
        var vm = this;
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/class/searchClassSelect",
          type: "POST",
          data:{
            deptId:this.intelScheArgs.deptId
          },
          dataType: "json",
          success: function(data) {
            //console.log(data);
            if(data.errorCode==0){
              vm.intelScheArgs.classData = null;
              vm.intelScheArgs.classData = data.rows;
            }else{
              vm.$message({type:"warning",message:"获取部门班次数据失败"});
            }
            defer.resolve();
          },
          error: function(err) {
            vm.$message({type:"warning",message:"获取部门班次数据失败"});
            defer.reject();
          }
        });
      }).promise();
    },
    closeIntelSchePop(){ //关闭排班弹层
      //清空对应日期的classId
      _.each(this.intelScheArgs.curClassInfos,(item)=>{
        item.classId = "";
        item.disabled = false;
      },this);
      this.intelSchePop = false;
      fjPublic.removeModalMask();
    },
    mutipleIntelScheOpe(){ //批量排班
      if(!this.intelScheUsers.length){
        this.$message({type:"warning",message:"请选择要设置批量排班的人员"});
        return;
      }
      //userIds
      this.selectedClassInfo["userIdArr"] = _.pluck(this.intelScheUsers,"userId").join(",");
      //date -> 存对应日期
      _.each(this.intelScheArgs.dateList,(item,i)=>{
        //this.intelScheArgs.curClassInfos[i]["classId"] = "";
        var curTime = new Date(this.intelScheArgs.curTimeStr).getTime();
        var setedTime = new Date(item.date).getTime();
        this.intelScheArgs.curClassInfos[i]["disabled"] = setedTime>curTime?false:true;
        this.intelScheArgs.curClassInfos[i]["date"]=item.date;
        //存当前班次，默认选中的第一个人的班次
        this.intelScheUsers[0].isShow = true;
        this.intelScheArgs.curClassInfos[i]["classId"] = this.intelScheUsers[0].dataList[i].classId;
      },this);
      //console.log(this.intelScheArgs.curClassInfos);
      //判断是否全为以前的日期
      var isAllDisabled = _.every(this.intelScheArgs.curClassInfos,(item)=>{
        return item.disabled === true;
      },this);
      if(isAllDisabled){
        this.$message({type:"warning",message:"只能设置今天以后的班次，请切换到今天以后的日期！"});
        return;
      }
      //console.log(this.intelScheArgs.deptId);
      fjPublic.openLoad("获取班次数据...");
      this.getClassSelect().then(()=>{
        fjPublic.closeLoad();
        this.intelSchePop = true;
        this.$nextTick(()=>{
          this.removeEleStyle("#intelSchePop");
        });
      });
    },
    clearSelectionUsers(){ //清空批量排班选择的人员
      this.intelScheUsers.splice(0,this.intelScheUsers.length);
    },
    handleSelectionChange(arr){ //批量选择
      //console.log(arr);
      this.intelScheUsers = null;
      this.intelScheUsers = arr; 
    },
    changeWeekOfIS(){ //切换周
      if(!this.intelScheArgs.deptId){
        this.$message({type:"warning",message:"请选择部门"});
        return;
      }
      fjPublic.openLoad("获取数据...");
      this.getTntelScheListData().always(()=>{
        fjPublic.closeLoad();
      });
    },
    changeMonthOfIS(time){ //切换月份
      var nowTime = new Date().getTime();
      var selectTime = new Date(time).getTime();
      if(selectTime > nowTime){
        //this.$message({type:"warning",message:""});
        //return;
      }
      if(!this.intelScheArgs.deptId){
        this.$message({type:"warning",message:"请选择部门"});
        return;
      }
      //获取周数据以及列表数据
      this.getMaxWeekthOfMonth().then(()=>{
        this.getTntelScheListData();
      });
    },
    getMaxWeekthOfMonth(){ //获取每个月有多少周
      return $.Deferred((defer)=>{
        var vm = this;
        $.ajax({
          url: fjPublic.ajaxUrlDNN + "/class/getMaxWeekthOfMonth",
          type: "POST",
          data:{
            yyyy_mm:this.intelScheArgs.yyyy_mm
          },
          dataType: "json",
          success: function(data) {
            //console.log(data);
            if(data.errorCode==0){
              vm.intelScheArgs.weeksData.splice(0,vm.intelScheArgs.weeksData.length);
              for(var i = 0;i<data.maxWeek;i++){
                vm.intelScheArgs.weeksData.push({
                  id:i+1,
                  label:"第"+(i+1)+"周"
                });
              }
              //切换月份之后，根据当前日期显示默认第几周
              var oDate = new Date();
              var initDateInfo = vm.getMonthWeek(oDate.getFullYear(),oDate.getMonth(),oDate.getDate());
              var maxWeek = vm.intelScheArgs.weeksData[vm.intelScheArgs.weeksData.length -1].id;
              initDateInfo.getWeek = (initDateInfo.getWeek+1)>=maxWeek?maxWeek:(initDateInfo.getWeek+1);
              vm.intelScheArgs.weekNum = initDateInfo.getWeek;
            }else{
              vm.$message({type:"warning",message:"请求周数失败"});
            }
            defer.resolve();
          },
          error: function(err) {
            vm.$message({type:"warning",message:"请求周数失败"});
            defer.reject();
          }
        });
      }).promise();
    },
    getDeptNameIS(){ //获取deptName
      var tmpObj = _.find(this.FLdeptsData,(item)=>{
        return item.deptId == this.intelScheArgs.deptId;
      },this);
      if(tmpObj){
        this.intelScheArgs["deptName"] = tmpObj.deptName;
      }else{
        //再找派出所
        var tmpObj2 =  _.find(this.intelScheArgs.SLdeptsData,(item)=>{
          return item.deptId == this.intelScheArgs.deptId;
        },this);
        this.intelScheArgs["deptName"] = tmpObj2?tmpObj2.deptName:"";
      }
    },
    intelScheCurrentPageChange: function(pageNum) {
      //点击某个分页按钮
      // pageNum  当前的页码值
      this.intelScheCurrentPage = pageNum;
      this.getTntelScheListData();
    },
    intelSchePrevPageChange: function(pageNum) {
      //点击分页的上一页
      // pageNum  当前页--后的值
      this.intelScheCurrentPage = pageNum;
      this.getTntelScheListData();
    },
    intelScheNextPageChange: function(pageNum) {
      //点击分页的下一页
      // pageNum  当前页++后的值
      this.intelScheCurrentPage = pageNum;
      this.getTntelScheListData();
    },
    intelScheSizePageChange: function(pageSize) {
      //改变每页条数时
      // pageSize 每页条数
    },
    requestDatas() {
      //向后台请求数据
      return $.Deferred(defer => {
        var vm = this;
        fjPublic.openLoad("数据加载中...");
        $.when(
          this.getMaxWeekthOfMonth(),
          this.getDeptTreeByUserRole("")
        ).then(
          function() {
            fjPublic.closeLoad();
            defer.resolve();
          },
          function() {
            vm.$message({
              type: "warning",
              message: "请求数据失败！！！"
            });
            _.delay(function() {
              fjPublic.closeLoad();
              vm.$router.push("/500");
            }, 2000);
          }
        );
      }).promise();
    }
  },
  watch: {
    activeIndex(val) {
      fjPublic.setLocalData("wmActiveIndex",val);
      //
      this.breadData.pop();
      this.breadData.push(this.addBreadItems[val+""]);
    }
  },
  components: {
    fjBreadNav,
    Treeselect
  }
};
</script>
<style lang="less">
.fj-content_view.work-manage {
  .fj-block-head.kaohe {
    padding-left: 0px;
    border-bottom: none;
    .el-tabs__item {
      color:rgba(0,0,0,.65);
      font-size:14px;
      height: 50px;
      line-height: 50px;
      &.is-active {
        color: #1890ff;
      }
    }
    .el-tabs__active-bar {
      background-color: #1890ff;
    }
  }
  .fj-block-body > .filterOpe-area {
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 224px;
    }
    .el-button {
      width: 98px;
    }
    .el-button + .el-button {
      margin-left: 20px;
    }
  }
  @media screen and (min-width: 1920px) {
    .fj-block-body.intel-sche > .filterOpe-area {
      &:after {
        content: "";
        display: table;
        clear: both;
      }
      .area-line {
        float: left;
        margin-bottom: 0px;
      }
      .item {
        margin-right: 10px;
        &.sc1920 {
          margin-left: 10px;
        }
      }
    }
  }
  /* 新增班次 */
  #addWorkConPop,#intelSchePop {
    .el-dialog__header {
      padding:40px 55px 24px;
    }
    .el-dialog__body{
      padding:0px 55px 10px;
    }
    .el-form-item__content {float:left;}
    .el-input,.treeSelect-box {width:360px;}
    .el-date-editor .el-range__icon {line-height:24px;}
    .el-date-editor .el-range-separator {height:auto;}
    .el-range-editor.el-input__inner {height:32px;line-height:32px;}
    .treeSelect-box {
      float:left;line-height:32px;
      .vue-treeselect__control {height:32px;margin-top:2px;}
      .vue-treeselect__placeholder {line-height:32px;}
      //.vue-treeselect__single-value,.vue-treeselect__input::-webkit-input-placeholder {color:#c0c4cc}
    }
  }
  #addWorkConPop,#intelSchePop {
    .fj-block-body.footer {text-align:center;}
    .el-date-editor.fj-fl {
      width:160px;
      & + .separator {
        margin:0px 12px;
      }
    }

  }
  #intelSchePop {
    .el-form-item__label {width:150px;padding-right:0px;text-align:left;}
    [class*=el-col-] {position:relative;}
    .users-box {
      display:flex;line-height:22px;margin-bottom:20px;
      &>.title {
        flex:0 0 auto;color:rgba(0,0,0,.85);
      }
      &>.users-box-list {
        flex:1 0 auto;width:88%;max-width:88%;text-align:justify;
        color:#1890FF;
        .item {
          cursor:pointer;
          &:hover,&.isShow {text-decoration:underline;}
          &.isShow {color:rgba(0,0,0,.85);}
        }
      }
    }
    .users-notice {position:absolute;top:4px;left:-20px;}
  }
}
</style>


